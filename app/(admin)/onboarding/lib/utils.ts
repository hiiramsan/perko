import { SYSTEM_OPTIONS } from './constants';

export function buildSlug(value: string) {
	return value
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9\s-]/g, '')
		.trim()
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.slice(0, 40);
}

export function getOrderedSystems(ids: string[]) {
	return SYSTEM_OPTIONS.filter((option) => ids.includes(option.id));
}

export const getCardContrastColor = (hexColor: string) => {
	const normalized = hexColor.replace('#', '').trim();
	const expanded = normalized.length === 3 ? normalized.split('').map((character) => character + character).join('') : normalized;
	const parsed = Number.parseInt(expanded, 16);
	const red = (parsed >> 16) & 255;
	const green = (parsed >> 8) & 255;
	const blue = parsed & 255;
	const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
	return luminance > 0.62 ? '#0f172a' : '#f8fbfd';
};
