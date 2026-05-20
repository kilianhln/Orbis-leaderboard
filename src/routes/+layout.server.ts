import { buildGoogleSheetCsvUrl, parseRidersCsv } from '$lib/sheets';
import { env } from '$env/dynamic/private';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch }) => {
	const csvUrl = env.GOOGLE_SHEET_CSV_URL || env.VITE_GOOGLE_SHEET_CSV_URL || getCsvUrlFromSheetId();

	if (!csvUrl) {
		return {
			riders: [],
			dataError:
				'Google Sheet is not configured. Set GOOGLE_SHEET_CSV_URL or GOOGLE_SHEET_ID in the environment.'
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
	const sheetId = env.GOOGLE_SHEET_ID || env.VITE_GOOGLE_SHEET_ID;

	if (!sheetId) {
		return '';
	}

	return buildGoogleSheetCsvUrl(sheetId, env.GOOGLE_SHEET_GID || env.VITE_GOOGLE_SHEET_GID || '0');
}
