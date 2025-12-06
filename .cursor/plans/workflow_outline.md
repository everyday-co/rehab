Love the conveyor belt mental model—clear entry point, guided progression, defined exit. Let me map this out:

---

## 🏭 Rehab Conveyor Belt: User Journey Framework

### The Core Flow

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                     │
│   ENTRY                    PLANNING                 EXECUTION              EXIT     │
│                                                                                     │
│  ┌───────┐    ┌─────────────────────────┐    ┌──────────────────┐    ┌─────────┐  │
│  │ SCOPE │ ─► │ BUDGET & OPTIMIZE       │ ─► │ BUILD & TRACK    │ ─► │ CLOSE & │  │
│  │ DETECT│    │                         │    │                  │    │ LEARN   │  │
│  └───────┘    └─────────────────────────┘    └──────────────────┘    └─────────┘  │
│                                                                                     │
│  "What needs   "What should I spend      "Am I on track?"        "How did I do?"  │
│   to be done?"  and on what?"                                                       │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: SCOPE DETECT

**User Goal:** "Help me figure out what this property needs"

### Entry Points (3 Ways In)

| Entry Method                  | User Action                            | System Output                              |
| ----------------------------- | -------------------------------------- | ------------------------------------------ |
| **Photo Upload**        | Upload 5-15 photos of property         | AI-detected issues + suggested line items  |
| **Walkthrough Video**   | Upload 2-5 min phone video             | Timestamped punch list with frame captures |
| **Quick Questionnaire** | Answer 10-15 questions about condition | Pre-populated scope based on answers       |

### Questionnaire Flow (Fallback/Supplement to Photos)

```
Property Basics
├── Year built? ────────────► Triggers age-based system flags
├── Last renovated? ────────► Determines baseline condition
├── Current condition? ─────► [Gut] [Major] [Moderate] [Cosmetic]
└── What's your target ARV? ─► Sets finish-level expectations

Room-by-Room Assessment
├── Kitchen
│   ├── Cabinet condition? ──► [Replace] [Reface] [Keep]
│   ├── Countertop material? ► [Laminate] [Tile] [Stone] [Other]
│   ├── Appliances working? ─► [All good] [Some need replacing] [All need replacing]
│   └── Layout changes needed?► [Keep] [Minor] [Major reconfigure]
│
├── Bathrooms (repeat for each)
│   ├── Vanity condition? 
│   ├── Tub/shower condition?
│   ├── Tile condition?
│   └── Fixtures (faucets, toilet)?
│
├── Systems
│   ├── HVAC age/condition?
│   ├── Water heater age?
│   ├── Electrical panel amps?
│   └── Plumbing material?
│
├── Interior General
│   ├── Flooring type & condition by area?
│   ├── Paint condition?
│   ├── Doors & trim condition?
│   └── Lighting (dated/functional)?
│
├── Exterior
│   ├── Roof age/condition?
│   ├── Siding condition?
│   ├── Windows (age, condition, type)?
│   └── Curb appeal items?
│
└── Basement (if applicable)
    ├── Currently finished?
    ├── Moisture issues?
    └── Egress windows present?
```

### Photo AI Detection Logic

```
Upload Photo ──► Image Analysis ──► Detected Elements ──► Suggested Actions

Example Kitchen Photo:
┌─────────────────────────────────────────────────────────────┐
│ [Photo of dated kitchen]                                    │
│                                                             │
│ AI Detected:                                                │
│ • Oak cabinets (1990s style) ─────► Suggest: Replace/Reface │
│ • Tile countertops ───────────────► Suggest: Quartz upgrade │
│ • Fluorescent lighting ───────────► Suggest: Recessed LEDs  │
│ • Linoleum flooring ──────────────► Suggest: LVP            │
│ • White appliances ───────────────► Suggest: SS package     │
│                                                             │
│ Confidence: 87% │ [Accept All] [Edit Suggestions] [Retake]  │
└─────────────────────────────────────────────────────────────┘
```

### Phase 1 Output: **Draft Scope**

