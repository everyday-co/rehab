# Epic 1: Phase 1 - Scope Detect

**Epic Owner:** Developer

**Priority:** P0 (Must Have)

**Sprint:** 2

**Dependencies:** Epic 0 (Foundation)

---

## Overview

Phase 1 helps users figure out what work their property needs. Users can input property details, choose a capture method (photos, video walkthrough, or questionnaire), and generate a draft scope of work that becomes the foundation for budgeting.

**Phase Color:** Violet (phase-1)

**Entry Point:** `/properties/new` or `/properties/[id]/scope`

---

## User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                     PHASE 1: SCOPE DETECT                       │
│                   "What does this property need?"               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   STEP 1          STEP 2           STEP 3                      │
│   Entry    ──►    Capture   ──►    Review    ──►  [Phase 2]   │
│                                                                 │
│   Property        Photos OR        Review                       │
│   Details    +    Questionnaire    Detected                    │
│   Capture              ↓           Items                       │
│   Method          Generate              ↓                      │
│   Selection       Scope           Finalize                     │
│                                   Scope                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## User Stories

### US-1.1: Create New Property

**As a** user

**I want** to enter basic property information

**So that** the system can help me analyze this flip

**Acceptance Criteria:**

* [ ] Form captures: address, city, state, zip
* [ ] Form captures: sqft (total), sqft above grade, sqft basement
* [ ] Form captures: beds, baths, lot size, garage spaces, year built
* [ ] Form captures: purchase price, purchase date
* [ ] Form captures: target ARV (low/high range)
* [ ] Form captures: property condition (cosmetic/moderate/gut-rehab)
* [ ] Form captures: notes (free text)
* [ ] Form validation with clear error messages
* [ ] Save creates property record in database
* [ ] After save, proceed to capture method selection

**Screen: Property Details Form**

```
┌─────────────────────────────────────────────────────────────────┐
│ [Phase Indicator: ● ○ ○ ○ ]                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  New Property                                                   │
│  Let's start with the basics                                   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ PROPERTY ADDRESS                                        │   │
│  │                                                         │   │
│  │ Street Address                                          │   │
│  │ [3811 Whitetail Dr                               ]     │   │
│  │                                                         │   │
│  │ City              State         Zip                     │   │
│  │ [Shakopee     ]   [MN  ▼]      [55379    ]            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ PROPERTY DETAILS                                        │   │
│  │                                                         │   │
│  │ Total Sqft        Above Grade       Basement           │   │
│  │ [4,150     ]      [3,036     ]      [1,114    ]       │   │
│  │                                                         │   │
│  │ Beds    Baths    Lot (acres)   Garage    Year Built   │   │
│  │ [5  ]   [3.5]    [0.61    ]    [3   ]    [2006    ]   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ PURCHASE & VALUE                                        │   │
│  │                                                         │   │
│  │ Purchase Price            Purchase Date                 │   │
│  │ [$555,000         ]      [02/18/2022    📅]           │   │
│  │                                                         │   │
│  │ Target ARV (After Repair Value)                        │   │
│  │ Low              High                                   │   │
│  │ [$735,000   ]    [$775,000   ]                        │   │
│  │                                                         │   │
│  │ Property Condition                                      │   │
│  │ [Gut Rehab                                       ▼]   │   │
│  │   ○ Cosmetic - Paint, flooring, fixtures               │   │
│  │   ○ Moderate - Kitchen/bath updates, some systems      │   │
│  │   ● Gut Rehab - Complete renovation                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ NOTES                                                   │   │
│  │ [Large 0.61 acre lot is 2x neighborhood average -     ]│   │
│  │ [key differentiator for ARV justification.            ]│   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                        [Save & Continue →]     │
└─────────────────────────────────────────────────────────────────┘
```

**Form Validation Rules:**

