<svelte:head>
	<title>Cycle for Sight Challenge Leaderboard</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { Rider } from '$lib/sheets';
	import type { PageData } from './$types';

	type Company = {
		name: string;
		totalKm: number;
		riders: number;
		averageKm: number;
	};

	const eventName = 'Cycle for Sight Challenge';
	const refreshMs = 30_000;

	let { data }: { data: PageData } = $props();
	let riders = $derived<Rider[]>(data.riders);
	let dataError = $derived(data.dataError);
	let individualLeaderboard = $derived(
		[...riders]
			.sort((a, b) => b.kmCycled - a.kmCycled || a.totalTime.localeCompare(b.totalTime))
			.slice(0, 10)
	);
	let companyLeaderboard = $derived(
		[
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
			.slice(0, 10)
	);

	let bestCompanyAverageKm = $derived(companyLeaderboard[0]?.averageKm ?? 0);

	onMount(() => {
		const interval = window.setInterval(() => {
			void invalidateAll();
		}, refreshMs);

		return () => window.clearInterval(interval);
	});
</script>

<main class="screen">
	<header class="header">
		<div class="header-text">
			<p class="subtitle">Live Leaderboard</p>
			<h1>{eventName}</h1>
		</div>
		<img
			class="logo"
			src="/Orbis_Plane_Logo_Reversed_RGB.png"
			alt="Orbis logo"
		/>
	</header>

	<section class="cards">
		<div class="stat">
			<span>Current Company Leader</span>
			<strong>{companyLeaderboard[0]?.name ?? '—'}</strong>
		</div>
		<div class="stat">
			<span>Best Company Average</span>
			<strong>{Math.round(bestCompanyAverageKm * 1000).toLocaleString()} m</strong>
		</div>
		<div class="stat">
			<span>Total Riders</span>
			<strong>{riders.length}</strong>
		</div>
	</section>

	{#if dataError}
		<p class="data-status">{dataError}</p>
	{:else if riders.length === 0}
		<p class="data-status">No driver rows found in the configured Google Sheet.</p>
	{/if}

	<section class="content-grid">
		<section class="table-panel" aria-labelledby="company-leaderboard-title">
			<h2 id="company-leaderboard-title">Company</h2>
			<table>
				<thead>
					<tr>
						<th>Rank</th>
						<th>Company</th>
						<th class="riders">Riders</th>
						<th class="km">Average Meter</th>
					</tr>
				</thead>
				<tbody>
					{#each companyLeaderboard as company, index (company.name)}
						<tr class:winner={index === 0}>
							<td>{index + 1}</td>
							<td>{company.name}</td>
							<td class="riders">{company.riders}</td>
							<td class="km">{Math.round(company.averageKm * 1000).toLocaleString()}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</section>
		<section class="table-panel" aria-labelledby="individual-leaderboard-title">
			<h2 id="individual-leaderboard-title">Individual</h2>
			<table>
				<thead>
					<tr>
						<th>Rank</th>
						<th>Driver</th>
						<th>Company</th>
						<th class="km">Meter</th>
					</tr>
				</thead>
				<tbody>
					{#each individualLeaderboard as rider, index (rider.name)}
						<tr class:winner={index === 0}>
							<td>{index + 1}</td>
							<td>{rider.name}</td>
							<td>{rider.team}</td>
							<td class="km">{Math.round(rider.kmCycled * 1000).toLocaleString()}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</section>
	</section>

	<footer class="footer">
		<img
			class="logo logo-ishka"
			src="/Ishka-AirfinanceGlobal-logolockup-white.png"
			alt="Ishka Airfinance Global logo"
		/>
	</footer>

	<aside class="donate" aria-label="Donate now">
		<svg
			class="donate-qr"
			viewBox="0 0 21 21"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
		>
			<rect width="21" height="21" fill="#ffffff" />
			<!-- top-left finder -->
			<rect x="0" y="0" width="7" height="7" fill="#000" />
			<rect x="1" y="1" width="5" height="5" fill="#fff" />
			<rect x="2" y="2" width="3" height="3" fill="#000" />
			<!-- top-right finder -->
			<rect x="14" y="0" width="7" height="7" fill="#000" />
			<rect x="15" y="1" width="5" height="5" fill="#fff" />
			<rect x="16" y="2" width="3" height="3" fill="#000" />
			<!-- bottom-left finder -->
			<rect x="0" y="14" width="7" height="7" fill="#000" />
			<rect x="1" y="15" width="5" height="5" fill="#fff" />
			<rect x="2" y="16" width="3" height="3" fill="#000" />
			<!-- timing + data placeholder cells -->
			<g fill="#000">
				<rect x="8" y="6" width="1" height="1" />
				<rect x="10" y="6" width="1" height="1" />
				<rect x="12" y="6" width="1" height="1" />
				<rect x="6" y="8" width="1" height="1" />
				<rect x="6" y="10" width="1" height="1" />
				<rect x="6" y="12" width="1" height="1" />
				<rect x="9" y="8" width="2" height="1" />
				<rect x="13" y="8" width="1" height="2" />
				<rect x="8" y="9" width="1" height="2" />
				<rect x="11" y="10" width="2" height="2" />
				<rect x="9" y="12" width="1" height="2" />
				<rect x="13" y="12" width="1" height="1" />
				<rect x="8" y="14" width="1" height="2" />
				<rect x="11" y="14" width="2" height="1" />
				<rect x="14" y="14" width="1" height="1" />
				<rect x="16" y="15" width="1" height="2" />
				<rect x="18" y="15" width="2" height="1" />
				<rect x="14" y="17" width="2" height="2" />
				<rect x="17" y="18" width="1" height="2" />
				<rect x="9" y="16" width="1" height="2" />
				<rect x="11" y="17" width="2" height="1" />
				<rect x="13" y="19" width="1" height="2" />
				<rect x="16" y="20" width="1" height="1" />
				<rect x="19" y="19" width="1" height="1" />
			</g>
		</svg>
		<p class="donate-label">Donate now</p>
	</aside>
</main>

<style>
	:global(body) {
		margin: 0;
		font-family: 'Inter', 'Segoe UI', Roboto, Arial, sans-serif;
		background: radial-gradient(circle at top, #253746, #14202b 60%);
		color: #f6f7fb;
	}

	.screen {
		min-height: 100vh;
		padding: 2.5rem 3rem;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		gap: 1.8rem;
	}

	.header {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		justify-content: space-between;
	}

	.header-text {
		display: flex;
		flex-direction: column;
		flex: 1;
		text-align: left;
		align-items: flex-start;
	}

	.footer {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 1rem 1rem 0;
		width: 100%;
		box-sizing: border-box;
	}

	.donate {
		position: fixed;
		bottom: 1.5rem;
		right: 1.5rem;
		background: rgba(255, 255, 255, 0.09);
		border: 1px solid rgba(255, 255, 255, 0.25);
		border-radius: 0.9rem;
		padding: 0.9rem 0.9rem 0.7rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.55rem;
		backdrop-filter: blur(6px);
		z-index: 10;
	}

	.donate-qr {
		width: clamp(5rem, 8vw, 7.5rem);
		height: clamp(5rem, 8vw, 7.5rem);
		background: #ffffff;
		border-radius: 0.5rem;
		padding: 0.4rem;
		box-sizing: border-box;
		display: block;
	}

	.donate-label {
		margin: 0;
		font-size: clamp(0.8rem, 1.1vw, 1rem);
		font-weight: 700;
		color: #95a4b1;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.footer img {
		max-width: min(100%, 56rem);
		height: auto;
	}

	.logo-ishka {
		max-height: clamp(5.5rem, 14vw, 11rem);
	}

	.logo {
		height: clamp(3.5rem, 7vw, 6rem);
		width: auto;
		object-fit: contain;
		flex-shrink: 0;
	}

	.header h1 {
		margin: 0.25rem 0;
		font-family: 'Libre Baskerville', 'Georgia', serif;
		font-size: clamp(2.2rem, 4.8vw, 4.5rem);
		font-weight: 700;
		letter-spacing: 0.02em;
	}

	.subtitle {
		margin: 0;
		font-size: clamp(1rem, 1.8vw, 1.35rem);
		color: #95a4b1;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.cards {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
	}

	.content-grid {
		flex: 1;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
		align-items: start;
	}

	.stat {
		background: rgba(255, 255, 255, 0.09);
		border: 1px solid rgba(255, 255, 255, 0.18);
		border-radius: 0.9rem;
		padding: 1rem 1.2rem;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.stat span {
		font-size: clamp(0.8rem, 1.2vw, 1rem);
		color: #95a4b1;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.stat strong {
		font-size: clamp(1.2rem, 2.5vw, 2rem);
		font-weight: 700;
	}

	.data-status {
		margin: 0;
		padding: 0.85rem 1rem;
		background: rgba(234, 218, 36, 0.13);
		border: 1px solid rgba(234, 218, 36, 0.45);
		border-radius: 0.75rem;
		color: #f6f7fb;
		font-size: clamp(0.9rem, 1.2vw, 1.05rem);
	}

	.table-panel {
		flex: 1;
		background: rgba(37, 55, 70, 0.7);
		border: 1px solid rgba(255, 255, 255, 0.25);
		border-radius: 1rem;
		overflow: hidden;
	}
	.table-panel h2 {
		margin: 0;
		padding: 1.5rem 1.25rem 1.25rem;
		font-family: 'Libre Baskerville', 'Georgia', serif;
		font-size: clamp(1.6rem, 2.8vw, 2.4rem);
		font-weight: 700;
		color: #f6f7fb;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: clamp(0.92rem, 1.35vw, 1.45rem);
	}

	thead {
		background: #EADA24;
		color: #253746;
	}

	th,
	td {
		padding: 0.9rem 1rem;
		text-align: left;
	}

	tbody tr:nth-child(odd) {
		background: #213340;
	}

	tbody tr:nth-child(even) {
		background: #ffffff17;
	}

	.km {
		text-align: right;
		font-variant-numeric: tabular-nums;
	}
	.riders {
		text-align: right;
	}

	@media (max-width: 900px) {
		.screen {
			padding: 1.25rem;
		}

		.cards {
			grid-template-columns: 1fr;
		}

		.content-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
