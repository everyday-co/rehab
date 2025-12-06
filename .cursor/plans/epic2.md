# Epic 2: Phase 2 - Budget & Optimize

**Epic Owner:** Developer

**Priority:** P0 (Must Have)

**Sprint:** 3-4

**Dependencies:** Epic 1 (Scope Detect)

---

## Overview

Phase 2 transforms the detected scope into an optimized budget. Users can see how their finish selections compare to market expectations, build their budget using AI recommendations or manual selection, optimize for ROI, plan the timeline, and generate contractor documents.

**Phase Color:** Blue (phase-2)

**Entry Point:** `/properties/[id]/budget`

---

## User Journey

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       PHASE 2: BUDGET & OPTIMIZE                            │
│                     "Build a budget that maximizes profit"                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ STEP 1      STEP 2       STEP 3        STEP 4         STEP 5              │
│ Market  ──► Build   ──►  Optimize  ──► Timeline  ──►  Contractors ──► [P3]│
│ Match       Budget       (Scenarios)   (Gantt)        (Docs/Bids)         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## User Stories

### US-2.1: View Market Match Analysis

**As a** user

**I want** to see what finishes are standard at my target ARV

**So that** I make finish selections that match buyer expectations

**Acceptance Criteria:**

* [ ] Show "Market Match Score" (% of comp features you have)
* [ ] List key features with % prevalence at target price point
* [ ] Indicate which features are in your current scope (check/X)
* [ ] Show impact: "Adding X could justify $Y higher ARV"
* [ ] Data sourced from comps entered for this property

**Screen: Market Match**

```
┌─────────────────────────────────────────────────────────────────┐
│ [Phase Indicator: ✓ ● ○ ○ ]   Step 1 of 5                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Market Match Analysis                                          │
│  How your planned finishes compare to $735K-$775K comps        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │     Your Market Match Score: 78%                        │   │
│  │     ████████████████████████░░░░░░                      │   │
│  │     Good! 2 features below could increase appeal.      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  FEATURE PREVALENCE AT TARGET ARV                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Feature               │ In Comps │ Your Scope          │   │
│  ├───────────────────────┼──────────┼─────────────────────┤   │
│  │ Quartz Counters       │ 95% ████ │ ✓ Included         │   │
│  │ Stainless Appliances  │ 92% ████ │ ✓ Included         │   │
│  │ Hardwood/LVP Flooring │ 88% ████ │ ✓ Included         │   │
│  │ Updated HVAC          │ 85% ████ │ ✓ Included         │   │
│  │ Tiled Primary Shower  │ 80% ████ │ ✗ Consider adding  │   │
│  │ Smart Home Features   │ 45% ██░░ │ ✗ Optional         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  💡 Adding tiled primary shower (~$3,500) appears in 80%       │
│     of comps at your price point.                              │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ [← Back to Scope]                     [Continue to Budget →]   │
└─────────────────────────────────────────────────────────────────┘
```

---

### US-2.2: Build Budget - AI Recommendations Mode

**As a** user

**I want** the system to recommend a budget based on my scope

**So that** I can quickly build a smart budget without manual research

**Acceptance Criteria:**

* [ ] Toggle between AI Recommendations and Build Your Own
* [ ] AI mode shows three tiers: Essential, High ROI, Premium
* [ ] Each tier shows items with cost and justification
* [ ] Items can be toggled on/off
* [ ] Running budget total displayed
* [ ] Can switch to BYO mode anytime

**Recommendation Tiers:**

| Tier      | Criteria                                     | Badge Color |
| --------- | -------------------------------------------- | ----------- |
| Essential | Required for sale (safety, code, livability) | Red         |
| High ROI  | 85%+ cost recovery expected                  | Green       |
| Premium   | Positions for top ARV, differentiators       | Gold        |

**Screen: AI Recommendations**

```
┌─────────────────────────────────────────────────────────────────┐
│ [Phase Indicator: ✓ ● ○ ○ ]   Step 2 of 5                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Build Your Budget                                              │
│  [AI Recommendations ✓]  [Build Your Own]                      │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🔴 ESSENTIAL ITEMS                        $48,500       │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ ☑ HVAC Replacement               $8,500                │   │
│  │   System is 18+ years old                              │   │
│  │ ☑ Electrical Panel Upgrade       $3,200                │   │
│  │   200 amp needed for modern load                       │   │
│  │ ☑ Kitchen Cabinets (Full)       $12,500                │   │
│  │   Current cabinets beyond repair                       │   │
│  │ ... more items                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🟢 HIGH ROI UPGRADES                      $32,000       │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ ☑ Quartz Countertops             $3,200   ROI: 92%     │   │
│  │ ☑ LVP Flooring (Main)            $8,400   ROI: 95%     │   │
│  │ ☐ Tiled Primary Shower           $3,500   ROI: 88%     │   │
│  │   [+ Add to Budget]                                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ⭐ PREMIUM POSITIONING                    $12,000       │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ ☐ Smart Home Package             $2,500                │   │
│  │ ☐ Patio Extension                $8,500                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  BUDGET SUMMARY                                                 │
│  Subtotal: $80,500 │ Contingency: $8,050 │ Total: $88,550     │
│  Projected Profit: $127,450 → ROI: 22.8%                       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ [← Market Match]                      [Continue to Optimize →] │
└─────────────────────────────────────────────────────────────────┘
```

