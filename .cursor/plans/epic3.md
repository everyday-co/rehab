# Epic 3: Phase 3 - Build & Track

**Epic Owner:** Developer

**Priority:** P0 (Must Have)

**Sprint:** 5

**Dependencies:** Epic 2 (Budget & Optimize)

---

## Overview

Phase 3 is the active construction tracking phase. Users monitor budget vs actual costs, track schedule progress, manage change orders, and document the renovation with photos. This phase runs from construction start until the property is ready to list.

**Phase Color:** Amber/Orange (phase-3)

**Entry Point:** `/properties/[id]/build`

---

## User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                      PHASE 3: BUILD & TRACK                     │
│                     "Stay on budget and schedule"               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   STEP 1           STEP 2           STEP 3                     │
│   Dashboard   ──►  Costs       ──►  Photos    ──►  [Phase 4]  │
│   (Overview)       (Tracking)       (Document)                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## User Stories

### US-3.1: View Progress Dashboard

**As a** user

**I want** to see an overview of my project status

**So that** I know if I'm on track or have issues to address

**Acceptance Criteria:**

* [ ] Overall progress percentage displayed prominently
* [ ] Four status cards: Budget, Schedule, Scope, Quality
* [ ] Each card shows status (green/yellow/red) and key metric
* [ ] Alert feed for items needing attention
* [ ] Quick action buttons for common tasks
* [ ] Link to detailed views for each area

**Status Card Logic:**

| Card     | Green       | Yellow           | Red             |
| -------- | ----------- | ---------------- | --------------- |
| Budget   | <90% spent  | 90-100% spent    | >100% spent     |
| Schedule | On time     | 1-2 weeks behind | 3+ weeks behind |
| Scope    | 0-2 changes | 3-5 changes      | 6+ changes      |
| Quality  | No issues   | Minor issues     | Major issues    |

**Screen: Progress Dashboard**

```
┌─────────────────────────────────────────────────────────────────┐
│ [Phase Indicator: ✓ ✓ ● ○ ]   Step 1 of 3                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  3811 Whitetail Dr                                              │
│  Project Dashboard                                              │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │           Overall Progress                              │   │
│  │                                                         │   │
│  │      ████████████████████████░░░░░░  68%               │   │
│  │                                                         │   │
│  │      Week 8 of 12 • Target completion: Apr 8           │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐  │
│  │ 💰 BUDGET  │ │ 📅 SCHEDULE│ │ 📋 SCOPE   │ │ ⭐ QUALITY │  │
│  │    🟢      │ │    🟡      │ │    🟢      │ │    🟢      │  │
│  │            │ │            │ │            │ │            │  │
│  │ $62,400    │ │ 5 days     │ │ 2 change   │ │ No major   │  │
│  │ of $88,050 │ │ behind     │ │ orders     │ │ issues     │  │
│  │            │ │            │ │            │ │            │  │
│  │ 71% spent  │ │ Week 8/12  │ │ +$3,200    │ │ 3 items    │  │
│  │ $25,650    │ │ Est: Apr 15│ │ to budget  │ │ to verify  │  │
│  │ remaining  │ │            │ │            │ │            │  │
│  │ [Details →]│ │ [Details →]│ │ [Details →]│ │ [Details →]│  │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘  │
│                                                                 │
│  ALERTS                                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ⚠️ Schedule: Drywall delayed 5 days due to inspection  │   │
│  │    rework. Cascading impact on paint/flooring.         │   │
│  │    [View Timeline] [Add Note]                          │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ 💰 Budget: Kitchen cabinets came in $1,200 over quote  │   │
│  │    Adjust budget or find savings elsewhere.            │   │
│  │    [Log Expense] [Adjust Budget]                       │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ 📸 Photos: No photos uploaded in 2 weeks               │   │
│  │    Document progress for records and listing.          │   │
│  │    [Upload Photos]                                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  QUICK ACTIONS                                                  │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                  │
│  │ + Log  │ │ + Add  │ │ + Take │ │ + Mark │                  │
│  │Expense │ │ Change │ │ Photos │ │Complete│                  │
│  └────────┘ └────────┘ └────────┘ └────────┘                  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                           [Mark Ready to List →]│
└─────────────────────────────────────────────────────────────────┘
```

