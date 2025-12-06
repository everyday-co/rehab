# Product Requirements Document (PRD)

# Fix & Flip Rehab Tracker

**Version:** 1.0

**Last Updated:** December 5, 2024

**Author:** Adam

**Status:** In Development

---

## 1. Executive Summary

### 1.1 Product Vision

Build the most intuitive, data-driven fix & flip deal analysis and project tracking tool that helps real estate investors maximize ROI by providing intelligent rehab budgeting, market-aligned finish selection, and portfolio learning that improves estimates over time.

### 1.2 Problem Statement

Current fix & flip tools (spreadsheets, generic project management apps) fail investors because they:

* Require manual data entry without intelligent suggestions
* Don't connect rehab decisions to market expectations (what finishes do buyers expect at this price point?)
* Treat each flip as isolated rather than learning from past projects
* Don't provide real-time profit impact as scope changes
* Lack photo documentation integrated with budget tracking

### 1.3 Solution

A "conveyor belt" workflow application that guides investors through four phases:

1. **Scope Detect** - Figure out what the property needs
2. **Budget & Optimize** - Build a smart, market-aligned budget
3. **Build & Track** - Monitor progress against plan
4. **Close & Learn** - Capture learnings to improve future flips

### 1.4 Success Metrics

| Metric                   | Target                          | Measurement           |
| ------------------------ | ------------------------------- | --------------------- |
| User completes Phase 1-2 | 80% of started projects         | Funnel analytics      |
| Budget accuracy          | Within 15% of actual            | Phase 4 retrospective |
| Time to complete budget  | < 30 minutes                    | Session tracking      |
| User retention           | 70% return for 2nd project      | Login analytics       |
| Estimate improvement     | 10% better accuracy by 3rd flip | Portfolio analytics   |

---

## 2. Target Users

### 2.1 Primary Persona: "Solo Flipper Sam"

* **Demographics:** 35-55 years old, does 2-8 flips per year
* **Experience:** 1-10 previous flips, knows the basics but not an expert
* **Pain Points:**
  * Spends 4+ hours building rehab budgets in spreadsheets
  * Often surprised by actual costs vs estimates
  * Uncertain which finishes will appeal to buyers at target price
  * Loses track of expenses during project
  * Makes same estimation mistakes repeatedly
* **Goals:**
  * Faster, more accurate deal analysis
  * Confidence that finish selections match market expectations
  * Real-time visibility into project profitability
  * Learn from each flip to improve the next

### 2.2 Secondary Persona: "Scaling Sarah"

* **Demographics:** Running a small flipping business, 10-20+ flips/year
* **Experience:** Seasoned investor building a team
* **Pain Points:**
  * No standardized process across projects
  * Difficult to compare performance across flips
  * Can't easily delegate deal analysis
* **Goals:**
  * Repeatable workflow for team members
  * Portfolio-level analytics
  * Standardized documentation for contractors

### 2.3 Out of Scope Users (V1)

* Large flipping operations (50+ flips/year) - enterprise features later
* Wholesalers (different workflow) - separate product consideration
* Buy-and-hold investors - different economics model

---

## 3. Product Principles

### 3.1 Core Principles

1. **Progressive Disclosure** - Show only what's needed for the current step; don't overwhelm
2. **Smart Defaults** - Pre-populate with intelligent suggestions; user can override
3. **Real-Time Feedback** - Every change instantly shows profit impact
4. **Market-Driven Decisions** - Connect every decision to market data and buyer expectations
5. **Learn and Improve** - System gets smarter with each completed flip
6. **Mobile-Ready** - Works on phone at the job site, not just desktop

### 3.2 Design Philosophy

* **Clarity over features** - Better to do 10 things excellently than 50 things poorly
* **Guided but flexible** - Strong defaults with easy overrides for experienced users
* **Celebrate progress** - Make the journey feel rewarding, not like a chore

---

## 4. Feature Overview

### 4.1 Phase 1: Scope Detect

**Goal:** Help user understand what work the property needs

| Feature                    | Priority | Description                                                                                |
| -------------------------- | -------- | ------------------------------------------------------------------------------------------ |
| Property Info Form         | P0       | Basic property details (address, sqft, beds/baths, year built, purchase price, target ARV) |
| Capture Method Selection   | P0       | Choose how to identify scope: Photos, Video, or Questionnaire                              |
| Photo Upload & Analysis    | P1       | Upload property photos; AI detects issues and suggests scope items                         |
| Room-by-Room Questionnaire | P0       | Guided questions about each area's condition                                               |
| Scope Review               | P0       | Review detected/suggested items; include/exclude, adjust quantities                        |
| Draft Scope Export         | P2       | Export scope list for contractor walkthroughs                                              |

