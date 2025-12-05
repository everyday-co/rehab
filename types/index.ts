import type { LucideIcon } from "lucide-react";

export type PhaseId = 1 | 2 | 3 | 4;

export type PropertyStatus =
  | "scope"
  | "budget"
  | "build"
  | "listed"
  | "sold"
  | "cancelled";

export interface Profile {
  id: string;
  fullName?: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface Property {
  id?: string;
  userId?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  sqft?: number;
  sqftAboveGrade?: number;
  sqftBasement?: number;
  beds?: number;
  baths?: number;
  lotAcres?: number;
  garageSpaces?: number;
  yearBuilt?: number;
  purchasePrice?: number;
  purchaseDate?: string;
  arvLow?: number;
  arvHigh?: number;
  condition?: "gut-rehab" | "major" | "moderate" | "cosmetic";
  status?: PropertyStatus;
  currentPhase?: PhaseId;
  currentStep?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type RehabPriority =
  | "essential"
  | "high-roi"
  | "recommended"
  | "upgrade"
  | "optional";

export interface RehabItem {
  id?: string;
  propertyId?: string;
  category: string;
  itemKey: string;
  name: string;
  unit: string;
  quantity: number;
  costLow: number;
  costHigh: number;
  laborPct?: number;
  priority?: RehabPriority;
  isIncluded?: boolean;
  isCompleted?: boolean;
  actualCost?: number;
  notes?: string;
  sortOrder?: number;
  createdAt?: string;
}

export interface HoldingCosts {
  mortgage?: number;
  taxes?: number;
  insurance?: number;
  utilities?: number;
  hoa?: number;
  misc?: number;
  holdMonths?: number;
}

export interface SellingCosts {
  agentCommissionPct?: number;
  closingCostPct?: number;
  staging?: number;
  warranty?: number;
}

export interface Expense {
  id?: string;
  propertyId?: string;
  rehabItemId?: string;
  amount: number;
  description?: string;
  vendor?: string;
  date: string;
  receiptUrl?: string;
  createdAt?: string;
}

export interface Photo {
  id?: string;
  propertyId?: string;
  room?: string;
  stage?: "before" | "during" | "after";
  url: string;
  thumbnailUrl?: string;
  analysisData?: Record<string, unknown>;
  createdAt?: string;
}

export interface TimelineTask {
  id?: string;
  propertyId?: string;
  name: string;
  startWeek: number;
  endWeek: number;
  status?: "pending" | "in_progress" | "complete" | "delayed";
  actualStart?: string;
  actualEnd?: string;
  notes?: string;
}

export interface FlipResult {
  id?: string;
  propertyId?: string;
  userId?: string;
  salePrice?: number;
  totalCost?: number;
  grossProfit?: number;
  roi?: number;
  daysOnMarket?: number;
  projectedProfit?: number;
  projectedRoi?: number;
  lessonsLearned?: string[];
  whatWorked?: string[];
  createdAt?: string;
}

export interface PhaseConfig {
  id: PhaseId;
  name: string;
  description: string;
  colorVar: string;
  accentClass: string;
  icon: LucideIcon;
}
