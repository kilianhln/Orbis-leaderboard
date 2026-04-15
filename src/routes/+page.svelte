<svelte:head>
	<title>Orbis Cycling Event Leaderboard</title>
</svelte:head>

<script lang="ts">
	import { onMount } from 'svelte';
	import 'leaflet/dist/leaflet.css';
	type Rider = {
		name: string;
		team: string;
		kmCycled: number;
		totalTime: string;
	};
	type LatLngTuple = [number, number];
	type LeafletModule = typeof import('leaflet');

	const eventName = 'Orbis Cycling Event';
	const routeStart = 'Dublin';
	const routeEnd = 'Addis Ababa';
	const routeDistanceKm = 8954;
	const routeWaypoints: LatLngTuple[] = [
		[53.3498, -6.2603],
		[50.1109, 8.6821],
		[45.4642, 9.19],
		[37.9838, 23.7275],
		[31.2001, 29.9187],
		[15.5007, 32.5599],
		[8.9806, 38.7578]
	];

	const haversineKm = (a: LatLngTuple, b: LatLngTuple): number => {
		const toRad = (deg: number) => (deg * Math.PI) / 180;
		const earthRadiusKm = 6371;
		const dLat = toRad(b[0] - a[0]);
		const dLng = toRad(b[1] - a[1]);
		const lat1 = toRad(a[0]);
		const lat2 = toRad(b[0]);
		const h =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

		return 2 * earthRadiusKm * Math.asin(Math.sqrt(h));
	};

	const interpolatePoint = (a: LatLngTuple, b: LatLngTuple, t: number): LatLngTuple => [
		a[0] + (b[0] - a[0]) * t,
		a[1] + (b[1] - a[1]) * t
	];

	const segmentLengthsKm = routeWaypoints
		.slice(0, -1)
		.map((_, i) => haversineKm(routeWaypoints[i], routeWaypoints[i + 1]));
	const totalPolylineKm = segmentLengthsKm.reduce((sum, km) => sum + km, 0);

	const getRouteProgress = (progress: number): { point: LatLngTuple; pathUntil: LatLngTuple[] } => {
		const clamped = Math.min(Math.max(progress, 0), 1);

		if (clamped <= 0) {
			return { point: routeWaypoints[0], pathUntil: [routeWaypoints[0]] };
		}

		if (clamped >= 1) {
			return {
				point: routeWaypoints[routeWaypoints.length - 1],
				pathUntil: [...routeWaypoints]
			};
		}

		const targetKm = totalPolylineKm * clamped;
		let coveredKm = 0;

		for (let i = 0; i < segmentLengthsKm.length; i++) {
			const segmentKm = segmentLengthsKm[i];

			if (coveredKm + segmentKm >= targetKm) {
				const segmentProgress = segmentKm === 0 ? 0 : (targetKm - coveredKm) / segmentKm;
				const point = interpolatePoint(routeWaypoints[i], routeWaypoints[i + 1], segmentProgress);
				return { point, pathUntil: [...routeWaypoints.slice(0, i + 1), point] };
			}

			coveredKm += segmentKm;
		}

		return {
			point: routeWaypoints[routeWaypoints.length - 1],
			pathUntil: [...routeWaypoints]
		};
	};

	let riders = $state<Rider[]>([
		{ name: 'Lena Hoffmann', team: 'Summit Wheels', kmCycled: 82.4, totalTime: '02:31:42' },
		{ name: 'Tom Richter', team: 'Velocity Core', kmCycled: 94.2, totalTime: '02:54:06' },
		{ name: 'Mina Aydin', team: 'Road Falcons', kmCycled: 88.7, totalTime: '02:43:18' },
		{ name: 'Noah Weiss', team: 'Urban Sprint', kmCycled: 76.5, totalTime: '02:20:54' },
		{ name: 'Sara Klein', team: 'Alpine Cadence', kmCycled: 97.1, totalTime: '03:01:11' },
		{ name: 'Jonas Bauer', team: 'Night Riders', kmCycled: 90.3, totalTime: '02:48:29' }
	]);

	let leaderboard = $derived(
		[...riders].sort((a, b) => b.kmCycled - a.kmCycled || a.totalTime.localeCompare(b.totalTime))
	);

	let leaderKm = $derived(leaderboard[0]?.kmCycled ?? 0);
	let totalKm = $derived(riders.reduce((sum, rider) => sum + rider.kmCycled, 0));
	let routeProgressKm = $derived(Math.min(totalKm, routeDistanceKm));
	let routeT = $derived(routeProgressKm / routeDistanceKm);
	let routeProgressPercent = $derived(routeT * 100);

	let mapContainer: HTMLDivElement | null = null;
	let leaflet: LeafletModule | null = null;
	let map: import('leaflet').Map | null = null;
	let progressLine: import('leaflet').Polyline | null = null;
	let bikeMarker: import('leaflet').Marker | null = null;

	onMount(() => {
		let isDisposed = false;

		const initializeMap = async () => {
			if (!mapContainer) {
				return;
			}

			const L = await import('leaflet');
			if (isDisposed) {
				return;
			}

			leaflet = L;

			map = L.map(mapContainer, {
				zoomControl: true,
				attributionControl: true
			});

			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 19,
				attribution: '&copy; OpenStreetMap contributors'
			}).addTo(map);

			L.polyline(routeWaypoints, {
				color: '#071126',
				weight: 12,
				opacity: 0.88,
				lineCap: 'round',
				lineJoin: 'round',
				interactive: false
			}).addTo(map);

			L.polyline(routeWaypoints, {
				color: '#eef5ff',
				weight: 6,
				opacity: 0.96,
				lineCap: 'round',
				lineJoin: 'round',
				dashArray: '12 8',
				interactive: false
			}).addTo(map);

			L.circleMarker(routeWaypoints[0], {
				radius: 6,
				color: '#0b142f',
				weight: 2,
				fillColor: '#eaf2ff',
				fillOpacity: 1
			})
				.addTo(map)
				.bindTooltip(routeStart, { direction: 'top', offset: [0, -8], className: 'route-tooltip' });

			L.circleMarker(routeWaypoints[routeWaypoints.length - 1], {
				radius: 6,
				color: '#0b142f',
				weight: 2,
				fillColor: '#eaf2ff',
				fillOpacity: 1
			})
				.addTo(map)
				.bindTooltip(routeEnd, { direction: 'top', offset: [0, -8], className: 'route-tooltip' });

			const initialProgress = getRouteProgress(routeT);

			progressLine = L.polyline(initialProgress.pathUntil, {
				color: '#00ffd5',
				weight: 8,
				opacity: 1,
				lineCap: 'round',
				lineJoin: 'round',
				className: 'route-progress-line'
			}).addTo(map);

			bikeMarker = L.marker(initialProgress.point, {
				icon: L.divIcon({
					className: 'bike-div-icon',
					html: '<span class="bike-marker" aria-hidden="true"><svg viewBox="0 0 64 64"><circle cx="16" cy="46" r="11"></circle><circle cx="48" cy="46" r="11"></circle><path d="M16 46 L27 27 L35 46 L48 46 M27 27 H39 L44 35 M27 27 L20 20 M35 46 L41 34"></path></svg></span>',
					iconSize: [48, 48],
					iconAnchor: [24, 24]
				}),
				keyboard: false
			}).addTo(map);

			bikeMarker.bindTooltip(`${routeProgressKm.toFixed(1)} km`, {
				direction: 'top',
				offset: [0, -12],
				className: 'route-tooltip'
			});

			map.fitBounds(L.latLngBounds(routeWaypoints).pad(0.28));
		};

		initializeMap();

		return () => {
			isDisposed = true;
			map?.remove();
			map = null;
			progressLine = null;
			bikeMarker = null;
			leaflet = null;
		};
	});

	$effect(() => {
		if (!leaflet || !progressLine || !bikeMarker) {
			return;
		}

		const currentProgress = getRouteProgress(routeT);
		progressLine.setLatLngs(currentProgress.pathUntil);
		bikeMarker.setLatLng(currentProgress.point);

		if (bikeMarker.getTooltip()) {
			bikeMarker.setTooltipContent(`${routeProgressKm.toFixed(1)} km`);
		}
	});