---

### US-3.2: Track Costs (Budget vs Actual)

**As a** user

**I want** to see how my actual spending compares to budget

**So that** I can catch overruns early and adjust

**Acceptance Criteria:**

* [ ] Table showing each category with: Budget, Spent, Committed, Remaining
* [ ] Visual variance indicator (green/red)
* [ ] Drill into category to see line items
* [ ] Total summary at bottom
* [ ] Contingency tracking (how much used)
* [ ] Export to CSV option

**Screen: Cost Tracking**

```
┌─────────────────────────────────────────────────────────────────┐
│ [Phase Indicator: ✓ ✓ ● ○ ]   Step 2 of 3                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Cost Tracking                                    [+ Log Expense]│
│                                                                 │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐  │
│  │ BUDGET     │ │ SPENT      │ │ COMMITTED  │ │ REMAINING  │  │
│  │ $88,050    │ │ $62,400    │ │ $8,500     │ │ $17,150    │  │
│  │            │ │ 71%        │ │ 10%        │ │ 19%        │  │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘  │
│                                                                 │
│  CONTINGENCY: $4,200 of $8,805 used (48%)                      │
│  ████████████████████░░░░░░░░░░░░░░░░░░░░                      │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Category     │ Budget  │ Spent   │ Variance │ Status   │   │
│  ├──────────────┼─────────┼─────────┼──────────┼──────────┤   │
│  │ ▼ Kitchen    │ $28,200 │ $29,400 │ +$1,200  │ 🔴 +4%   │   │
│  │   Cabinets   │ $12,500 │ $13,700 │ +$1,200  │ Over     │   │
│  │   Counters   │  $3,200 │  $3,200 │     $0   │ On budget│   │
│  │   Appliances │  $4,500 │  $4,500 │     $0   │ On budget│   │
│  │   ... more   │         │         │          │          │   │
│  ├──────────────┼─────────┼─────────┼──────────┼──────────┤   │
│  │ ▶ Bathrooms  │ $12,500 │ $11,200 │  -$1,300 │ 🟢 -10%  │   │
│  ├──────────────┼─────────┼─────────┼──────────┼──────────┤   │
│  │ ▶ Interior   │ $27,700 │ $18,400 │  -$9,300 │ 🟢 In progress│
│  ├──────────────┼─────────┼─────────┼──────────┼──────────┤   │
│  │ ▶ Exterior   │  $8,500 │  $2,100 │  -$6,400 │ ⚪ Not started│
│  ├──────────────┼─────────┼─────────┼──────────┼──────────┤   │
│  │ ▶ Systems    │ $11,150 │  $1,300 │  -$9,850 │ ⚪ Not started│
│  ├──────────────┼─────────┼─────────┼──────────┼──────────┤   │
│  │ SUBTOTAL     │ $88,050 │ $62,400 │ -$25,650 │          │   │
│  │ Contingency  │  $8,805 │  $4,200 │  -$4,605 │          │   │
│  ├──────────────┼─────────┼─────────┼──────────┼──────────┤   │
│  │ TOTAL        │ $96,855 │ $66,600 │          │ 69% spent│   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  RECENT EXPENSES                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Today   │ Kitchen Cabinets - Final  │ ABC Supply │ $6,850│   │
│  │ Dec 3   │ Countertop Install        │ Stone Co   │ $3,200│   │
│  │ Dec 1   │ Appliance Delivery        │ Best Buy   │ $4,500│   │
│  │ Nov 28  │ Drywall Materials         │ Home Depot │ $2,400│   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ [← Dashboard]                                      [Photos →]  │
└─────────────────────────────────────────────────────────────────┘
```