### 4.2 Phase 2: Budget & Optimize

**Goal:** Build a budget that maximizes profit and matches market expectations

| Feature               | Priority | Description                                                       |
| --------------------- | -------- | ----------------------------------------------------------------- |
| Market Match Analysis | P1       | Show what finishes appear in comps at target ARV                  |
| Comp Gallery          | P2       | Visual comparison with comparable sales                           |
| AI Budget Mode        | P0       | System generates recommended budget based on scope + market + ROI |
| Build Your Own Mode   | P0       | Browse cost database, add items manually via carousel             |
| Budget Summary        | P0       | Running totals by category, contingency calculation               |
| Scenario Comparison   | P1       | Compare Conservative/Base/Premium budget scenarios                |
| ROI Optimizer         | P1       | AI suggestions to swap/add/remove items for better ROI            |
| Timeline Builder      | P1       | Gantt chart with task sequencing, holding cost calculator         |
| Contractor Documents  | P2       | Generate SOW, bid sheets, material lists                          |
| Bid Comparison        | P2       | Compare contractor bids side-by-side                              |

### 4.3 Phase 3: Build & Track

**Goal:** Stay on budget and on schedule during construction

| Feature                 | Priority | Description                                      |
| ----------------------- | -------- | ------------------------------------------------ |
| Progress Dashboard      | P0       | Overview of budget, schedule, scope status       |
| Cost Tracking           | P0       | Log expenses, compare budget vs actual           |
| Change Order Management | P1       | Document scope changes with cost/timeline impact |
| Photo Documentation     | P1       | Upload progress photos by room and stage         |
| Alert System            | P1       | Warnings when over budget, behind schedule, etc. |
| Expense Receipt Upload  | P2       | Attach receipts to expenses                      |

### 4.4 Phase 4: Close & Learn

**Goal:** Capture learnings to improve future estimates

| Feature                    | Priority | Description                                   |
| -------------------------- | -------- | --------------------------------------------- |
| Project Retrospective      | P0       | Projected vs actual analysis, lessons learned |
| Portfolio Dashboard        | P1       | View all completed flips, aggregate metrics   |
| Estimate Accuracy Tracking | P1       | Track accuracy by category, show trends       |
| Personalized Adjustments   | P2       | Auto-adjust future estimates based on history |
| Export Final Report        | P2       | Generate summary report for records/partners  |

### 4.5 Cross-Cutting Features

| Feature             | Priority | Description                                           |
| ------------------- | -------- | ----------------------------------------------------- |
| User Authentication | P0       | Email + Google OAuth login                            |
| Property CRUD       | P0       | Create, view, edit, delete properties                 |
| Cost Database       | P0       | Minnesota-specific costs, expandable to other regions |
| Dark Mode           | P1       | System preference + manual toggle                     |
| Mobile Responsive   | P0       | Full functionality on mobile devices                  |
| Data Export         | P2       | Export to CSV/Excel                                   |

---

## 5. Information Architecture

### 5.1 Navigation Structure

```
├── Dashboard (Property List)
│   ├── + New Property
│   └── [Property Card] → Property Detail
│
├── Property Detail
│   ├── Phase 1: Scope Detect
│   │   ├── Step 1: Entry (Property Info + Capture Method)
│   │   ├── Step 2: Capture (Photos/Questionnaire)
│   │   └── Step 3: Review (Scope List)
│   │
│   ├── Phase 2: Budget & Optimize
│   │   ├── Step 1: Market Match
│   │   ├── Step 2: Build Budget
│   │   ├── Step 3: Optimize
│   │   ├── Step 4: Timeline
│   │   └── Step 5: Contractors
│   │
│   ├── Phase 3: Build & Track
│   │   ├── Step 1: Dashboard
│   │   ├── Step 2: Costs
│   │   └── Step 3: Photos
│   │
│   └── Phase 4: Close & Learn
│       ├── Step 1: Retrospective
│       └── Step 2: Portfolio
│
├── Portfolio (all completed flips)
│
└── Settings
    ├── Profile
    ├── Preferences
    └── Cost Database (view/customize)
```

### 5.2 URL Structure

```
/                           → Dashboard (property list)
/properties/new             → New property form
/properties/[id]            → Property detail (redirects to current phase)
/properties/[id]/scope      → Phase 1
/properties/[id]/budget     → Phase 2
/properties/[id]/build      → Phase 3
/properties/[id]/review     → Phase 4
/portfolio                  → Portfolio analytics
/settings                   → User settings
```

---

## 6. Data Model Overview

### 6.1 Core Entities

