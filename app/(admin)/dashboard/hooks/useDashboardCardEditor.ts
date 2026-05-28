'use client';

import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getDashboardBusiness, updateBusinessCardProps } from '../actions';

export function useDashboardCardEditor() {
	const [businessId, setBusinessId] = useState<string | null>(null);
	const [businessName, setBusinessName] = useState('Tu negocio');
	const [logoPreview, setLogoPreview] = useState('');
	const [tempLogoPreview, setTempLogoPreview] = useState('');
	const [logoFile, setLogoFile] = useState<File | null>(null);
	const [cardColor, setCardColor] = useState('#4f7a35');
	const [tempColor, setTempColor] = useState('#4f7a35');
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		getDashboardBusiness().then((business) => {
			if (!business) return;

			setBusinessId(business.id);
			setBusinessName(business.name || 'Tu negocio');

			if (business.logo_url) {
				setLogoPreview(business.logo_url);
				setTempLogoPreview(business.logo_url);
			}

			if (business.color) {
				setCardColor(business.color);
				setTempColor(business.color);
			}
		});
	}, []);

	useEffect(() => {
		return () => {
			if (tempLogoPreview.startsWith('blob:')) {
				URL.revokeObjectURL(tempLogoPreview);
			}
		};
	}, [tempLogoPreview]);

	const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setLogoFile(file);
		setTempLogoPreview(URL.createObjectURL(file));
	};

	const handleSaveCard = async () => {
		if (!businessId) return false;

		setIsSaving(true);
		let uploadedLogoUrl = tempLogoPreview;

		if (logoFile) {
			const supabase = createClient();
			const fileExt = logoFile.name.split('.').pop() || 'png';
			const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

			const { error: uploadError } = await supabase.storage.from('logos').upload(fileName, logoFile);

			if (uploadError) {
				console.error('Error al subir el logo:', uploadError);
				alert('Ocurrió un error al subir el nuevo logo. Intenta nuevamente.');
				setIsSaving(false);
				return false;
			}

			const { data } = supabase.storage.from('logos').getPublicUrl(fileName);
			uploadedLogoUrl = data.publicUrl;
		}

		const result = await updateBusinessCardProps(businessId, tempColor, logoFile ? uploadedLogoUrl : undefined);

		if (result.success) {
			setCardColor(tempColor);
			setLogoPreview(uploadedLogoUrl);
			setTempLogoPreview(uploadedLogoUrl);
			setLogoFile(null);
			setIsSaving(false);
			return true;
		}

		setTempColor(cardColor);
		setTempLogoPreview(logoPreview);
		setIsSaving(false);
		return false;
	};

	const resetCardDraft = () => {
		setTempColor(cardColor);
		setTempLogoPreview(logoPreview);
		setLogoFile(null);
	};

	return {
		businessName,
		logoPreview,
		cardColor,
		tempColor,
		tempLogoPreview,
		isSaving,
		setTempColor,
		handleLogoChange,
		handleSaveCard,
		resetCardDraft,
	};
}