/** Parse `yyyy-mm-dd` as UTC noon to reduce timezone off-by-one issues. */
export function parseDateOnlyInput(value: string | undefined): Date | null {
	if (!value?.trim()) return null;
	const s = value.trim();
	if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
	const d = new Date(`${s}T12:00:00.000Z`);
	return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDateOnlyIso(iso: Date | string): string {
	const d = typeof iso === 'string' ? new Date(iso) : iso;
	if (Number.isNaN(d.getTime())) return '';
	return d.toISOString().slice(0, 10);
}
