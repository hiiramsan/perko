import type { SystemOption } from '../components/SystemSelectionCombobox';

export const CARD_COLORS = [
	{ id: 'forest', label: 'Bosque', value: '#4f7a35' },
	{ id: 'coral', label: 'Coral', value: '#ef4f2f' },
	{ id: 'amber', label: 'Ámbar', value: '#c58b00' },
	{ id: 'cobalt', label: 'Oceánico', value: '#05668D' },
	{ id: 'plum', label: 'Ciruela', value: '#7b4aa2' },
	{ id: 'rose', label: 'Rosado', value: '#c93d73' },
];

export const SYSTEM_OPTIONS: SystemOption[] = [
	{
		id: 'rewards',
		label: 'Recompensa por visitas',
		description: 'Ofrece un producto gratis cuando el cliente alcance la cantidad de visitas o compras que defina la empresa.',
		details:
			'La empresa elige el producto gratis y define cuántas visitas o compras se necesitan para ganarlo. Es ideal para empujar repetición de compra.',
	},
	{
		id: 'points',
		label: 'Puntos por compra',
		description: 'Acumula puntos por cada compra realizada para después convertirlos en beneficios o descuentos.',
		details:
			'La empresa decide cuántos puntos da por peso comprado y a cuántos pesos equivale cada punto. Así puede adaptar la regla a su negocio.',
	},
	{
		id: 'levels',
		label: 'Sistema de niveles',
		description: 'Permite subir de nivel según el comportamiento del cliente dentro del programa de fidelidad.',
		details: 'Próximamente. Esta fase todavía no está implementada, pero quedará lista para definir reglas de avance por nivel.',
		comingSoon: true,
	},
	{
		id: 'memberships',
		label: 'Membresías',
		description: 'Un plan de membresía con beneficios especiales para clientes frecuentes.',
		details: 'Próximamente. Esta fase todavía no está implementada, pero quedará lista para configurar planes y beneficios exclusivos.',
		comingSoon: true,
	},
];

export const LINK_STAGE_INDEX = 2;
export const COLOR_STAGE_INDEX = 3;
export const SYSTEM_SELECTION_STAGE_INDEX = 4;