---

### US-3.3: Log Expense

**As a** user

**I want** to log actual expenses as they occur

**So that** I can track real costs against budget

**Acceptance Criteria:**

* [ ] Quick expense entry form
* [ ] Select category and optionally specific budget item
* [ ] Enter amount, description, vendor, date
* [ ] Upload receipt photo (optional)
* [ ] Auto-updates budget vs actual view
* [ ] Can mark as "from contingency"

**Screen: Log Expense Modal**

```
┌─────────────────────────────────────────────────────────────────┐
│  Log Expense                                              [×]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Amount *                                                       │
│  [$6,850.00                                            ]      │
│                                                                 │
│  Category *                                                     │
│  [Kitchen                                            ▼]       │
│                                                                 │
│  Budget Item (optional)                                         │
│  [Cabinets (Full) - $12,500 budgeted                 ▼]       │
│                                                                 │
│  Vendor                                                         │
│  [ABC Supply                                           ]      │
│                                                                 │
│  Date                                                           │
│  [12/05/2024                                         📅]      │
│                                                                 │
│  Description                                                    │
│  [Final cabinet payment - install complete             ]      │
│                                                                 │
│  Receipt                                                        │
│  [📷 Upload receipt image]                                     │
│                                                                 │
│  ☐ Use contingency funds for this expense                      │
│                                                                 │
│  ───────────────────────────────────────────────────────────   │
│  Running total for Cabinets: $13,700 / $12,500 (+$1,200 over) │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                              [Cancel]    [Save Expense]        │
└─────────────────────────────────────────────────────────────────┘
```

---

### US-3.4: Manage Change Orders

**As a** user

**I want** to document scope changes during construction

**So that** I understand why costs or timelines changed

**Acceptance Criteria:**

* [ ] Create change order with description and reason
* [ ] Add line items with costs
* [ ] Show impact on: budget, timeline, contingency, profit
* [ ] Require acknowledgment before applying
* [ ] Change orders appear in audit trail

**Screen: Change Order**

```
┌─────────────────────────────────────────────────────────────────┐
│  Create Change Order                                      [×]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Issue / Reason *                                               │
│  [Discovered water damage behind shower wall during demo  ]   │
│                                                                 │
│  ITEMS TO ADD                                     [+ Add Item]  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Item                              │ Qty │ Cost │ Total │   │
│  ├───────────────────────────────────┼─────┼──────┼───────┤   │
│  │ Water damage repair               │  1  │ $800 │  $800 │   │
│  │ Replace shower pan                │  1  │ $450 │  $450 │   │
│  │ Additional tile work              │ 20sf│  $18 │  $360 │   │
│  ├───────────────────────────────────┼─────┼──────┼───────┤   │
│  │                          TOTAL ADD│     │      │$1,610 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  IMPACT ANALYSIS                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │ 💰 Budget Impact                                       │   │
│  │    Original: $88,050 → New: $89,660 (+$1,610)         │   │
│  │                                                         │   │
│  │ 🏦 Contingency Impact                                  │   │
│  │    Remaining: $4,605 → $2,995                         │   │
│  │    ☑ Apply to contingency                             │   │
│  │                                                         │   │
│  │ 📅 Timeline Impact                                     │   │
│  │    + 3 days estimated                                  │   │
│  │                                                         │   │
│  │ 📉 Profit Impact                                       │   │
│  │    Projected: $44,350 → $42,740 (-$1,610)             │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Notes                                                          │
│  [Photos taken, plumber confirmed damage was from old leak ]  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                    [Cancel]    [Create Change Order]           │
└─────────────────────────────────────────────────────────────────┘
```

---

### US-3.5: Upload Progress Photos

**As a** user

**I want** to upload photos throughout the project

**So that** I have documentation for my records and listings

**Acceptance Criteria:**

