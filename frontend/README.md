# EDU Sekai - SaaS Frontend

The public-facing platform for EDU Sekai. Handles school registration, subscription management, and payment processing.

---

## Overview

This is the first touchpoint for potential customers. Unlike the tenant dashboard (which schools use after registration), this application focuses on:

- Marketing the platform to educational institutions
- Capturing school information during registration
- Processing subscription payments through eSewa
- Provisioning new tenant instances upon successful payment
- Providing a login portal to system administrators

**Access:** `http://localhost:3000`

---

## Key Features

### Landing Page

Professional marketing page showcasing:
- Platform capabilities and benefits
- Pricing structure and subscription plans
- Testimonials and case studies
- Feature comparison with competitors
- Call-to-action for registration

### School Registration Workflow

**Step 1: Organization Information**
- School name
- Desired subdomain (e.g., `oxford` → `oxford.edusekai.com`)
- Contact details (phone, email, address)

**Step 2: Owner Account Creation**
- First owner's name and email
- Initial login credentials
- Contact information

**Step 3: Subdomain Verification**
Real-time validation ensures:
- Subdomain is available (not already registered)
- Meets format requirements (lowercase, alphanumeric, hyphens only)
- Doesn't conflict with reserved keywords (`www`, `api`, `admin`, etc.)

**Step 4: Payment Processing**
- Integration with eSewa payment gateway
- Subscription fee collection
- Transaction verification via callback

**Step 5: Tenant Provisioning**
Upon successful payment:
- Backend creates new PostgreSQL schema for the school
- Seeds system roles and permissions
- Creates owner's User account
- Links subdomain to the new organization
- Returns tenant URL for immediate access

### Payment Integration

**eSewa V2 API:**
- HMAC-SHA256 signature generation for secure transactions
- Redirect-based payment flow
- Callback URL verification
- Transaction status reconciliation

**Payment States:**
- `PENDING` - Payment initiated, awaiting completion
- `COMPLETE` - Payment successful, verified by eSewa
- `FAILED` - Payment cancelled or failed

### Post-Registration Flow

After successful registration and payment:
1. User is redirected to `[subdomain].localhost:3555` (tenant dashboard)
2. Auto-login with owner credentials
3. Onboarding wizard guides through initial setup:
   - Upload school logo
   - Configure academic calendar
   - Add first staff members
   - Enroll first students

---

## Technical Architecture

### Framework & Structure

Built with **Next.js 14+ (App Router)** for:
- Server-side rendering of marketing content (better SEO)
- Static generation of landing pages (faster load times)
- API routes for server-side validation
- Edge middleware for geolocation-based content

### State Management

- **React Query** for API interactions (registration, payment verification)
- **React Context** for global app state (loading states, error messages)
- **URL State** for multi-step forms (step tracking, form progress)

### Form Handling

- **React Hook Form** for form state management
- **Zod** for schema validation
- Real-time validation feedback
- Error message display
- Accessibility features (ARIA labels, keyboard navigation)

---

## API Integration

### Backend Endpoints Used

**Organization Management:**
- `POST /api/organizations/register/` - Create new school
- `GET /api/organizations/check-domain/` - Verify subdomain availability

**Payment Processing:**
- `POST /api/payments/init/` - Initialize eSewa transaction
- `GET /api/payments/verify/` - Verify payment completion

**Authentication:**
- `POST /api/auth/login/` - Admin/superuser login

### Payment Flow Sequence

1. **Initiation:**
   - Frontend collects organization and owner details
   - Calls `POST /api/payments/init/` with form data
   - Backend creates Payment record with status `PENDING`
   - Backend generates eSewa signature
   - Frontend receives payment URL and transaction UUID

2. **Redirect:**
   - User is redirected to eSewa payment page
   - Completes payment on eSewa's platform

3. **Callback:**
   - eSewa redirects back to `/payment-success?data=<encoded_response>`
   - Frontend decodes transaction status
   - Calls `GET /api/payments/verify/` to confirm with backend

4. **Verification:**
   - Backend validates transaction UUID
   - Confirms payment amount matches
   - Updates Payment status to `COMPLETE`
   - Triggers tenant provisioning
   - Returns tenant URL

5. **Completion:**
   - Frontend redirects user to `[subdomain].localhost:3555`
   - User logs in with credentials from registration form

---

## UI/UX Design

### Design Principles

- **Premium Feel:** Modern, clean interface with professional branding
- **Trust Building:** Clear pricing, transparent process, security badges
- **Conversion Optimized:** Minimal friction, clear CTAs, progress indicators
- **Mobile Responsive:** Fully functional on all device sizes

### Components

**Marketing Components:**
- `Hero` - Above-the-fold section with primary CTA
- `FeatureGrid` - Visual showcase of platform capabilities
- `PricingCard` - Subscription plan comparison
- `Testimonial` - Social proof from existing schools
- `FAQ` - Common questions and answers

**Form Components:**
- `StepIndicator` - Multi-step form progress
- `InputField` - Consistent input styling with validation
- `SubdomainChecker` - Real-time availability indicator
- `SubmitButton` - Loading states and error handling

### Styling

Uses **Tailwind CSS** for:
- Rapid UI development
- Consistent design system
- Responsive utilities
- Dark mode support
- Custom color palette

---

## Environment Configuration

Create `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_ESEWA_URL=https://rc-epay.esewa.com.np/api/epay/main/v2/form
```

**Variables Explained:**
- `NEXT_PUBLIC_API_URL` - Backend API base URL
- `NEXT_PUBLIC_ESEWA_URL` - eSewa payment gateway endpoint (test/production)

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

3. **Access the application:**
   - Navigate to `http://localhost:3000`
   - Click "Get Started" to begin registration
   - Complete the form and payment process
   - You'll be redirected to your school's dashboard

---

## Development Notes

### Testing Payment Integration

For development, use eSewa's test credentials:
- **Test Card Number:** Provided by eSewa
- **Test Amount:** Use small amounts (e.g., NPR 10)
- **Callback URL:** Ensure it matches your `.env` configuration

### Subdomain Validation

The system prevents registration of:
- Already-taken subdomains (checked via backend)
- Reserved keywords (`api`, `www`, `admin`, `app`, etc.)
- Invalid formats (uppercase, special characters, spaces)
- Too short (< 3 characters) or too long (> 30 characters)

### Error Handling

Payment failure scenarios:
- **Network Error:** Shows retry option, saves form data
- **Payment Cancelled:** Returns user to form with data intact
- **Verification Failed:** Displays support contact information
- **Subdomain Conflict:** Suggests alternatives, allows manual entry

---

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **Forms:** React Hook Form + Zod
- **Data Fetching:** React Query (TanStack Query)
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **HTTP Client:** Axios

---

## Security Considerations

- All payments processed through eSewa's secure platform
- No credit card data stored on our servers
- HTTPS required in production
- CSRF protection enabled
- Rate limiting on registration endpoints

---

## Future Enhancements

Planned features:
- Multiple payment gateway options (Khalti, PayPal, Stripe)
- Free trial period before payment
- Referral program with discounts
- Live chat support integration
- Video demos and tour
- Detailed feature documentation

---

**Last Updated:** January 2026
