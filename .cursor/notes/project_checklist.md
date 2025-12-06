# Fix & Flip Tracker - Project Checklist

## Phase 1: Foundation (Epic 0) ✅ COMPLETE

### Authentication
- [x] Create middleware for protected routes
- [x] Wire up Supabase auth in login/signup pages
- [x] Add server actions for signIn, signUp, signOut
- [x] OAuth callback route handler
- [x] Google OAuth configuration (in Supabase dashboard)
- [x] Forgot password flow
- [x] Protected route redirects

### App Shell
- [x] Root layout with Toaster provider
- [x] Dashboard layout with header
- [x] Auth layout (minimal branding)
- [x] Header component with navigation
- [x] User menu dropdown
- [x] Phase indicator component
- [x] Page header component
- [x] Footer actions component (for wizard flows)

### Dashboard
- [x] Properties list page
- [x] Property card component
- [x] Search/filter/sort functionality
- [x] New property button → form
- [x] Empty state for no properties

### Property Management
- [x] Property form with Zod validation
- [x] Create property server action
- [x] Delete property with confirmation
- [x] Property detail routing scaffold
- [x] Phase-based subpage routing

## Phase 2: Scope Detect (Epic 1) ✅ COMPLETE

### Capture Method Selection
- [x] Scope page with method cards
- [x] Questionnaire marked as recommended
- [x] Photo/video marked "coming soon"

### Questionnaire Engine
- [x] Question data structure
- [x] Multi-section form component
- [x] Single choice questions
- [x] Multi-select questions
- [x] Number input questions
- [x] Text input questions
- [x] Conditional question display
- [x] Section navigation
- [x] Progress indicator
- [x] Skip section functionality

### Cost Database
- [x] MN cost data structure
- [x] Categories and items
- [x] Priority levels
- [x] Quantity calculation logic

### Scope Generation
- [x] Map answers to scope items
- [x] Quantity multipliers from property data
- [x] Save scope items to database

### Scope Review
- [x] Review page layout
- [x] Collapsible category sections
- [x] Include/exclude toggle
- [x] Edit item quantities/costs
- [x] Running totals display
- [x] 10% contingency calculation
- [x] Finalize and advance to Phase 2

## Phase 3: Budget & Optimize (Epic 2) 🔄 PARTIAL

### Budget Summary
- [x] Display scope totals
- [x] Purchase price / ARV metrics
- [x] Projected profit calculation
- [x] Category breakdown cards

### Coming Soon
- [ ] AI recommendations mode
- [ ] Build-your-own mode
- [ ] Scenario comparison
- [ ] ROI optimizer
- [ ] Timeline planning (Gantt)
- [ ] Holding cost calculator
- [ ] Contractor document generation
- [ ] Budget lock functionality

## Phase 4: Build & Track (Epic 3) 📋 PLANNED

- [ ] Progress dashboard
- [ ] Budget vs actual tracking
- [ ] Expense logging
- [ ] Receipt upload
- [ ] Change order management
- [ ] Photo documentation
- [ ] Before/after views
- [ ] Mark ready to list

## Phase 5: Close & Learn (Epic 4) 📋 PLANNED

- [ ] Sale information entry
- [ ] Projected vs actual analysis
- [ ] Lessons learned capture
- [ ] Portfolio dashboard
- [ ] Estimate accuracy tracking
- [ ] Personalized adjustments

## Infrastructure & Polish ✅ COMPLETE

### Loading States
- [x] Properties list loading
- [x] Property detail loading
- [x] Portfolio loading

### Error Handling
- [x] Global error boundary
- [x] Not found page
- [x] Form error states
- [x] Toast notifications

### Documentation
- [x] Agent notes
- [x] Project checklist
- [x] README updates

## Database Setup ⚠️ REQUIRED

- [ ] Create Supabase project
- [ ] Run migrations for tables:
  - [ ] profiles
  - [ ] properties
  - [ ] rehab_items
  - [ ] expenses
  - [ ] flip_results
- [ ] Enable Row Level Security policies
- [ ] Configure OAuth providers

## Testing 📋 PLANNED

- [ ] Unit tests for validation schemas
- [ ] Component tests for forms
- [ ] Integration tests for auth flow
- [ ] E2E tests for property creation → scope flow