---

### US-2.3: Build Budget - Build Your Own Mode

**As a** user

**I want** to manually select items from a cost database

**So that** I have full control over my budget

**Acceptance Criteria:**

* [ ] Card carousel interface grouped by category
* [ ] Each card shows: name, cost range, ROI score, description
* [ ] Quick-add button with suggested quantity
* [ ] Filter by category tabs
* [ ] Search within database
* [ ] Added items appear in budget list below

**Screen: Build Your Own**

```
┌─────────────────────────────────────────────────────────────────┐
│  Build Your Budget                                              │
│  [AI Recommendations]  [Build Your Own ✓]                      │
│                                                                 │
│  [Search items...                               🔍]            │
│                                                                 │
│  [All] [Kitchen] [Bathroom] [Interior] [Exterior] [Systems]   │
│        ━━━━━━━━                                                │
│                                                                 │
│  KITCHEN                                          See All →    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  ◄ ►   │
│  │ Cabinets │ │ Counters │ │Appliances│ │Backsplash│         │
│  │ $250-350 │ │ $55-75   │ │ $3.5-5K  │ │ $15-35   │         │
│  │ per LF   │ │ per sqft │ │ set      │ │ per sqft │         │
│  │ 🟢 92%   │ │ 🟢 95%   │ │ 🟢 88%   │ │ 🔵 75%   │         │
│  │ [+ Add]  │ │ [+ Add]  │ │ [+ Add]  │ │ [+ Add]  │         │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘         │
│                                                                 │
│  YOUR BUDGET                            12 items • $68,400     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ▼ Kitchen (4 items)                       $28,200       │   │
│  │   • Cabinets - 40 LF                     $12,500       │   │
│  │   • Quartz Counters - 45 sqft             $3,200       │   │
│  │   • Appliance Package                     $4,500       │   │
│  │   • Backsplash - 30 sqft                   $750        │   │
│  │ ▶ Bathroom (5 items)                      $12,500       │   │
│  │ ▶ Interior (3 items)                      $27,700       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Subtotal: $68,400 │ Contingency: $6,840 │ Total: $75,240     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ [← Market Match]                      [Continue to Optimize →] │
└─────────────────────────────────────────────────────────────────┘
```

---

### US-2.4: Compare Budget Scenarios

**As a** user

**I want** to compare different budget scenarios

**So that** I can see the profit impact of different approaches

**Acceptance Criteria:**

* [ ] Three scenarios: Conservative, Base, Premium
* [ ] Each shows: rehab cost, ARV, profit, ROI, risk level, timeline
* [ ] Visual card comparison
* [ ] Can select a scenario to adopt
* [ ] Optimizer suggestions (swap/add/keep recommendations)

**Screen: Scenario Comparison**

```
┌─────────────────────────────────────────────────────────────────┐
│  Compare Scenarios                                              │
│                                                                 │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐  │
│  │ CONSERVATIVE    │ │ BASE CASE ★     │ │ PREMIUM         │  │
│  │ Essentials only │ │ Your budget     │ │ Max out ARV     │  │
│  │                 │ │                 │ │                 │  │
│  │ Rehab: $52K     │ │ Rehab: $88K     │ │ Rehab: $125K    │  │
│  │ ARV: $710K      │ │ ARV: $755K      │ │ ARV: $790K      │  │
│  │ Profit: $82.5K  │ │ Profit: $91.2K  │ │ Profit: $88.4K  │  │
│  │ ROI: 18.2%      │ │ ROI: 19.1%      │ │ ROI: 16.8%      │  │
│  │ Risk: Low       │ │ Risk: Medium    │ │ Risk: Higher    │  │
│  │ Time: 8 weeks   │ │ Time: 12 weeks  │ │ Time: 16 weeks  │  │
│  │                 │ │                 │ │                 │  │
│  │ [Select]        │ │ [Selected ✓]    │ │ [Select]        │  │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘  │
│                                                                 │
│  OPTIMIZER SUGGESTIONS                                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 💡 SWAP: Cabinet refacing vs replacement               │   │
│  │    Save $5,500 • Net gain: +$3,500 profit              │   │
│  │    [Accept] [Reject]                                   │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ 💡 ADD: Tiled primary shower                           │   │
│  │    Cost $3,500 • ARV +$6,000 • Net: +$2,500            │   │
│  │    [Accept] [Reject]                                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ [← Back to Budget]                    [Continue to Timeline →] │
└─────────────────────────────────────────────────────────────────┘
```

