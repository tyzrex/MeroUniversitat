'use client';

import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { FormTextarea } from '@/modules/shared/components/form-textarea';
import type { ComponentProps } from 'react';
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';

type RHFTextareaProps<T extends FieldValues> = {
	control: UseFormReturn<T>['control'];
	name: Path<T>;
	label: string;
	placeholder?: string;
	description?: string;
	formItemClassName?: string;
} & Omit<ComponentProps<typeof FormTextarea>, 'name'>;

export function RHFTextarea<T extends FieldValues>({
	control,
	name,
	label,
	placeholder,
	description,
	formItemClassName,
	rows,
	...props
}: RHFTextareaProps<T>) {
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
						<FormTextarea
							placeholder={placeholder}
							rows={rows}
							{...field}
							{...props}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