* [ ] Upload multiple photos at once
* [ ] Tag photos by room and stage (Before, Demo, Progress, Final)
* [ ] Photos organized in timeline view
* [ ] Can add captions
* [ ] Generate before/after comparisons
* [ ] Export photo set for listing

**Screen: Photo Documentation**

```
┌─────────────────────────────────────────────────────────────────┐
│ [Phase Indicator: ✓ ✓ ● ○ ]   Step 3 of 3                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Photo Documentation                              [+ Upload Photos]
│                                                                 │
│  [All Rooms ▼]  [All Stages ▼]                                │
│                                                                 │
│  KITCHEN                                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ BEFORE        DEMO          PROGRESS       FINAL        │   │
│  │ Jan 15        Jan 22        Feb 15         —            │   │
│  │                                                         │   │
│  │ ┌────────┐   ┌────────┐   ┌────────┐   ┌────────┐     │   │
│  │ │ 🖼️    │   │ 🖼️    │   │ 🖼️    │   │        │     │   │
│  │ │        │   │        │   │        │   │ + Add  │     │   │
│  │ │        │   │        │   │        │   │        │     │   │
│  │ └────────┘   └────────┘   └────────┘   └────────┘     │   │
│  │ 3 photos     2 photos     4 photos     0 photos       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  PRIMARY BATHROOM                                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ BEFORE        DEMO          PROGRESS       FINAL        │   │
│  │ Jan 15        Jan 25        Mar 1          —            │   │
│  │                                                         │   │
│  │ ┌────────┐   ┌────────┐   ┌────────┐   ┌────────┐     │   │
│  │ │ 🖼️    │   │ 🖼️    │   │ 🖼️    │   │        │     │   │
│  │ │        │   │        │   │        │   │ + Add  │     │   │
│  │ │        │   │        │   │        │   │        │     │   │
│  │ └────────┘   └────────┘   └────────┘   └────────┘     │   │
│  │ 2 photos     3 photos     2 photos     0 photos       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ... more rooms                                                 │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ BEFORE / AFTER PREVIEW                   [Generate All] │   │
│  │                                                         │   │
│  │ Kitchen:     Before ↔ Progress  [View]                 │   │
│  │ Bathroom:    Before ↔ Progress  [View]                 │   │
│  │ Living Room: Before ↔ Progress  [View]                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ [← Costs]                                  [Mark Ready to List]│
└─────────────────────────────────────────────────────────────────┘
```

---

### US-3.6: Mark Property Ready to List

**As a** user

**I want** to indicate construction is complete

**So that** I can move to selling and final review

**Acceptance Criteria:**

* [ ] "Ready to List" button on dashboard
* [ ] Shows completion checklist (all items done, final photos, etc.)
* [ ] Requires confirmation
* [ ] Updates property status
* [ ] Moves to Phase 4

**Screen: Ready to List Confirmation**

```
┌─────────────────────────────────────────────────────────────────┐
│  Mark Property Ready to List?                             [×]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  COMPLETION CHECKLIST                                          │
│                                                                 │
│  ☑ All scope items marked complete                            │
│  ☑ Final expenses logged                                       │
│  ⚠️ Final photos not uploaded for 3 rooms                      │
│  ☑ Change orders resolved                                      │
│                                                                 │
│  ───────────────────────────────────────────────────────────   │
│                                                                 │
│  PROJECT SUMMARY                                                │
│                                                                 │
│  Duration: 14 weeks (2 weeks over target)                      │
│  Total Spent: $91,200 (vs $88,050 budget)                      │
│  Change Orders: 2 ($3,150 added)                               │
│                                                                 │
│  ───────────────────────────────────────────────────────────   │
│                                                                 │
│  Moving to Phase 4 will:                                        │
│  • Lock all expenses                                           │
│  • Calculate final profit projections                          │
│  • Enable retrospective analysis                               │
│                                                                 │
│  You can still upload photos and update the sale info later.   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│           [Cancel]    [Upload Missing Photos]    [Continue →]  │
└─────────────────────────────────────────────────────────────────┘
```

