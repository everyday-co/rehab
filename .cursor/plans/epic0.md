# Epic 0: Foundation & Project Setup

**Epic Owner:** Developer

**Priority:** P0 (Must Have)

**Sprint:** 1

**Dependencies:** None

---

## Overview

Set up the project infrastructure, development environment, authentication, and core layout components that all other features will build upon.

---

## User Stories

### US-0.1: Project Initialization

**As a** developer

**I want** the project scaffolded with the correct tech stack

**So that** I can begin building features on a solid foundation

**Acceptance Criteria:**

* [ ] Next.js 14+ with App Router initialized
* [ ] TypeScript configured with strict mode
* [ ] Tailwind CSS v4 with OKLCH theme applied
* [ ] shadcn/ui initialized with all required components
* [ ] Supabase client configured
* [ ] Environment variables documented
* [ ] ESLint + Prettier configured
* [ ] pnpm as package manager

**Technical Notes:**

```bash
# Initialization commands
npx create-next-app@latest fix-flip-tracker --typescript --tailwind --eslint --app
pnpm add @supabase/supabase-js @supabase/ssr zustand react-hook-form @hookform/resolvers zod framer-motion recharts lucide-react clsx tailwind-merge tailwindcss-animate geist
pnpm dlx shadcn@latest init
```

---

### US-0.2: Database Schema Setup

**As a** developer

**I want** the database schema created in Supabase

**So that** I can persist application data

**Acceptance Criteria:**

* [ ] All tables created per schema in CURSOR_PROJECT_BRIEF.md
* [ ] Row-level security policies enabled
* [ ] Foreign key relationships established
* [ ] Indexes on frequently queried columns
* [ ] Seed data for cost_database table (50+ items)

**Tables to Create:**

1. profiles
2. properties
3. rehab_items
4. cost_database
5. holding_costs
6. selling_costs
7. expenses
8. photos
9. timeline_tasks
10. comps
11. flip_results

---

### US-0.3: Authentication Flow

**As a** user

**I want** to create an account and log in

**So that** my data is saved and secure

**Acceptance Criteria:**

* [ ] Email/password signup with email verification
* [ ] Email/password login
* [ ] Google OAuth login
* [ ] Password reset flow
* [ ] Logout functionality
* [ ] Protected routes redirect to login
* [ ] User profile created on first login

**User Flow:**

```
Landing Page
    ├── [Sign Up] → Sign Up Form
    │   ├── Enter email + password
    │   ├── Submit → Verification email sent
    │   └── Verify email → Redirect to Dashboard
    │
    ├── [Log In] → Login Form
    │   ├── Enter email + password
    │   ├── Submit → Redirect to Dashboard
    │   └── [Forgot Password] → Reset flow
    │
    └── [Continue with Google] → OAuth flow → Dashboard
```

**Screen: Sign Up**

```
┌─────────────────────────────────────┐
│           Fix & Flip Tracker        │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Create your account         │   │
│  │                             │   │
│  │ Email                       │   │
│  │ [________________________]  │   │
│  │                             │   │
│  │ Password                    │   │
│  │ [________________________]  │   │
│  │                             │   │
│  │ Confirm Password            │   │
│  │ [________________________]  │   │
│  │                             │   │
│  │ [    Create Account     ]   │   │
│  │                             │   │
│  │ ─────── or ───────         │   │
│  │                             │   │
│  │ [G] Continue with Google    │   │
│  │                             │   │
│  │ Already have an account?    │   │
│  │ Log in                      │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

### US-0.4: App Shell & Layout

**As a** user

**I want** a consistent navigation structure

**So that** I can easily move through the application

**Acceptance Criteria:**

* [ ] Header with logo, phase indicator placeholder, user menu
* [ ] User menu dropdown with profile, settings, logout
* [ ] Main content area with max-width container
* [ ] Responsive: hamburger menu on mobile
* [ ] Footer actions area for navigation buttons

**Layout Structure:**

```
┌─────────────────────────────────────────────────────┐
│ HEADER                                              │
│ [Logo]     [Phase Indicator]          [User Menu ▼] │
├─────────────────────────────────────────────────────┤
│                                                     │
│                                                     │
│                 MAIN CONTENT                        │
│              (max-width: 1280px)                    │
│                                                     │
│                                                     │
├─────────────────────────────────────────────────────┤
│ FOOTER ACTIONS                                      │
│                              [Back]  [Continue]     │
└─────────────────────────────────────────────────────┘
```

---

### US-0.5: Phase Indicator Component

**As a** user

**I want** to see my progress through the flip workflow

**So that** I know where I am and what's next

**Acceptance Criteria:**

* [ ] Shows all 4 phases as connected steps
* [ ] Current phase highlighted with phase color
* [ ] Completed phases show checkmark
* [ ] Locked phases are grayed out
* [ ] Clicking completed/current phase navigates to it
* [ ] Sub-steps shown as dots below active phase
* [ ] Responsive: collapses to current phase only on mobile

**Component States:**

```
Desktop View:
┌────────────────────────────────────────────────────────────┐
│  ●──────●──────●──────○                                   │
│  Scope   Budget  Build   Close                            │
│  Detect  & Opt   & Track  & Learn                         │
│                                                            │
│          ● ● ○ ○ ○  (sub-steps for active phase)         │
└────────────────────────────────────────────────────────────┘

Phase States:
● Completed (checkmark, green)
● Current (filled, phase color)
○ Locked (outline, gray)

