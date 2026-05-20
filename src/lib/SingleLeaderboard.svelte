<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import type { Rider } from '$lib/sheets';
	import type { Company } from '$lib/leaderboards';
	import { formatMeters } from '$lib/leaderboards';

	type Props =
		| {
				title: 'Company';
				subtitle: string;
				riders: Rider[];
				dataError: string;
				companies: Company[];
				individuals?: never;
		  }
		| {
				title: 'Individual';
				subtitle: string;
				riders: Rider[];
				dataError: string;
				individuals: Rider[];
				companies?: never;
		  };

	const eventName = 'Orbis Cycle for Sight Challenge';
	const refreshMs = 30_000;
	const riderKey = (rider: Rider, index: number) =>
		`${rider.name}-${rider.team}-${rider.kmCycled}-${index}`;

	let props: Props = $props();

	onMount(() => {
		const interval = window.setInterval(() => {
			void invalidateAll();
		}, refreshMs);

		return () => window.clearInterval(interval);
	});
</script>

<svelte:head>
	<title>{props.title} Leaderboard | Cycle for Sight Challenge</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<main class="screen">
	<header class="header">
		<div class="header-text">
			<p class="subtitle">{props.subtitle}</p>
			<h1>{eventName}</h1>
		</div>
		<img class="logo" src="/Orbis_Plane_Logo_Reversed_RGB.png" alt="Orbis logo" />
	</header>

	<nav class="nav" aria-label="Leaderboard views">
		<a href={resolve('/companies')} aria-current={props.title === 'Company' ? 'page' : undefined}>
			Company
		</a>
		<a href={resolve('/individual')} aria-current={props.title === 'Individual' ? 'page' : undefined}>
			Individual
		</a>
	</nav>

	{#if props.dataError}
		<p class="data-status">{props.dataError}</p>
	{:else if props.riders.length === 0}
		<p class="data-status">No driver rows found in the configured Google Sheet.</p>
	{/if}

	<section class="table-panel" aria-labelledby="leaderboard-title">
		<h2 id="leaderboard-title">{props.title}</h2>
		<table>
			{#if props.title === 'Company'}
				<thead>
					<tr>
						<th>Rank</th>
						<th>Company</th>
						<th class="riders">Riders</th>
						<th class="km">Average Meter</th>
					</tr>
				</thead>
				<tbody>
					{#each props.companies as company, index (company.name)}
						<tr class:winner={index === 0}>
							<td>{index + 1}</td>
							<td>{company.name}</td>
							<td class="riders">{company.riders}</td>
							<td class="km">{formatMeters(company.averageKm)}</td>
						</tr>
					{/each}
				</tbody>
			{:else}
				<thead>
					<tr>
						<th>Rank</th>
						<th>Driver</th>
						<th>Company</th>
						<th class="km">Meter</th>
					</tr>
				</thead>
				<tbody>
					{#each props.individuals as rider, index (riderKey(rider, index))}
						<tr class:winner={index === 0}>
							<td>{index + 1}</td>
							<td>{rider.name}</td>
							<td>{rider.team}</td>
							<td class="km">{formatMeters(rider.kmCycled)}</td>
						</tr>
					{/each}
				</tbody>
			{/if}
		</table>
	</section>

	<footer class="footer">
		<img
			class="logo logo-ishka"
			src="/Ishka-AirfinanceGlobal-logolockup-white.png"
			alt="Ishka Airfinance Global logo"
		/>
	</footer>

	<aside class="donate" aria-label="Donate now">
		<img class="donate-qr" src="/qr-code.png" alt="Donation QR code" />
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
		flex: 1;
		flex-direction: column;
		align-items: flex-start;
		text-align: left;
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
		color: #95a4b1;
		font-size: clamp(1rem, 1.8vw, 1.35rem);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.logo {
		height: clamp(3.5rem, 7vw, 6rem);
		width: auto;
		flex-shrink: 0;
		object-fit: contain;
	}

	.nav {
		display: flex;
		gap: 0.75rem;
	}

	.nav a {
		border: 1px solid rgba(255, 255, 255, 0.25);
		border-radius: 0.5rem;
		padding: 0.75rem 1rem;
		color: #f6f7fb;
		font-weight: 700;
		text-decoration: none;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		background: rgba(255, 255, 255, 0.09);
	}

	.nav a[aria-current='page'] {
		background: #eada24;
		color: #253746;
	}

	.data-status {
		margin: 0;
		padding: 0.85rem 1rem;
		border: 1px solid rgba(234, 218, 36, 0.45);
		border-radius: 0.75rem;
		background: rgba(234, 218, 36, 0.13);
		color: #f6f7fb;
		font-size: clamp(0.9rem, 1.2vw, 1.05rem);
	}

	.table-panel {
		flex: 1;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.25);
		border-radius: 1rem;
		background: rgba(37, 55, 70, 0.7);
	}

	.table-panel h2 {
		margin: 0;
		padding: 1.5rem 1.25rem 1.25rem;
		color: #f6f7fb;
		font-family: 'Libre Baskerville', 'Georgia', serif;
		font-size: clamp(1.6rem, 2.8vw, 2.4rem);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: clamp(0.92rem, 1.35vw, 1.45rem);
	}

	thead {
		background: #eada24;
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

	.km,
	.riders {
		text-align: right;
	}

	.km {
		font-variant-numeric: tabular-nums;
	}

	.footer {
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		width: 100%;
		padding: 1rem 1rem 0;
	}

	.footer img {
		max-width: min(100%, 56rem);
		height: auto;
	}

	.logo-ishka {
		max-height: clamp(5.5rem, 14vw, 11rem);
	}

	.donate {
		position: fixed;
		right: 1.5rem;
		bottom: 1.5rem;
		z-index: 10;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		align-items: center;
		padding: 1rem 1rem 0.8rem;
		border: 1px solid rgba(255, 255, 255, 0.25);
		border-radius: 0.9rem;
		background: rgba(255, 255, 255, 0.09);
		backdrop-filter: blur(6px);
	}

	.donate-qr {
		display: block;
		box-sizing: border-box;
		width: clamp(5.5rem, 8.8vw, 8.25rem);
		height: clamp(5.5rem, 8.8vw, 8.25rem);
		padding: 0.4rem;
		border-radius: 0.5rem;
		background: #ffffff;
	}

	.donate-label {
		margin: 0;
		color: #95a4b1;
		font-size: clamp(0.85rem, 1.15vw, 1.05rem);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	@media (max-width: 900px) {
		.screen {
			padding: 1.25rem;
		}

		.header {
			align-items: flex-start;
			flex-direction: column-reverse;
		}

		.nav {
			flex-wrap: wrap;
		}
	}
</style>