</script>

<main class="screen">
	<header class="header">
		<p class="subtitle">Live Beamer View</p>
		<h1>{eventName}</h1>
		<p class="summary">Sorted by cycled kilometers (KM)</p>
	</header>

	<section class="cards">
		<div class="stat">
			<span>Current Leader</span>
			<strong>{leaderboard[0]?.name ?? '—'}</strong>
		</div>
		<div class="stat">
			<span>Best Distance</span>
			<strong>{leaderKm.toFixed(1)} km</strong>
		</div>
		<div class="stat">
			<span>Total Riders</span>
			<strong>{leaderboard.length}</strong>
		</div>
		<div class="stat">
			<span>Accumulated KM</span>
			<strong>{totalKm.toFixed(1)} km</strong>
		</div>
	</section>

	<section class="content-grid">
		<section class="table-wrap" aria-label="Orbis cycling leaderboard">
			<table>
				<thead>
					<tr>
						<th>Rank</th>
						<th>Driver</th>
						<th>Team</th>
						<th class="km">KM</th>
						<th>Time</th>
					</tr>
				</thead>
				<tbody>
					{#each leaderboard as rider, index (rider.name)}
						<tr class:winner={index === 0}>
							<td>{index + 1}</td>
							<td>{rider.name}</td>
							<td>{rider.team}</td>
							<td class="km">{rider.kmCycled.toFixed(1)}</td>
							<td>{rider.totalTime}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</section>

		<section class="route-panel" aria-label="Route progress from Dublin to Addis Ababa">
			<div class="route-head">
				<h2>Route Progress</h2>
				<p>{routeStart} → {routeEnd} · {routeDistanceKm.toLocaleString()} km</p>
			</div>
			<div
				class="route-map"
				bind:this={mapContainer}
				role="img"
				aria-label={`OpenStreetMap route from ${routeStart} to ${routeEnd}`}
			></div>
			<p class="route-caption">
				{routeProgressKm.toFixed(1)} km of {routeDistanceKm.toLocaleString()} km completed by all riders
				combined ({routeProgressPercent.toFixed(1)}%)
			</p>
		</section>
	</section>
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
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1rem;
	}

	.content-grid {
		flex: 1;
		display: grid;
		grid-template-columns: minmax(0, 1.55fr) minmax(360px, 1fr);
		gap: 1rem;
		align-items: stretch;
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

	.route-panel {
		background: rgba(5, 11, 30, 0.58);
		border: 1px solid rgba(255, 255, 255, 0.16);
		border-radius: 1rem;
		padding: 1rem 1.2rem 1.1rem;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
		height: 100%;
	}

	.route-head h2 {
		margin: 0;
		font-size: clamp(1.1rem, 1.8vw, 1.55rem);
	}

	.route-head p {
		margin: 0.15rem 0 0;
		color: #adc1ff;
		font-size: clamp(0.85rem, 1.2vw, 1rem);
	}

	.route-map {
		position: relative;
		flex: 1;
		min-height: clamp(220px, 38vh, 360px);
		border-radius: 0.8rem;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.14);
		background: #102044;
	}

	:global(.leaflet-container) {
		width: 100%;
		height: 100%;
		background: #102044;
		font-family: 'Inter', 'Segoe UI', Roboto, Arial, sans-serif;
	}

	:global(.leaflet-control-attribution) {
		background: rgba(7, 14, 31, 0.78) !important;
		color: #d6e4ff !important;
		font-size: 0.68rem !important;
	}

	:global(.leaflet-control-attribution a) {
		color: #eaf2ff !important;
	}

	:global(.bike-div-icon) {
		background: transparent;
		border: none;
	}

	:global(.route-progress-line) {
		filter: drop-shadow(0 0 5px rgba(0, 255, 213, 0.95))
			drop-shadow(0 0 11px rgba(0, 255, 213, 0.7));
	}

	:global(.bike-marker) {
		display: block;
		width: 100%;
		height: 100%;
		filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.55));
	}

	:global(.bike-marker svg) {
		display: block;
		width: 100%;
		height: 100%;
	}

	:global(.bike-marker svg circle),
	:global(.bike-marker svg path) {
		fill: none;
		stroke: #ffd34d;
		stroke-width: 4.6;
		stroke-linecap: round;
		stroke-linejoin: round;
		filter: drop-shadow(0 0 3px rgba(255, 211, 77, 0.85));
	}

	:global(.route-tooltip) {
		background: rgba(7, 14, 31, 0.92);
		color: #eff5ff;
		border: 1px solid rgba(211, 226, 255, 0.26);
		box-shadow: none;
	}

	:global(.route-tooltip:before) {
		border-top-color: rgba(211, 226, 255, 0.26);
	}

	.route-caption {
		margin: 0;
		font-size: clamp(0.82rem, 1.15vw, 0.98rem);
		color: #d5dcf7;
	}

	.table-wrap {
		flex: 1;
		background: rgba(5, 11, 30, 0.58);
		border: 1px solid rgba(255, 255, 255, 0.16);
		border-radius: 1rem;
		overflow: hidden;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: clamp(1rem, 1.7vw, 1.8rem);
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

		.route-map {
			border-radius: 0.65rem;
		}
	}
</style>