- Categorized list of detected/suggested work items
- Flagged "must do" vs "should consider" vs "optional upgrade"
- Ready to flow into Budget & Optimize phase

---

## Phase 2: BUDGET & OPTIMIZE

**User Goal:** "Build a smart budget that maximizes my profit"

### 2A: Match the Market

```
┌─────────────────────────────────────────────────────────────────────┐
│ MARKET FINISH ANALYZER                                              │
│ ─────────────────────                                               │
│ Your Target: $735K-$775K in Shakopee, MN                           │
│                                                                     │
│ What's selling at this price point:                                 │
│ ┌─────────────────┬────────────┬─────────────────────────────────┐ │
│ │ Feature         │ % of Comps │ Your Current Plan               │ │
│ ├─────────────────┼────────────┼─────────────────────────────────┤ │
│ │ Quartz counters │ 87%        │ ✓ Included                      │ │
│ │ LVP/Hardwood    │ 92%        │ ✓ Included                      │ │
│ │ White/Gray cabs │ 78%        │ ✓ Included                      │ │
│ │ Tiled primary   │ 65%        │ ⚠ Not included - ADD?          │ │
│ │ Finished basemt │ 71%        │ ✓ Included                      │ │
│ │ Smart thermostat│ 45%        │ ○ Optional                      │ │
│ └─────────────────┴────────────┴─────────────────────────────────┘ │
│                                                                     │
│ [View Comp Photos] [Auto-Match Budget] [Continue with Current]      │
└─────────────────────────────────────────────────────────────────────┘
```

### 2B: Visual Comp Gallery

```
┌─────────────────────────────────────────────────────────────────────┐
│ KITCHEN COMPARISON                                        [< >]     │
│                                                                     │
│ ┌─────────────────────────┐  ┌─────────────────────────┐           │
│ │                         │  │                         │           │
│ │    YOUR PROPERTY        │  │   2425 Peace Cir        │           │
│ │    (Current/Planned)    │  │   Sold: $824,900        │           │
│ │                         │  │                         │           │
│ │   [Photo/Render]        │  │   [Listing Photo]       │           │
│ │                         │  │                         │           │
│ └─────────────────────────┘  └─────────────────────────┘           │
│                                                                     │
│ Their finishes: Quartz, white shaker, SS appliances, subway tile   │
│ Your planned:   Quartz, white shaker, SS appliances, subway tile   │
│ Match Score: 94% ✓                                                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 2C: Budget Builder (Current Build - Enhanced)

```
Two Modes:
┌─────────────────────────────────────────────────────────────────────┐
│ [AI Recommendations]  [Build Your Own]                              │
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐│
│ │ AI MODE: Smart recommendations based on:                        ││
│ │ • Your detected scope (Phase 1)                                 ││
│ │ • Market finish standards (Phase 2A)                            ││
│ │ • ROI optimization                                              ││
│ │ • Your budget constraints (if set)                              ││
│ └─────────────────────────────────────────────────────────────────┘│
│                                                                     │
│ Essential Items ──────────────────────────── $67,400               │
│ High ROI Upgrades ────────────────────────── $24,200               │
│ Market-Match Additions ───────────────────── $12,800               │
│ ─────────────────────────────────────────────────────              │
│ Subtotal                                      $104,400              │
│ Contingency (10%)                             $10,440               │
│ TOTAL                                         $114,840              │
└─────────────────────────────────────────────────────────────────────┘
```

### 2D: ROI Optimizer

```
┌─────────────────────────────────────────────────────────────────────┐
│ BUDGET OPTIMIZER                                                    │
│ ─────────────────                                                   │
│ Budget Target: $[115,000 ]  ◄── User sets max budget               │
│                                                                     │
│ Optimization Goal:                                                  │
│ ○ Maximize ROI (highest return per dollar)                         │
│ ● Maximize ARV (highest sale price)                                │
│ ○ Minimize Risk (essentials + safety margin)                       │
│ ○ Fastest Flip (quick-turnaround items only)                       │
│                                                                     │
│ [Optimize Budget]                                                   │
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐│
│ │ OPTIMIZER SUGGESTIONS:                                          ││
│ │                                                                 ││
│ │ SWAP: Tiled shower ($6,500) → Acrylic surround ($1,800)        ││
│ │       Saves: $4,700 │ ARV Impact: -$3,000 │ Net Gain: +$1,700  ││
│ │       [Accept] [Reject] [Compare Photos]                        ││
│ │                                                                 ││
│ │ ADD: Smart thermostat ($300)                                    ││
│ │      ROI: 90% │ ARV Impact: +$500 │ Net Gain: +$200            ││
│ │      [Accept] [Reject]                                          ││
│ │                                                                 ││
│ │ KEEP: Quartz counters (high market match %)                     ││
│ │       Downgrade not recommended at this ARV                     ││
│ └─────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

