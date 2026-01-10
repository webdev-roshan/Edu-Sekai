# EDU Sekai Backend

The backend for EDU Sekai is a multi-tenant Django REST API that provides complete data isolation for educational institutions while maintaining a shared authentication system.

---

## Architecture Overview

### Multi-Tenant Design Philosophy

The backend implements **schema-based multi-tenancy** using PostgreSQL's native schema feature combined with Django Tenants. This provides the strongest form of data isolation available in relational databases.

**Two Schema Categories:**

1. **Public Schema (Shared)**
   Contains global data that applies across the entire SaaS platform:
   - User authentication credentials (username, password hash)
   - Organization registry (school metadata, subdomain mappings)
   - Payment and billing records
   - System-wide configuration

2. **Tenant Schemas (Isolated)**
   Each school receives its own dedicated schema (e.g., `school_oxford`, `school_cambridge`) containing:
   - Student academic records and enrollment data
   - Staff employment information
   - Roles, permissions, and access control rules
   - Guardian (parent) profiles and relationships
   - Institution-specific settings and preferences

**How Isolation Works:**
- Physical separation at the database level
- Queries cannot accidentally access other schools' data
- Each request sets PostgreSQL's `search_path` to the appropriate schema
- No filtering logic required - wrong data literally doesn't exist in the search path

---

## The Soft-Link Identity System

### Why Not Foreign Keys?

Traditional Django projects use database Foreign Keys to link related tables. However, in a multi-schema environment:

**The Problem:**
- PostgreSQL Foreign Keys require both tables to exist in the same schema
- A tenant table (e.g., `school_oxford.profiles_profile`) cannot have a Foreign Key to a public table (e.g., `public.accounts_user`)
- Attempting to create cross-schema Foreign Keys causes migration failures
- Django's admin interface tries to follow Foreign Key relationships and crashes when they span schemas

**The EDU Sekai Solution:**
Instead of database-enforced Foreign Keys, we use **UUID-based soft links**:
- Profiles store the User's ID as a plain UUID field (`user_id`)
- The relationship exists at the application layer, not the database layer
- Django signals handle cascading operations (e.g., when a User is deleted)

**Benefits:**
1. **Admin Stability:** Django's admin panel works without attempting impossible cross-schema joins
2. **Horizontal Scalability:** Tenant schemas can be migrated to different database servers
3. **Performance:** No Foreign Key constraint checking overhead across schemas
4. **Flexibility:** Users can be "soft-deleted" without triggering cascading deletes across all tenant schemas

**Trade-Off:**
Referential integrity must be maintained through application logic rather than database constraints. This is why we provide audit scripts to detect and fix broken links.

---

## Authentication & Username Resolution

### Dual-Username Strategy

The system balances user-friendliness with technical requirements through a two-tier username structure:

**Local Usernames (School Context)**
- Format: `firstnamemiddlenamelastname` (e.g., `alicejoneswilliams`)
- Uniqueness: Only within a specific school's schema
- Purpose: What users actually type during login
- Storage: Tenant schema's Profile table
- Collision handling: If duplicate, append counter (e.g., `alicejoneswilliams2`)

**Global Usernames (System Context)**
- Format: `localusername_randomhex` (e.g., `alicejoneswilliams_7f3a19`)
- Uniqueness: Globally unique across the entire SaaS platform
- Purpose: Django's authentication backend requirement
- Storage: Public schema's User table
- Visibility: Hidden from end users

### Login Resolution Process

When a user attempts to log in:

1. **Input:** User types `alicejoneswilliams` at `oxford.localhost:3555`
2. **Context Detection:** Middleware identifies the tenant as `school_oxford`
3. **Profile Lookup:** System queries `school_oxford.profiles_profile WHERE local_username = 'alicejoneswilliams'`
4. **User ID Retrieval:** Profile returns its `user_id` (the soft link UUID)
5. **User Fetch:** System queries `public.accounts_user WHERE id = <user_id>`
6. **Global Username:** Retrieved User object contains `username = 'alicejoneswilliams_7f3a19'`
7. **Authentication:** Django's authentication backend verifies password against this User
8. **Success:** User is authenticated in Oxford's tenant context