| Field          | Required | Validation                            |
| -------------- | -------- | ------------------------------------- |
| Address        | Yes      | Non-empty string                      |
| City           | Yes      | Non-empty string                      |
| State          | Yes      | Valid US state                        |
| Zip            | Yes      | 5-digit format                        |
| Total Sqft     | Yes      | Positive number                       |
| Beds           | Yes      | 0-20                                  |
| Baths          | Yes      | 0-10 (supports .5)                    |
| Purchase Price | Yes      | Positive number                       |
| ARV Low        | Yes      | Greater than purchase price           |
| ARV High       | Yes      | Greater than or equal to ARV Low      |
| Condition      | Yes      | One of: cosmetic, moderate, gut-rehab |

---

### US-1.2: Select Capture Method

**As a** user

**I want** to choose how I'll identify the property's scope

**So that** I can use the method that works best for me

**Acceptance Criteria:**

* [ ] Three capture method cards displayed
* [ ] Each card shows: icon, title, description, time estimate, accuracy indicator
* [ ] "Recommended" badge on preferred method
* [ ] Selecting a card highlights it and enables Continue
* [ ] Continue navigates to appropriate capture flow

**Capture Methods:**

| Method            | Time      | Accuracy  | MVP Status         |
| ----------------- | --------- | --------- | ------------------ |
| Photo Upload      | 5-10 min  | High      | V1.1 (AI analysis) |
| Walkthrough Video | 10-15 min | Very High | V2                 |
| Questionnaire     | 15-20 min | Good      | **MVP**      |

**Screen: Capture Method Selection**

```
┌─────────────────────────────────────────────────────────────────┐
│ [Phase Indicator: ● ○ ○ ○ ]   Step 1 of 3                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  How would you like to identify the scope?                     │
│  Choose the method that works best for you                     │
│                                                                 │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐  │
│  │ 📸              │ │ 🎥              │ │ 📋 RECOMMENDED │  │
│  │                 │ │                 │ │                 │  │
│  │ Photo Upload    │ │ Video           │ │ Questionnaire   │  │
│  │                 │ │ Walkthrough     │ │                 │  │
│  │ Upload 5-15     │ │ Record a quick  │ │ Answer guided   │  │
│  │ photos and AI   │ │ walkthrough     │ │ questions about │  │
│  │ will detect     │ │ video for most  │ │ each room and   │  │
│  │ issues          │ │ accurate scope  │ │ system          │  │
│  │                 │ │                 │ │                 │  │
│  │ ⏱ 5-10 min     │ │ ⏱ 10-15 min    │ │ ⏱ 15-20 min    │  │
│  │ 🎯 High        │ │ 🎯 Very High   │ │ 🎯 Good         │  │
│  │                 │ │                 │ │                 │  │
│  │ [Coming Soon]   │ │ [Coming Soon]   │ │ [  Selected  ]  │  │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ [← Back]                                      [Continue →]     │
└─────────────────────────────────────────────────────────────────┘
```

---

### US-1.3: Complete Scope Questionnaire

**As a** user

**I want** to answer questions about each area of the property

**So that** the system can generate a comprehensive scope

**Acceptance Criteria:**

* [ ] Multi-step questionnaire organized by area
* [ ] Progress indicator shows completion
* [ ] Questions adapt based on previous answers
* [ ] Save progress automatically (can return later)
* [ ] Skip option for areas not applicable
* [ ] Summary shows before generating scope

**Questionnaire Sections:**

| Section   | Questions                                                | Items Generated |
| --------- | -------------------------------------------------------- | --------------- |
| Kitchen   | Cabinets, counters, appliances, flooring, layout         | 8-15 items      |
| Bathrooms | Per bathroom: vanity, toilet, tub/shower, tile, fixtures | 5-10 items each |
| Interior  | Paint, flooring, trim, doors, lighting, electrical       | 10-20 items     |
| Exterior  | Roof, siding, windows, doors, garage, landscaping        | 8-15 items      |
| Systems   | HVAC, plumbing, electrical, water heater                 | 5-10 items      |
| Basement  | Finished?, waterproofing, egress, flooring               | 5-10 items      |

