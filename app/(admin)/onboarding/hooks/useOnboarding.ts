import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { createBusinessAction } from '../lib/actions';
import { CARD_COLORS, SYSTEM_SELECTION_STAGE_INDEX } from '../lib/constants';
import { buildSlug, getOrderedSystems } from '../lib/utils';

export function useOnboarding() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [stageIndex, setStageIndex] = useState(0);
	const [businessName, setBusinessName] = useState('');
	const [slug, setSlug] = useState('');
	const [slugTouched, setSlugTouched] = useState(false);
	const [logoFile, setLogoFile] = useState<File | null>(null);
	const [logoPreview, setLogoPreview] = useState('');
	const [cardColor, setCardColor] = useState(CARD_COLORS[0].value);
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
			{ kind: 'color' as const },
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
			case 'color':
				return Boolean(cardColor);
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
	}, [businessName, cardColor, currentPhase, logoFile, pointsPerPeso, pesosPerPoint, rewardProduct, rewardVisits, selectedSystems, slug]);

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

	const goNext = async () => {
		if (!canContinue || loading) return;

		if (stageIndex === phases.length - 1) {
			setLoading(true);

			let uploadedLogoUrl = '';

			if (logoFile) {
				const supabase = createClient();
				const fileExt = logoFile.name.split('.').pop();
				const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
				const { data: uploadData, error: uploadError } = await supabase.storage
					.from('logos') 
					.upload(fileName, logoFile);

				if (uploadError) {
					console.error("Error al subir el logo:", uploadError);
					alert("Ocurrió un error al subir el logo. Por favor, intenta de nuevo.");
					setLoading(false);
					return;
				}

				const { data } = supabase.storage.from('logos').getPublicUrl(fileName);
				uploadedLogoUrl = data.publicUrl;
			}

			const result = await createBusinessAction({ 
				name: businessName, 
				slug: slug,
				logoUrl: uploadedLogoUrl || undefined,
				color: cardColor,
				selectedSystems: selectedSystems,
				rewardProduct: rewardProduct,
				rewardVisits: Number(rewardVisits) || 0,
				pointsPerPeso: Number(pointsPerPeso) || 0,
				pesosPerPoint: Number(pesosPerPoint) || 0
			});

			setLoading(false);

			if (result?.error) {
				alert(result.error);
				return;
			}

			if (result?.success) {
				router.push('/dashboard');
			}
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

	return {
		state: {
			loading,
			stageIndex,
			businessName,
			slug,
			logoFile,
			logoPreview,
			cardColor,
			selectedSystems,
			lockedSystems,
			rewardProduct,
			rewardVisits,
			pointsPerPeso,
			pesosPerPoint,
		},
		setters: {
			setBusinessName,
			setSlugTouched,
			setSlug,
			setCardColor,
			setRewardProduct,
			setRewardVisits,
			setPointsPerPeso,
			setPesosPerPoint,
		},
		handlers: {
			handleLogoChange,
			toggleSystem,
			goNext,
			goBack,
		},
		derived: {
			phases,
			currentPhase,
			progress,
			canContinue
		}
	};
}
