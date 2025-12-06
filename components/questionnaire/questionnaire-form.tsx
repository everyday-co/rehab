"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  QUESTIONNAIRE_SECTIONS,
  getVisibleQuestions,
  type Question,
} from "@/lib/questionnaire/questions";
import {
  generateScopeFromAnswers,
  saveScopeItems,
  type QuestionnaireAnswers,
} from "@/lib/questionnaire/actions";

// Custom RadioGroup component for consistency
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";
import * as React from "react";

const RadioGroupCustom = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroupCustom.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItemCustom = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItemCustom.displayName = RadioGroupPrimitive.Item.displayName;

interface QuestionnaireFormProps {
  propertyId: string;
  initialAnswers?: QuestionnaireAnswers;
}

export function QuestionnaireForm({
  propertyId,
  initialAnswers = {},
}: QuestionnaireFormProps) {
  const router = useRouter();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(initialAnswers);
  const [isPending, startTransition] = useTransition();

  const currentSection = QUESTIONNAIRE_SECTIONS[currentSectionIndex];
  const visibleQuestions = getVisibleQuestions(currentSection, answers);
  const progress =
    ((currentSectionIndex + 1) / QUESTIONNAIRE_SECTIONS.length) * 100;

  function handleAnswer(questionId: string, value: string | string[] | number) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function handleMultiAnswer(questionId: string, value: string, checked: boolean) {
    setAnswers((prev) => {
      const current = (prev[questionId] as string[]) || [];
      if (checked) {
        return { ...prev, [questionId]: [...current, value] };
      }
      return { ...prev, [questionId]: current.filter((v) => v !== value) };
    });
  }

  function handleNext() {
    if (currentSectionIndex < QUESTIONNAIRE_SECTIONS.length - 1) {
      setCurrentSectionIndex((i) => i + 1);
    }
  }

  function handleBack() {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex((i) => i - 1);
    }
  }

  function handleSkipSection() {
    handleNext();
  }

  async function handleFinish() {
    startTransition(async () => {
      // Generate scope from answers
      const result = await generateScopeFromAnswers(propertyId, answers);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (!result.items || result.items.length === 0) {
        toast.error("No scope items generated. Please answer more questions.");
        return;
      }

      // Save scope items
      const saveResult = await saveScopeItems(propertyId, result.items);

      if (saveResult.error) {
        toast.error(saveResult.error);
        return;
      }

      toast.success(`Generated ${result.items.length} scope items!`);
      router.push(`/properties/${propertyId}/scope/review`);
    });
  }

  const isLastSection =
    currentSectionIndex === QUESTIONNAIRE_SECTIONS.length - 1;

  return (
    <div className="space-y-6">
      {/* Progress header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            Section {currentSectionIndex + 1} of {QUESTIONNAIRE_SECTIONS.length}
          </span>
          <span className="text-muted-foreground">
            {Math.round(progress)}% complete
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Section tabs */}
      <div className="flex flex-wrap gap-2">
        {QUESTIONNAIRE_SECTIONS.map((section, index) => {
          const isComplete =
            index < currentSectionIndex ||
            (index === currentSectionIndex &&
              visibleQuestions.every((q) => !q.required || answers[q.id]));
          const isCurrent = index === currentSectionIndex;

          return (
            <button
              key={section.id}
              onClick={() => setCurrentSectionIndex(index)}
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors",
                isCurrent
                  ? "bg-primary text-primary-foreground"
                  : isComplete
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {isComplete && !isCurrent && <Check className="h-3 w-3" />}
              <span>{section.icon}</span>
              <span className="hidden sm:inline">{section.title}</span>
            </button>
          );
        })}
      </div>

      {/* Current section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">{currentSection.icon}</span>
            {currentSection.title}
          </CardTitle>
          <CardDescription>{currentSection.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {visibleQuestions.map((question) => (
            <QuestionField
              key={question.id}
              question={question}
              value={answers[question.id]}
              onChange={(value) => handleAnswer(question.id, value)}
              onMultiChange={(value, checked) =>
                handleMultiAnswer(question.id, value, checked)
              }
            />
          ))}

          {visibleQuestions.length === 0 && (
            <p className="text-center text-muted-foreground">
              No questions for this section based on your previous answers.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div>
          {currentSectionIndex > 0 && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleBack}
              disabled={isPending}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isLastSection && (
            <Button
              type="button"
              variant="outline"
              onClick={handleSkipSection}
              disabled={isPending}
            >
              Skip Section
            </Button>
          )}
          {isLastSection ? (
            <Button onClick={handleFinish} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Scope...
                </>
              ) : (
                <>
                  Generate Scope
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={isPending}>
              Next Section
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

interface QuestionFieldProps {
  question: Question;
  value: string | string[] | number | undefined;
  onChange: (value: string | string[] | number) => void;
  onMultiChange: (value: string, checked: boolean) => void;
}

function QuestionField({
  question,
  value,
  onChange,
  onMultiChange,
}: QuestionFieldProps) {
  return (
    <div className="space-y-3">
      <Label className="text-base">
        {question.question}
        {question.required && <span className="ml-1 text-destructive">*</span>}
      </Label>

      {question.type === "single" && question.options && (
        <RadioGroupCustom
          value={value as string}
          onValueChange={onChange}
          className="space-y-2"
        >
          {question.options.map((option) => (
            <div
              key={option.value}
              className={cn(
                "flex items-start space-x-3 rounded-lg border p-3 transition-colors",
                value === option.value
                  ? "border-primary bg-primary/5"
                  : "hover:bg-muted/50"
              )}
            >
              <RadioGroupItemCustom value={option.value} id={`${question.id}-${option.value}`} />
              <div className="flex-1">
                <Label
                  htmlFor={`${question.id}-${option.value}`}
                  className="cursor-pointer font-medium"
                >
                  {option.label}
                </Label>
                {option.description && (
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </RadioGroupCustom>
      )}

      {question.type === "multi" && question.options && (
        <div className="space-y-2">
          {question.options.map((option) => {
            const isChecked = ((value as string[]) || []).includes(option.value);
            return (
              <div
                key={option.value}
                className={cn(
                  "flex items-start space-x-3 rounded-lg border p-3 transition-colors",
                  isChecked ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                )}
              >
                <Checkbox
                  id={`${question.id}-${option.value}`}
                  checked={isChecked}
                  onCheckedChange={(checked) =>
                    onMultiChange(option.value, !!checked)
                  }
                />
                <div className="flex-1">
                  <Label
                    htmlFor={`${question.id}-${option.value}`}
                    className="cursor-pointer font-medium"
                  >
                    {option.label}
                  </Label>
                  {option.description && (
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {question.type === "number" && (
        <Input
          type="number"
          placeholder={question.placeholder}
          value={value as number ?? ""}
          onChange={(e) =>
            onChange(e.target.value ? Number(e.target.value) : 0)
          }
          className="max-w-[200px]"
        />
      )}

      {question.type === "text" && (
        <Textarea
          placeholder={question.placeholder}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[80px]"
        />
      )}
    </div>
  );
}