**Why This Works:**
- Users experience simple, intuitive usernames
- Each school maintains its own username namespace (no global collision worries)
- The platform ensures true global uniqueness behind the scenes
- Same person can use different local usernames in different schools (e.g., teacher in School A, parent in School B)

---

## Role-Based Access Control (RBAC)

### Tenant-Scoped Permission System

As of January 2026, the RBAC system operates entirely within tenant schemas. Each school has its own isolated set of roles and permissions.

**Core Components:**

1. **Permissions**
   - Atomic actions: `view_student`, `add_staff`, `delete_parent`, etc.
   - Module-grouped for UI organization (Students, Staff, Roles, etc.)
   - Defined in `roles/constants.py` and seeded automatically

2. **Roles**
   - Collections of permissions: Owner, Admin, Teacher, Student, etc.
   - System roles: Pre-configured, cannot be deleted, can be customized
   - Custom roles: School-specific (e.g., Librarian, Counselor, Bus Coordinator)

3. **UserRole Assignments**
   - Links global Users to tenant-specific Roles
   - One user can have multiple roles in the same school
   - Same user can have different roles in different schools

**How Permission Checking Works:**

When a request hits a protected endpoint:
1. Authentication confirms the User's identity
2. Middleware sets the tenant context based on subdomain
3. Permission decorator checks if the User has a role assignment in THIS tenant
4. System queries the tenant's UserRole table for active assignments
5. Checks if any assigned role includes the required permission
6. Grants or denies access accordingly

**Isolation Guarantees:**
- Oxford's "Teacher" role is completely independent of Cambridge's "Teacher" role
- Permissions can be customized per school without affecting others
- Custom roles in one school don't appear in other schools' lists
- UserRole table exists in each tenant schema, not globally shared

---

## Portal Activation Workflow

Students and staff don't automatically get login credentials when they're admitted or hired. Portal activation is a deliberate, controlled process.

**Phase 1: Profile Creation (Identity)**
- Admin admits a new student/staff member through the dashboard
- Profile is created in the tenant schema with personal information
- No User account exists yet (`profile.user_id = NULL`)
- Person exists in the school system but cannot log in

**Phase 2: Account Activation (Access)**
- Admin initiates portal activation for selected profiles
- System generates local username from profile name
- Creates corresponding User account in public schema
- Links Profile to User via `user_id` soft link
- Assigns appropriate role (Student, Instructor, etc.)
- Generates temporary password with forced-change flag

**Phase 3: First Login (Personalization)**
- User enters their local username and temporary password
- System resolves to global User account
- Mandatory password change modal appears
- User sets permanent password
- Dashboard access granted

