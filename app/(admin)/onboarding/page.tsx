'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, BadgeCheck, Building2, ImageUp, Link2 } from 'lucide-react';

const TOTAL_STEPS = 3;

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

export default function OnboardingPage() {
	const [step, setStep] = useState(0);
	const [businessName, setBusinessName] = useState('');
	const [slug, setSlug] = useState('');
	const [slugTouched, setSlugTouched] = useState(false);
	const [logoFile, setLogoFile] = useState<File | null>(null);
	const [logoPreview, setLogoPreview] = useState('');

	useEffect(() => {
		if (!slugTouched) {
			setSlug(buildSlug(businessName));
		}
	}, [businessName, slugTouched]);

	const progress = useMemo(() => (step / TOTAL_STEPS) * 100, [step]);

	const canContinue = useMemo(() => {
		if (step === 0) return businessName.trim().length > 1;
		if (step === 1) return Boolean(logoFile);
		if (step === 2) return slug.trim().length > 1;
		return false;
	}, [businessName, logoFile, slug, step]);

	const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setLogoFile(file);
		setLogoPreview(URL.createObjectURL(file));
	};

	const goNext = () => {
		if (!canContinue) return;
		setStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
	};

	const goBack = () => {
		setStep((prev) => Math.max(prev - 1, 0));
	};

	return (
		<main className="relative min-h-screen w-full overflow-hidden bg-[#f7f8fa] p-4 md:p-8">
			<style>{`
				@keyframes borderPulse {
					0%, 100% {
						border-color: #d8e2ea;
						box-shadow: 0 0 0 0 rgba(90, 182, 217, 0);
					}
					50% {
						border-color: #57b6d9;
						box-shadow: 0 0 0 3px rgba(87, 182, 217, 0.1);
					}
				}
				.border-pulse {
					animation: borderPulse 3s ease-in-out infinite;
				}
				@keyframes checkmarkPulse {
					0% {
						transform: scale(0);
						opacity: 0;
					}
					10% {
						transform: scale(1);
						opacity: 1;
					}
					50% {
						transform: scale(1);
						opacity: 1;
					}
					90% {
						transform: scale(0);
						opacity: 0;
					}
					100% {
						transform: scale(0);
						opacity: 0;
					}
				}
				.checkmark-pulse {
					animation: checkmarkPulse 2s ease-in-out infinite;
				}
			`}</style>
			<div
				className="absolute inset-0 z-0"
				style={{
					background: '#ffffff',
					backgroundImage:
						'radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.28) 1px, transparent 0)',
					backgroundSize: '20px 20px',
				}}
			/>

			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -top-1/2 -left-1/4 h-130 w-130 rounded-full bg-[#d8e6df] blur-[130px]" />
				<div className="absolute -bottom-1/2 -right-1/4 h-110 w-110 rounded-full bg-[#e6ece9] blur-[120px]" />
			</div>

			<section className="relative z-10 mx-auto max-w-7xl rounded-2xl border border-[#d5dde4] bg-white shadow-[0_18px_40px_-25px_rgba(15,23,42,0.35)]">
				<div className="h-1.5 w-full rounded-t-2xl bg-[#e7edf2]">
					<div
						className="h-full rounded-tl-2xl bg-[#ef4f2f] transition-all duration-500"
						style={{ width: `${progress}%` }}
					/>
				</div>

				<div className="px-6 pb-8 pt-6 md:px-10 md:pb-12">
					<Link
						href="/"
						className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#4f6b83] transition hover:text-[#0f172a]"
					>
						<ArrowLeft size={16} /> Volver
					</Link>

					<div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
						<div className="max-w-xl">
							{step === 0 ? (
								<>
									<h1 className="mb-2 text-3xl font-semibold leading-tight text-[#0f172a] md:text-4xl">
										¿Cómo se llama tu negocio?
									</h1>
									<p className="mb-8 text-sm text-[#0f172a]/60">
										Lo usaremos para personalizar tu tarjeta y crear tu link.
									</p>

									<label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#334155]">
										Nombre del negocio
									</label>
									<div className="flex items-center gap-2 border-b-2 border-[#57b6d9] pb-2">
										<input
											value={businessName}
											onChange={(event) => setBusinessName(event.target.value)}
											placeholder="Ej. Matcha House"
											className="w-full bg-transparent text-lg text-[#0f172a] placeholder:text-[#9aa8b6] focus:outline-none"
										/>
									</div>
								</>
							) : null}

							{step === 1 ? (
								<>
									<h1 className="mb-2 text-3xl font-semibold leading-tight text-[#0f172a] md:text-4xl">
										Sube el logo de tu negocio
									</h1>
									<p className="mb-8 text-sm text-[#0f172a]/60">
										Tu logo aparecera en la tarjeta digital y en tu pagina de negocio.
									</p>

									<label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#334155]">
										Logo del negocio
									</label>
									<label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border-2 border-dashed border-[#c6d3de] bg-[#f8fbfd] p-5 transition hover:border-[#57b6d9]">
										<div className="flex items-center gap-3">
											<ImageUp size={22} className="text-[#57b6d9]" />
											<span className="text-sm font-semibold text-[#334155]">
												{logoFile ? logoFile.name : 'Seleccionar archivo'}
											</span>
										</div>
										<span className="rounded-md bg-[#0f172a] px-3 py-1.5 text-xs font-semibold uppercase text-white">
											Subir
										</span>
										<input
											type="file"
											accept="image/*"
											className="hidden"
											onChange={handleLogoChange}
										/>
									</label>

									{logoPreview ? (
										<div className="mt-5 flex items-center gap-4 rounded-xl border border-[#dbe4ec] bg-white p-3">
											<img
												src={logoPreview}
												alt="Preview del logo"
												className="h-14 w-14 rounded-lg border border-[#dbe4ec] object-cover"
											/>
											<p className="text-sm font-medium text-[#334155]">Vista previa cargada correctamente</p>
										</div>
									) : null}
								</>
							) : null}

							{step === 2 ? (
								<>
									<h1 className="mb-2 text-3xl font-semibold leading-tight text-[#0f172a] md:text-4xl">
										Define el link de tu negocio
									</h1>
									<p className="mb-8 text-sm text-[#0f172a]/60">
										Se autogenera segun tu nombre, pero puedes editar la parte final.
									</p>

									<label className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#334155]">
										Link publico
									</label>
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
							) : null}

							<div className="mt-10 flex flex-wrap items-center gap-3">
								<button
									type="button"
									onClick={goBack}
									disabled={step === 0}
									className="rounded-lg border border-[#c8d3de] bg-white px-6 py-2.5 text-sm font-semibold text-[#334155] transition disabled:cursor-not-allowed disabled:opacity-50"
								>
									Atras
								</button>

								<button
									type="button"
									onClick={goNext}
									disabled={!canContinue || step === TOTAL_STEPS - 1}
									className="rounded-lg bg-[#dfe8ef] px-8 py-2.5 text-sm font-semibold text-[#6b7d8d] transition enabled:bg-[#0f172a] enabled:text-white enabled:hover:bg-[#1e293b] disabled:cursor-not-allowed"
								>
									{step === TOTAL_STEPS - 1 ? 'Listo' : 'Siguiente'}
								</button>
							</div>
						</div>

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
								<p className="text-xs font-semibold uppercase tracking-wide text-[#64748b]">Vista rapida</p>
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
					</div>
				</div>
			</section>
		</main>
	);
}
