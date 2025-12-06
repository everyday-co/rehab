# Fix & Flip Tracker - Agent Notes

## Project Overview

A Next.js 16 application for real estate investors to track fix & flip rehab projects through a 4-phase "conveyor belt" workflow: Scope Detect → Budget & Optimize → Build & Track → Close & Learn.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 with OKLCH theme
- **UI Components**: shadcn/ui (Radix primitives)
- **Backend**: Supabase (Auth + Postgres + Storage)
- **Forms**: React Hook Form + Zod validation
- **State**: Zustand (available but not yet used heavily)
- **Package Manager**: pnpm

## Project Structure

```
/app
  /(auth)        - Login, signup, forgot-password pages
  /(dashboard)   - Protected routes with header
    /properties  - Property list, new form, [id] detail with phase subpages
    /portfolio   - Portfolio analytics (placeholder)
    /settings    - User settings (placeholder)
  /auth/callback - OAuth callback handler

/components
  /layout        - Header, UserMenu, PhaseIndicator, PageHeader, FooterActions
  /properties    - PropertyCard, PropertyList, PropertyForm
  /questionnaire - QuestionnaireForm, ScopeReview
  /ui            - shadcn/ui components

/lib
  /auth          - Server actions (signIn, signUp, signOut, resetPassword)
  /properties    - Server actions (CRUD, phase updates)
  /questionnaire - Questions, cost database, scope generation
  /supabase      - Client/server/middleware utilities

/types           - TypeScript types and database schema
```

## Current Implementation Status

### ✅ Completed (Foundation - Epic 0)

1. **Auth Infrastructure**
   - Middleware for protected routes
   - Login/signup/forgot-password pages with forms
   - OAuth callback handler
   - Session management
   - Header with user menu

2. **App Shell**
   - Root layout with Toaster
   - Dashboard layout with header
   - Auth layout (minimal)
   - Phase indicator component
   - Page header component
   - Loading and error states

3. **Property CRUD**
   - Property list page with search/filter/sort
   - Property card component
   - New property form with validation
   - Property detail routing with phase subpages

### ✅ Completed (Phase 1 - Epic 1)

1. **Capture Method Selection**
   - Photo/video marked "coming soon"
   - Questionnaire as MVP path

2. **Questionnaire Engine**
   - Multi-section form (Kitchen, Bathrooms, Interior, Exterior, Systems, Basement)
   - Single/multi/number/text question types
   - Conditional question display
   - Progress tracking
   - Auto-generates scope items from answers

3. **Cost Database**
   - Minnesota-specific costs
   - Categories: Kitchen, Bathrooms, Interior, Exterior, Systems, Basement
   - Priority levels: essential, high-roi, recommended, optional
   - Quantity multipliers based on property data

4. **Scope Review**
   - Collapsible category sections
   - Include/exclude items
   - Edit quantities and costs
   - Running totals with contingency
   - Finalize to Phase 2

### 🔄 In Progress / Placeholders

- **Phase 2 (Budget & Optimize)**: Summary view only, full features pending
- **Phase 3 (Build & Track)**: Placeholder page
- **Phase 4 (Close & Learn)**: Placeholder page
- **Portfolio**: Placeholder with stats cards

## Database Schema (Supabase)

Tables defined in `/types/database.ts`:
- `profiles` - User profiles
- `properties` - Property details and phase tracking
- `rehab_items` - Scope/budget line items
- `expenses` - Expense tracking (future)
- `flip_results` - Completed flip analytics (future)

**Note**: Database migrations need to be run in Supabase. See `/lib/questionnaire/actions.ts` for schema requirements.

## Key Files to Review

- `lib/constants.ts` - Phase definitions, test property data
- `lib/validations.ts` - Zod schemas, US states, conditions
- `lib/questionnaire/questions.ts` - Full questionnaire structure
- `lib/questionnaire/cost-database.ts` - MN cost data
- `types/database.ts` - Supabase schema types

## Environment Variables Needed

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Development Commands

```bash
pnpm dev      # Start dev server
pnpm build    # Production build
pnpm lint     # Run ESLint
```

## Next Steps

1. Set up Supabase project and run migrations
2. Configure OAuth (Google) in Supabase
3. Complete Phase 2 (Budget & Optimize) features
4. Add expense tracking in Phase 3
5. Build portfolio analytics in Phase 4

## Gotchas / Notes

- Using Next.js 16 with React 19 (latest)
- `params` in dynamic routes are now Promises (await required)
- Supabase SSR uses cookie-based auth
- Tailwind v4 uses CSS variables with OKLCH colors
- Phase colors defined in `globals.css` as CSS custom properties