### 2E: What-If Scenario Builder

```
┌─────────────────────────────────────────────────────────────────────┐
│ WHAT-IF SCENARIOS                                                   │
│ ─────────────────                                                   │
│                                                                     │
│        │ Current Plan │ Skip Basement │ Premium Kitchen │ Budget   │
│ ───────┼──────────────┼───────────────┼─────────────────┼─────────│
│ Rehab  │ $114,840     │ $86,590       │ $128,340        │ $95,000 │
│ ARV    │ $755,000     │ $715,000      │ $775,000        │ $740,000│
│ Profit │ $58,200      │ $52,400       │ $61,800         │ $63,100 │
│ ROI    │ 7.8%         │ 7.5%          │ 7.6%            │ 8.9%    │
│ Risk   │ Medium       │ Low           │ Medium-High     │ Low     │
│ ───────┴──────────────┴───────────────┴─────────────────┴─────────│
│                                                                     │
│ [Make "Budget" Active Plan] [Create New Scenario] [Export Compare]  │
└─────────────────────────────────────────────────────────────────────┘
```

### 2F: Timeline & Sequencing

```
┌─────────────────────────────────────────────────────────────────────┐
│ PROJECT TIMELINE                                                    │
│ ────────────────                                                    │
│ Based on your scope, estimated duration: 14 weeks                   │
│                                                                     │
│ Week  1  2  3  4  5  6  7  8  9  10 11 12 13 14                    │
│ ────────────────────────────────────────────────                    │
│ Demo  ████                                                          │
│ Rough ░░░░████████                                                  │
│ HVAC     ░░░░████                                                   │
│ Elec     ░░░░████████                                               │
│ Plumb    ░░░░██████                                                 │
│ Drywall        ░░░░░░████████                                       │
│ Paint                    ░░░░██████                                 │
│ Floor                       ░░░░████                                │
│ Kitchen                         ░░████████                          │
│ Bath                            ░░░░██████                          │
│ Punch                                   ░░████                      │
│                                                                     │
│ ⚠ LONG LEAD ITEMS:                                                 │
│ • Cabinets: Order by Week 2 (6-week lead time)                     │
│ • Windows: Order by Week 1 (8-week lead time)                      │
│                                                                     │
│ 💰 HOLDING COST IMPACT:                                            │
│ • Each week delay = $950                                           │
│ • 14 weeks = $13,300 holding costs                                 │
│ • Compress to 12 weeks? Saves $1,900                               │
│                                                                     │
│ [Adjust Timeline] [Export to Calendar] [Share with Contractor]      │
└─────────────────────────────────────────────────────────────────────┘
```

### 2G: Contractor Integration

