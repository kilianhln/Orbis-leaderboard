<svelte:head>
	<title>Cycle for Sight Challenge Leaderboard</title>
</svelte:head>

<script lang="ts">
	type Rider = {
		name: string;
		team: string;
		kmCycled: number;
		totalTime: string;
	};

	type Company = {
		name: string;
		totalKm: number;
		riders: number;
		averageKm: number;
	};

	const eventName = 'Cycle for Sight Challenge';

	let riders = $state<Rider[]>([
		{ name: 'Lena Hoffmann', team: 'Summit Wheels', kmCycled: 82.4, totalTime: '02:31:42' },
		{ name: 'Tom Richter', team: 'Velocity Core', kmCycled: 94.2, totalTime: '02:54:06' },
		{ name: 'Mina Aydin', team: 'Road Falcons', kmCycled: 88.7, totalTime: '02:43:18' },
		{ name: 'Noah Weiss', team: 'Urban Sprint', kmCycled: 76.5, totalTime: '02:20:54' },
		{ name: 'Sara Klein', team: 'Alpine Cadence', kmCycled: 97.1, totalTime: '03:01:11' },
		{ name: 'Jonas Bauer', team: 'Night Riders', kmCycled: 90.3, totalTime: '02:48:29' }
	]);
	let individualLeaderboard = $derived(
		[...riders].sort((a, b) => b.kmCycled - a.kmCycled || a.totalTime.localeCompare(b.totalTime))
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
		].sort((a, b) => b.averageKm - a.averageKm || a.name.localeCompare(b.name))
	);

	let bestCompanyAverageKm = $derived(companyLeaderboard[0]?.averageKm ?? 0);
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
			<strong>{individualLeaderboard.length}</strong>
		</div>
	</section>

	<section class="content-grid">
		<section class="table-panel" aria-labelledby="company-leaderboard-title">
			<h2 id="company-leaderboard-title">Company Leaderboard</h2>
			<table>
				<thead>
					<tr>
						<th>Rank</th>
						<th>Company</th>
						<th class="km">Average Meter</th>
						<th class="riders">Riders</th>
					</tr>
				</thead>
				<tbody>
					{#each companyLeaderboard as company, index (company.name)}
						<tr class:winner={index === 0}>
							<td>{index + 1}</td>
							<td>{company.name}</td>
							<td class="km">{Math.round(company.averageKm * 1000).toLocaleString()}</td>
							<td class="riders">{company.riders}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</section>
		<section class="table-panel" aria-labelledby="individual-leaderboard-title">
			<h2 id="individual-leaderboard-title">Individual Leaderboard</h2>
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
</main>

<style>
	:global(body) {
		margin: 0;
		font-family: 'Inter', 'Segoe UI', Roboto, Arial, sans-serif;
		background: radial-gradient(circle at top, #101e3f, #040711 60%);
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
		padding-top: 1rem;
	}

	.logo-ishka {
		height: clamp(2.5rem, 5vw, 4.5rem);
	}

	.logo {
		height: clamp(3.5rem, 7vw, 6rem);
		width: auto;
		object-fit: contain;
		flex-shrink: 0;
	}

	.header h1 {
		margin: 0.25rem 0;
		font-size: clamp(2.2rem, 4.8vw, 4.5rem);
		font-weight: 800;
		letter-spacing: 0.02em;
	}

	.subtitle {
		margin: 0;
		font-size: clamp(1rem, 1.8vw, 1.35rem);
		color: #96b9ff;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.summary {
		margin: 0;
		font-size: clamp(1rem, 1.6vw, 1.3rem);
		color: #d5dcf7;
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
		color: #adc1ff;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.stat strong {
		font-size: clamp(1.2rem, 2.5vw, 2rem);
		font-weight: 700;
	}

	.table-panel {
		flex: 1;
		background: rgba(5, 11, 30, 0.58);
		border: 1px solid rgba(255, 255, 255, 0.16);
		border-radius: 1rem;
		overflow: hidden;
	}
	.table-panel h2 {
		margin: 0;
		padding: 1rem 1rem 0;
		font-size: clamp(1.1rem, 1.8vw, 1.55rem);
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: clamp(0.92rem, 1.35vw, 1.45rem);
	}

	thead {
		background: rgba(123, 166, 255, 0.2);
	}

	th,
	td {
		padding: 0.9rem 1rem;
		text-align: left;
	}

	tbody tr:nth-child(even) {
		background: rgba(255, 255, 255, 0.04);
	}

	tbody tr.winner {
		background: linear-gradient(90deg, rgba(255, 214, 106, 0.3), rgba(255, 255, 255, 0.02));
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
