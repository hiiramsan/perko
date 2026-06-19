'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { ArrowLeft, BadgeCheck } from 'lucide-react';
import OnboardingStyles from './components/OnboardingStyles';
import StampPreviewCard from '@/components/StampPreviewCard';
import { useOnboarding } from '@/hooks/useOnboarding';
import { getCardContrastColor } from './lib/utils';
import { COLOR_STAGE_INDEX } from './lib/constants';
import {
	BusinessPhase,
	LogoPhase,
	LinkPhase,
	ColorPhase,
	SystemsPhase,
	RewardsPhase,
	PointsPhase,
	ComingSoonPhase,
} from './components/phases';

interface OnboardingPageProps {
  initialStep?: number;
}

function OnboardingPageContent({ initialStep = 1 }: OnboardingPageProps) {
	const searchParams = useSearchParams();
	const stepParam = searchParams.get('step');
	const parsedStep = stepParam ? Number(stepParam) : Number.NaN;
	const effectiveStep = Number.isFinite(parsedStep) && parsedStep > 0 ? parsedStep : initialStep;
	const { state, setters, handlers, derived } = useOnboarding(effectiveStep);
	const {
		loading,
		stageIndex,
		businessName,
		slug,
		logoFile,
		logoPreview,
		cardColor,
		selectedSystems,
		rewardProduct,
		rewardVisits,
		pesosForPoint,
		pointToPesos,
	} = state;
	const {
		setBusinessName,
		setSlugTouched,
		setSlug,
		setCardColor,
		setRewardProduct,
		setRewardVisits,
		setPointsPerPeso,
		setPesosPerPoint,
	} = setters;
	const { handleLogoChange, toggleSystem, goNext, goBack } = handlers;
	const { phases, currentPhase, progress, canContinue } = derived;

	const renderMainContent = () => {
		if (!currentPhase) return null;

		switch (currentPhase.kind) {
			case 'business':
				return <BusinessPhase businessName={businessName} setBusinessName={setBusinessName} />;
			case 'logo':
				return <LogoPhase logoFile={logoFile} logoPreview={logoPreview} handleLogoChange={handleLogoChange} />;
			case 'link':
				return <LinkPhase slug={slug} setSlug={setSlug} setSlugTouched={setSlugTouched} />;
			case 'color':
				return <ColorPhase cardColor={cardColor} setCardColor={setCardColor} />;
			case 'systems':
				return <SystemsPhase selectedSystems={selectedSystems} toggleSystem={toggleSystem} />;
			case 'system': {
				if (currentPhase.kind !== 'system') return null;
				switch (currentPhase.system.id) {
					case 'rewards':
						return (
							<RewardsPhase
								rewardProduct={rewardProduct}
								setRewardProduct={setRewardProduct}
								rewardVisits={rewardVisits}
								setRewardVisits={setRewardVisits}
							/>
						);
					case 'points':
						return (
							<PointsPhase
								pesosForPoint={pesosForPoint}
								setPointsPerPeso={setPointsPerPeso}
								pointToPesos={pointToPesos}
								setPesosPerPoint={setPesosPerPoint}
							/>
						);
					default:
						return <ComingSoonPhase system={currentPhase.system} />;
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

			<section className="relative z-10 mx-auto max-w-7xl overflow-hidden rounded-2xl border border-[#d5dde4] bg-white shadow-[0_18px_40px_-25px_rgba(15,23,42,0.35)]">
				<div className="h-1.5 w-full bg-[#e7edf2]">
					<div className="h-full bg-[#05668D] transition-all duration-500" style={{ width: `${progress}%` }} />
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
									className="rounded-lg border border-[#c8d3de] bg-white px-6 py-2.5 text-sm font-semibold text-[#334155] transition disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
								>
									Atras
								</button>

								<button
									type="button"
									onClick={goNext}
									disabled={!canContinue || loading}
									className="rounded-lg bg-[#dfe8ef] px-8 py-2.5 text-sm font-semibold text-[#6b7d8d] transition enabled:bg-[#0f172a] enabled:text-white enabled:hover:bg-[#1e293b] disabled:cursor-not-allowed cursor-pointer"
								>
									{loading ? 'Creando...' : (stageIndex === phases.length - 1 ? 'Listo' : 'Siguiente')}
								</button>
							</div>
						</div>

						<div className="lg:pt-1 flex flex-col items-center justify-center h-full">
							{stageIndex <= COLOR_STAGE_INDEX ? (
								<div className="flex flex-col items-center gap-3">
									<div className="h-52 w-72 sm:h-56 sm:w-80 stamp-bounce">
										<StampPreviewCard businessName={businessName} logoPreview={logoPreview} cardColor={cardColor} />
									</div>
									<div className="h-3 w-48 bg-black rounded-full shadow-pulse opacity-30 blur-xl"></div>
								</div>
							) : (
								<aside className="rounded-2xl border border-[#d8e2ea] bg-[#f9fcfb] p-6 border-pulse">
									<div className="mb-5 flex items-center justify-center">
										<div className="h-20 w-20 rounded-full border-4 p-1 shadow-[0_8px_24px_-12px_rgba(16,40,16,0.5)]" style={{ backgroundColor: cardColor, borderColor: cardColor }}>
											<div className="flex h-full w-full items-center justify-center rounded-full" style={{ backgroundColor: cardColor }}>
												<div className="checkmark-pulse">
													<BadgeCheck color={getCardContrastColor(cardColor)} size={38} strokeWidth={2.7} />
												</div>
											</div>
										</div>
									</div>

									<h2 className="text-center text-xl font-bold text-[#0f172a]">Prepara tu programa antes de publicarlo</h2>
									<p className="mx-auto mt-3 max-w-sm text-center text-sm leading-relaxed text-[#475569]">
										Aquí terminas de definir cómo funcionará tu tarjeta. El diseño ya está listo; ahora vamos con la lógica de recompensas.
									</p>
								</aside>
							)}
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}

export default function OnboardingPage(props: OnboardingPageProps) {
	return (
		<Suspense fallback={<div className="flex min-h-screen items-center justify-center text-[#4f6b83]">Cargando...</div>}>
			<OnboardingPageContent {...props} />
		</Suspense>
	);
}