**Screen: Questionnaire - Kitchen Section**

```
┌─────────────────────────────────────────────────────────────────┐
│ [Phase Indicator: ● ○ ○ ○ ]   Step 2 of 3                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Kitchen Assessment                                             │
│  Section 1 of 6  ████████░░░░░░░░ 15%                          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  What is the current condition of the kitchen           │   │
│  │  cabinets?                                              │   │
│  │                                                         │   │
│  │  ○ Good - Minor touch-ups only                         │   │
│  │  ○ Fair - Need refinishing or painting                 │   │
│  │  ○ Poor - Need replacement (reface or new)             │   │
│  │  ● Gut - Complete removal and new cabinets             │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  What type of countertops does the property need?       │   │
│  │                                                         │   │
│  │  ○ Keep existing                                       │   │
│  │  ○ Laminate ($15-40/sqft installed)                   │   │
│  │  ● Quartz ($50-80/sqft installed)                     │   │
│  │  ○ Granite ($40-60/sqft installed)                    │   │
│  │  ○ Butcher Block ($40-65/sqft installed)              │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  Which appliances need to be replaced?                  │   │
│  │  Select all that apply                                  │   │
│  │                                                         │   │
│  │  ☑ Refrigerator                                        │   │
│  │  ☑ Range/Oven                                          │   │
│  │  ☑ Dishwasher                                          │   │
│  │  ☑ Microwave/Hood                                      │   │
│  │  ☐ Washer/Dryer (if in kitchen)                       │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Any additional kitchen notes?                          │   │
│  │  [Layout change needed - remove wall to dining    ]    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ [← Back]    [Skip Section]              [Next: Bathrooms →]    │
└─────────────────────────────────────────────────────────────────┘
```

**Question Logic Examples:**

```
Q: "How many bathrooms need work?"
A: "3"
→ Generate 3 bathroom sub-sections

Q: "Property condition?" (from Step 1)
A: "Gut Rehab"
→ Pre-select "Gut/Replace" options throughout questionnaire

Q: "Is basement finished?"
A: "No"
→ Skip "refinish existing" questions, show "finish new" options
```

---

### US-1.4: Review Generated Scope

**As a** user

**I want** to review and adjust the generated scope items

**So that** I can finalize what work will be done

**Acceptance Criteria:**

* [ ] Scope items grouped by category (expandable sections)
* [ ] Each item shows: name, quantity, unit, estimated cost range, priority badge
* [ ] Confidence indicator for AI-detected items (future)
* [ ] Toggle to include/exclude items
* [ ] Edit quantity inline
* [ ] Add custom item option
* [ ] Running total displayed
* [ ] "Finalize Scope" saves and moves to Phase 2

**Priority Badges:**

* 🔴 **Essential** - Required for sale (safety, code, function)
* 🟢 **High ROI** - 85%+ cost recovery expected
* 🔵 **Recommended** - Standard for price point
* ⚪ **Optional** - Nice to have but not expected

**Screen: Scope Review**

