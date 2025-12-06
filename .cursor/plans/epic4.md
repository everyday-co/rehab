# Epic 4: Phase 4 - Close & Learn

**Epic Owner:** Developer

**Priority:** P1 (Should Have)

**Sprint:** 6

**Dependencies:** Epic 3 (Build & Track)

---

## Overview

Phase 4 captures the outcome of the flip and feeds learnings back into the system. After the property sells, users complete a retrospective comparing projected vs actual results, and their data improves future estimates through portfolio analytics.

**Phase Color:** Green (phase-4)

**Entry Point:** `/properties/[id]/review`

---

## User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                      PHASE 4: CLOSE & LEARN                     │
│                   "Capture learnings for next time"             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   STEP 1                        STEP 2                         │
│   Retrospective        ──►      Portfolio        ──►  [Done]  │
│   (This flip)                   (All flips)                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## User Stories

### US-4.1: Enter Sale Information

**As a** user

**I want** to enter the final sale details

**So that** I can see my actual profit and complete the project

**Acceptance Criteria:**

* [ ] Enter sale price
* [ ] Enter sale date
* [ ] Enter actual closing costs
* [ ] Enter agent commission (if different from estimate)
* [ ] Enter days on market
* [ ] Calculate actual profit and ROI
* [ ] Mark property as "Sold"

**Screen: Enter Sale Details**

```
┌─────────────────────────────────────────────────────────────────┐
│ [Phase Indicator: ✓ ✓ ✓ ● ]   Step 1 of 2                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🎉 Congratulations!                                           │
│  Let's record the final numbers for 3811 Whitetail Dr          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ SALE INFORMATION                                        │   │
│  │                                                         │   │
│  │ Sale Price *                                            │   │
│  │ [$752,000                                        ]     │   │
│  │                                                         │   │
│  │ Sale Date *                                             │   │
│  │ [04/22/2025                                    📅]     │   │
│  │                                                         │   │
│  │ Days on Market                                          │   │
│  │ [14                                              ]     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ CLOSING COSTS                                           │   │
│  │                                                         │   │
│  │ Agent Commission (%)        Amount                      │   │
│  │ [5.5            ]          $41,360                     │   │
│  │                                                         │   │
│  │ Other Closing Costs                                     │   │
│  │ [$8,200                                          ]     │   │
│  │ (Title, escrow, transfer taxes, etc.)                  │   │
│  │                                                         │   │
│  │ Total Selling Costs: $49,560                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ CALCULATED RESULTS                                      │   │
│  │                                                         │   │
│  │ Sale Price                           $752,000          │   │
│  │ - Purchase Price                    -$555,000          │   │
│  │ - Total Rehab Cost                   -$91,200          │   │
│  │ - Holding Costs (14 wks)              -$8,400          │   │
│  │ - Selling Costs                      -$49,560          │   │
│  │ ─────────────────────────────────────────────          │   │
│  │ NET PROFIT                            $47,840          │   │
│  │                                                         │   │
│  │ Total Investment: $654,600                             │   │
│  │ ROI: 7.3%                                              │   │
│  │ Annualized ROI: 52.3% (14 weeks)                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                        [Save & View Retrospective]│
└─────────────────────────────────────────────────────────────────┘
```

---

### US-4.2: View Project Retrospective

**As a** user

**I want** to see how my projections compared to reality

**So that** I can learn what to adjust for next time

**Acceptance Criteria:**

* [ ] Side-by-side: Projected vs Actual for all key metrics
* [ ] Highlight variances (green for better, red for worse)
* [ ] Show variance by category (which areas were off?)
* [ ] "What Worked" section (user input)
* [ ] "Lessons Learned" section (user input)
* [ ] Save learnings to database

**Screen: Retrospective**

