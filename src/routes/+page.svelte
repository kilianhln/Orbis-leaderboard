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
		{ name: 'Lena Hoffmann', team: 'Summit Wheels', kmCycled: 0.524, totalTime: '02:31:42' },
		{ name: 'Tom Richter', team: 'Velocity Core', kmCycled: 0.812, totalTime: '02:54:06' },
		{ name: 'Mina Aydin', team: 'Road Falcons', kmCycled: 0.689, totalTime: '02:43:18' },
		{ name: 'Noah Weiss', team: 'Urban Sprint', kmCycled: 0.145, totalTime: '02:20:54' },
		{ name: 'Sara Klein', team: 'Alpine Cadence', kmCycled: 0.933, totalTime: '03:01:11' },
		{ name: 'Jonas Bauer', team: 'Night Riders', kmCycled: 0.078, totalTime: '02:48:29' },
		{ name: 'Hannah Brandt', team: 'Summit Wheels', kmCycled: 0.376, totalTime: '02:18:55' },
		{ name: 'David Eberhard', team: 'Velocity Core', kmCycled: 0.712, totalTime: '02:39:12' },
		{ name: 'Lukas Berger', team: 'Road Falcons', kmCycled: 0.458, totalTime: '02:26:48' },
		{ name: 'Marie Schulz', team: 'Night Riders', kmCycled: 0.591, totalTime: '02:35:03' },
		{ name: 'Elias Vogel', team: 'Aero Pulse', kmCycled: 0.844, totalTime: '02:52:11' },
		{ name: 'Lara Krüger', team: 'Aero Pulse', kmCycled: 0.612, totalTime: '02:30:27' },
		{ name: 'Felix Maier', team: 'Carbon Cranks', kmCycled: 0.273, totalTime: '02:09:33' },
		{ name: 'Sophie Lang', team: 'Carbon Cranks', kmCycled: 0.498, totalTime: '02:24:17' },
		{ name: 'Matti Werner', team: 'Storm Chasers', kmCycled: 0.967, totalTime: '03:05:48' },
		{ name: 'Anna Becker', team: 'Ridge Runners', kmCycled: 0.205, totalTime: '02:14:52' },
		{ name: 'Paul Neumann', team: 'Ridge Runners', kmCycled: 0.738, totalTime: '02:41:09' },
		{ name: 'Clara Roth', team: 'Dawn Patrol', kmCycled: 0.351, totalTime: '02:17:44' },
		{ name: 'Henry Fischer', team: 'Dawn Patrol', kmCycled: 0.624, totalTime: '02:33:55' },
		{ name: 'Mila Wagner', team: 'Sunset Cyclers', kmCycled: 0.118, totalTime: '02:11:30' },
		{ name: 'Leo Schwarz', team: 'Sunset Cyclers', kmCycled: 0.482, totalTime: '02:23:08' },
		{ name: 'Ida Sommer', team: 'City Sparks', kmCycled: 0.789, totalTime: '02:47:36' },
		{ name: 'Ben Köhler', team: 'Iron Pedalers', kmCycled: 0.566, totalTime: '02:29:14' },
		{ name: 'Nora Engel', team: 'Iron Pedalers', kmCycled: 0.402, totalTime: '02:21:46' },
		{ name: 'Theo Albers', team: 'Polar Spokes', kmCycled: 0.658, totalTime: '02:36:51' },
		{ name: 'Pia Hartmann', team: 'Echo Trail', kmCycled: 0.314, totalTime: '02:15:22' },
		{ name: 'Jakob Reiter', team: 'Vortex Velo', kmCycled: 0.873, totalTime: '02:58:04' },
		{ name: 'Emma Voss', team: 'Summit Wheels', kmCycled: 0.456, totalTime: '02:24:12' },
		{ name: 'Liam Frank', team: 'Velocity Core', kmCycled: 0.681, totalTime: '02:37:48' },
		{ name: 'Mia Schröder', team: 'Road Falcons', kmCycled: 0.234, totalTime: '02:13:09' },
		{ name: 'Niko Beck', team: 'Urban Sprint', kmCycled: 0.853, totalTime: '02:54:31' },
		{ name: 'Lea Werner', team: 'Alpine Cadence', kmCycled: 0.572, totalTime: '02:29:55' },
		{ name: 'Finn Walter', team: 'Night Riders', kmCycled: 0.398, totalTime: '02:20:14' },
		{ name: 'Hanna Otto', team: 'Aero Pulse', kmCycled: 0.717, totalTime: '02:42:38' },
		{ name: 'Erik Lehmann', team: 'Carbon Cranks', kmCycled: 0.609, totalTime: '02:33:22' },
		{ name: 'Greta Beil', team: 'Storm Chasers', kmCycled: 0.482, totalTime: '02:25:48' },
		{ name: 'Max Adler', team: 'Ridge Runners', kmCycled: 0.834, totalTime: '02:50:02' },
		{ name: 'Lilly Burger', team: 'Dawn Patrol', kmCycled: 0.265, totalTime: '02:14:21' },
		{ name: 'Oskar Junker', team: 'Sunset Cyclers', kmCycled: 0.792, totalTime: '02:46:09' },
		{ name: 'Klara Pfeiffer', team: 'City Sparks', kmCycled: 0.358, totalTime: '02:19:11' },
		{ name: 'Levi Bach', team: 'Iron Pedalers', kmCycled: 0.611, totalTime: '02:32:57' },
		{ name: 'Frieda Holm', team: 'Polar Spokes', kmCycled: 0.474, totalTime: '02:23:48' },
		{ name: 'Theo Schubert', team: 'Echo Trail', kmCycled: 0.823, totalTime: '02:49:36' },
		{ name: 'Lina Dietz', team: 'Vortex Velo', kmCycled: 0.156, totalTime: '02:10:27' },
		{ name: 'Mats Falke', team: 'Summit Wheels', kmCycled: 0.694, totalTime: '02:38:14' },
		{ name: 'Pauline Stein', team: 'Velocity Core', kmCycled: 0.328, totalTime: '02:16:51' },
		{ name: 'Ron Maus', team: 'Road Falcons', kmCycled: 0.564, totalTime: '02:28:36' },
		{ name: 'Ella Funk', team: 'Urban Sprint', kmCycled: 0.901, totalTime: '02:57:13' },
		{ name: 'Karl Böhm', team: 'Alpine Cadence', kmCycled: 0.276, totalTime: '02:14:42' },
		{ name: 'Lou Reuter', team: 'Night Riders', kmCycled: 0.625, totalTime: '02:34:08' },
		{ name: 'Mira Kaiser', team: 'Aero Pulse', kmCycled: 0.443, totalTime: '02:22:30' },
		{ name: 'Linus Kraft', team: 'Carbon Cranks', kmCycled: 0.738, totalTime: '02:43:52' },
		{ name: 'Romy Ott', team: 'Storm Chasers', kmCycled: 0.512, totalTime: '02:27:15' },
		{ name: 'Felix Held', team: 'Ridge Runners', kmCycled: 0.187, totalTime: '02:12:04' },
		{ name: 'Ida Wolf', team: 'Dawn Patrol', kmCycled: 0.659, totalTime: '02:35:42' },
		{ name: 'Tim Decker', team: 'Sunset Cyclers', kmCycled: 0.224, totalTime: '02:13:26' },
		{ name: 'Nele Sturm', team: 'City Sparks', kmCycled: 0.487, totalTime: '02:26:01' },
		{ name: 'Aaron Volk', team: 'Iron Pedalers', kmCycled: 0.768, totalTime: '02:45:19' },
		{ name: 'Hedi Bauer', team: 'Polar Spokes', kmCycled: 0.351, totalTime: '02:18:32' },
		{ name: 'Linn Pohl', team: 'Echo Trail', kmCycled: 0.612, totalTime: '02:33:05' },
		{ name: 'Ole Henke', team: 'Vortex Velo', kmCycled: 0.495, totalTime: '02:26:48' },
		{ name: 'Mika Roth', team: 'Summit Wheels', kmCycled: 0.847, totalTime: '02:51:33' },
		{ name: 'Selma Frey', team: 'Velocity Core', kmCycled: 0.213, totalTime: '02:12:47' },
		{ name: 'Joris Bender', team: 'Road Falcons', kmCycled: 0.781, totalTime: '02:46:55' },
		{ name: 'Jana Schmid', team: 'Urban Sprint', kmCycled: 0.376, totalTime: '02:19:38' },
		{ name: 'Yuri Klotz', team: 'Alpine Cadence', kmCycled: 0.652, totalTime: '02:35:21' },
		{ name: 'Lasse Probst', team: 'Night Riders', kmCycled: 0.498, totalTime: '02:26:14' },
		{ name: 'Pia Linke', team: 'Aero Pulse', kmCycled: 0.197, totalTime: '02:12:23' },
		{ name: 'Bennet Voigt', team: 'Carbon Cranks', kmCycled: 0.846, totalTime: '02:51:07' },
		{ name: 'Saskia Beil', team: 'Storm Chasers', kmCycled: 0.541, totalTime: '02:28:42' },
		{ name: 'Tobias Krebs', team: 'Ridge Runners', kmCycled: 0.328, totalTime: '02:17:09' },
		{ name: 'Carla Werner', team: 'Dawn Patrol', kmCycled: 0.793, totalTime: '02:46:32' },
		{ name: 'Aaron Niemann', team: 'Sunset Cyclers', kmCycled: 0.245, totalTime: '02:13:55' },
		{ name: 'Linnea Berg', team: 'City Sparks', kmCycled: 0.583, totalTime: '02:30:18' },
		{ name: 'Mattis Knapp', team: 'Iron Pedalers', kmCycled: 0.418, totalTime: '02:21:24' },
		{ name: 'Stella Krause', team: 'Polar Spokes', kmCycled: 0.671, totalTime: '02:36:48' },
		{ name: 'Jaron Tritt', team: 'Echo Trail', kmCycled: 0.532, totalTime: '02:27:51' }
	]);
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
		color: #95a4b1;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.stat strong {
		font-size: clamp(1.2rem, 2.5vw, 2rem);
		font-weight: 700;
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