**Security Features:**
- Passwords are never stored in plain text (Django's PBKDF2 hashing)
- Initial passwords are one-time use only
- Password complexity requirements enforced
- Account activation can be revoked by removing the User link

---

## Data Isolation & Tenant Routing

### Request-Level Schema Switching

Every incoming HTTP request goes through tenant detection:

1. **Domain Extraction:** Middleware reads the `Host` header
2. **Tenant Lookup:** Queries `organizations_domain` table to find matching Organization
3. **Schema Activation:** Sets PostgreSQL connection's `search_path` to the tenant's schema
4. **Query Execution:** All ORM queries now operate within that schema only
5. **Response:** Data from that schema alone is returned

**Example Flow:**
```
GET http://oxford.localhost:8000/api/students/

→ Middleware extracts: hostname = "oxford.localhost"
→ Lookup: Domain.objects.get(domain="oxford.localhost")
  Returns: Organization(schema_name="school_oxford")
→ Execute: SET search_path TO school_oxford
→ Query: Student.objects.all()
  Reads from: school_oxford.students_student table
→ Response: Only Oxford's students
```

**Impossibility of Cross-Tenant Access:**
Even if application code attempted to query another tenant's data, PostgreSQL wouldn't find the table because it's not in the current `search_path`. The isolation is database-enforced, not just application logic.

---

## Development & Maintenance Tools

### Automated Seeding

**Public Tenant Setup:**
The `seed_public.py` script runs automatically during container startup via `entrypoint.sh`. It ensures:
- Public tenant exists with `localhost` domain mapping
- Superuser account is created from environment variables
- Infrastructure is ready for the first school registration

**Tenant Role Initialization:**
Django signals detect when a new tenant schema is migrated and automatically seed:
- System permissions (all available actions in the system)
- System roles (Owner, Admin, Teacher, Student)
- Role-permission assignments (Owner gets all permissions)

This ensures every school starts with a functional RBAC system without manual setup.

### Integrity Audit Scripts

Because soft links don't have database-level integrity constraints, we provide maintenance commands:

**Orphan Detection:**
```bash
python manage.py audit_orphans
```
Scans all tenant schemas for profiles with `user_id` values that point to non-existent User accounts. This can happen if:
- A User is deleted directly from the admin panel
- Data is manually manipulated in the database
- Sync issues occur during development resets

**Orphan Cleanup:**
```bash
python manage.py audit_orphans --fix
```
Sets `user_id = NULL` for all broken references, effectively "deactivating" those accounts.

**Unlinked Profile Inventory:**
```bash
python manage.py audit_unlinked
```
Lists profiles that don't have associated User accounts (students/staff who haven't been given portal access yet).

These tools maintain the application-level referential integrity that the soft-link pattern requires.

### Test Data Generation

**Populate Mock Data:**
```bash
python manage.py populate_test_data --schema=<schema_name>
```
Uses the `Faker` library to generate realistic test data for a specific tenant.
- Populates PROGRAMS, SECTIONS, SUBJECTS, STAFF, STUDENTS, and FAMILIES.
- Generating COURSE CONTENT (assignments, submissions) with varied statuses.
- Ensures referential integrity and avoids duplicates.
- **Example:** `python manage.py populate_test_data --schema=school_oxford`

> **Note:** User passwords are set to `password123` by default for generated accounts.

### Testing Infrastructure

