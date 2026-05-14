'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, BadgeCheck, Building2, ImageUp, Link2 } from 'lucide-react';
import OnboardingStyles from './components/OnboardingStyles';
import StampPreviewCard from './components/StampPreviewCard';
import SystemSelectionCombobox, { type SystemOption } from './components/SystemSelectionCombobox';

const SYSTEM_OPTIONS: SystemOption[] = [
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

const LINK_STAGE_INDEX = 2;
const SYSTEM_SELECTION_STAGE_INDEX = 3;

function buildSlug(value: string) {
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

function getOrderedSystems(ids: string[]) {
	return SYSTEM_OPTIONS.filter((option) => ids.includes(option.id));
}

export default function OnboardingPage() {
	const router = useRouter();
	const [stageIndex, setStageIndex] = useState(0);
	const [businessName, setBusinessName] = useState('');
	const [slug, setSlug] = useState('');
	const [slugTouched, setSlugTouched] = useState(false);
	const [logoFile, setLogoFile] = useState<File | null>(null);
	const [logoPreview, setLogoPreview] = useState('');
	const [selectedSystems, setSelectedSystems] = useState<string[]>([]);
	const [lockedSystems, setLockedSystems] = useState<string[]>([]);
	const [rewardProduct, setRewardProduct] = useState('');
	const [rewardVisits, setRewardVisits] = useState('10');
	const [pointsPerPeso, setPointsPerPeso] = useState('5');
	const [pesosPerPoint, setPesosPerPoint] = useState('0.10');

	useEffect(() => {
		if (!slugTouched) {
			setSlug(buildSlug(businessName));
		}
	}, [businessName, slugTouched]);

	useEffect(() => {
		return () => {
			if (logoPreview.startsWith('blob:')) {
				URL.revokeObjectURL(logoPreview);
			}
		};
	}, [logoPreview]);

	const activeSystems = stageIndex > SYSTEM_SELECTION_STAGE_INDEX ? getOrderedSystems(lockedSystems) : getOrderedSystems(selectedSystems);

	const phases = useMemo(() => {
		return [
			{ kind: 'business' as const },
			{ kind: 'logo' as const },
			{ kind: 'link' as const },
			{ kind: 'systems' as const },
			...activeSystems.map((system) => ({ kind: 'system' as const, system })),
		];
	}, [activeSystems]);

	const currentPhase = phases[Math.min(stageIndex, phases.length - 1)];
	const progress = useMemo(() => {
		if (phases.length <= 1) return 0;
		return (stageIndex / (phases.length - 1)) * 100;
	}, [phases.length, stageIndex]);

	const canContinue = useMemo(() => {
		if (!currentPhase) return false;

		switch (currentPhase.kind) {
			case 'business':
				return businessName.trim().length > 1;
			case 'logo':
				return Boolean(logoFile);
			case 'link':
				return slug.trim().length > 1;
			case 'systems':
				return selectedSystems.length > 0;
			case 'system':
				switch (currentPhase.system.id) {
					case 'rewards':
						return rewardProduct.trim().length > 1 && Number(rewardVisits) > 0;
					case 'points':
						return Number(pointsPerPeso) > 0 && Number(pesosPerPoint) > 0;
					default:
						return true;
				}
			default:
				return false;
		}
	}, [businessName, currentPhase, logoFile, pointsPerPeso, pesosPerPoint, rewardProduct, rewardVisits, selectedSystems, slug]);

	const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setLogoFile(file);
		setLogoPreview(URL.createObjectURL(file));
	};

	const toggleSystem = (id: string) => {
		setSelectedSystems((current) =>
			current.includes(id) ? current.filter((systemId) => systemId !== id) : [...current, id],
		);
	};

	const goNext = () => {
		if (!canContinue) return;

		if (stageIndex === phases.length - 1) {
			router.push('/dashboard');
			return;
		}

		if (currentPhase?.kind === 'systems') {
			setLockedSystems(getOrderedSystems(selectedSystems).map((system) => system.id));
		}

		setStageIndex((prev) => Math.min(prev + 1, phases.length - 1));
	};

	const goBack = () => {
		setStageIndex((prev) => Math.max(prev - 1, 0));
	};

	const renderMainContent = () => {
		if (!currentPhase) return null;

		switch (currentPhase.kind) {
			case 'business':
				return (
					<>
						<h1 className="mb-2 text-3xl font-semibold leading-tight text-[#0f172a] md:text-4xl">
							¿Cómo se llama tu negocio?
						</h1>
						<p className="mb-8 text-sm text-[#0f172a]/60">Lo usaremos para personalizar tu tarjeta y crear tu link.</p>

						<label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#334155]">Nombre del negocio</label>
						<div className="flex items-center gap-2 border-b-2 border-[#57b6d9] pb-2">
							<input
								value={businessName}
								onChange={(event) => setBusinessName(event.target.value)}
								placeholder="Ej. Matcha House"
								className="w-full bg-transparent text-lg text-[#0f172a] placeholder:text-[#9aa8b6] focus:outline-none"
							/>
						</div>
					</>
				);
			case 'logo':
				return (
					<>
						<h1 className="mb-2 text-3xl font-semibold leading-tight text-[#0f172a] md:text-4xl">Sube el logo de tu negocio</h1>
						<p className="mb-8 text-sm text-[#0f172a]/60">Tu logo aparecerá en la tarjeta digital y en tu página de negocio.</p>

						<label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#334155]">Logo del negocio</label>
						<label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border-2 border-dashed border-[#c6d3de] bg-[#f8fbfd] p-5 transition hover:border-[#57b6d9]">
							<div className="flex items-center gap-3">
								<ImageUp size={22} className="text-[#57b6d9]" />
								<span className="text-sm font-semibold text-[#334155]">{logoFile ? logoFile.name : 'Seleccionar archivo'}</span>
							</div>
							<span className="rounded-md bg-[#0f172a] px-3 py-1.5 text-xs font-semibold uppercase text-white">Subir</span>
							<input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
						</label>

						{logoPreview ? (
							<div className="mt-5 flex items-center gap-4 rounded-xl border border-[#dbe4ec] bg-white p-3">
								<img src={logoPreview} alt="Preview del logo" className="h-14 w-14 rounded-lg border border-[#dbe4ec] object-cover" />
								<p className="text-sm font-medium text-[#334155]">Vista previa cargada correctamente</p>
							</div>
						) : null}
					</>
				);
			case 'link':
				return (
					<>
						<h1 className="mb-2 text-3xl font-semibold leading-tight text-[#0f172a] md:text-4xl">Define el link de tu negocio</h1>
						<p className="mb-8 text-sm text-[#0f172a]/60">Se autogenera según tu nombre, pero puedes editar la parte final.</p>

						<label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#334155]">Link público</label>
						<div className="flex items-center gap-2 border-b-2 border-[#57b6d9] pb-2">
							<Link2 size={18} className="text-[#57b6d9]" />
							<span className="text-[#64748b]">perko.com/</span>
							<input
								value={slug}
								onChange={(event) => {
									setSlugTouched(true);
									setSlug(buildSlug(event.target.value));
								}}
								placeholder="tu-negocio"
								className="w-full bg-transparent text-lg text-[#0f172a] placeholder:text-[#9aa8b6] focus:outline-none"
							/>
						</div>
						<p className="mt-3 text-xs text-[#64748b]">
							Link final: <span className="font-semibold text-[#0f172a]">perko.com/{slug || 'tu-negocio'}</span>
						</p>
					</>
				);
			case 'systems':
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
			case 'system': {
				if (currentPhase.kind !== 'system') return null;
				switch (currentPhase.system.id) {
					case 'rewards':
						return (
							<>
								<h1 className="mb-2 text-3xl font-semibold leading-tight text-[#0f172a] md:text-4xl">Configura la recompensa por visitas</h1>
								<p className="mb-8 text-sm text-[#0f172a]/60">El cliente obtiene un producto gratis cuando completa las visitas o compras necesarias.</p>

								<div className="space-y-6">
									<div className="space-y-2">
										<label className="block text-xs font-bold uppercase tracking-wide text-[#334155]">Producto gratis</label>
										<input
											value={rewardProduct}
											onChange={(event) => setRewardProduct(event.target.value)}
											placeholder="Ej. café chico gratis"
											className="w-full rounded-2xl border border-[#dbe4ec] bg-white px-4 py-3 text-[#0f172a] placeholder:text-[#9aa8b6] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]"
										/>
									</div>

									<div className="space-y-2">
										<label className="block text-xs font-bold uppercase tracking-wide text-[#334155]">Visitas necesarias</label>
										<input
											type="number"
											min="1"
											value={rewardVisits}
											onChange={(event) => setRewardVisits(event.target.value)}
											className="w-full rounded-2xl border border-[#dbe4ec] bg-white px-4 py-3 text-[#0f172a] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]"
										/>
									</div>
								</div>
							</>
						);
					case 'points':
						return (
							<>
								<h1 className="mb-2 text-3xl font-semibold leading-tight text-[#0f172a] md:text-4xl">Configura los puntos por compra</h1>
								<p className="mb-8 text-sm text-[#0f172a]/60">Por cada compra se ganan puntos. Aquí defines la conversión entre peso y puntos.</p>

								<div className="space-y-6">
									<div className="space-y-2">
										<label className="block text-xs font-bold uppercase tracking-wide text-[#334155]">¿Cada cuántos pesos se gana un punto?</label>
										<input
											type="number"
											min="1"
											value={pointsPerPeso}
											onChange={(event) => setPointsPerPeso(event.target.value)}
											className="w-full rounded-2xl border border-[#dbe4ec] bg-white px-4 py-3 text-[#0f172a] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]"
										/>
									</div>

									<div className="space-y-2">
										<label className="block text-xs font-bold uppercase tracking-wide text-[#334155]">¿Cuánto vale 1 punto al momento de pagar?</label>
										<input
											type="number"
											min="1"
											value={pesosPerPoint}
											onChange={(event) => setPesosPerPoint(event.target.value)}
											className="w-full rounded-2xl border border-[#dbe4ec] bg-white px-4 py-3 text-[#0f172a] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]"
										/>
									</div>
								</div>
							</>
						);
					default:
						return (
							<>
								<h1 className="mb-2 text-3xl font-semibold leading-tight text-[#0f172a] md:text-4xl">{currentPhase.system.label}</h1>
								<p className="mb-8 text-sm text-[#0f172a]/60">{currentPhase.system.details}</p>

								<div className="rounded-2xl border border-[#dbe4ec] bg-[#f8fbfd] p-5">
									<p className="text-sm font-semibold text-[#0f172a]">Próximamente</p>
									<p className="mt-2 text-sm text-[#475569]">
										Esta fase queda preparada para configuración futura, pero todavía no tiene controles activos.
									</p>
								</div>
							</>
						);
				}
			}
			default:
				return null;
		}
	};

	return (
		<main className="relative min-h-screen w-full overflow-hidden bg-[#f7f8fa] p-4 md:p-8">
			<div
				className="absolute inset-0 z-0"
				style={{
					background: '#ffffff',
					backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.28) 1px, transparent 0)',
					backgroundSize: '20px 20px',
				}}
			/>

			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -top-1/2 -left-1/4 h-130 w-130 rounded-full bg-[#d8e6df] blur-[130px]" />
				<div className="absolute -bottom-1/2 -right-1/4 h-110 w-110 rounded-full bg-[#e6ece9] blur-[120px]" />
			</div>

			<section className="relative z-10 mx-auto max-w-7xl rounded-2xl border border-[#d5dde4] bg-white shadow-[0_18px_40px_-25px_rgba(15,23,42,0.35)]">
				<div className="h-1.5 w-full rounded-t-2xl bg-[#e7edf2]">
					<div className="h-full rounded-tl-2xl bg-[#ef4f2f] transition-all duration-500" style={{ width: `${progress}%` }} />
				</div>

				<div className="px-6 pb-8 pt-6 md:px-10 md:pb-12">
					<Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#4f6b83] transition hover:text-[#0f172a]">
						<ArrowLeft size={16} /> Volver
					</Link>

					<div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
						<div className="max-w-xl">
							<OnboardingStyles />
							{renderMainContent()}

							<div className="mt-10 flex flex-wrap items-center gap-3">
								<button
									type="button"
									onClick={goBack}
									disabled={stageIndex === 0}
									className="rounded-lg border border-[#c8d3de] bg-white px-6 py-2.5 text-sm font-semibold text-[#334155] transition disabled:cursor-not-allowed disabled:opacity-50"
								>
									Atras
								</button>

								<button
									type="button"
									onClick={goNext}
									disabled={!canContinue}
									className="rounded-lg bg-[#dfe8ef] px-8 py-2.5 text-sm font-semibold text-[#6b7d8d] transition enabled:bg-[#0f172a] enabled:text-white enabled:hover:bg-[#1e293b] disabled:cursor-not-allowed"
								>
									{stageIndex === phases.length - 1 ? 'Listo' : 'Siguiente'}
								</button>
							</div>
						</div>

						<div className="lg:pt-1 flex flex-col items-center justify-center h-full">
							{stageIndex > LINK_STAGE_INDEX ? (
								<div className="flex flex-col items-center gap-3">
									<div className="h-44 w-64 sm:h-50 sm:w-72 stamp-bounce">
										<StampPreviewCard businessName={businessName} logoPreview={logoPreview} />
									</div>
									<div className="h-3 w-48 bg-black rounded-full shadow-pulse opacity-30 blur-xl"></div>
								</div>
							) : (
								<aside className="rounded-2xl border border-[#d8e2ea] bg-[#f9fcfb] p-6 border-pulse">
									<div className="mb-5 flex items-center justify-center">
										<div className="h-20 w-20 rounded-full border-4 border-[#8bb277] bg-[#425E31] p-1 shadow-[0_8px_24px_-12px_rgba(16,40,16,0.5)]">
											<div className="flex h-full w-full items-center justify-center rounded-full bg-[#4f7a35]">
												<div className="checkmark-pulse">
														<BadgeCheck color="#d6f5cc" size={34} />
												</div>
											</div>
										</div>
									</div>

									<h2 className="text-center text-xl font-bold text-[#0f172a]">Perko te ayuda a convertir mas</h2>
									<p className="mx-auto mt-3 max-w-sm text-center text-sm leading-relaxed text-[#475569]">
										Mientras completas estos datos, nosotros preparamos tu tarjeta digital para que puedas empezar
										a atraer y fidelizar clientes en minutos.
									</p>

									<div className="mt-6 rounded-xl bg-white p-4 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.55)]">
										<p className="text-xs font-semibold uppercase tracking-wide text-[#64748b]">Vista rápida</p>
										<div className="mt-3 flex items-center gap-3">
											<div className="h-10 w-10 overflow-hidden rounded-full border border-[#dbe4ec] bg-[#eef2f1]">
												{logoPreview ? (
													<img src={logoPreview} alt="Logo negocio" className="h-full w-full object-cover" />
												) : (
													<div className="flex h-full w-full items-center justify-center bg-linear-to-br from-[#4f7a35] to-[#2f6a4f]">
														<Building2 size={18} color="#e7f6e1" />
													</div>
												)}
											</div>
											<div>
												<p className="text-sm font-semibold text-[#0f172a]">{businessName || 'Tu negocio'}</p>
												<p className="text-xs text-[#64748b]">perko.com/{slug || 'tu-negocio'}</p>
											</div>
										</div>
									</div>
								</aside>
							)}
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