```
┌─────────────────────────────────────────────────────────────────────┐
│ CONTRACTOR HUB                                                      │
│ ──────────────                                                      │
│                                                                     │
│ ┌─ Generate Documents ─────────────────────────────────────────────┐│
│ │ [📄 Scope of Work PDF]  [📊 Bid Sheet Excel]  [📋 Punch List]   ││
│ └──────────────────────────────────────────────────────────────────┘│
│                                                                     │
│ ┌─ Bid Comparison: Kitchen Cabinets ───────────────────────────────┐│
│ │                                                                  ││
│ │ Contractor      │ Bid      │ $/Unit │ vs Avg │ Timeline │ Rating ││
│ │ ────────────────┼──────────┼────────┼────────┼──────────┼───────││
│ │ ABC Cabinets    │ $13,500  │ $450   │ ✓ Avg  │ 4 weeks  │ ★★★★☆ ││
│ │ Budget Builders │ $10,200  │ $340   │ -24%   │ 6 weeks  │ ★★★☆☆ ││
│ │ Premium Install │ $16,800  │ $560   │ +24%   │ 3 weeks  │ ★★★★★ ││
│ │                                                                  ││
│ │ Your estimate: $13,500 │ Market avg: $13,200                     ││
│ │ ⚠ Budget Builders bid seems low—verify scope match              ││
│ └──────────────────────────────────────────────────────────────────┘│
│                                                                     │
│ [Add Bid] [Request Bids via Email] [Award Contract]                 │
└─────────────────────────────────────────────────────────────────────┘
```

### Phase 2 Output: **Locked Budget + Schedule**

- Finalized line items with costs
- Timeline with milestones
- SOW documents ready for contractors
- Baseline for tracking in Phase 3

---

## Phase 3: BUILD & TRACK

**User Goal:** "Stay on budget and on schedule"

### 3A: Progress Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│ PROJECT TRACKER: 3811 Whitetail Dr                                  │
│ ───────────────────────────────────                                 │
│                                                                     │
│ Overall Progress                                                    │
│ ████████████████████░░░░░░░░░░ 62% Complete                        │
│                                                                     │
│ ┌──────────────┬────────────┬────────────┬────────────┐            │
│ │ BUDGET       │ SCHEDULE   │ SCOPE      │ QUALITY    │            │
│ ├──────────────┼────────────┼────────────┼────────────┤            │
│ │ $72,400      │ Week 9/14  │ 34/52      │ 3 Issues   │            │
│ │ of $114,840  │            │ items done │ open       │            │
│ │              │            │            │            │            │
│ │ ✓ On Track   │ ⚠ 3 days   │ ✓ On Track │ ⚠ Review   │            │
│ │              │   behind   │            │            │            │
│ └──────────────┴────────────┴────────────┴────────────┘            │
│                                                                     │
│ 🔔 ALERTS:                                                         │
│ • Drywall delayed 3 days - impacts paint start                     │
│ • Cabinet delivery confirmed for Thursday                          │
│ • Electrical inspection passed ✓                                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 3B: Cost Tracking

```
┌─────────────────────────────────────────────────────────────────────┐
│ BUDGET vs ACTUAL                                                    │
│ ────────────────                                                    │
│                                                                     │
│ Category    │ Budgeted  │ Spent     │ Committed │ Variance │ Status│
│ ────────────┼───────────┼───────────┼───────────┼──────────┼───────│
│ Interior    │ $28,400   │ $24,200   │ $3,100    │ +$1,100  │ ✓     │
│ Kitchen     │ $32,500   │ $18,400   │ $15,200   │ -$1,100  │ ⚠     │
│ Bathroom    │ $18,200   │ $12,800   │ $4,200    │ +$1,200  │ ✓     │
│ Systems     │ $12,500   │ $11,800   │ $0        │ +$700    │ ✓     │
│ Exterior    │ $9,000    │ $9,000    │ $0        │ $0       │ ✓     │
│ Basement    │ $14,240   │ $5,200    │ $8,400    │ +$640    │ ✓     │
│ ────────────┼───────────┼───────────┼───────────┼──────────┼───────│
│ Subtotal    │ $114,840  │ $81,400   │ $30,900   │ +$2,540  │       │
│ Contingency │ $10,440   │ $3,200    │ $0        │ +$7,240  │       │
│                                                                     │
│ [Log Expense] [Upload Receipt] [Adjust Budget] [View All Expenses]  │
└─────────────────────────────────────────────────────────────────────┘
```

### 3C: Change Order Management

