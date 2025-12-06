export type QuestionType = "single" | "multi" | "number" | "text";

export interface QuestionOption {
  value: string;
  label: string;
  description?: string;
  // Items to generate when this option is selected
  generates?: {
    itemKey: string;
    quantity?: number;
    quantityMultiplier?: string; // e.g., "sqft" to multiply by sqft
  }[];
}

export interface Question {
  id: string;
  section: string;
  question: string;
  type: QuestionType;
  options?: QuestionOption[];
  placeholder?: string;
  required?: boolean;
  // Show this question only if another answer matches
  showIf?: {
    questionId: string;
    values: string[];
  };
}

export interface QuestionSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  questions: Question[];
}

export const QUESTIONNAIRE_SECTIONS: QuestionSection[] = [
  {
    id: "kitchen",
    title: "Kitchen",
    description: "Cabinets, counters, appliances, and layout",
    icon: "🍳",
    questions: [
      {
        id: "kitchen_cabinets",
        section: "kitchen",
        question: "What is the condition of the kitchen cabinets?",
        type: "single",
        required: true,
        options: [
          { value: "good", label: "Good", description: "Minor touch-ups only" },
          { value: "fair", label: "Fair", description: "Need refinishing or painting" },
          { value: "poor", label: "Poor", description: "Need replacement - reface or new" },
          { 
            value: "gut", 
            label: "Gut", 
            description: "Complete removal and new cabinets",
            generates: [{ itemKey: "cabinet_replacement_full", quantityMultiplier: "kitchen_lf" }]
          },
        ],
      },
      {
        id: "kitchen_counters",
        section: "kitchen",
        question: "What type of countertops does the property need?",
        type: "single",
        required: true,
        options: [
          { value: "keep", label: "Keep existing" },
          { 
            value: "laminate", 
            label: "Laminate", 
            description: "$15-40/sqft installed",
            generates: [{ itemKey: "countertop_laminate", quantityMultiplier: "counter_sqft" }]
          },
          { 
            value: "quartz", 
            label: "Quartz", 
            description: "$50-80/sqft installed",
            generates: [{ itemKey: "countertop_quartz", quantityMultiplier: "counter_sqft" }]
          },
          { 
            value: "granite", 
            label: "Granite", 
            description: "$40-60/sqft installed",
            generates: [{ itemKey: "countertop_granite", quantityMultiplier: "counter_sqft" }]
          },
        ],
      },
      {
        id: "kitchen_appliances",
        section: "kitchen",
        question: "Which appliances need to be replaced?",
        type: "multi",
        options: [
          { 
            value: "refrigerator", 
            label: "Refrigerator",
            generates: [{ itemKey: "appliance_refrigerator", quantity: 1 }]
          },
          { 
            value: "range", 
            label: "Range/Oven",
            generates: [{ itemKey: "appliance_range", quantity: 1 }]
          },
          { 
            value: "dishwasher", 
            label: "Dishwasher",
            generates: [{ itemKey: "appliance_dishwasher", quantity: 1 }]
          },
          { 
            value: "microwave", 
            label: "Microwave/Hood",
            generates: [{ itemKey: "appliance_microwave", quantity: 1 }]
          },
        ],
      },
      {
        id: "kitchen_flooring",
        section: "kitchen",
        question: "What flooring work is needed in the kitchen?",
        type: "single",
        options: [
          { value: "keep", label: "Keep existing" },
          { 
            value: "lvp", 
            label: "LVP/Vinyl Plank",
            generates: [{ itemKey: "flooring_lvp", quantityMultiplier: "kitchen_sqft" }]
          },
          { 
            value: "tile", 
            label: "Tile",
            generates: [{ itemKey: "flooring_tile", quantityMultiplier: "kitchen_sqft" }]
          },
          { 
            value: "hardwood", 
            label: "Hardwood",
            generates: [{ itemKey: "flooring_hardwood", quantityMultiplier: "kitchen_sqft" }]
          },
        ],
      },
      {
        id: "kitchen_notes",
        section: "kitchen",
        question: "Any additional kitchen notes?",
        type: "text",
        placeholder: "Layout changes, specific issues, etc.",
      },
    ],
  },
  {
    id: "bathrooms",
    title: "Bathrooms",
    description: "Vanities, fixtures, tile, and showers",
    icon: "🚿",
    questions: [
      {
        id: "bathroom_count",
        section: "bathrooms",
        question: "How many bathrooms need work?",
        type: "number",
        placeholder: "3",
        required: true,
      },
      {
        id: "bathroom_vanities",
        section: "bathrooms",
        question: "What vanity work is needed?",
        type: "single",
        options: [
          { value: "keep", label: "Keep existing" },
          { 
            value: "replace", 
            label: "Replace vanities",
            generates: [{ itemKey: "bathroom_vanity", quantityMultiplier: "bathroom_count" }]
          },
        ],
      },
      {
        id: "bathroom_toilets",
        section: "bathrooms",
        question: "Do toilets need replacement?",
        type: "single",
        options: [
          { value: "keep", label: "Keep existing" },
          { 
            value: "replace", 
            label: "Replace all",
            generates: [{ itemKey: "bathroom_toilet", quantityMultiplier: "bathroom_count" }]
          },
        ],
      },
      {
        id: "bathroom_tub_shower",
        section: "bathrooms",
        question: "What tub/shower work is needed?",
        type: "single",
        options: [
          { value: "keep", label: "Keep existing" },
          { 
            value: "surround", 
            label: "Install surround/acrylic",
            generates: [{ itemKey: "bathroom_surround", quantityMultiplier: "bathroom_count" }]
          },
          { 
            value: "tile", 
            label: "Tile shower/tub",
            generates: [{ itemKey: "bathroom_tile_shower", quantityMultiplier: "bathroom_count" }]
          },
          { 
            value: "full", 
            label: "Full tub/shower replacement",
            generates: [{ itemKey: "bathroom_full_shower", quantityMultiplier: "bathroom_count" }]
          },
        ],
      },
      {
        id: "bathroom_flooring",
        section: "bathrooms",
        question: "What flooring is needed in bathrooms?",
        type: "single",
        options: [
          { value: "keep", label: "Keep existing" },
          { 
            value: "tile", 
            label: "Tile",
            generates: [{ itemKey: "flooring_tile_bath", quantityMultiplier: "bathroom_sqft" }]
          },
          { 
            value: "lvp", 
            label: "LVP/Vinyl",
            generates: [{ itemKey: "flooring_lvp_bath", quantityMultiplier: "bathroom_sqft" }]
          },
        ],
      },
    ],
  },
  {
    id: "interior",
    title: "Interior",
    description: "Paint, flooring, trim, doors, and lighting",
    icon: "🏠",
    questions: [
      {
        id: "interior_paint",
        section: "interior",
        question: "What interior painting is needed?",
        type: "single",
        required: true,
        options: [
          { value: "none", label: "None needed" },
          { 
            value: "touchup", 
            label: "Touch-up only",
            generates: [{ itemKey: "paint_touchup" }]
          },
          { 
            value: "full", 
            label: "Full interior paint",
            generates: [{ itemKey: "paint_full_interior", quantityMultiplier: "sqft" }]
          },
        ],
      },
      {
        id: "interior_flooring",
        section: "interior",
        question: "What main living area flooring is needed?",
        type: "single",
        options: [
          { value: "keep", label: "Keep existing" },
          { 
            value: "lvp", 
            label: "LVP throughout",
            generates: [{ itemKey: "flooring_lvp_main", quantityMultiplier: "main_sqft" }]
          },
          { 
            value: "hardwood", 
            label: "Hardwood",
            generates: [{ itemKey: "flooring_hardwood_main", quantityMultiplier: "main_sqft" }]
          },
          { 
            value: "carpet", 
            label: "Carpet (bedrooms)",
            generates: [{ itemKey: "flooring_carpet", quantityMultiplier: "bedroom_sqft" }]
          },
        ],
      },
      {
        id: "interior_trim",
        section: "interior",
        question: "What trim/molding work is needed?",
        type: "single",
        options: [
          { value: "keep", label: "Keep existing" },
          { 
            value: "paint", 
            label: "Paint existing trim",
            generates: [{ itemKey: "trim_paint", quantityMultiplier: "trim_lf" }]
          },
          { 
            value: "replace", 
            label: "Replace baseboards",
            generates: [{ itemKey: "trim_replace", quantityMultiplier: "trim_lf" }]
          },
        ],
      },
      {
        id: "interior_doors",
        section: "interior",
        question: "What interior door work is needed?",
        type: "single",
        options: [
          { value: "keep", label: "Keep existing" },
          { 
            value: "hardware", 
            label: "Replace hardware only",
            generates: [{ itemKey: "door_hardware", quantityMultiplier: "door_count" }]
          },
          { 
            value: "replace", 
            label: "Replace doors",
            generates: [{ itemKey: "door_interior", quantityMultiplier: "door_count" }]
          },
        ],
      },
      {
        id: "interior_lighting",
        section: "interior",
        question: "What lighting updates are needed?",
        type: "multi",
        options: [
          { 
            value: "fixtures", 
            label: "Replace light fixtures",
            generates: [{ itemKey: "lighting_fixtures", quantityMultiplier: "fixture_count" }]
          },
          { 
            value: "recessed", 
            label: "Add recessed lighting",
            generates: [{ itemKey: "lighting_recessed" }]
          },
          { 
            value: "switches", 
            label: "Update switches/outlets",
            generates: [{ itemKey: "electrical_switches" }]
          },
        ],
      },
    ],
  },
  {
    id: "exterior",
    title: "Exterior",
    description: "Roof, siding, windows, doors, and landscaping",
    icon: "🏡",
    questions: [
      {
        id: "exterior_roof",
        section: "exterior",
        question: "What is the roof condition?",
        type: "single",
        required: true,
        options: [
          { value: "good", label: "Good - No work needed" },
          { 
            value: "repair", 
            label: "Needs repairs",
            generates: [{ itemKey: "roof_repair" }]
          },
          { 
            value: "replace", 
            label: "Needs replacement",
            generates: [{ itemKey: "roof_replacement", quantityMultiplier: "roof_sqft" }]
          },
        ],
      },
      {
        id: "exterior_siding",
        section: "exterior",
        question: "What siding work is needed?",
        type: "single",
        options: [
          { value: "good", label: "Good - No work needed" },
          { 
            value: "repair", 
            label: "Repairs/patching",
            generates: [{ itemKey: "siding_repair" }]
          },
          { 
            value: "paint", 
            label: "Paint exterior",
            generates: [{ itemKey: "paint_exterior" }]
          },
          { 
            value: "replace", 
            label: "Replace siding",
            generates: [{ itemKey: "siding_replacement" }]
          },
        ],
      },
      {
        id: "exterior_windows",
        section: "exterior",
        question: "What window work is needed?",
        type: "single",
        options: [
          { value: "keep", label: "Keep existing" },
          { 
            value: "some", 
            label: "Replace some windows",
            generates: [{ itemKey: "windows_partial" }]
          },
          { 
            value: "all", 
            label: "Replace all windows",
            generates: [{ itemKey: "windows_full", quantityMultiplier: "window_count" }]
          },
        ],
      },
      {
        id: "exterior_entry",
        section: "exterior",
        question: "What entry door work is needed?",
        type: "single",
        options: [
          { value: "keep", label: "Keep existing" },
          { 
            value: "replace_front", 
            label: "Replace front door",
            generates: [{ itemKey: "door_entry", quantity: 1 }]
          },
          { 
            value: "replace_all", 
            label: "Replace all entry doors",
            generates: [{ itemKey: "door_entry", quantity: 3 }]
          },
        ],
      },
      {
        id: "exterior_landscaping",
        section: "exterior",
        question: "What landscaping is needed?",
        type: "multi",
        options: [
          { 
            value: "cleanup", 
            label: "General cleanup",
            generates: [{ itemKey: "landscaping_cleanup" }]
          },
          { 
            value: "mulch", 
            label: "Fresh mulch/beds",
            generates: [{ itemKey: "landscaping_mulch" }]
          },
          { 
            value: "sod", 
            label: "New sod/lawn",
            generates: [{ itemKey: "landscaping_sod" }]
          },
          { 
            value: "plants", 
            label: "New plants/shrubs",
            generates: [{ itemKey: "landscaping_plants" }]
          },
        ],
      },
    ],
  },
  {
    id: "systems",
    title: "Systems",
    description: "HVAC, plumbing, electrical, and water heater",
    icon: "⚙️",
    questions: [
      {
        id: "systems_hvac",
        section: "systems",
        question: "What is the HVAC condition?",
        type: "single",
        required: true,
        options: [
          { value: "good", label: "Good - Functional" },
          { 
            value: "service", 
            label: "Needs service/tune-up",
            generates: [{ itemKey: "hvac_service" }]
          },
          { 
            value: "replace", 
            label: "Needs replacement",
            generates: [{ itemKey: "hvac_replacement" }]
          },
        ],
      },
      {
        id: "systems_water_heater",
        section: "systems",
        question: "What is the water heater condition?",
        type: "single",
        options: [
          { value: "good", label: "Good - Functional" },
          { 
            value: "replace", 
            label: "Needs replacement",
            generates: [{ itemKey: "water_heater" }]
          },
        ],
      },
      {
        id: "systems_electrical",
        section: "systems",
        question: "What electrical work is needed?",
        type: "multi",
        options: [
          { 
            value: "panel", 
            label: "Panel upgrade",
            generates: [{ itemKey: "electrical_panel" }]
          },
          { 
            value: "outlets", 
            label: "Add/update outlets",
            generates: [{ itemKey: "electrical_outlets" }]
          },
          { 
            value: "rewire", 
            label: "Partial rewire",
            generates: [{ itemKey: "electrical_rewire" }]
          },
        ],
      },
      {
        id: "systems_plumbing",
        section: "systems",
        question: "What plumbing work is needed?",
        type: "multi",
        options: [
          { 
            value: "fixtures", 
            label: "Replace fixtures",
            generates: [{ itemKey: "plumbing_fixtures" }]
          },
          { 
            value: "pipes", 
            label: "Repipe (partial)",
            generates: [{ itemKey: "plumbing_repipe" }]
          },
          { 
            value: "sewer", 
            label: "Sewer line repair",
            generates: [{ itemKey: "plumbing_sewer" }]
          },
        ],
      },
    ],
  },
  {
    id: "basement",
    title: "Basement",
    description: "Finishing, waterproofing, and egress",
    icon: "🏗️",
    questions: [
      {
        id: "basement_status",
        section: "basement",
        question: "Is the basement currently finished?",
        type: "single",
        required: true,
        options: [
          { value: "none", label: "No basement" },
          { value: "unfinished", label: "Unfinished" },
          { value: "partially", label: "Partially finished" },
          { value: "finished", label: "Fully finished" },
        ],
      },
      {
        id: "basement_finish",
        section: "basement",
        question: "What basement finishing is planned?",
        type: "single",
        showIf: { questionId: "basement_status", values: ["unfinished", "partially"] },
        options: [
          { value: "none", label: "Leave as-is" },
          { 
            value: "basic", 
            label: "Basic finish",
            generates: [{ itemKey: "basement_finish_basic", quantityMultiplier: "basement_sqft" }]
          },
          { 
            value: "full", 
            label: "Full finish with bathroom",
            generates: [
              { itemKey: "basement_finish_full", quantityMultiplier: "basement_sqft" },
              { itemKey: "basement_bathroom", quantity: 1 }
            ]
          },
        ],
      },
      {
        id: "basement_waterproofing",
        section: "basement",
        question: "Is waterproofing needed?",
        type: "single",
        showIf: { questionId: "basement_status", values: ["unfinished", "partially", "finished"] },
        options: [
          { value: "no", label: "No issues" },
          { 
            value: "sealing", 
            label: "Minor sealing",
            generates: [{ itemKey: "basement_sealing" }]
          },
          { 
            value: "full", 
            label: "Full waterproofing",
            generates: [{ itemKey: "basement_waterproofing" }]
          },
        ],
      },
      {
        id: "basement_egress",
        section: "basement",
        question: "Are egress windows needed for bedrooms?",
        type: "single",
        showIf: { questionId: "basement_status", values: ["unfinished", "partially", "finished"] },
        options: [
          { value: "no", label: "Not needed / already have" },
          { 
            value: "one", 
            label: "One egress window",
            generates: [{ itemKey: "basement_egress", quantity: 1 }]
          },
          { 
            value: "two", 
            label: "Two egress windows",
            generates: [{ itemKey: "basement_egress", quantity: 2 }]
          },
        ],
      },
    ],
  },
];

export function getSectionById(id: string): QuestionSection | undefined {
  return QUESTIONNAIRE_SECTIONS.find((s) => s.id === id);
}

export function getVisibleQuestions(
  section: QuestionSection,
  answers: Record<string, string | string[] | number>
): Question[] {
  return section.questions.filter((q) => {
    if (!q.showIf) return true;
    const depAnswer = answers[q.showIf.questionId];
    if (Array.isArray(depAnswer)) {
      return depAnswer.some((v) => q.showIf!.values.includes(v));
    }
    return q.showIf.values.includes(depAnswer as string);
  });
}