```
User (profile)
  └── has many Properties

Property
  ├── has one HoldingCosts
  ├── has one SellingCosts
  ├── has many RehabItems
  ├── has many Expenses
  ├── has many Photos
  ├── has many TimelineTasks
  ├── has many Comps
  └── has one FlipResult (after sale)

RehabItem (scope/budget line item)
  └── linked to CostDatabase (reference)

CostDatabase (system reference data)
  └── regional cost estimates by item
```

### 6.2 Key Relationships

* Property status determines which phases are accessible
* RehabItems are created from CostDatabase templates but can be customized
* Expenses link back to RehabItems for variance tracking
* FlipResult is created when property is marked sold

---

## 7. Technical Requirements

### 7.1 Performance

* Page load: < 2 seconds on 3G connection
* Budget calculations: Real-time (< 100ms)
* Photo upload: Support up to 50 photos per property
* Offline capability: Not required for V1

### 7.2 Security

* Authentication via Supabase Auth
* Row-level security: Users only see their own data
* Secure file uploads to Supabase Storage
* HTTPS everywhere

### 7.3 Scalability

* Support 1,000 concurrent users
* Up to 100 properties per user
* Up to 500 rehab items per property

### 7.4 Browser Support

* Chrome, Firefox, Safari, Edge (latest 2 versions)
* iOS Safari, Chrome for Android

---

## 8. Release Plan

### 8.1 MVP (8 weeks)

**Goal:** Complete workflow for a single flip

**Included:**

* User auth (email + Google)
* Property CRUD
* Phase 1: Full scope detection flow (questionnaire mode)
* Phase 2: Budget builder (both modes), basic timeline
* Phase 3: Dashboard, cost tracking
* Phase 4: Basic retrospective
* Mobile responsive

**Excluded from MVP:**

* AI photo analysis (use questionnaire instead)
* Comp data API integration (manual entry)
* Contractor messaging
* PDF export
* Portfolio analytics (beyond single project)

### 8.2 V1.1 (4 weeks post-MVP)

* Photo upload with manual tagging
* Scenario comparison
* Improved timeline with dependencies
* Contractor document generation

### 8.3 V1.2 (4 weeks)

* Portfolio dashboard
* Estimate accuracy tracking
* Personalized adjustments
* Dark mode

### 8.4 Future Considerations

* AI photo analysis
* Comp data API (Zillow, Redfin)
* Multi-user/team features
* Mobile app (React Native)
* Contractor marketplace integration

---

## 9. Success Criteria for MVP

### 9.1 Functional Completeness

* [ ] User can create account and log in
* [ ] User can create a new property with basic details
* [ ] User can complete questionnaire to generate scope
* [ ] User can review and modify scope items
* [ ] User can build budget using AI recommendations
* [ ] User can build budget using manual item selection
* [ ] User can view budget summary with profit calculation
* [ ] User can track expenses against budget
* [ ] User can mark property as sold and view retrospective
* [ ] All features work on mobile viewport

### 9.2 Quality Gates

* [ ] No critical bugs
* [ ] Page load < 3 seconds
* [ ] All forms have validation
* [ ] Error states handled gracefully
* [ ] Loading states present

### 9.3 User Acceptance

* [ ] Test with 3 real users (fix & flip investors)
* [ ] Complete at least one full property workflow
* [ ] Gather feedback, address critical issues

---

## 10. Open Questions

| Question                                   | Owner | Status                    |
| ------------------------------------------ | ----- | ------------------------- |
| Which comp data API to integrate?          | Adam  | Researching               |
| AI photo analysis: build or buy?           | Adam  | Deferred to post-MVP      |
| Multi-region cost database: user-editable? | Adam  | Yes, allow user overrides |
| Team/sharing features priority?            | Adam  | V2 consideration          |

---

## 11. Appendix

### 11.1 Reference Documents

* [CURSOR_PROJECT_BRIEF.md](https://claude.ai/chat/CURSOR_PROJECT_BRIEF.md) - Technical implementation guide
* [COMPONENT_LIBRARY.md](https://claude.ai/chat/COMPONENT_LIBRARY.md) - UI component specifications
* [Epic documents](https://claude.ai/chat/epics/) - Detailed user stories and flows

### 11.2 Glossary

| Term          | Definition                                                         |
| ------------- | ------------------------------------------------------------------ |
| ARV           | After Repair Value - estimated sale price after renovation         |
| Comp          | Comparable sale - recently sold similar property                   |
| Holding Costs | Monthly costs while owning (mortgage, taxes, insurance, utilities) |
| ROI           | Return on Investment - profit as percentage of total investment    |
| SOW           | Scope of Work - document describing work for contractor bids       |
| Scope         | List of renovation work items needed                               |
| Rehab         | Renovation/rehabilitation of property                              |
