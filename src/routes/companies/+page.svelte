<script lang="ts">
	import SingleLeaderboard from '$lib/SingleLeaderboard.svelte';
	import { getCompanyLeaderboard } from '$lib/leaderboards';
	import type { Rider } from '$lib/sheets';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let riders = $derived<Rider[]>(data.riders);
	let companies = $derived(getCompanyLeaderboard(riders, riders.length));
</script>

<SingleLeaderboard
	title="Company"
	subtitle="Company Leaderboard"
	{riders}
	dataError={data.dataError}
	{companies}
/>
