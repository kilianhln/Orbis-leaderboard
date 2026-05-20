<script lang="ts">
	import SingleLeaderboard from '$lib/SingleLeaderboard.svelte';
	import { getIndividualLeaderboard } from '$lib/leaderboards';
	import type { Rider } from '$lib/sheets';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let riders = $derived<Rider[]>(data.riders);
	let individuals = $derived(getIndividualLeaderboard(riders, riders.length));
</script>

<SingleLeaderboard
	title="Individual"
	subtitle="Individual Leaderboard"
	{riders}
	dataError={data.dataError}
	{individuals}
/>
