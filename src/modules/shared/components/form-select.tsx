import { cn } from '@/lib/utils';
import * as React from 'react';

export type FormSelectProps = React.ComponentProps<'select'>;

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
	function FormSelect({ className, ...props }, ref) {
		return (
			<select
				ref={ref}
				data-slot="form-select"
				className={cn(
					'border-input bg-background text-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-11 w-full min-w-0 rounded-lg border px-3 py-2 text-base shadow-none transition-colors outline-none focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-50 md:text-sm',
					className
				)}
				{...props}
			/>
		);
	}
);