```
┌─────────────────────────────────────────────────────────────────────┐
│ CHANGE ORDER #003                                                   │
│ ─────────────────                                                   │
│                                                                     │
│ Issue Found: Water damage behind master bath wall                   │
│ Discovered: Week 7 during tile prep                                │
│                                                                     │
│ Required Work:                                                      │
│ • Mold remediation ──────────────────────────────── $1,800         │
│ • Replace subfloor (40 sqft) ────────────────────── $480           │
│ • Additional drywall ────────────────────────────── $320           │
│                                                                     │
│ Total Change Order: $2,600                                         │
│ Remaining Contingency: $7,240                                      │
│ Post-Change Contingency: $4,640                                    │
│                                                                     │
│ Timeline Impact: +2 days                                           │
│ Profit Impact: -$2,600 (covered by contingency)                    │
│                                                                     │
│ [Approve from Contingency] [Add to Budget] [Dispute] [Get 2nd Bid]  │
└─────────────────────────────────────────────────────────────────────┘
```

### 3D: Photo Documentation

```
┌─────────────────────────────────────────────────────────────────────┐
│ PHOTO TIMELINE: Master Bathroom                                     │
│ ───────────────────────────────                                     │
│                                                                     │
│ Week 1          Week 5          Week 9          Week 12            │
│ ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐         │
│ │ Before   │   │ Demo     │   │ Tile     │   │ Final    │         │
│ │          │   │          │   │          │   │          │         │
│ │ [Photo]  │   │ [Photo]  │   │ [Photo]  │   │ [Photo]  │         │
│ │          │   │          │   │          │   │          │         │
│ └──────────┘   └──────────┘   └──────────┘   └──────────┘         │
│                                                                     │
│ [+ Add Photo] [Generate Before/After] [Export for Listing]          │
└─────────────────────────────────────────────────────────────────────┘
```

### Phase 3 Output: **Completed Project**

- Final cost accounting (actual vs budget)
- Photo documentation (before/after)
- Timeline record (planned vs actual)
- Punch list cleared
- Ready for listing

---

## Phase 4: CLOSE & LEARN

**User Goal:** "Capture learnings to improve next time"

### 4A: Project Retrospective

```
┌─────────────────────────────────────────────────────────────────────┐
│ FLIP RETROSPECTIVE: 3811 Whitetail Dr                              │
│ ─────────────────────────────────────                              │
│                                                                     │
│ FINANCIAL SUMMARY                                                   │
│ ┌─────────────────┬────────────┬────────────┬────────────┐         │
│ │                 │ Projected  │ Actual     │ Variance   │         │
│ ├─────────────────┼────────────┼────────────┼────────────┤         │
│ │ Sale Price      │ $755,000   │ $768,000   │ +$13,000   │         │
│ │ Total Costs     │ $696,800   │ $702,400   │ -$5,600    │         │
│ │ Gross Profit    │ $58,200    │ $65,600    │ +$7,400    │         │
│ │ ROI             │ 8.4%       │ 9.3%       │ +0.9%      │         │
│ │ Days on Market  │ 21         │ 14         │ -7 days    │         │
│ └─────────────────┴────────────┴────────────┴────────────┘         │
│                                                                     │
│ TIMELINE SUMMARY                                                    │
│ Planned: 14 weeks │ Actual: 15.5 weeks │ Variance: +1.5 weeks      │
│ Primary delay: Cabinet lead time (lesson learned)                  │
│                                                                     │
│ WHAT WORKED                       WHAT DIDN'T                       │
│ ✓ Quartz counters (buyer loved)  ✗ Skipped smart thermostat        │
│ ✓ LVP flooring choice            ✗ Underestimated drywall by 15%   │
│ ✓ Finished basement (key diff)   ✗ Cabinet ordering too late       │
│ ✓ Large lot premium realized     ✗ Paint color too bold (repainted)│
│                                                                     │
│ [Save to Portfolio] [Generate Report] [Share Learnings]             │
└─────────────────────────────────────────────────────────────────────┘
```

### 4B: Portfolio Intelligence (Feature #10)

