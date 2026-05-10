"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormSelect } from "@/modules/shared/components/form-select";
import type { ReactNode } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

type RHFSelectProps<T extends FieldValues> = {
  control: UseFormReturn<T>["control"];
  name: Path<T>;
  label: string;
  description?: string;
  children: ReactNode;
  formItemClassName?: string;
};

export function RHFSelect<T extends FieldValues>({
  control,
  name,
  label,
  description,
  children,
  formItemClassName,
}: RHFSelectProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={formItemClassName}>
          <FormLabel className="text-sm font-semibold text-slate-700">
            {label}
          </FormLabel>
          {description ? (
            <FormDescription>{description}</FormDescription>
          ) : null}
          <FormControl>
            <FormSelect {...field}>{children}</FormSelect>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
