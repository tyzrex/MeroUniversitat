import type { FieldErrors } from 'react-hook-form';

/** Standard shape for server actions — easy to branch on in clients. */
export type ActionResult<T = void> =
	| { ok: true; data: T }
	| {
			ok: false;
			error: string;
			fieldErrors?: FieldErrors;
	  };