```
┌─────────────────────────────────────────────────────────────────┐
│ [Phase Indicator: ✓ ✓ ✓ ● ]   Step 1 of 2                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🏆 Project Complete!                                          │
│  3811 Whitetail Dr, Shakopee, MN                               │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │     $47,840 PROFIT    │    7.3% ROI    │   14 weeks    │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  PROJECTED VS ACTUAL                                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Metric            │ Projected │ Actual  │ Variance     │   │
│  ├───────────────────┼───────────┼─────────┼──────────────┤   │
│  │ Sale Price (ARV)  │ $755,000  │$752,000 │ -$3,000 🔴  │   │
│  │ Rehab Cost        │  $88,050  │ $91,200 │ +$3,150 🔴  │   │
│  │ Holding Costs     │   $7,200  │  $8,400 │ +$1,200 🔴  │   │
│  │ Selling Costs     │  $60,400  │ $49,560 │ -$10,840 🟢 │   │
│  │ Timeline          │  12 weeks │ 14 weeks│ +2 weeks 🔴 │   │
│  ├───────────────────┼───────────┼─────────┼──────────────┤   │
│  │ NET PROFIT        │  $44,350  │ $47,840 │ +$3,490 🟢  │   │
│  │ ROI               │    6.2%   │   7.3%  │ +1.1% 🟢    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  REHAB VARIANCE BY CATEGORY                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Kitchen      │ Budget $28,200 │ Actual $29,400 │ +4.3% │   │
│  │ Bathrooms    │ Budget $12,500 │ Actual $11,200 │ -10.4%│   │
│  │ Interior     │ Budget $27,700 │ Actual $28,900 │ +4.3% │   │
│  │ Exterior     │ Budget  $8,500 │ Actual  $8,200 │ -3.5% │   │
│  │ Systems      │ Budget $11,150 │ Actual $13,500 │ +21.1%│   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  📝 WHAT WORKED                                [Edit]          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ • Negotiated 5.5% commission (saved vs 6% standard)    │   │
│  │ • LVP flooring choice was cost-effective and looked    │   │
│  │   great in photos - multiple buyer compliments         │   │
│  │ • Large lot was the #1 selling point as predicted      │   │
│  │ + Add more...                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  📝 LESSONS LEARNED                            [Edit]          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ • HVAC took longer than expected - always add 1 week   │   │
│  │ • Cabinet lead time was 6 weeks, not 4 - order earlier │   │
│  │ • Systems category consistently underestimated - add   │   │
│  │   15% buffer to electrical/plumbing                    │   │
│  │ + Add more...                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                        [Save & View Portfolio →]│
└─────────────────────────────────────────────────────────────────┘
```

---

### US-4.3: View Portfolio Dashboard

**As a** user

**I want** to see aggregate analytics across all my flips

**So that** I can track my overall performance and identify patterns

**Acceptance Criteria:**

* [ ] Summary stats: Total flips, Total profit, Average ROI
* [ ] List of all completed flips with key metrics
* [ ] Filter by date range, status
* [ ] Sort by profit, ROI, date
* [ ] Click to view individual retrospective

**Screen: Portfolio Dashboard**

```
┌─────────────────────────────────────────────────────────────────┐
│ [Header]                                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  My Portfolio                                                   │
│                                                                 │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐  │
│  │ TOTAL      │ │ TOTAL      │ │ AVERAGE    │ │ AVG TIME   │  │
│  │ FLIPS      │ │ PROFIT     │ │ ROI        │ │ TO FLIP    │  │
│  │            │ │            │ │            │ │            │  │
│  │     8      │ │  $312,400  │ │   8.2%     │ │  11 weeks  │  │
│  │            │ │            │ │            │ │            │  │
│  │ 2022-2025  │ │ $39K avg   │ │ per flip   │ │ avg        │  │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘  │
│                                                                 │
│  COMPLETED FLIPS                      [Filter ▼] [Sort: Date ▼]│
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Property           │ Profit  │ ROI   │ Duration │ Date  │   │
│  ├────────────────────┼─────────┼───────┼──────────┼───────┤   │
│  │ 3811 Whitetail Dr  │ $47,840 │ 7.3%  │ 14 weeks │ Apr 25│   │
│  │ Shakopee, MN       │         │       │          │       │   │
│  │ [View Details]                                          │   │
│  ├────────────────────┼─────────┼───────┼──────────┼───────┤   │
│  │ 1234 Oak Street    │ $52,100 │ 9.1%  │ 10 weeks │ Jan 25│   │
│  │ Minneapolis, MN    │         │       │          │       │   │
│  │ [View Details]                                          │   │
│  ├────────────────────┼─────────┼───────┼──────────┼───────┤   │
│  │ 567 Maple Ave      │ $38,200 │ 7.8%  │ 12 weeks │ Oct 24│   │
│  │ St. Paul, MN       │         │       │          │       │   │
│  │ [View Details]                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ... more flips                                                 │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                       [View Estimate Accuracy →]│
└─────────────────────────────────────────────────────────────────┘
```