Mobile View:
┌─────────────────────────┐
│  Phase 2 of 4           │
│  Budget & Optimize      │
│  ● ● ○ ○ ○             │
└─────────────────────────┘
```

**Props Interface:**

```typescript
interface PhaseIndicatorProps {
  currentPhase: 1 | 2 | 3 | 4;
  currentStep: number;
  completedPhases: number[];
  steps: { [phase: number]: string[] };
  onPhaseClick: (phase: number) => void;
  onStepClick: (phase: number, step: number) => void;
}
```

---

### US-0.6: Dashboard (Property List)

**As a** user

**I want** to see all my properties in one place

**So that** I can manage my active and completed flips

**Acceptance Criteria:**

* [ ] Grid of property cards
* [ ] Empty state when no properties
* [ ] "New Property" button prominently displayed
* [ ] Filter by status (Active, Completed, All)
* [ ] Sort by date created, ARV, profit
* [ ] Search by address
* [ ] Click card to navigate to property detail

**Screen: Dashboard (Empty State)**

```
┌─────────────────────────────────────────────────────────┐
│ HEADER                                                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  My Properties                    [+ New Property]      │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                 │   │
│  │           🏠                                    │   │
│  │                                                 │   │
│  │     No properties yet                          │   │
│  │                                                 │   │
│  │     Add your first flip to get started        │   │
│  │                                                 │   │
│  │     [+ Add Property]                          │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Screen: Dashboard (With Properties)**

```
┌─────────────────────────────────────────────────────────┐
│ HEADER                                                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  My Properties                    [+ New Property]      │
│                                                         │
│  [All ▼]  [Sort: Newest ▼]  [Search...        🔍]      │
│                                                         │
│  ┌─────────────────┐  ┌─────────────────┐              │
│  │ 📍 Active       │  │ ✓ Sold          │              │
│  │                 │  │                 │              │
│  │ 3811 Whitetail  │  │ 123 Main St     │              │
│  │ Shakopee, MN    │  │ Minneapolis, MN │              │
│  │                 │  │                 │              │
│  │ ARV: $755K      │  │ Profit: $47K    │              │
│  │ Phase: Budget   │  │ ROI: 18.2%      │              │
│  │                 │  │                 │              │
│  │ Updated 2h ago  │  │ Sold 3/15/24    │              │
│  └─────────────────┘  └─────────────────┘              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### US-0.7: Property Card Component

**As a** user

**I want** to see key property metrics at a glance

**So that** I can quickly assess each flip

**Acceptance Criteria:**

* [ ] Shows status badge (Active, Sold, On Hold)
* [ ] Address and city/state
* [ ] Key metrics: ARV (active) or Profit/ROI (sold)
* [ ] Current phase indicator
* [ ] Last updated timestamp
* [ ] Hover state with subtle elevation
* [ ] Click navigates to property detail
* [ ] Overflow menu for quick actions (archive, delete)

**Props Interface:**

```typescript
interface PropertyCardProps {
  property: {
    id: string;
    address: string;
    city: string;
    state: string;
    status: 'active' | 'sold' | 'on-hold';
    currentPhase: 1 | 2 | 3 | 4;
    arvHigh: number;
    profit?: number;
    roi?: number;
    updatedAt: Date;
  };
  onClick: () => void;
  onAction: (action: 'archive' | 'delete') => void;
}
```

---

## Technical Tasks

### T-0.1: Initialize Next.js Project

* Create project with create-next-app
* Configure TypeScript strict mode
* Set up path aliases (@/*)
* Create folder structure per CURSOR_PROJECT_BRIEF.md

### T-0.2: Configure Tailwind CSS v4

* Install Tailwind v4 with PostCSS
* Apply OKLCH theme from brief
* Add custom phase/status colors
* Configure Geist font

### T-0.3: Install & Configure shadcn/ui

* Run shadcn init
* Install all required components (see COMPONENT_LIBRARY.md)
* Verify components render with theme

### T-0.4: Set Up Supabase

* Create Supabase project
* Configure environment variables
* Create client utilities (client.ts, server.ts, middleware.ts)
* Set up auth helpers

### T-0.5: Apply Database Schema

* Run SQL to create all tables
* Configure RLS policies
* Create indexes
* Seed cost_database with MN data

### T-0.6: Build Auth Pages

* Create /login page
* Create /signup page
* Create /forgot-password page
* Implement auth logic with Supabase
* Protected route middleware

### T-0.7: Build Layout Components

* AppShell component
* Header component
* UserMenu component
* FooterActions component
* PageHeader component

### T-0.8: Build Phase Indicator

* PhaseIndicator component
* Step dots sub-component
* Phase navigation logic
* Responsive behavior

### T-0.9: Build Dashboard Page

* Property list with grid layout
* Empty state component
* Property card component
* Filter/sort/search UI
* Connect to Supabase queries

### T-0.10: Create Test Property

* Seed test property (3811 Whitetail Dr)
* Verify displays in dashboard

---

## Definition of Done

* [ ] All acceptance criteria met
* [ ] Code reviewed and merged
* [ ] No TypeScript errors
* [ ] Responsive on mobile/tablet/desktop
* [ ] Loading states implemented
* [ ] Error states handled
* [ ] Tested manually on Chrome, Safari, Firefox
* [ ] No accessibility violations (basic a11y)

---

## Estimation

| Story           | Points       | Notes                     |
| --------------- | ------------ | ------------------------- |
| US-0.1          | 3            | Project setup             |
| US-0.2          | 3            | Database schema           |
| US-0.3          | 5            | Auth flow                 |
| US-0.4          | 3            | App shell                 |
| US-0.5          | 5            | Phase indicator (complex) |
| US-0.6          | 3            | Dashboard page            |
| US-0.7          | 2            | Property card             |
| **Total** | **24** | ~1.5 weeks                |
