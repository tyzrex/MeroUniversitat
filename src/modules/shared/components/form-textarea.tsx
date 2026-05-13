import * as React from 'react';
import { cn } from '@/lib/utils';

export type FormTextareaProps = React.ComponentProps<'textarea'>;

export const FormTextarea = React.forwardRef<
	HTMLTextAreaElement,
	FormTextareaProps
>(function FormTextarea({ className, ...props }, ref) {
	return (
		<textarea
			ref={ref}
			data-slot="form-textarea"
			className={cn(
				'border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 field-sizing-content min-h-[120px] w-full rounded-lg border px-3 py-2.5 text-base shadow-none transition-colors outline-none focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-50 md:text-sm',
				className
			)}
			{...props}
		/>
	);
});
