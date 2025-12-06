"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  Edit2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn, formatCurrency } from "@/lib/utils";
import { updateScopeItem } from "@/lib/questionnaire/actions";
import { updatePropertyPhase } from "@/lib/properties/actions";
import type { Tables } from "@/types/database";

type RehabItem = Tables<"rehab_items">;

interface ScopeReviewProps {
  propertyId: string;
  items: RehabItem[];
}

const priorityConfig = {
  essential: { label: "Essential", color: "bg-red-500/10 text-red-600 border-red-200" },
  "high-roi": { label: "High ROI", color: "bg-green-500/10 text-green-600 border-green-200" },
  recommended: { label: "Recommended", color: "bg-blue-500/10 text-blue-600 border-blue-200" },
  optional: { label: "Optional", color: "bg-gray-500/10 text-gray-600 border-gray-200" },
};

export function ScopeReview({ propertyId, items: initialItems }: ScopeReviewProps) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["Kitchen", "Bathrooms"])
  );
  const [editingItem, setEditingItem] = useState<RehabItem | null>(null);
  const [isPending, startTransition] = useTransition();

  // Group items by category
  const categories = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, RehabItem[]>);

  // Calculate totals
  const includedItems = items.filter((i) => i.is_included);
  const totalLow = includedItems.reduce(
    (sum, i) => sum + i.quantity * i.cost_low,
    0
  );
  const totalHigh = includedItems.reduce(
    (sum, i) => sum + i.quantity * i.cost_high,
    0
  );
  const contingencyLow = totalLow * 0.1;
  const contingencyHigh = totalHigh * 0.1;

  function toggleCategory(category: string) {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }

  async function handleToggleInclude(item: RehabItem) {
    const newValue = !item.is_included;
    
    // Optimistic update
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, is_included: newValue } : i))
    );

    const result = await updateScopeItem(item.id, { isIncluded: newValue });
    if (result.error) {
      // Revert on error
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, is_included: !newValue } : i))
      );
      toast.error(result.error);
    }
  }

  async function handleSaveEdit() {
    if (!editingItem) return;

    const result = await updateScopeItem(editingItem.id, {
      quantity: editingItem.quantity,
      costLow: editingItem.cost_low,
      costHigh: editingItem.cost_high,
    });

    if (result.error) {
      toast.error(result.error);
      return;
    }

    setItems((prev) =>
      prev.map((i) => (i.id === editingItem.id ? editingItem : i))
    );
    setEditingItem(null);
    toast.success("Item updated");
  }

  async function handleFinalize() {
    startTransition(async () => {
      // Move to Phase 2
      const result = await updatePropertyPhase(propertyId, 2, 0);
      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Scope finalized! Moving to Budget phase.");
      router.push(`/properties/${propertyId}/budget`);
    });
  }

  return (
    <div className="space-y-6">
      {/* Summary header */}
      <Card>
        <CardHeader>
          <CardTitle>Scope Summary</CardTitle>
          <CardDescription>
            {includedItems.length} of {items.length} items included
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Estimated Range</p>
              <p className="text-2xl font-bold">
                {formatCurrency(totalLow)} – {formatCurrency(totalHigh)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">+ 10% Contingency</p>
              <p className="text-lg font-semibold text-muted-foreground">
                {formatCurrency(contingencyLow)} – {formatCurrency(contingencyHigh)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total with Contingency</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(totalLow + contingencyLow)} –{" "}
                {formatCurrency(totalHigh + contingencyHigh)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category accordion */}
      <div className="space-y-4">
        {Object.entries(categories).map(([category, categoryItems]) => {
          const isExpanded = expandedCategories.has(category);
          const includedCount = categoryItems.filter((i) => i.is_included).length;
          const categoryLow = categoryItems
            .filter((i) => i.is_included)
            .reduce((sum, i) => sum + i.quantity * i.cost_low, 0);
          const categoryHigh = categoryItems
            .filter((i) => i.is_included)
            .reduce((sum, i) => sum + i.quantity * i.cost_high, 0);

          return (
            <Collapsible
              key={category}
              open={isExpanded}
              onOpenChange={() => toggleCategory(category)}
            >
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                        <div>
                          <CardTitle className="text-base">{category}</CardTitle>
                          <CardDescription>
                            {includedCount} of {categoryItems.length} items
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatCurrency(categoryLow)} – {formatCurrency(categoryHigh)}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {categoryItems.map((item) => (
                        <ScopeItemRow
                          key={item.id}
                          item={item}
                          onToggle={() => handleToggleInclude(item)}
                          onEdit={() => setEditingItem(item)}
                        />
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4">
        <div>
          <p className="font-medium">Ready to build your budget?</p>
          <p className="text-sm text-muted-foreground">
            You can still adjust items in the next phase
          </p>
        </div>
        <Button onClick={handleFinalize} disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Finalizing...
            </>
          ) : (
            "Finalize & Continue"
          )}
        </Button>
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Scope Item</DialogTitle>
            <DialogDescription>
              Adjust quantity and cost estimates for this item
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              <div>
                <p className="font-medium">{editingItem.name}</p>
                <p className="text-sm text-muted-foreground">
                  {editingItem.category}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={editingItem.quantity}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        quantity: Number(e.target.value),
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Unit: {editingItem.unit}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Cost Low (per unit)</Label>
                  <Input
                    type="number"
                    value={editingItem.cost_low}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        cost_low: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cost High (per unit)</Label>
                  <Input
                    type="number"
                    value={editingItem.cost_high}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        cost_high: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <Separator />
              <div className="text-sm">
                <p className="text-muted-foreground">Calculated Total</p>
                <p className="font-semibold">
                  {formatCurrency(editingItem.quantity * editingItem.cost_low)} –{" "}
                  {formatCurrency(editingItem.quantity * editingItem.cost_high)}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingItem(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ScopeItemRowProps {
  item: RehabItem;
  onToggle: () => void;
  onEdit: () => void;
}

function ScopeItemRow({ item, onToggle, onEdit }: ScopeItemRowProps) {
  const priority = priorityConfig[item.priority as keyof typeof priorityConfig];
  const totalLow = item.quantity * item.cost_low;
  const totalHigh = item.quantity * item.cost_high;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border p-3 transition-colors",
        item.is_included ? "bg-background" : "bg-muted/30 opacity-60"
      )}
    >
      <Checkbox
        checked={item.is_included}
        onCheckedChange={onToggle}
        className="shrink-0"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p
            className={cn(
              "font-medium",
              !item.is_included && "line-through"
            )}
          >
            {item.name}
          </p>
          {priority && (
            <Badge variant="outline" className={cn("text-xs", priority.color)}>
              {priority.label}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {item.quantity} {item.unit} × ${item.cost_low}-${item.cost_high}/{item.unit}
        </p>
      </div>
      <div className="text-right">
        <p className="font-medium">
          {formatCurrency(totalLow)} – {formatCurrency(totalHigh)}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={onEdit}
      >
        <Edit2 className="h-4 w-4" />
        <span className="sr-only">Edit</span>
      </Button>
    </div>
  );
}

