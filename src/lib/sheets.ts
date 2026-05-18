export type Rider = {
	name: string;
	team: string;
	kmCycled: number;
	totalTime: string;
};

type SheetRow = Record<string, string>;

const headerAliases = {
	name: ['driver', 'name', 'rider', 'participant'],
	team: ['company', 'team', 'organisation', 'organization'],
	distance: ['meter', 'meters', 'metre', 'metres', 'km', 'kilometers', 'kilometres', 'distance'],
	time: ['time', 'total time', 'totaltime', 'duration']
};

export function buildGoogleSheetCsvUrl(sheetId: string, gid = '0') {
	return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
}

export function parseRidersCsv(csv: string): Rider[] {
	const [rawHeaders, ...records] = parseCsv(csv);

	if (!rawHeaders?.length) {
		return [];
	}

	const headers = rawHeaders.map(normalizeHeader);
	const nameColumn = findColumn(headers, headerAliases.name);
	const teamColumn = findColumn(headers, headerAliases.team);
	const distanceColumn = findColumn(headers, headerAliases.distance);
	const timeColumn = findColumn(headers, headerAliases.time);

	if (nameColumn === -1 || teamColumn === -1 || distanceColumn === -1) {
		throw new Error('Sheet must include driver/name, company/team, and meter/km columns.');
	}

	return records
		.map((record) => rowToObject(headers, record))
		.map((row) => {
			const distanceHeader = headers[distanceColumn] ?? '';
			const distance = parseDistanceToKm(row[distanceHeader] ?? '', distanceHeader);

			return {
				name: row[headers[nameColumn] ?? '']?.trim() ?? '',
				team: row[headers[teamColumn] ?? '']?.trim() ?? '',
				kmCycled: distance,
				totalTime: row[headers[timeColumn] ?? '']?.trim() ?? ''
			};
		})
		.filter((rider) => rider.name && rider.team && Number.isFinite(rider.kmCycled));
}

function parseCsv(csv: string): string[][] {
	const rows: string[][] = [];
	let row: string[] = [];
	let value = '';
	let inQuotes = false;

	for (let index = 0; index < csv.length; index += 1) {
		const char = csv[index];
		const nextChar = csv[index + 1];

		if (char === '"' && inQuotes && nextChar === '"') {
			value += '"';
			index += 1;
			continue;
		}

		if (char === '"') {
			inQuotes = !inQuotes;
			continue;
		}

		if (char === ',' && !inQuotes) {
			row.push(value);
			value = '';
			continue;
		}

		if ((char === '\n' || char === '\r') && !inQuotes) {
			if (char === '\r' && nextChar === '\n') {
				index += 1;
			}

			row.push(value);
			if (row.some((cell) => cell.trim() !== '')) {
				rows.push(row);
			}
			row = [];
			value = '';
			continue;
		}

		value += char;
	}

	row.push(value);
	if (row.some((cell) => cell.trim() !== '')) {
		rows.push(row);
	}

	return rows;
}

function rowToObject(headers: string[], record: string[]): SheetRow {
	return headers.reduce<SheetRow>((row, header, index) => {
		row[header] = record[index] ?? '';
		return row;
	}, {});
}

function findColumn(headers: string[], aliases: string[]) {
	return headers.findIndex((header) => aliases.includes(header));
}

function normalizeHeader(header: string) {
	return header.trim().toLowerCase().replace(/\s+/g, ' ');
}

function parseDistanceToKm(value: string, header: string) {
	const distance = Number(value.trim().replace(/\s/g, '').replace(',', '.'));

	if (!Number.isFinite(distance)) {
		return Number.NaN;
	}

	if (header.includes('km') || header.includes('kilometer') || header.includes('kilometre')) {
		return distance;
	}

	return distance / 1000;
}
