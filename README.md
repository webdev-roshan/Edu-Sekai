# EDU Sekai: Multi-Tenant School Management System

EDU Sekai is a comprehensive SaaS platform for educational institutions, built using schema-based multi-tenancy to provide complete data isolation while maintaining a centralized identity and billing system.

---

## Project Overview

This repository contains three main components:

### 1. Backend (Django REST Framework)
**Location:** `./backend`  
**Port:** `http://localhost:8000`  
**Purpose:** Centralized API server, identity provider, and multi-tenant schema orchestrator.

The backend uses PostgreSQL schema-based tenancy to provide complete data isolation for each school while maintaining a shared authentication layer.

### 2. SaaS Frontend (Next.js)
**Location:** `./frontend`  
**Port:** `http://localhost:3000`  
**Purpose:** Public-facing platform for marketing, registration, and payment processing.

Handles school onboarding, eSewa payment integration, and subdomain provisioning.

### 3. Tenant Dashboard (Next.js)
**Location:** `./tenant_frontend`  
**Port:** `http://[school].localhost:3555`  
**Purpose:** School-specific management interface for daily operations. Includes full **Learning Management System (LMS)** capabilities (assignments, grading, materials).

Each school accesses their own isolated environment through a unique subdomain (e.g., `oxford.localhost:3555`).

---

## Core Architecture Concepts

### Multi-Tenancy Strategy

The system uses **schema-based isolation** where each school's data lives in a completely separate PostgreSQL schema. This provides stronger isolation than row-level filtering approaches.

**Two Schema Types:**

1. **Public Schema** - Shared across all tenants
   - User authentication credentials
   - Organization metadata and billing
   - Domain routing tables
   - Payment transaction records

2. **Tenant Schemas** - One per school (e.g., `school_oxford`, `school_medhavi`)
   - Student academic records
   - Staff employment data
   - Roles and permissions
   - Guardian information
   - All school-specific operational data

**Why This Matters:**
- Each school's data is physically separated at the database level
- No risk of accidental cross-tenant data leakage
- Performance scales linearly (queries don't scan all schools' data)
- Future-proof for database sharding (can move tenant schemas to separate servers)

### The Soft-Link Pattern

**The Challenge:**
Traditional Django uses Foreign Keys to link tables. However, PostgreSQL Foreign Keys cannot span schemas. A Foreign Key from a tenant table to the public `User` table would fail.

**The Solution:**
Instead of database-level Foreign Keys, we use **UUID Soft Links**:
- Tenant profiles store `user_id` as a plain UUID field
- This UUID references a `User.id` in the public schema
- The relationship is maintained through application logic, not database constraints

