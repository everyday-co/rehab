import type { LucideIcon } from "lucide-react";
import { Award, Camera, DollarSign, Hammer } from "lucide-react";
import type { PhaseConfig, PhaseId, Property } from "@/types";

export const PHASES: Array<PhaseConfig & { icon: LucideIcon }> = [
  {
    id: 1,
    name: "Scope Detect",
    description: "What needs to be done?",
    colorVar: "var(--phase-1)",
    accentClass: "bg-phase-1 text-white",
    icon: Camera,
  },
  {
    id: 2,
    name: "Budget & Optimize",
    description: "What should I spend and on what?",
    colorVar: "var(--phase-2)",
    accentClass: "bg-phase-2 text-white",
    icon: DollarSign,
  },
  {
    id: 3,
    name: "Build & Track",
    description: "Am I on track?",
    colorVar: "var(--phase-3)",
    accentClass: "bg-phase-3 text-foreground",
    icon: Hammer,
  },
  {
    id: 4,
    name: "Close & Learn",
    description: "How did I do?",
    colorVar: "var(--phase-4)",
    accentClass: "bg-phase-4 text-white",
    icon: Award,
  },
];

export const TEST_PROPERTY: Property = {
  address: "3811 Whitetail Dr",
  city: "Shakopee",
  state: "MN",
  zip: "55379",
  sqft: 4150,
  sqftAboveGrade: 3036,
  sqftBasement: 1114,
  beds: 5,
  baths: 3.5,
  lotAcres: 0.61,
  garageSpaces: 3,
  yearBuilt: 2006,
  purchasePrice: 555000,
  purchaseDate: "2022-02-18",
  arvLow: 735000,
  arvHigh: 775000,
  condition: "gut-rehab",
  notes:
    "Full gut renovation. 0.61 acre lot is 2x neighborhood average - key differentiator.",
  currentPhase: 1,
  currentStep: 0,
  status: "scope",
};

export const TEST_COMPS = [
  { address: "3662 Whitetail Dr", price: 688000, sqft: 3373, priceSqft: 204 },
  { address: "2425 Peace Cir", price: 824900, sqft: 4036, priceSqft: 204 },
  { address: "7687 22nd Ave E", price: 799900, sqft: 4243, priceSqft: 188 },
  { address: "1551 Creekside Dr", price: 768625, sqft: 4614, priceSqft: 167 },
];

export const phaseById = (phase: PhaseId) => PHASES.find((p) => p.id === phase);
