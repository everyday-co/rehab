"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles, Check } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  propertySchema,
  type PropertyFormValues,
  US_STATES,
  CONDITIONS,
} from "@/lib/validations";
import { createProperty } from "@/lib/properties/actions";
import type { EnrichmentResult } from "@/lib/enrichment/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PropertyFormProps {
  defaultValues?: Partial<PropertyFormValues>;
  enrichmentResult?: EnrichmentResult | null;
}

/** Indicator for auto-filled fields */
function EnrichedIndicator() {
  return (
    <Badge variant="secondary" className="ml-2 gap-1 text-xs bg-primary/10 text-primary">
      <Sparkles className="h-3 w-3" />
      Auto-filled
    </Badge>
  );
}

export function PropertyForm({ defaultValues, enrichmentResult }: PropertyFormProps) {
  // Track which fields were auto-filled for visual indication
  const enrichedFields = enrichmentResult ? Object.keys(enrichmentResult.property) : [];
  const isEnriched = (fieldName: string) => enrichedFields.includes(fieldName);
  const arvSuggestion = enrichmentResult?.arvSuggestion;
  
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  // Handler to apply ARV suggestion
  const applyARVSuggestion = (type: "low" | "mid" | "high") => {
    if (!arvSuggestion) return;
    
    if (type === "low") {
      form.setValue("arvLow", arvSuggestion.low);
      form.setValue("arvHigh", arvSuggestion.mid);
    } else if (type === "mid") {
      form.setValue("arvLow", arvSuggestion.low);
      form.setValue("arvHigh", arvSuggestion.high);
    } else {
      form.setValue("arvLow", arvSuggestion.mid);
      form.setValue("arvHigh", arvSuggestion.high);
    }
  };

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      address: "",
      city: "",
      state: "MN",
      zip: "",
      sqft: null,
      sqftAboveGrade: null,
      sqftBasement: null,
      beds: null,
      baths: null,
      lotAcres: null,
      garageSpaces: null,
      yearBuilt: null,
      purchasePrice: null,
      purchaseDate: null,
      arvLow: null,
      arvHigh: null,
      condition: null,
      notes: null,
      ...defaultValues,
    },
  });

  function onSubmit(values: PropertyFormValues) {
    startTransition(async () => {
      const result = await createProperty(values);
      if (result.error) {
        toast.error(result.error);
      } else if (result.data?.id) {
        toast.success("Property created!");
        router.push(`/properties/${result.data.id}/scope`);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Property Address */}
        <Card>
          <CardHeader>
            <CardTitle>Property Address</CardTitle>
            <CardDescription>
              Enter the property location details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Street Address *
                    {isEnriched("address") && <EnrichedIndicator />}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City *</FormLabel>
                    <FormControl>
                      <Input placeholder="Minneapolis" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {US_STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP *</FormLabel>
                    <FormControl>
                      <Input placeholder="55401" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
            <CardDescription>
              Physical characteristics of the property
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="sqft"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Total Sqft
                      {isEnriched("sqft") && <EnrichedIndicator />}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="2,500"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sqftAboveGrade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Above Grade</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1,800"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sqftBasement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Basement</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="700"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-5">
              <FormField
                control={form.control}
                name="beds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Beds
                      {isEnriched("beds") && <EnrichedIndicator />}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="4"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="baths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Baths</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.5"
                        placeholder="2.5"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lotAcres"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lot (acres)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.25"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="garageSpaces"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Garage</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="2"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="yearBuilt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Year Built
                      {isEnriched("yearBuilt") && <EnrichedIndicator />}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1995"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Purchase & Value */}
        <Card>
          <CardHeader>
            <CardTitle>Purchase & Value</CardTitle>
            <CardDescription>
              Financial details and estimated ARV
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="purchasePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="250000"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormDescription>Enter without commas or $</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* ARV Suggestion */}
            {arvSuggestion && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">
                    Suggested ARV Range
                  </span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    {arvSuggestion.confidence} confidence
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => applyARVSuggestion("low")}
                    className="gap-1"
                  >
                    Conservative
                    <span className="font-semibold">
                      ${arvSuggestion.low.toLocaleString()}
                    </span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => applyARVSuggestion("mid")}
                    className="gap-1"
                  >
                    Middle
                    <span className="font-semibold">
                      ${arvSuggestion.mid.toLocaleString()}
                    </span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => applyARVSuggestion("high")}
                    className="gap-1"
                  >
                    Optimistic
                    <span className="font-semibold">
                      ${arvSuggestion.high.toLocaleString()}
                    </span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Based on ${arvSuggestion.pricePerSqftRange.avg}/sqft avg in the area
                </p>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="arvLow"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target ARV (Low)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="350000"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormDescription>Conservative estimate</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="arvHigh"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target ARV (High)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="375000"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : null)
                        }
                      />
                    </FormControl>
                    <FormDescription>Optimistic estimate</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Condition</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CONDITIONS.map((condition) => (
                        <SelectItem key={condition.value} value={condition.value}>
                          <div>
                            <span className="font-medium">{condition.label}</span>
                            <span className="ml-2 text-muted-foreground">
                              – {condition.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>
              Any additional details about the property
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Key observations, unique features, or important context..."
                      className="min-h-[100px] resize-y"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Save & Continue"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

