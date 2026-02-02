

## Join Us Page - Application Forms

This plan adds application forms to each role on the Join Us page, with submissions stored in the database for later review.

---

### Overview

Each role card ("App Maintainers", "Mobile Developers", "Angel Investors", "Donors & Supporters") will have a form that opens when clicking "Get Involved". Form submissions will be stored in a new database table.

---

### Database Changes

Create a new `join_requests` table:

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| created_at | timestamp | Auto-generated |
| role_type | text | Which role they're applying for |
| name | text | Applicant's name |
| email | text | Contact email |
| message | text | Why they want to join / additional info |
| skills | text | (Optional) Relevant skills for developers |
| portfolio_url | text | (Optional) Link to portfolio/LinkedIn |
| status | text | Default 'pending' for admin review |

**RLS Policies:**
- Anyone can INSERT (submit applications)
- Only admins can SELECT/UPDATE/DELETE (review applications)

---

### UI Changes

1. **Create `JoinUsFormDialog` component** - A reusable dialog with form fields that adapts based on role type

2. **Update `JoinUs.tsx`** - Replace the static "Get Involved" buttons with buttons that open the form dialog

3. **Form fields per role type:**
   - **All roles**: Name, Email, Message
   - **Developers** (App Maintainers & Mobile Developers): Additional "Skills" and "Portfolio URL" fields
   - **Investors & Donors**: Simpler form with just contact info and message

---

### Technical Details

- Use `react-hook-form` with `zod` validation (already installed)
- Dialog component from existing UI library
- Toast notifications for success/error feedback
- Input validation: required fields, email format, URL format for portfolio

---

### Files to Create/Modify

| File | Action |
|------|--------|
| `src/components/joinus/JoinUsFormDialog.tsx` | Create - Form dialog component |
| `src/pages/JoinUs.tsx` | Modify - Add dialog state and trigger |
| Database migration | Create `join_requests` table with RLS |