```
┌─────────────────────────────────────────────────────────────────┐
│ [Phase Indicator: ● ○ ○ ○ ]   Step 3 of 3                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Review Your Scope                                              │
│  46 items detected • Estimated $115,000 - $145,000             │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ▼ KITCHEN                           $32,500 - $41,000  │   │
│  │   12 items                                              │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │                                                         │   │
│  │ ☑ Cabinet replacement (full)         🔵 Recommended    │   │
│  │   40 LF × $280-350/LF = $11,200-14,000                 │   │
│  │                                      [Edit] [Remove]    │   │
│  │                                                         │   │
│  │ ☑ Quartz countertops                 🟢 High ROI       │   │
│  │   45 sqft × $55-75/sqft = $2,475-3,375                 │   │
│  │                                      [Edit] [Remove]    │   │
│  │                                                         │   │
│  │ ☑ Appliance package (mid-range)      🔵 Recommended    │   │
│  │   1 set × $3,500-5,000 = $3,500-5,000                  │   │
│  │                                      [Edit] [Remove]    │   │
│  │                                                         │   │
│  │ ☐ Under-cabinet lighting             ⚪ Optional        │   │
│  │   12 LF × $25-40/LF = $300-480                         │   │
│  │                                      [Edit] [Remove]    │   │
│  │                                                         │   │
│  │ [+ Add Item to Kitchen]                                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ▶ BATHROOMS (3)                     $18,000 - $24,000  │   │
│  │   15 items                                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ▶ INTERIOR                          $24,000 - $32,000  │   │
│  │   8 items                                               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ▶ EXTERIOR                          $12,000 - $18,000  │   │
│  │   6 items                                               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ▶ SYSTEMS                           $22,000 - $28,000  │   │
│  │   5 items                                               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ───────────────────────────────────────────────────────────   │
│                                                                 │
│  SUMMARY                                                        │
│  Included Items: 42 of 46                                      │
│  Estimated Range: $115,500 - $143,000                          │
│  + 10% Contingency: $11,550 - $14,300                         │
│  ─────────────────────────────────────                         │
│  Total: $127,050 - $157,300                                    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ [← Back to Questionnaire]           [Finalize & Build Budget →]│
└─────────────────────────────────────────────────────────────────┘
```

---

### US-1.5: Edit Scope Item

**As a** user

**I want** to edit the details of a scope item

**So that** I can adjust quantities or costs to match my situation

**Acceptance Criteria:**

* [ ] Click "Edit" opens inline edit or modal
* [ ] Can change: quantity, unit cost range, notes
* [ ] Validation prevents invalid values
* [ ] Save updates item and recalculates totals
* [ ] Cancel returns to original values

**Screen: Edit Item Dialog**

```
┌─────────────────────────────────────────────────────────────────┐
│  Edit Scope Item                                          [×]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Item: Cabinet replacement (full)                              │
│  Category: Kitchen                                              │
│                                                                 │
│  Quantity                    Unit                               │
│  [40               ]        [Linear Feet        ▼]             │
│                                                                 │
│  Cost Range (per unit)                                          │
│  Low                         High                               │
│  [$280             ]        [$350             ]                │
│                                                                 │
│  Calculated Total: $11,200 - $14,000                           │
│                                                                 │
│  Notes                                                          │
│  [Semi-custom shaker style, soft-close                    ]   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                              [Cancel]    [Save Changes]        │
└─────────────────────────────────────────────────────────────────┘
```

---

### US-1.6: Add Custom Scope Item

**As a** user

**I want** to add items not detected by the questionnaire

**So that** my scope is complete

**Acceptance Criteria:**

* [ ] "Add Item" button in each category section
* [ ] Can search/browse cost database
* [ ] Can create fully custom item
* [ ] New item appears in appropriate category
* [ ] Auto-saves to database

**Screen: Add Item**

```
┌─────────────────────────────────────────────────────────────────┐
│  Add Scope Item                                           [×]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Search cost database...                            🔍]      │
│                                                                 │
│  ─── Or choose from category ───                               │
│                                                                 │
│  KITCHEN ITEMS                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ○ Cabinet hardware           $3-8/piece                │   │
│  │ ○ Cabinet refinishing        $75-150/LF                │   │
│  │ ○ Backsplash tile            $15-35/sqft               │   │
│  │ ○ Sink replacement           $250-600/each             │   │
│  │ ○ Faucet replacement         $150-400/each             │   │
│  │ ● Custom item...                                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ─── Custom Item Details ───                                   │
│                                                                 │
│  Name                                                           │
│  [Kitchen island electrical                              ]    │
│                                                                 │
│  Quantity         Unit              Cost/Unit                  │
│  [1         ]     [Each      ▼]    [$800        ]            │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                              [Cancel]    [Add to Scope]        │
└─────────────────────────────────────────────────────────────────┘
```

