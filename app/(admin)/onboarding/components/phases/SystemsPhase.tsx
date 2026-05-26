'use client';

import SystemSelectionCombobox from '../SystemSelectionCombobox';
import { SYSTEM_OPTIONS } from '../../lib/constants';

export function SystemsPhase({
	selectedSystems,
	toggleSystem,
}: {
	selectedSystems: string[];
	toggleSystem: (id: string) => void;
}) {
	return (
		<>
			<h1 className="mb-2 text-3xl font-semibold leading-tight text-[#0f172a] md:text-4xl">¿Qué sistema desea adoptar tu negocio?</h1>
			<p className="mb-8 text-sm text-[#0f172a]/60">
				Puedes elegir uno o varios sistemas. Cada uno abrirá su propia fase de configuración.
			</p>

			<SystemSelectionCombobox
				label="Sistemas para tus clientes"
				helperText="Abre el combobox, selecciona uno o varios sistemas y consulta el botón de acerca de para entender cada uno."
				options={SYSTEM_OPTIONS}
				selectedIds={selectedSystems}
				onToggle={toggleSystem}
			/>
		</>
	);
}
