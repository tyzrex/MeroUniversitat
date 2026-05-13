import * as React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

export type FormInputProps = ComponentProps<typeof Input> & {
	icon?: LucideIcon;
};

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
	function FormInput({ className, icon: Icon, ...props }, ref) {
		return (
			<div className="relative">
				{Icon ? (
					<Icon
						aria-hidden
						className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400"
						strokeWidth={1.75}
					/>
				) : null}
				<Input
					ref={ref}
					className={cn(Icon && 'pl-10', className)}
					data-slot="form-input"
					{...props}
				/>
			</div>
		);
	}
);
