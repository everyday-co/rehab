# Fix & Flip Rehab Tracker

A professional fix & flip deal analysis and project tracking application for real estate investors. Built with Next.js 16, Supabase, and shadcn/ui.

## Features

- **4-Phase Workflow**: Scope Detect → Budget & Optimize → Build & Track → Close & Learn
- **Smart Property Intake**: Auto-fill property details from BatchData or listing URLs (Zillow, Redfin, Realtor.com)
- **ARV Suggestions**: Automated ARV estimates based on property history and comps
- **Smart Scope Detection**: Questionnaire-based scope generation with MN-specific cost database
- **Budget Planning**: Category-based cost estimation with contingency calculations
- **Project Tracking**: Monitor progress, track expenses, manage change orders (coming soon)
- **Portfolio Analytics**: Track completed flips and improve future estimates (coming soon)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 (OKLCH theme)
- **UI Components**: shadcn/ui
- **Backend**: Supabase (Auth, Postgres, Storage)
- **Forms**: React Hook Form + Zod
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd rehab
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Property Enrichment (optional)
ENABLE_PROPERTY_ENRICHMENT=true
BATCHDATA_API_KEY=your-batchdata-api-key
FIRECRAWL_API_KEY=your-firecrawl-api-key

# Development
USE_ENRICHMENT_MOCKS=true  # Use mock data instead of real API calls
```

### Property Enrichment Setup

The property enrichment feature allows auto-filling property details from public records and listing URLs:

1. **BatchData** (~$0.01-0.03/lookup): Get property details, tax info, and sale history
   - Sign up at [batchdata.com](https://batchdata.com)
   - Add `BATCHDATA_API_KEY` to your env

2. **Firecrawl** (~$0.001/page): Scrape Zillow, Redfin, Realtor.com listings
   - Sign up at [firecrawl.dev](https://firecrawl.dev)
   - Add `FIRECRAWL_API_KEY` to your env

3. Set `ENABLE_PROPERTY_ENRICHMENT=true` to enable the feature

**Cost**: ~$0.01-0.04 per property lookup (very affordable for personal use)

4. Set up Supabase database:
   - Create a new Supabase project
   - Run the migrations (see `.cursor/notes/project_checklist.md`)
   - Enable Row Level Security
   - Configure OAuth providers (optional)

5. Start the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/app                    # Next.js App Router pages
  /(auth)               # Authentication pages
  /(dashboard)          # Protected dashboard routes
    /properties         # Property management
    /portfolio          # Portfolio analytics
    /settings           # User settings

/components             # React components
  /layout               # Layout components (Header, PhaseIndicator, etc.)
  /properties           # Property-related components
  /questionnaire        # Scope questionnaire components
  /ui                   # shadcn/ui components

/lib                    # Utilities and server actions
  /auth                 # Authentication actions
  /enrichment           # Property enrichment (BatchData, Firecrawl)
  /properties           # Property CRUD actions
  /questionnaire        # Questionnaire logic and cost database
  /storage              # Supabase Storage utilities
  /supabase             # Supabase client utilities
  /validations          # Zod schemas

/types                  # TypeScript types
```

## Development

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Documentation

- See `.cursor/notes/agentnotes.md` for detailed implementation notes
- See `.cursor/notes/project_checklist.md` for feature status
- See `.cursor/plans/` for PRD and epic documentation

## License

Private - All rights reserved
