'use client';

import type { ChangeEvent } from 'react';
import { Activity } from 'lucide-react';
import StampPreviewCard from '@/app/(admin)/onboarding/components/StampPreviewCard';
import { DashboardCardModal } from './DashboardCardModal';

type DashboardCardEditorModalProps = {
	open: boolean;
	onClose: () => void;
	businessName: string;
	tempColor: string;
	tempLogoPreview: string;
	isSaving: boolean;
	onColorChange: (color: string) => void;
	onLogoChange: (event: ChangeEvent<HTMLInputElement>) => void;
	onSave: () => Promise<boolean>;
};

export function DashboardCardEditorModal({
	open,
	onClose,
	businessName,
	tempColor,
	tempLogoPreview,
	isSaving,
	onColorChange,
	onLogoChange,
	onSave,
}: DashboardCardEditorModalProps) {
	return (
		<DashboardCardModal open={open} onClose={onClose}>
			<div className="flex flex-col gap-8">
				<div className="flex flex-col gap-8 md:flex-row">
					<div className="flex flex-1 items-center justify-center lg:max-w-88">
						<div className="w-[320px]">
							<StampPreviewCard businessName={businessName} logoPreview={tempLogoPreview} cardColor={tempColor} />
						</div>
					</div>

					<div className="flex flex-1 flex-col gap-6 pt-2">
						<div>
							<h3 className="mb-3 text-sm font-semibold tracking-tight text-[#0f172a]">Color de la tarjeta</h3>
							<div className="flex flex-wrap gap-3">
								{['#4f7a35', '#0f172a', '#E76F51', '#2A9D8F', '#05668D', '#8b5cf6'].map((color) => (
									<button
										key={color}
										type="button"
										onClick={() => onColorChange(color)}
										className={`h-10 w-10 rounded-full border-2 transition-transform hover:scale-110 ${tempColor === color ? 'scale-110 border-[#0f172a] shadow-md' : 'border-transparent'}`}
										style={{ backgroundColor: color }}
										aria-label={`Seleccionar color ${color}`}
									/>
								))}
							</div>
						</div>

						<div>
							<h3 className="mb-3 text-sm font-semibold tracking-tight text-[#0f172a]">Logo del negocio</h3>
							<div className="flex items-center gap-4">
								{tempLogoPreview ? (
									<img src={tempLogoPreview} alt="Logo local" className="h-16 w-16 rounded-2xl border border-[#cfd9e3] object-cover" />
								) : (
									<div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-[#cfd9e3] bg-[#f8fbfd] text-[#94a3b8]">
										<Activity size={24} />
									</div>
								)}

								<div className="flex flex-col gap-2">
									<label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-[#dbe4ec] bg-[#f8fbfd] px-4 py-2.5 text-xs font-semibold text-[#0f172a] transition hover:border-[#94a3b8] hover:bg-white">
										Subir nueva imagen
										<input type="file" accept="image/*" className="hidden" onChange={onLogoChange} />
									</label>
									<p className="text-[10px] text-[#64748b]">Recomendado: PNG o JPG, min. 400x400px</p>
								</div>
							</div>
						</div>
					</div>
					</div>

				<div className="flex justify-end">
					<button
						type="button"
						disabled={isSaving}
						onClick={async () => {
							const saved = await onSave();
							if (saved) onClose();
						}}
						className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white transition ${isSaving ? 'bg-gray-400' : 'bg-[#0f172a] hover:bg-[#1e293b]'}`}
					>
						{isSaving ? 'Guardando...' : 'Guardar cambios'}
					</button>
				</div>
			</div>
		</DashboardCardModal>
	);
}