---

### US-2.5: Plan Project Timeline

**As a** user

**I want** to see a timeline with task dependencies

**So that** I can plan the project and understand holding costs

**Acceptance Criteria:**

* [ ] Gantt-style timeline view
* [ ] Tasks auto-generated from budget items
* [ ] Show dependencies (demo before flooring, etc.)
* [ ] Holding cost calculator based on duration
* [ ] Flag long-lead items (appliances, cabinets)

**Screen: Timeline**

```
┌─────────────────────────────────────────────────────────────────┐
│  Project Timeline                                               │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Duration: 12 weeks │ Holding: $2,400/mo │ Total: $7,200 │   │
│  │ Start: Jan 15      │ Target: Apr 8                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │      Wk1  Wk2  Wk3  Wk4  Wk5  Wk6  Wk7  Wk8  Wk9 Wk10 │   │
│  │ Demo ████                                               │   │
│  │ Elect    ████████                                       │   │
│  │ Plumb    ████████                                       │   │
│  │ HVAC         ████████                                   │   │
│  │ Drywall          ████████                               │   │
│  │ Kitchen              ████████████                       │   │
│  │ Bath                 ████████████                       │   │
│  │ Paint                        ████████                   │   │
│  │ Floor                            ████████               │   │
│  │ Final                                 ████              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ⚠️ LONG LEAD ITEMS                                            │
│  • Cabinets: Order 4-6 weeks early                             │
│  • Appliances: Confirm in stock or 2-4 weeks                   │
│                                                                 │
│  HOLDING COST IMPACT                                            │
│  If delayed 2 weeks: +$1,200 → $8,400 total                    │
│  If early 2 weeks: -$1,200 → $6,000 total                      │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ [← Optimize]                        [Continue to Contractors →] │
└─────────────────────────────────────────────────────────────────┘
```

---

### US-2.6: Generate Contractor Documents

**As a** user

**I want** to generate documents for contractor bids

**So that** I can get accurate quotes efficiently

**Acceptance Criteria:**

* [ ] Generate Scope of Work (SOW) document
* [ ] Generate Bid Sheet with line items
* [ ] Generate Material List
* [ ] Copy text or download PDF (V1.1)
* [ ] Track received bids in comparison table

**Screen: Contractors**

```
┌─────────────────────────────────────────────────────────────────┐
│  Contractor Hub                                                 │
│                                                                 │
│  GENERATE DOCUMENTS                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │
│  │ 📄 Scope of  │ │ 📊 Bid       │ │ 📋 Material  │           │
│  │    Work      │ │    Sheet     │ │    List      │           │
│  │ [Generate]   │ │ [Generate]   │ │ [Generate]   │           │
│  └──────────────┘ └──────────────┘ └──────────────┘           │
│                                                                 │
│  BID COMPARISON                                   [+ Add Bid]   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Contractor   │ Bid     │ $/Sqft │ vs Budget │ Timeline │   │
│  ├──────────────┼─────────┼────────┼───────────┼──────────┤   │
│  │ ABC Builders │ $82,500 │ $19.88 │ -6.3%     │ 10 weeks │   │
│  │ XYZ Const    │ $91,200 │ $21.97 │ +3.6%     │ 12 weeks │   │
│  │ Quick Flip   │ $78,000 │ $18.80 │ -11.4%    │ 14 weeks │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Notes: ABC Builders selected - best balance of cost/timeline  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ [← Timeline]                             [Lock Budget & Start →]│
└─────────────────────────────────────────────────────────────────┘
```

---

### US-2.7: Lock Budget and Proceed

**As a** user

**I want** to finalize my budget and move to construction

**So that** I have a baseline to track against

**Acceptance Criteria:**

* [ ] "Lock Budget" creates snapshot of current budget
* [ ] Shows final summary: total, projected profit, ROI
* [ ] Requires confirmation before locking
* [ ] Updates property status to Phase 3
* [ ] Budget items become trackable expenses

**Screen: Lock Budget Confirmation**

