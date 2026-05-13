import { z } from 'zod';

export const signInSchema = z.object({
	email: z.string().email('Enter a valid email'),
	password: z.string().min(1, 'Password is required')
});

export const signUpSchema = z.object({
	name: z.string().min(2, 'Name is too short'),
	email: z.string().email('Enter a valid email'),
	password: z.string().min(8, 'Use at least 8 characters')
});

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