---

## User Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    PHASE 3 COMPLETE FLOW                        │
└─────────────────────────────────────────────────────────────────┘

[From Phase 2: Budget Locked]
         │
         ▼
┌──────────────────┐
│  Dashboard       │ ◄──────────────────────────────────┐
│  (US-3.1)        │                                     │
│                  │                                     │
│  - Progress %    │                                     │
│  - Status cards  │                                     │
│  - Alerts        │                                     │
│  - Quick actions │                                     │
└────────┬─────────┘                                     │
         │                                               │
         ├─────────────────┐                             │
         │                 │                             │
         ▼                 ▼                             │
┌──────────────────┐ ┌──────────────────┐               │
│  Costs           │ │  Photos          │               │
│  (US-3.2)        │ │  (US-3.5)        │               │
│                  │ │                  │               │
│  Budget vs       │ │  Room-by-room    │               │
│  Actual table    │ │  photo timeline  │               │
│                  │ │                  │               │
│  [+ Log Expense] │ │  [+ Upload]      │               │
│  (US-3.3) ──────►│ │                  │               │
│                  │ │                  │               │
│  [+ Change Order]│ │                  │               │
│  (US-3.4) ──────►│ │                  │               │
└────────┬─────────┘ └────────┬─────────┘               │
         │                    │                          │
         └─────────┬──────────┘                          │
                   │                                     │
                   └─────────────────────────────────────┘
                                │
                                │ (Ongoing during construction)
                                │
                                ▼
                   ┌──────────────────┐
                   │  Ready to List   │
                   │  (US-3.6)        │
                   │                  │
                   │  Completion      │
                   │  checklist       │
                   └────────┬─────────┘
                            │
                            ▼
                   ┌──────────────────┐
                   │  PHASE 4         │
                   │  Close & Learn   │
                   └──────────────────┘
```

---

## Technical Tasks

### T-3.1: Dashboard Components

* ProgressBar/ProgressRing components
* StatusCard component with conditional styling
* AlertItem and AlertFeed components
* Quick action button grid

### T-3.2: Cost Tracking

* CostTrackingTable component
* Category accordion with line items
* Variance calculation and display
* Contingency tracking bar

### T-3.3: Expense Management

* ExpenseForm component
* Receipt upload to Supabase Storage
* Expense list with filters
* Expense API routes (CRUD)

### T-3.4: Change Order System

* ChangeOrderCard component
* Impact calculation (budget, timeline, profit)
* Change order API routes
* Audit trail storage

### T-3.5: Photo Management

* PhotoUploadZone component
* PhotoGrid and PhotoCard components
* PhotoTimeline by room/stage
* Supabase Storage integration
* Photo metadata (room, stage, caption)

### T-3.6: Phase Transition

* Completion checklist logic
* Phase 3 → Phase 4 transition
* Status update API

---

## Definition of Done

* [ ] Dashboard shows accurate progress and status
* [ ] Status cards reflect real data with correct colors
* [ ] Alerts surface actual issues
* [ ] Cost tracking table matches budget items
* [ ] Expenses can be logged with receipts
* [ ] Change orders calculate impact correctly
* [ ] Photos can be uploaded and organized
* [ ] Ready to List transition works
* [ ] All screens responsive on mobile
* [ ] Real-time updates when data changes

---

## Estimation

| Story           | Points       | Notes                              |
| --------------- | ------------ | ---------------------------------- |
| US-3.1          | 5            | Dashboard with multiple components |
| US-3.2          | 5            | Cost tracking table                |
| US-3.3          | 3            | Expense form                       |
| US-3.4          | 5            | Change order with impact calc      |
| US-3.5          | 5            | Photo management                   |
| US-3.6          | 2            | Ready to list flow                 |
| **Total** | **25** | ~1.5 weeks                         |