```
┌─────────────────────────────────────────────────────────────────┐
│  Ready to Lock Budget?                                    [×]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ FINAL BUDGET SUMMARY                                    │   │
│  │                                                         │   │
│  │ Rehab Budget                            $88,050         │   │
│  │ + Contingency (10%)                      $8,805         │   │
│  │ ─────────────────────────────────────────────────       │   │
│  │ Total Rehab                             $96,855         │   │
│  │                                                         │   │
│  │ Purchase Price                         $555,000         │   │
│  │ + Rehab                                 $96,855         │   │
│  │ + Holding Costs (12 wks)                 $7,200         │   │
│  │ + Selling Costs (8%)                    $60,400         │   │
│  │ ─────────────────────────────────────────────────       │   │
│  │ Total Investment                       $719,455         │   │
│  │                                                         │   │
│  │ Target ARV                             $755,000         │   │
│  │ ─────────────────────────────────────────────────       │   │
│  │ Projected Profit                        $35,545         │   │
│  │ ROI                                        4.9%         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ⚠️ Locking the budget will:                                   │
│  • Create a baseline for tracking actual costs                 │
│  • Move you to Phase 3: Build & Track                         │
│  • You can still adjust items, but original budget saved      │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                        [Cancel]    [Lock Budget & Start Build] │
└─────────────────────────────────────────────────────────────────┘
```

---

## User Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    PHASE 2 COMPLETE FLOW                        │
└─────────────────────────────────────────────────────────────────┘

[From Phase 1: Finalized Scope]
         │
         ▼
┌──────────────────┐
│  Market Match    │ ──► Show feature prevalence from comps
│  (US-2.1)        │ ──► Identify gaps in scope
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Build Budget    │
│  (US-2.2/2.3)    │
│                  │
│  AI Mode ◄──────►│ BYO Mode
│  - Essential     │ - Card carousel
│  - High ROI      │ - Category browse
│  - Premium       │ - Search items
│                  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Optimize        │ ──► Compare Conservative/Base/Premium
│  (US-2.4)        │ ──► AI swap/add/keep suggestions
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Timeline        │ ──► Gantt chart generation
│  (US-2.5)        │ ──► Holding cost calculator
│                  │ ──► Long lead item warnings
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Contractors     │ ──► Generate SOW, Bid Sheet, Materials
│  (US-2.6)        │ ──► Track contractor bids
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Lock Budget     │ ──► Snapshot baseline budget
│  (US-2.7)        │ ──► Move to Phase 3
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  PHASE 3         │
│  Build & Track   │
└──────────────────┘
```

---

## Technical Tasks

### T-2.1: Market Match Components

* FeatureMatchBar component
* FeatureMatchList component
* Market match score calculator
* Query comps for feature prevalence

### T-2.2: Budget Builder - AI Mode

* Tier categorization logic (Essential/High ROI/Premium)
* Recommendation engine based on scope + market
* Tier accordion components
* Item add/remove from tier

### T-2.3: Budget Builder - BYO Mode

* ItemCard component
* ItemCardCarousel component
* Category tab navigation
* Cost database search
* Add to budget action

### T-2.4: Budget Summary

* BudgetSummary component
* Contingency calculator (% based)
* Profit projection calculator
* Budget breakdown by category

### T-2.5: Scenario Comparison

* ScenarioCard component
* Scenario generation logic
* ComparisonTable component
* Optimizer suggestions logic

### T-2.6: Timeline Components

* GanttChart component
* GanttTask component
* Task generation from budget items
* Dependency mapping
* Holding cost calculator

### T-2.7: Contractor Documents

* SOW template generator
* Bid sheet template generator
* Material list generator
* BidComparisonTable component
* Add bid modal

### T-2.8: Lock Budget Flow

* Budget snapshot storage
* Phase transition logic
* Confirmation dialog

---

## Definition of Done

* [ ] Market match displays feature prevalence
* [ ] AI mode generates appropriate recommendations
* [ ] BYO mode allows browsing and adding items
* [ ] Budget total calculates correctly with contingency
* [ ] Scenarios show different profit projections
* [ ] Timeline generates from budget items
* [ ] Holding costs calculate based on duration
* [ ] Document generation works
* [ ] Bid comparison tracks multiple bids
* [ ] Lock budget transitions to Phase 3
* [ ] All screens responsive on mobile
* [ ] Real-time calculation updates

---

## Estimation

| Story           | Points       | Notes                           |
| --------------- | ------------ | ------------------------------- |
| US-2.1          | 5            | Market match with comp analysis |
| US-2.2          | 5            | AI recommendations mode         |
| US-2.3          | 5            | BYO with carousel               |
| US-2.4          | 5            | Scenario comparison + optimizer |
| US-2.5          | 8            | Timeline/Gantt (complex)        |
| US-2.6          | 5            | Document generation + bids      |
| US-2.7          | 2            | Lock budget flow                |
| **Total** | **35** | ~2 weeks                        |