**Test Coverage:**
- Multi-tenant isolation verification (queries don't leak across schemas)
- Authentication flow (username resolution, soft-link traversal)
- Permission enforcement (RBAC system correctness)
- Data integrity (profile-user relationships remain valid)

**Running Tests:**
```bash
# All tests
docker compose exec backend python manage.py test

# Specific modules
docker compose exec backend python manage.py test accounts
docker compose exec backend python manage.py test students
docker compose exec backend python manage.py test roles
```

---

## Performance Optimizations

### N+1 Query Elimination

Cross-schema User lookups are a potential bottleneck. When displaying a list of 50 students with their email addresses, naive implementation would cause 51 database queries (1 for students + 50 for individual Users).

**Optimization Strategy:**
- Fetch all profiles in a single query
- Extract `user_id` values from the result set
- Bulk fetch Users from public schema in one query
- Build an in-memory map (dictionary) for instant lookup
- Attach Users to profile instances via `_user_cache` attribute
- Serializer accesses cached Users instead of hitting the database

**Performance Gain:** 95% reduction in database queries for list views.

### Strategic Indexing

Database indexes are applied to commonly queried fields:
- Profile: Composite index on (`user_id`, `local_username`) for login resolution
- Student: Index on (`status`, `admission_date`) for filtering active students
- UserRole: Index on (`user`, `role`, `is_active`) for permission checks

### Transaction Safety

All multi-step operations (enrollment, activation, role assignment) are wrapped in atomic transactions. If any step fails, all changes are rolled back, preventing partial data corruption.

---

## API Endpoints

**Authentication (Public):**
- `POST /api/auth/login/` - User authentication
- `POST /api/auth/logout/` - Session termination
- `POST /api/auth/refresh/` - JWT token refresh
- `GET /api/auth/me/` - Current user info + roles in current tenant
- `POST /api/auth/change-password/` - Password update

**Organization Management (Public):**
- `POST /api/organizations/register/` - New school registration
- `GET /api/organizations/check-domain/` - Subdomain availability

**Payment Processing (Public):**
- `POST /api/payments/init/` - Initialize eSewa payment
- `GET /api/payments/verify/` - Verify payment callback

**Student Management (Tenant):**
- `GET /api/students/` - List students
- `POST /api/students/enroll/` - Admit new student
- `POST /api/students/portal-activation/` - Create student accounts
- `GET /api/students/credential-distribution/` - List unclaimed credentials
- `GET/PUT/DELETE /api/students/{id}/` - Student detail operations

**Staff Management (Tenant):**
- `GET /api/staff/` - List staff members
- `POST /api/staff/onboard-instructor/` - Hire new instructor
- `POST /api/staff/activate-instructor/` - Create instructor account
- `GET /api/staff/credential-distribution/` - List unclaimed staff credentials

**Role Management (Tenant):**
- `GET /api/roles/` - List roles in current school
- `POST /api/roles/` - Create custom role
- `PUT /api/roles/{id}/` - Update role permissions
- `GET /api/roles/permissions/` - List all available permissions

**Academics (Tenant):**
- `GET/POST /api/academics/programs/` - Manage academic programs
- `GET/POST /api/academics/academic-levels/` - Manage grade levels
- `GET/POST /api/academics/sections/` - Manage class sections
- `GET/POST /api/academics/subjects/` - Manage subjects

**Course Content (Tenant):**
- `GET/POST /api/course-content/contents/` - Manage assignments, notes, etc.
- `POST /api/course-content/submissions/` - Submit assignments
- `POST /api/course-content/submissions/{id}/grade/` - Grade submissions
- `GET /api/course-content/submissions/` - List submissions for grading

---

## Environment Configuration

Required `.env` variables:

**Database:**
- `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`

**Authentication:**
- `SECRET_KEY` - Django secret for signing tokens
- `ACCESS_TOKEN_LIFETIME_MINUTES` - JWT access token duration
- `REFRESH_TOKEN_LIFETIME_DAYS` - JWT refresh token duration

**Superuser:**
- `SUPERUSER_EMAIL` - Auto-created admin account email
- `SUPERUSER_PASSWORD` - Auto-created admin account password

**Payment Gateway:**
- `ESEWA_CLIENT_ID`, `ESEWA_CLIENT_SECRET`, `ESEWA_PRODUCT_CODE`

---

## Tech Stack

- **Framework:** Django 5.x with Django REST Framework
- **Database:** PostgreSQL 15-Alpine
- **Multi-Tenancy:** `django-tenants` for schema routing
- **Authentication:** PyJWT with HttpOnly cookie storage
- **Password Security:** Django's PBKDF2 hasher
- **Containerization:** Docker + Docker Compose

---

## Scaling Considerations

**Current Capacity:** 1,000+ schools, 100,000+ students

**Bottleneck Mitigation:**
- Connection pooling enabled (`CONN_MAX_AGE`)
- N+1 queries eliminated through bulk fetching
- Strategic database indexes on hot paths
- Atomic transactions to prevent data inconsistencies

**Future Scaling Path:**
- PostgreSQL read replicas for reporting workloads
- Redis caching layer for role/permission lookups
- Database sharding (move tenant schemas to separate servers)
- Horizontal application scaling (multiple Gunicorn workers behind load balancer)

---

**Last Updated:** January 2026  
**Architecture Version:** 2.0 (Tenant-Scoped RBAC)
