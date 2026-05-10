"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormInput, type FormInputProps } from "@/modules/shared/components/form-input";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

type RHFInputProps<T extends FieldValues> = {
  control: UseFormReturn<T>["control"];
  name: Path<T>;
  label: string;
  placeholder?: string;
  description?: string;
  formItemClassName?: string;
} & Omit<FormInputProps, "name">;

export function RHFInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  formItemClassName,
  ...props
}: RHFInputProps<T>) {
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
            <FormInput placeholder={placeholder} {...field} {...props} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
