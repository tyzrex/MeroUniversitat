const tones = [
	{ chip: 'bg-blue-600 text-white' },
	{ chip: 'bg-slate-800 text-white' },
	{ chip: 'bg-teal-600 text-white' },
	{ chip: 'bg-indigo-600 text-white' },
	{ chip: 'bg-rose-600 text-white' },
	{ chip: 'bg-amber-600 text-white' },
	{ chip: 'bg-violet-600 text-white' }
] as const;

function hashSeed(s: string) {
	let h = 0;
	for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
	return h;
}

/** Up to 3-letter initials from a university display name (e.g. “TU Munich” → “TUM”). */
export function universityInitialsFromName(name: string): string {
	const cleaned = name.trim();
	if (!cleaned) return '?';

	const words = cleaned.split(/\s+/).filter(Boolean);
	if (words.length >= 3) {
		return words
			.slice(0, 3)
			.map((w) => w.charAt(0))
			.join('')
			.toUpperCase()
			.slice(0, 3);
	}

	if (words.length === 2) {
		const [a, b] = words;
		const left = (a.charAt(0) + (a.charAt(1) ?? '')).toUpperCase();
		const right = b.charAt(0).toUpperCase();
		return (left + right).slice(0, 3);
	}

	const w = words[0] ?? cleaned;
	return w.slice(0, 3).toUpperCase();
}

export function universityInitialChipClass(seed: string): string {
	const tone = tones[hashSeed(seed) % tones.length];
	return tone.chip;
}