---

## User Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    PHASE 1 COMPLETE FLOW                        │
└─────────────────────────────────────────────────────────────────┘

[Dashboard]
     │
     ▼
[+ New Property]
     │
     ▼
┌──────────────────┐
│  Property Form   │ ──► Validate ──► Save to DB
│  (US-1.1)        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Capture Method  │
│  Selection       │ ──► For MVP: Questionnaire only
│  (US-1.2)        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Questionnaire   │
│  Multi-step      │ ──► Auto-save progress
│  (US-1.3)        │ ──► Generate scope items based on answers
│                  │
│  Kitchen ───────►├──► Cabinet items
│  Bathrooms ─────►├──► Bathroom items (×N)
│  Interior ──────►├──► Paint, flooring, etc.
│  Exterior ──────►├──► Roof, siding, etc.
│  Systems ───────►├──► HVAC, plumbing, etc.
│  Basement ──────►├──► Basement items
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Scope Review    │
│  (US-1.4)        │
│                  │
│  - Review items  │
│  - Include/Excl  │
│  - Edit (US-1.5) │
│  - Add (US-1.6)  │
│                  │
└────────┬─────────┘
         │
         ▼
[Finalize Scope]
         │
         ▼
┌──────────────────┐
│  PHASE 2         │
│  Budget & Opt    │
└──────────────────┘
```

---

## Technical Tasks

### T-1.1: Property Form Components

* Build property details form with all fields
* Create Zod validation schema
* Currency input component (with formatting)
* Square footage input component
* State dropdown with US states
* Condition selector (radio or select)

### T-1.2: Property API Routes

* POST /api/properties - Create property
* GET /api/properties/[id] - Get property
* PATCH /api/properties/[id] - Update property
* DELETE /api/properties/[id] - Delete property

### T-1.3: Capture Method Selection

* Build CaptureMethodCard component
* Three card layout with selection state
* "Coming Soon" overlay for non-MVP methods

### T-1.4: Questionnaire Engine

* Multi-step form with progress tracking
* Question types: single choice, multi-choice, number input, text
* Conditional logic for follow-up questions
* Auto-save with debounce
* Skip section functionality

### T-1.5: Scope Generation Logic

* Map questionnaire answers to cost database items
* Apply quantity calculations based on property size
* Set priority based on condition and item type
* Generate rehab_items records

### T-1.6: Scope Review Components

* Expandable category sections (ScopeCategory)
* Scope item row component (ScopeItemRow)
* Include/exclude toggle
* Running total calculation
* Edit item modal
* Add item modal with search

### T-1.7: Cost Database Integration

* Query cost database by category
* Search cost database by name/tags
* Create custom items

### T-1.8: Phase Navigation

* Update property current_phase/current_step on progress
* Route guards to prevent skipping ahead
* "Finalize" action to lock Phase 1 and proceed

---

## Definition of Done

* [ ] User can create property with all required fields
* [ ] Form validation works and shows clear errors
* [ ] Questionnaire flows through all sections
* [ ] Questionnaire progress auto-saves
* [ ] Scope items generated match questionnaire answers
* [ ] User can include/exclude items
* [ ] User can edit item quantities and costs
* [ ] User can add custom items
* [ ] Running total updates in real-time
* [ ] Finalizing scope moves to Phase 2
* [ ] All screens responsive on mobile
* [ ] Loading states present
* [ ] Error states handled

---

## Estimation

| Story           | Points       | Notes                          |
| --------------- | ------------ | ------------------------------ |
| US-1.1          | 5            | Complex form, many fields      |
| US-1.2          | 2            | Simple card selection          |
| US-1.3          | 8            | Multi-step questionnaire logic |
| US-1.4          | 5            | Scope review with calculations |
| US-1.5          | 2            | Edit modal                     |
| US-1.6          | 3            | Add with search/custom         |
| **Total** | **25** | ~1.5 weeks                     |
