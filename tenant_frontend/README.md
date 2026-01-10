# EDU Sekai - Tenant Dashboard Frontend

The school-specific management interface for EDU Sekai. Each institution accesses their own isolated environment through a unique subdomain.

---

## Overview

This is the operational dashboard where schools manage their daily activities. Unlike the SaaS frontend (which handles registration and billing), this application is designed for:

- Student enrollment and academic tracking
- Staff management and scheduling
- Parent/guardian information management
- Role-based access control for different user types
- School-specific settings and customization

**Access Pattern:** `http://[school-subdomain].localhost:3555`

For example:
- Oxford High School: `oxford.localhost:3555`
- Cambridge Academy: `cambridge.localhost:3555`

---

## Key Features

### Subdomain-Based Tenant Detection

The application automatically detects which school is being accessed based on the URL subdomain. This determines:
- Which backend schema to query for data
- Which branding and customization to display
- Which users have access rights (via tenant-scoped roles)

**How It Works:**
- Middleware extracts the subdomain from the request URL
- Verifies the school exists by querying the backend's domain registry
- Stores the tenant context for all subsequent API calls
- If subdomain is invalid, shows an error page

### Dynamic Role-Based UI

The dashboard adapts its interface based on the logged-in user's role:

**Owner Role:**
- Full access to all modules
- Organization settings and branding
- Staff hiring and management
- Financial records and reports

**Admin Role:**
- Student enrollment and academics
- Staff directory (view only)
- Parent communication
- Academic calendar

**Teacher Role:**
- Class rosters and attendance
- Grade entry
- Student progress notes
- Course materials

**Student Role:**
- Personal dashboard with grades
- Assignment submission
- Schedule viewing
- Resource access

The sidebar navigation dynamically shows/hides menu items based on assigned permissions.

### Portal Activation Management

Schools can:
- View lists of students/staff without portal accounts
- Initiate bulk account creation
- Generate temporary passwords
- Distribute login credentials
- Monitor which users have/haven't changed their initial passwords

This provides controlled onboarding for new students and staff members.

### Learning Management System (LMS)

A built-in classroom environment where:
- **Teachers** can create assignments, upload materials, and grade submissions.
- **Students** can view course content, submit homework, and check grades.
- **Features:** File uploads, due dates, rich text descriptions, and grading workflows.

### Customization & Branding

- **School Identity:** Upload custom institution logos and banners that replace default branding throughout the dashboard.
- **User Profiles:** Staff and students can upload personal profile pictures.
- **Dynamic Themes:** The interface adapts to display the school's identity via the sidebar and header.

---

## Technical Architecture

### Framework & Routing

Built with **Next.js 14+ (App Router)** for:
- Server-side rendering for faster initial loads
- File-based routing for intuitive project structure
- API route handlers for server-side logic
- Middleware for subdomain detection

### Authentication Flow

1. **Login:** User submits credentials at `oxford.localhost:3555/login`
2. **Api Call:** Credentials sent to `localhost:8000/api/auth/login/`
3. **Backend Validation:**
   - Resolves local username to global User account
   - Verifies password
   - Checks user has role assignment in Oxford's tenant schema
4. **Token Issuance:** JWT tokens set as HttpOnly cookies
5. **Redirect:** User sent to dashboard
6. **Authorization:** Each subsequent API call includes cookies for authentication

**Security Features:**
- HttpOnly cookies prevent XSS token theft
- Tokens are validated on every API request
- Expired tokens automatically trigger re-authentication
- Logout clears cookies and invalidates sessions

### Data Fetching Strategy

**React Query (TanStack Query)** manages all API interactions:
- Automatic caching of frequently accessed data
- Background refetching for data freshness
- Optimistic updates for better UX
- Error handling and retry logic

**Custom Hooks:**
Each domain has dedicated hooks for data operations:
- `useStudents()` - List, enroll, update students
- `useStaff()` - Manage staff members and instructors
- `useRoles()` - Fetch and assign roles
- `useProfile()` - User's own profile data

### Tenant-Aware API Calls

All API requests include the current tenant context:
- Cookies contain authentication tokens
- Backend reads subdomain from the Referer header
- Queries are automatically scoped to the correct tenant schema
- No risk of cross-tenant data access