```
┌─────────────────────────────────────────────────────────────────────┐
│ YOUR FLIP PORTFOLIO                                                 │
│ ───────────────────                                                 │
│ 7 Completed Flips │ $412,000 Total Profit │ 8.2% Avg ROI           │
│                                                                     │
│ YOUR ESTIMATING ACCURACY                                            │
│ ┌───────────────────────────────────────────────────────────────┐  │
│ │ Category    │ Avg Variance │ Trend      │ Adjustment Applied  │  │
│ │ ────────────┼──────────────┼────────────┼────────────────────│  │
│ │ Drywall     │ +18% over    │ Consistent │ +15% auto-added     │  │
│ │ Electrical  │ +8% over     │ Improving  │ +5% auto-added      │  │
│ │ Kitchen     │ -3% under    │ Stable     │ None                │  │
│ │ Flooring    │ +2% over     │ Stable     │ None                │  │
│ │ Plumbing    │ +22% over    │ Worsening  │ ⚠ Review estimates │  │
│ └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│ YOUR TOP ROI CATEGORIES (Actual, not estimated)                     │
│ 1. Kitchen upgrades ──────────────────────────────── 94% ROI       │
│ 2. Curb appeal (door, landscaping) ──────────────── 91% ROI       │
│ 3. Primary bathroom ─────────────────────────────── 88% ROI       │
│ 4. Interior paint ───────────────────────────────── 85% ROI       │
│ 5. Basement finish ──────────────────────────────── 72% ROI       │
│                                                                     │
│ 💡 INSIGHT: Your basement finishes underperform market average      │
│    (72% vs 80%). Consider reducing basement scope on next flip.     │
│                                                                     │
│ [View All Flips] [Export Portfolio Report] [Compare to Market]      │
└─────────────────────────────────────────────────────────────────────┘
```

### 4C: Personalized Future Estimates

```
┌─────────────────────────────────────────────────────────────────────┐
│ SMART ESTIMATE: New Property                                        │
│ ────────────────────────────                                        │
│                                                                     │
│ Standard Database Estimate: $98,500                                │
│                                                                     │
│ YOUR Personalized Estimate: $108,200                               │
│                                                                     │
│ Adjustments Applied (based on your history):                       │
│ • Drywall: +15% ($2,400) ─── You consistently run over            │
│ • Electrical: +5% ($620) ─── Slight historical variance           │
│ • Plumbing: +20% ($1,800) ── Your plumbers charge premium         │
│ • Contingency: 12% vs 10% ── Your avg overrun is 11.8%            │
│                                                                     │
│ Confidence Level: HIGH (based on 7 similar projects)               │
│                                                                     │
│ [Use Personalized] [Use Standard] [Adjust Manually]                 │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Complete Conveyor Belt Summary

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│  PHASE 1              PHASE 2                PHASE 3            PHASE 4        │
│  SCOPE DETECT         BUDGET & OPTIMIZE      BUILD & TRACK      CLOSE & LEARN  │
│                                                                                 │
│  ┌─────────────┐     ┌─────────────────┐    ┌──────────────┐   ┌────────────┐ │
│  │ • Photos    │     │ • Market Match  │    │ • Dashboard  │   │ • Retro    │ │
│  │ • Video     │ ──► │ • Comp Gallery  │ ─► │ • Cost Track │ ─►│ • Portfolio│ │
│  │ • Questions │     │ • AI/BYO Budget │    │ • Changes    │   │ • Insights │ │
│  │             │     │ • ROI Optimizer │    │ • Photos     │   │ • Learning │ │
│  │             │     │ • What-If       │    │ • Timeline   │   │            │ │
│  │             │     │ • Timeline      │    │              │   │            │ │
│  │             │     │ • Contractors   │    │              │   │            │ │
│  └─────────────┘     └─────────────────┘    └──────────────┘   └────────────┘ │
│                                                                                 │
│  OUTPUT:             OUTPUT:                OUTPUT:            OUTPUT:         │
│  Draft Scope         Locked Budget +        Completed          Learnings +     │
│                      Schedule + SOW         Project            Calibrated      │
│                                                                Estimates       │
│                                                                                 │
│  TIME: 30 min        TIME: 1-2 hours        TIME: Project      TIME: 30 min   │
│                                             Duration                           │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```
