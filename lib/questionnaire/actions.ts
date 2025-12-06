"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient, getUser } from "@/lib/supabase/server";
import { getProperty, updatePropertyPhase } from "@/lib/properties/actions";
import { QUESTIONNAIRE_SECTIONS } from "./questions";
import { getCostItem } from "./cost-database";

export type QuestionnaireAnswers = Record<string, string | string[] | number>;

export interface GeneratedScopeItem {
  itemKey: string;
  category: string;
  name: string;
  unit: string;
  quantity: number;
  costLow: number;
  costHigh: number;
  laborPct: number;
  priority: "essential" | "high-roi" | "recommended" | "optional";
  isIncluded: boolean;
}

export async function saveQuestionnaireAnswers(
  propertyId: string,
  answers: QuestionnaireAnswers
): Promise<{ error?: string }> {
  const supabase = await createSupabaseServerClient();
  const user = await getUser();

  if (!user) {
    return { error: "You must be logged in" };
  }

  // Store answers in property notes or a separate table
  // For MVP, we'll store as JSON in a property metadata field
  const { error } = await supabase
    .from("properties")
    .update({
      // Store questionnaire answers - in a real app, this would be a separate table
      notes: JSON.stringify({ questionnaire_answers: answers }),
    })
    .eq("id", propertyId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error saving questionnaire:", error);
    return { error: "Failed to save answers" };
  }

  return {};
}

export async function generateScopeFromAnswers(
  propertyId: string,
  answers: QuestionnaireAnswers
): Promise<{ items?: GeneratedScopeItem[]; error?: string }> {
  const user = await getUser();

  if (!user) {
    return { error: "You must be logged in" };
  }

  const property = await getProperty(propertyId);
  if (!property) {
    return { error: "Property not found" };
  }

  const items: GeneratedScopeItem[] = [];

  // Process each section and question to generate scope items
  for (const section of QUESTIONNAIRE_SECTIONS) {
    for (const question of section.questions) {
      const answer = answers[question.id];
      if (!answer) continue;

      // Find the selected option(s) and their generates config
      if (question.options) {
        const selectedValues = Array.isArray(answer) ? answer : [answer];

        for (const value of selectedValues) {
          const option = question.options.find((o) => o.value === value);
          if (!option?.generates) continue;

          for (const gen of option.generates) {
            const costItem = getCostItem(gen.itemKey);
            if (!costItem) continue;

            // Calculate quantity
            let quantity = gen.quantity ?? costItem.defaultQuantity ?? 1;

            // Apply quantity multipliers based on property data
            if (gen.quantityMultiplier) {
              const multiplier = getQuantityMultiplier(
                gen.quantityMultiplier,
                property,
                answers
              );
              quantity = Math.ceil(quantity * multiplier);
            }

            // Check if we already have this item (combine quantities)
            const existingIndex = items.findIndex((i) => i.itemKey === gen.itemKey);
            if (existingIndex >= 0) {
              items[existingIndex].quantity += quantity;
            } else {
              items.push({
                itemKey: costItem.key,
                category: costItem.category,
                name: costItem.name,
                unit: costItem.unit,
                quantity,
                costLow: costItem.costLow,
                costHigh: costItem.costHigh,
                laborPct: costItem.laborPct,
                priority: costItem.priority,
                isIncluded: true,
              });
            }
          }
        }
      }
    }
  }

  return { items };
}

function getQuantityMultiplier(
  multiplier: string,
  property: Awaited<ReturnType<typeof getProperty>>,
  answers: QuestionnaireAnswers
): number {
  if (!property) return 1;

  switch (multiplier) {
    case "sqft":
      return (property.sqft ?? 2000) / 1000; // Normalize to per-1000 sqft
    case "main_sqft":
      return (property.sqft_above_grade ?? property.sqft ?? 2000) / 1000;
    case "basement_sqft":
      return (property.sqft_basement ?? 800) / 800;
    case "bedroom_sqft":
      return ((property.beds ?? 3) * 150) / 450; // ~150 sqft per bedroom
    case "kitchen_sqft":
      return 1; // Assume ~200 sqft kitchen, normalize to 1
    case "kitchen_lf":
      return 1; // Assume ~30 LF cabinets, normalize to 1
    case "counter_sqft":
      return 1; // Assume ~40 sqft counters, normalize to 1
    case "bathroom_count":
      const bathCount = answers.bathroom_count;
      return typeof bathCount === "number" ? bathCount : (property.baths ?? 2);
    case "bathroom_sqft":
      const baths = answers.bathroom_count;
      const numBaths = typeof baths === "number" ? baths : (property.baths ?? 2);
      return (numBaths * 60) / 60; // ~60 sqft per bath
    case "trim_lf":
      return (property.sqft ?? 2000) / 2000; // Rough estimate
    case "door_count":
      return ((property.beds ?? 3) + 3) / 6; // Estimate doors
    case "fixture_count":
      return 1;
    case "roof_sqft":
      return (property.sqft ?? 2000) / 2000;
    case "window_count":
      return ((property.beds ?? 3) + 5) / 8; // Rough window count
    default:
      return 1;
  }
}

export async function saveScopeItems(
  propertyId: string,
  items: GeneratedScopeItem[]
): Promise<{ error?: string }> {
  const supabase = await createSupabaseServerClient();
  const user = await getUser();

  if (!user) {
    return { error: "You must be logged in" };
  }

  // Delete existing rehab items for this property
  await supabase
    .from("rehab_items")
    .delete()
    .eq("property_id", propertyId);

  // Insert new items
  const insertData = items.map((item, index) => ({
    property_id: propertyId,
    category: item.category,
    item_key: item.itemKey,
    name: item.name,
    unit: item.unit,
    quantity: item.quantity,
    cost_low: item.costLow,
    cost_high: item.costHigh,
    labor_pct: item.laborPct,
    priority: item.priority,
    is_included: item.isIncluded,
    is_completed: false,
    sort_order: index,
  }));

  const { error } = await supabase
    .from("rehab_items")
    .insert(insertData);

  if (error) {
    console.error("Error saving scope items:", error);
    return { error: "Failed to save scope items" };
  }

  // Update property to Phase 2
  await updatePropertyPhase(propertyId, 2, 0);

  revalidatePath(`/properties/${propertyId}`);
  return {};
}

export async function getScopeItems(propertyId: string) {
  const supabase = await createSupabaseServerClient();
  const user = await getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("rehab_items")
    .select("*")
    .eq("property_id", propertyId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching scope items:", error);
    return [];
  }

  return data ?? [];
}

export async function updateScopeItem(
  itemId: string,
  updates: {
    quantity?: number;
    costLow?: number;
    costHigh?: number;
    isIncluded?: boolean;
    notes?: string;
  }
): Promise<{ error?: string }> {
  const supabase = await createSupabaseServerClient();
  const user = await getUser();

  if (!user) {
    return { error: "You must be logged in" };
  }

  const updateData: Record<string, unknown> = {};
  if (updates.quantity !== undefined) updateData.quantity = updates.quantity;
  if (updates.costLow !== undefined) updateData.cost_low = updates.costLow;
  if (updates.costHigh !== undefined) updateData.cost_high = updates.costHigh;
  if (updates.isIncluded !== undefined) updateData.is_included = updates.isIncluded;
  if (updates.notes !== undefined) updateData.notes = updates.notes;

  const { error } = await supabase
    .from("rehab_items")
    .update(updateData)
    .eq("id", itemId);

  if (error) {
    console.error("Error updating scope item:", error);
    return { error: "Failed to update item" };
  }

  return {};
}

