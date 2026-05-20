import type { Rider } from '$lib/sheets';

export type Company = {
	name: string;
	totalKm: number;
	riders: number;
	averageKm: number;
};

export function getIndividualLeaderboard(riders: Rider[], limit = 10) {
	return [...riders]
		.sort((a, b) => b.kmCycled - a.kmCycled || a.totalTime.localeCompare(b.totalTime))
		.slice(0, limit);
}

export function getCompanyLeaderboard(riders: Rider[], limit = 10) {
	return [
		...riders
			.reduce((companies, rider) => {
				const current = companies.get(rider.team) ?? {
					name: rider.team,
					totalKm: 0,
					riders: 0,
					averageKm: 0
				};

				current.totalKm += rider.kmCycled;
				current.riders += 1;
				current.averageKm = current.totalKm / current.riders;
				companies.set(rider.team, current);

				return companies;
			}, new Map<string, Company>())
			.values()
	]
		.sort((a, b) => b.averageKm - a.averageKm || a.name.localeCompare(b.name))
		.slice(0, limit);
}

export function formatMeters(km: number) {
	return Math.round(km * 1000).toLocaleString();
}
