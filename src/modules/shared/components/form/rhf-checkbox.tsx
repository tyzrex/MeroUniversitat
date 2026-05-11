"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

type RHFCheckboxProps<T extends FieldValues> = {
  control: UseFormReturn<T>["control"];
  name: Path<T>;
  label: React.ReactNode;
  description?: string;
  formItemClassName?: string;
  /** Extra content below label (e.g. helper copy). */
  children?: React.ReactNode;
};

export function RHFCheckbox<T extends FieldValues>({
  control,
  name,
  label,
  description,
  formItemClassName,
  children,
}: RHFCheckboxProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            "flex flex-row items-start gap-3 space-y-0",
            formItemClassName,
          )}
        >
          <FormControl>
            <input
              type="checkbox"
              checked={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              name={field.name}
              className="border-input text-primary focus-visible:ring-ring mt-1 size-4 shrink-0 rounded border  focus-visible:ring-2 focus-visible:outline-none"
            />
          </FormControl>
          <div className="grid gap-1.5 leading-snug">
            <FormLabel className="block! cursor-pointer font-medium text-foreground">
              {label}
            </FormLabel>
            {description ? (
              <FormDescription>{description}</FormDescription>
            ) : null}
            {children}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
