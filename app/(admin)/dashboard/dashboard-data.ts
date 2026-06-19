export type RecentScanRow = {
	transactionId: string;
	buyerName: string;
	dateTime: string;
	transaction: string;
	accentClass: string;
};

export const recentScanRows: RecentScanRow[] = [
	{ transactionId: 'TX-1048', buyerName: 'Ana G.', dateTime: '19 May, 10:42', transaction: 'Canjeó café y sumó 1 punto', accentClass: 'bg-[#2A9D8F]' },
	{ transactionId: 'TX-1047', buyerName: 'Pedro R.', dateTime: '19 May, 10:31', transaction: 'Escaneó el QR y registró visita', accentClass: 'bg-[#05668D]' },
	{ transactionId: 'TX-1046', buyerName: 'Sofía M.', dateTime: '19 May, 10:18', transaction: 'Canjeó un premio y cerró su tarjeta', accentClass: 'bg-[#ef4f2f]' },
	{ transactionId: 'TX-1045', buyerName: 'Carlos L.', dateTime: '19 May, 10:04', transaction: 'Sumó 1 punto por compra', accentClass: 'bg-[#7b4aa2]' },
];
