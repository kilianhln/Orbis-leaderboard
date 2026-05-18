import { buildGoogleSheetCsvUrl, parseRidersCsv } from '$lib/sheets';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const csvUrl = import.meta.env.VITE_GOOGLE_SHEET_CSV_URL || getCsvUrlFromSheetId();

	if (!csvUrl) {
		return {
				riders: [],
				dataError:
					'Google Sheet is not configured. Set VITE_GOOGLE_SHEET_CSV_URL or VITE_GOOGLE_SHEET_ID in the environment.'
			};
	}

	try {
		const response = await fetch(csvUrl);

		if (!response.ok) {
			throw new Error(`Google Sheet responded with ${response.status}`);
		}

		return {
			riders: parseRidersCsv(await response.text()),
			dataError: ''
		};
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unable to load Google Sheet.';

		return {
			riders: [],
			dataError: message
		};
	}
};

function getCsvUrlFromSheetId() {
	if (!import.meta.env.VITE_GOOGLE_SHEET_ID) {
		return '';
	}

	return buildGoogleSheetCsvUrl(
		import.meta.env.VITE_GOOGLE_SHEET_ID,
		import.meta.env.VITE_GOOGLE_SHEET_GID || '0'
	);
}