---

## UI Components & Design

### Design System

Uses a custom CSS design system with:
- Modern color palette with dark mode support
- Consistent spacing and typography scales
- Reusable component patterns
- Responsive breakpoints for mobile/tablet/desktop

**Key Components:**
- `Sidebar` - Dynamic navigation based on user permissions
- `DashboardCard` - Stat display for key metrics
- `DataTable` - Sortable, filterable lists (students, staff)
- `Modal` - Overlays for forms and actions
- `FormField` - Consistent input styling and validation

### State Management

- **Global State:** React Context for user info and tenant details
- **Server State:** React Query for all backend data
- **Form State:** Controlled components with validation
- **UI State:** Component-level React state for toggles, modals, etc.

---

## Key Pages & Workflows

### Dashboard (`/dashboard`)
Landing page showing:
- Quick stats (total students, active staff, pending tasks)
- Recent activity feed
- Shortcuts to common actions
- Announcements and calendar events

### Student Management (`/students`)
- **List View:** All enrolled students with search/filter
- **Enrollment Form:** Admit new students
- **Detail View:** Edit profile, academic history, guardian info
- **Portal Activation:** Bulk creation of student accounts
- **Credential Distribution:** Share login credentials with students

### Staff Management (`/staff`)
- **List View:** All staff members and instructors
- **Onboarding Form:** Hire new staff/instructors
- **Activation:** Create portal accounts for staff
- **Activation:** Create portal accounts for staff
- **Credential Distribution:** Share login credentials with staff

### Academics (`/academics`)
- **Program Structure:** Define programs (e.g., High School, Diploma) and academic levels.
- **Class Sections:** Manage sections and assign capacities.
- **Subjects:** Create subject catalog and assign to levels.

### Course Content (`/course-content`)
- **Assignments:** Create and manage course work.
- **Grading Board:** Review and grade student submissions.
- **Materials:** specialized resource distribution.

### Settings (`/settings`)
- **Institution Profile:** Custom Logo, Banner, Bio, and social links.
- **Organization Profile:** Contact information.
- **User Management:** View and manage user accounts
- **Role Configuration:** Create custom roles, assign permissions
- **Academic Calendar:** Set terms, holidays, important dates

---

## Environment Setup

Create `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BASE_DOMAIN=localhost
```

**Variables Explained:**
- `NEXT_PUBLIC_API_URL` - Backend API base URL
- `NEXT_PUBLIC_BASE_DOMAIN` - Root domain (subdomains will be appended)

---

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Access the dashboard:**
   - Ensure backend is running on port 8000
   - Register a school on the SaaS frontend (port 3000)
   - Navigate to `[yourschool].localhost:3555`
   - Log in with owner credentials from registration

---

## Development Tips

### Testing Different Tenants Locally

To test multiple schools simultaneously:
1. Register different schools with unique subdomains (e.g., `oxford`, `cambridge`)
2. Access them at `oxford.localhost:3555` and `cambridge.localhost:3555`
3. Data will be completely isolated (different students, staff, etc.)
4. Same browser can maintain separate sessions (different tabs)

### Subdomain Debugging

If subdomain routing isn't working:
- Verify the school was registered successfully on the SaaS frontend
- Check backend's `organizations_domain` table for the subdomain entry
- Ensure middleware is extracting subdomain correctly (check browser console)
- Try clearing cookies and re-logging in

### Permission Testing

To test different role experiences:
1. Create test users with different roles (Owner, Admin, Teacher, Student)
2. Log in as each user type
3. Verify appropriate menu items appear/disappear
4. Test that unauthorized actions return 403 errors

---

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Styling:** CSS Modules + Custom Design System
- **Data Fetching:** React Query (TanStack Query)
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React
- **Date Handling:** date-fns
- **HTTP Client:** Axios with interceptors

---

## Future Enhancements

Planned features:
- Real-time notifications using WebSockets
- Advanced reporting and analytics dashboards
- Grade book and transcript generation
- Attendance tracking with QR code scanning
- Parent portal with limited access
- Mobile app (React Native) for on-the-go access

---

**Last Updated:** January 2026