**Benefits:**
- Admin panel stability (no cross-schema joins that crash Django's admin)
- Horizontal scaling capability (tenants can be moved to different databases)
- No Foreign Key constraint overhead across schemas
- Greater flexibility in user management

**Trade-off:**
- Referential integrity must be maintained through Django signals rather than database constraints
- Requires custom cleanup logic when deleting users

### Username System

Users need intuitive usernames within their school context, but the system must ensure global uniqueness across all schools.

**Two-Tier Username Approach:**

1. **Local Username** (School-Specific)
   - Format: `firstnamemiddlenamelastname` (e.g., `johnprasaddoe`)
   - Used for login within a specific school
   - Unique only within that school's schema
   - Can have duplicates across different schools

2. **Global Username** (System-Wide)
   - Format: `localusername_randomhex` (e.g., `johnprasaddoe_a1b2c3`)
   - Stored in the public `User` table
   - Globally unique across the entire platform
   - Hidden from end users

**Login Flow:**
1. User types local username (e.g., `johnprasaddoe`) at `oxford.localhost`
2. System queries Oxford's tenant schema for matching profile
3. Profile contains the linked `user_id`
4. User record is fetched from public schema using that ID
5. Password is verified against the global User account
6. If valid, user is authenticated in Oxford's context

**Advantages:**
- Users see friendly, memorable usernames
- Each school maintains its own username namespace
- Behind-the-scenes global uniqueness prevents conflicts
- Same user can have different local usernames in different schools

### Role-Based Access Control (RBAC)

**Tenant-Scoped Permissions:**
As of January 2026, roles and permissions are stored in each tenant's schema rather than globally. This provides complete customization flexibility.

**How It Works:**
- Each school gets a replicated set of system roles (Owner, Admin, Teacher, Student)
- Schools can create custom roles (e.g., Librarian, Bus Driver, Counselor)
- Permissions are granular (view_student, add_staff, change_role, etc.)
- UserRole table links global Users to tenant-specific Roles

**Permission Check Flow:**
1. Request arrives at `/api/students/` for `oxford.localhost`
2. Middleware identifies the tenant schema and activates it
3. System queries UserRole table in Oxford's schema for the authenticated user
4. Checks if any of the user's roles have the required permission
5. If authorized, query proceeds; otherwise, returns 403 Forbidden

**Isolation:**
- Oxford's "Librarian" role is completely separate from Cambridge's "Librarian" role
- Custom permissions in one school don't affect other schools
- Each school can modify role permissions independently

---

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL 15+ (handled by Docker)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EDU\ Sekai
   ```

2. **Set up environment files**
   - `backend/.env` - Database credentials, JWT secret, superuser credentials
   - `frontend/.env.local` - API URL
   - `tenant_frontend/.env.local` - API URL and base domain

3. **Start the backend**
   ```bash
   cd backend
   docker compose up --build
   ```
   
   The backend will automatically:
   - Run database migrations
   - Create the public tenant
   - Seed system permissions and roles
   - Create a superuser account

4. **Start the SaaS frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Start the tenant dashboard** (in a new terminal)
   ```bash
   cd tenant_frontend
   npm install
   npm run dev
   ```

### Creating Your First School

1. Visit `http://localhost:3000`
2. Click "Get Started" and fill in school details
3. Complete payment through eSewa (test mode)
4. After verification, you'll be redirected to `[yourschool].localhost:3555`
5. Log in with the owner credentials created during registration

---

## Development Tools

### Database Seeding

**Public Tenant Seeding:**
The `seed_public.py` script automatically runs during container startup to ensure:
- Public tenant exists with `schema_name = "public"`
- `localhost` domain is mapped to the public tenant
- Superuser account is created from environment variables

**Tenant Role Seeding:**
Django signals automatically seed system roles and permissions when a new tenant schema is created. Each school receives:
- Owner role (full access)
- Admin role
- Teacher role
- Student role
- Complete permission set for all modules

### Audit & Maintenance Commands

**Check for orphaned profiles:**
```bash
docker compose exec backend python manage.py audit_orphans
```
Scans all tenant schemas for profiles with `user_id` references that point to deleted User accounts.

**Fix orphaned profiles:**
```bash
docker compose exec backend python manage.py audit_orphans --fix
```
Sets `user_id = NULL` for all broken references, effectively "unassigning" the account.

**List unlinked profiles:**
```bash
docker compose exec backend python manage.py audit_unlinked
```
Shows all profiles that don't have an associated User account (students/staff without portal access).

**Purpose:**
These tools ensure referential integrity across schemas since we use soft links instead of database Foreign Keys.

### Test Data Generation

**Populate Mock Data:**
```bash
docker compose exec backend python manage.py populate_test_data --schema=<schema_name>
```
Uses `Faker` to generate comprehensive test datasets (students, staff, academics, course content) for a specific tenant.
- **Example:** `docker compose exec backend python manage.py populate_test_data --schema=school_oxford`
- **Defaults:** Creates users with password `password123`.

### Testing

**Run all tests:**
```bash
docker compose exec backend python manage.py test
```

**Test specific modules:**
```bash
docker compose exec backend python manage.py test accounts
docker compose exec backend python manage.py test students
```

Tests cover:
- Multi-tenant isolation (ensuring queries don't leak across schemas)
- Authentication flow (username resolution, password verification)
- Permission system (RBAC enforcement)
- Soft-link integrity (profile-user relationships)

---

## Project Structure

```
EDU Sekai/
├── backend/              # Django API + Multi-Tenant Logic
│   ├── accounts/         # Global authentication (public schema)
│   ├── organizations/    # Tenant management (public schema)
│   ├── payments/         # Billing (public schema)
│   ├── profiles/         # Identity layer (tenant schema)
│   ├── students/         # Academic domain (tenant schema)
│   ├── staff/            # HR domain (tenant schema)
│   ├── families/         # Guardian management (tenant schema)
│   ├── roles/            # RBAC system (tenant schema)
│   └── config/           # Django settings
│
├── frontend/             # SaaS Marketing + Registration
│   ├── app/              # Next.js App Router pages
│   ├── components/       # Reusable UI components
│   └── hooks/            # API interaction hooks
│
└── tenant_frontend/      # School Management Dashboard
    ├── app/              # Next.js App Router pages
    ├── components/       # Dashboard UI components
    ├── hooks/            # Tenant-aware API hooks
    └── middleware.ts     # Subdomain detection logic
```

---

## Data Isolation Guarantees

**Schema-Level Separation:**
- Each school's tables exist in a completely separate PostgreSQL schema
- Queries are physically unable to access other schools' data
- Database connection sets `search_path` per request based on subdomain

**Request Flow Example:**
1. Request: `GET http://oxford.localhost:8000/api/students/`
2. Middleware extracts subdomain: `oxford`
3. Lookup: Domain table maps `oxford.localhost` → Organization(schema_name='school_oxford')
4. PostgreSQL `search_path` is set to `school_oxford`
5. Query: `SELECT * FROM students_student` now reads from `school_oxford.students_student`
6. Response: Only Oxford's students are returned

**Cross-Contamination Prevention:**
- No shared tables for operational data (students, staff, grades)
- Roles and permissions are replicated per tenant (not shared)
- Foreign Keys don't span schemas (preventing accidental joins)
- Middleware enforces tenant context on every request

**User Identity Bridging:**
While data is isolated, users are global. This allows:
- A teacher to work at multiple schools with one login
- Parents to access multiple children's schools
- System administrators to manage the platform

---

## Security Highlights

- **Authentication:** JWT tokens stored in HttpOnly cookies (XSS-protected)
- **Authorization:** Granular permission checks on every protected endpoint
- **Data Isolation:** Schema-based tenancy at PostgreSQL level
- **Password Security:** Django's PBKDF2 password hashing
- **SQL Injection Protection:** All queries use Django ORM (no raw SQL)
- **CORS Configuration:** Whitelisted origins only

---

## Scalability Notes

**Current Capacity:** Tested for 1,000+ schools with 100,000+ students

**Optimization Highlights:**
- N+1 query elimination using bulk fetching
- Strategic database indexes on frequently queried fields
- Connection pooling for database efficiency
- Transaction atomic operations for data consistency

**Future Scaling Path:**
- Add PostgreSQL read replicas for reporting
- Implement Redis caching for role/permission lookups
- Enable horizontal sharding (move tenant schemas to separate databases)
- Deploy behind load balancer with multiple application servers

---

## Documentation

For detailed module-specific information:
- [Backend Documentation](./backend/README.md) - API design, authentication flow, tenant routing
- [SaaS Frontend Documentation](./frontend/README.md) - Registration flow, payment integration
- [Tenant Dashboard Documentation](./tenant_frontend/README.md) - School management features, subdomain logic

---

## License

Proprietary - All rights reserved

---

**Last Updated:** January 2026  
**Architecture Version:** 2.0 (Tenant-Scoped RBAC)