---

### US-4.4: Track Estimate Accuracy

**As a** user

**I want** to see how accurate my estimates have been by category

**So that** I know where to adjust my future budgets

**Acceptance Criteria:**

* [ ] Table showing each category: Avg variance, Trend, Suggested adjustment
* [ ] Trend indicator (improving, worsening, stable)
* [ ] System-generated adjustment recommendation
* [ ] Chart showing accuracy over time
* [ ] Apply adjustments to future estimates (V1.2)

**Screen: Estimate Accuracy**

```
┌─────────────────────────────────────────────────────────────────┐
│ [Header]                                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Estimate Accuracy                                              │
│  How your budgets compare to actual costs                      │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ OVERALL ACCURACY                                        │   │
│  │                                                         │   │
│  │         Your estimates are within 8.4% on average      │   │
│  │                                                         │   │
│  │         ██████████████████░░ 91.6% accurate            │   │
│  │                                                         │   │
│  │         📈 Improving: 12% → 8.4% over 8 flips         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  BY CATEGORY                                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Category    │ Avg Variance │ Trend │ Adjustment        │   │
│  ├─────────────┼──────────────┼───────┼───────────────────┤   │
│  │ Kitchen     │ +4.8%        │ 📈    │ Add 5% to budget │   │
│  │ Bathrooms   │ -2.3%        │ ➡️    │ No change needed │   │
│  │ Interior    │ +6.2%        │ 📈    │ Add 6% to budget │   │
│  │ Exterior    │ -1.8%        │ ➡️    │ No change needed │   │
│  │ Systems     │ +18.4%       │ 📈    │ Add 20% buffer   │   │
│  │ Basement    │ +3.1%        │ 📉    │ Add 3% to budget │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ⚠️ SYSTEMS is consistently underestimated by 18%+             │
│     Consider adding 20% buffer to electrical, plumbing, HVAC   │
│                                                                 │
│  TOP ROI CATEGORIES (Your actual results)                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Category           │ Avg Cost │ Avg Value Add │ ROI    │   │
│  ├────────────────────┼──────────┼───────────────┼────────┤   │
│  │ Interior Paint     │   $4,200 │      $8,500   │ 102%   │   │
│  │ LVP Flooring       │   $8,800 │     $14,200   │  61%   │   │
│  │ Kitchen Counters   │   $3,400 │      $5,100   │  50%   │   │
│  │ Bathroom Vanities  │   $2,100 │      $3,000   │  43%   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  💡 PERSONALIZED INSIGHT                                       │
│  Based on your 8 flips, you tend to underestimate systems by  │
│  18% and kitchens by 5%. Your next estimate will be adjusted: │
│                                                                 │
│  Standard Estimate: $85,000                                     │
│  Your Adjusted:     $91,200 (+7.3%)                            │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ [← Portfolio]                              [Start New Flip →]  │
└─────────────────────────────────────────────────────────────────┘
```

---

### US-4.5: Start New Flip from Portfolio Learnings

**As a** user

**I want** my next flip estimate to incorporate my track record

**So that** my budgets improve automatically over time

**Acceptance Criteria:**

* [ ] "Start New Flip" from portfolio applies learned adjustments
* [ ] Show "Standard" vs "Personalized" estimate
* [ ] Explain adjustments made
* [ ] User can override/accept adjustments
* [ ] Track if adjusted estimates are more accurate

**Screen: Personalized Estimate Preview (V1.2)**

```
┌─────────────────────────────────────────────────────────────────┐
│  New Property Estimate Preview                            [×]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Based on your track record of 8 flips, we've adjusted        │
│  the standard estimate for this property.                      │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Category    │ Standard │ Adjusted │ Your Adjustment     │   │
│  ├─────────────┼──────────┼──────────┼─────────────────────┤   │
│  │ Kitchen     │ $28,000  │ $29,400  │ +5% (your avg)     │   │
│  │ Bathrooms   │ $12,000  │ $12,000  │ No change          │   │
│  │ Interior    │ $25,000  │ $26,550  │ +6% (your avg)     │   │
│  │ Exterior    │  $8,000  │  $8,000  │ No change          │   │
│  │ Systems     │ $12,000  │ $14,400  │ +20% (your avg)    │   │
│  ├─────────────┼──────────┼──────────┼─────────────────────┤   │
│  │ TOTAL       │ $85,000  │ $90,350  │ +6.3% overall      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Your estimates have been 8.4% more accurate since             │
│  we started applying these adjustments.                        │
│                                                                 │
│  ☑ Apply personalized adjustments                              │
│  ☐ Use standard estimates only                                 │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                              [Cancel]    [Create Property]     │
└─────────────────────────────────────────────────────────────────┘
```

---

## User Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    PHASE 4 COMPLETE FLOW                        │
└─────────────────────────────────────────────────────────────────┘

[From Phase 3: Ready to List]
         │
         ▼
┌──────────────────┐
│  Property Listed │ (Status: For Sale)
│  (waiting)       │
└────────┬─────────┘
         │
         │ [Property Sells]
         ▼
┌──────────────────┐
│  Enter Sale Info │
│  (US-4.1)        │
│                  │
│  - Sale price    │
│  - Sale date     │
│  - Closing costs │
│  - DOM           │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Retrospective   │
│  (US-4.2)        │
│                  │
│  - Projected vs  │
│    Actual        │
│  - What Worked   │
│  - Lessons       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Portfolio       │ ◄──── Aggregates all completed flips
│  (US-4.3)        │
│                  │
│  - Total stats   │
│  - Flip list     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Accuracy        │ ◄──── Tracks estimate performance
│  (US-4.4)        │
│                  │
│  - By category   │
│  - Adjustments   │
│  - Top ROI       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Start New Flip  │ ◄──── Applies learned adjustments
│  (US-4.5)        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  PHASE 1         │
│  (New Property)  │
└──────────────────┘
```

---

## Technical Tasks

### T-4.1: Sale Entry

* Sale information form
* Profit calculation logic
* ROI calculation (simple and annualized)
* Update property status to "Sold"
* Create flip_results record

### T-4.2: Retrospective View

* ProjectResultsSummary component
* Variance calculation and display
* LessonsLearnedCard component (editable)
* Save learnings to database

### T-4.3: Portfolio Dashboard

* PortfolioStatsRow component
* FlipHistoryList component
* Aggregate calculations
* Filter and sort functionality

### T-4.4: Accuracy Tracking

* EstimateAccuracyTable component
* Variance aggregation by category
* Trend calculation
* Adjustment recommendations logic
* ROICategoryChart component

### T-4.5: Personalized Estimates (V1.2)

* Load user adjustment factors
* Apply adjustments to new estimates
* PersonalizedEstimatePreview component
* Track adjustment effectiveness

---

## Definition of Done

* [ ] Sale information can be entered
* [ ] Profit and ROI calculate correctly
* [ ] Retrospective shows projected vs actual
* [ ] User can add what worked / lessons learned
* [ ] Portfolio shows all completed flips
* [ ] Accuracy tracking shows variance by category
* [ ] System generates adjustment recommendations
* [ ] All screens responsive on mobile
* [ ] Data persists and aggregates correctly

---

## Estimation

| Story           | Points       | Notes                               |
| --------------- | ------------ | ----------------------------------- |
| US-4.1          | 3            | Sale entry form                     |
| US-4.2          | 5            | Retrospective with variance         |
| US-4.3          | 3            | Portfolio dashboard                 |
| US-4.4          | 5            | Accuracy tracking + recommendations |
| US-4.5          | 5            | Personalized estimates (V1.2)       |
| **Total** | **21** | ~1.5 weeks                          |

---

## Future Enhancements (V2+)

* **Automated Comp Pulling** : Integrate with MLS/Zillow API to auto-populate sale data
* **Market Trend Alerts** : Notify user if market conditions suggest adjusting ARV
* **Benchmark Comparisons** : Compare performance to market averages
* **Tax Reporting** : Generate reports for tax purposes
* **Partner/Investor Reporting** : Shareable portfolio summaries for partners
* **AI Insights** : Machine learning on portfolio to predict flip success factors
