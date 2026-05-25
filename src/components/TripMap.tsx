import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TripDay, Activity, ParkingSpot } from '@/data/tripData';

const DEFAULT_CENTER: L.LatLngTuple = [43.4628, -3.8100];
const DEFAULT_ZOOM = 12;

const createNumberedIcon = (color: string, emoji: string, number: number) =>
  L.divIcon({
    className: 'custom-marker',
    html: `<div style="position:relative;background:${color};width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px hsl(0 0% 0% / 0.3);font-size:14px;">
      ${emoji}
      <span style="position:absolute;top:-8px;right:-8px;background:hsl(0 0% 100%);color:hsl(0 0% 15%);font-size:10px;font-weight:700;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:1.5px solid ${color};box-shadow:0 1px 3px hsl(0 0% 0% / 0.2);">${number}</span>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

const createHotelIcon = () =>
  L.divIcon({
    className: 'custom-marker',
    html: `<div style="position:relative;background:hsl(16 85% 50%);width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 3px 10px hsl(0 0% 0% / 0.4);font-size:16px;">
      🏨
      <span style="position:absolute;top:-10px;right:-10px;background:hsl(16 85% 50%);color:white;font-size:8px;font-weight:700;padding:1px 4px;border-radius:6px;white-space:nowrap;border:1.5px solid white;box-shadow:0 1px 3px hsl(0 0% 0% / 0.2);">HOTEL</span>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });

const categoryIcons: Record<string, { color: string; emoji: string }> = {
  flight:      { color: 'hsl(221 83% 53%)', emoji: '✈️' },
  transport:   { color: 'hsl(221 83% 53%)', emoji: '🚌' },
  sightseeing: { color: 'hsl(16 85% 50%)',  emoji: '📍' },
  food:        { color: 'hsl(30 85% 52%)',  emoji: '🍽️' },
  hotel:       { color: 'hsl(16 85% 50%)',  emoji: '🏨' },
  walk:        { color: 'hsl(168 100% 36%)', emoji: '🚶' },
  parking:     { color: 'hsl(220 10% 55%)', emoji: '🅿️' },
  car:         { color: 'hsl(270 60% 55%)', emoji: '🚗' },
};

const createParkingIcon = (free: boolean) =>
  L.divIcon({
    className: 'custom-marker',
    html: `<div style="background:${free ? 'hsl(142 71% 45%)' : 'hsl(220 10% 55%)'};width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px hsl(0 0% 0% / 0.3);font-size:14px;font-weight:700;color:white;">P</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

const hasParking = (
  spot: ParkingSpot,
): spot is ParkingSpot & { lat: number; lng: number } =>
  typeof spot.lat === 'number' && typeof spot.lng === 'number';

const parseTransport = (transport?: string): { icon: string; duration: string } | null => {
  if (!transport) return null;
  let icon = '🚗';
  if (transport.includes('✈') || transport.toLowerCase().includes('polет') || transport.toLowerCase().includes('полет')) icon = '✈️';
  else if (transport.includes('🚶') || transport.toLowerCase().includes('walk') || transport.toLowerCase().includes('пеша')) icon = '🚶';
  else if (transport.includes('🚌')) icon = '🚌';

  const durMatch = transport.match(/~?\s*(\d+[\-–]?\d*)\s*(h|час|мин|min)/i);
  const duration = durMatch ? `${durMatch[1]}${durMatch[2]}` : '';
  if (!duration) return null;
  return { icon, duration };
};

const createTransportLabel = (icon: string, duration: string) =>
  L.divIcon({
    className: 'transport-label',
    html: `<div style="font-size:13px;font-weight:700;color:hsl(16 60% 30%);white-space:nowrap;display:flex;align-items:center;gap:2px;text-shadow:0 0 3px white, 0 0 6px white, 0 0 9px white;">${icon}${duration}</div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 8],
  });

const getOSRMProfile = (transport?: string, category?: string): 'foot' | 'driving' | 'flight' => {
  if (category === 'flight') return 'flight';
  if (!transport) return 'driving';
  if (transport.includes('✈')) return 'flight';
  if (transport.includes('🚶') || transport.toLowerCase().includes('пеша') || transport.toLowerCase().includes('walk')) return 'foot';
  return 'driving';
};

const fetchRoute = async (
  from: L.LatLngTuple,
  to: L.LatLngTuple,
  profile: 'foot' | 'driving',
): Promise<L.LatLngTuple[]> => {
  try {
    const url = `https://router.project-osrm.org/route/v1/${profile}/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    if (!res.ok) return [from, to];
    const data = await res.json();
    if (data.code !== 'Ok' || !data.routes?.[0]) return [from, to];
    const coords: L.LatLngTuple[] = data.routes[0].geometry.coordinates.map(
      ([lng, lat]: [number, number]) => [lat, lng],
    );
    return coords;
  } catch {
    return [from, to];
  }
};

interface TripMapProps {
  day: TripDay;
  focusedActivity?: Activity | null;
  height?: string;
}

const hasCoords = (
  item: Activity | null | undefined,
): item is Activity & { lat: number; lng: number } =>
  typeof item?.lat === 'number' && typeof item?.lng === 'number';

const TripMap = ({ day, focusedActivity = null, height = 'calc(100dvh - 176px)' }: TripMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();
    const points: L.LatLngTuple[] = [];

    interface RouteStop { coords: L.LatLngTuple; transport?: string; category?: string }
    const stops: RouteStop[] = [];

    const hotelActivity = day.activities.find(a => a.category === 'hotel' && hasCoords(a));
    const hotelCoords: L.LatLngTuple | null = hotelActivity && hasCoords(hotelActivity)
      ? [hotelActivity.lat, hotelActivity.lng]
      : null;

    if (hotelCoords) {
      L.marker(hotelCoords, {
        icon: createHotelIcon(),
        zIndexOffset: 2000,
      })
        .bindPopup(`<strong>🏨 Pension El Figon</strong><br/><em>Хотел</em>`)
        .addTo(markersLayer);
      points.push(hotelCoords);
    }

    // Parking markers
    day.parking.forEach((spot) => {
      if (!hasParking(spot)) return;
      L.marker([spot.lat, spot.lng], {
        icon: createParkingIcon(spot.free ?? false),
        zIndexOffset: 900,
      })
        .bindPopup(
          `<strong>🅿️ ${spot.name}</strong><br/><span style="color:${spot.free ? 'green' : 'orange'};font-weight:600">${spot.price}</span>${spot.notes ? `<br/><em>${spot.notes}</em>` : ''}`,
        )
        .addTo(markersLayer);
      points.push([spot.lat, spot.lng]);
    });

    let stepNumber = 0;
    day.activities.forEach((activity) => {
      if (!hasCoords(activity)) return;
      if (activity.category === 'hotel') return;
      stepNumber++;
      const iconCfg = categoryIcons[activity.category] ?? categoryIcons.sightseeing;

      L.marker([activity.lat, activity.lng], {
        icon: createNumberedIcon(iconCfg.color, iconCfg.emoji, stepNumber),
        zIndexOffset: 1000,
      })
        .bindPopup(
          `<strong>${stepNumber}. ${activity.title}</strong><br/><span>${activity.time}</span>${activity.notes ? `<br/><em>${activity.notes}</em>` : ''}`,
        )
        .addTo(markersLayer);

      points.push([activity.lat, activity.lng]);
      stops.push({ coords: [activity.lat, activity.lng], transport: activity.transport, category: activity.category });
    });

    // Build ordered waypoints: hotel → stops → hotel
    const allStops: RouteStop[] = [];
    if (hotelCoords) allStops.push({ coords: hotelCoords });
    allStops.push(...stops);
    if (hotelCoords) allStops.push({ coords: hotelCoords });

    // Add transport duration labels at midpoints
    for (let i = 1; i < allStops.length; i++) {
      const prev = allStops[i - 1].coords;
      const curr = allStops[i].coords;
      const parsed = parseTransport(allStops[i].transport);
      if (parsed) {
        const midLat = (prev[0] + curr[0]) / 2;
        const midLng = (prev[1] + curr[1]) / 2;
        L.marker([midLat, midLng], {
          icon: createTransportLabel(parsed.icon, parsed.duration),
          interactive: false,
          zIndexOffset: 500,
        }).addTo(markersLayer);
      }
    }

    if (hasCoords(focusedActivity)) {
      map.flyTo([focusedActivity.lat, focusedActivity.lng], 15, { duration: 0.8 });
    } else if (points.length > 0) {
      map.fitBounds(points, { padding: [40, 40], maxZoom: 14 });
    } else {
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
    }

    const resizeTimer = window.setTimeout(() => map.invalidateSize(), 0);

    // Draw straight dashed fallback immediately, then replace with real routes
    const fallbackLine = allStops.length > 1
      ? L.polyline(allStops.map(s => s.coords), {
          color: 'hsl(16 85% 50%)',
          weight: 3,
          opacity: 0.4,
          dashArray: '8, 8',
        }).addTo(markersLayer)
      : null;

    // Fetch real road routes for each segment and draw them
    let cancelled = false;
    (async () => {
      if (allStops.length < 2) return;
      const segmentLines: L.Polyline[] = [];

      for (let i = 0; i < allStops.length - 1; i++) {
        if (cancelled) break;
        const from = allStops[i].coords;
        const to = allStops[i + 1].coords;
        const profile = getOSRMProfile(allStops[i + 1].transport, allStops[i + 1].category);

        if (profile === 'flight') {
          L.polyline([from, to], {
            color: 'hsl(221 83% 53%)',
            weight: 2,
            opacity: 0.6,
            dashArray: '6, 10',
            lineCap: 'round',
          }).addTo(markersLayer);
          continue;
        }

        const routeCoords = await fetchRoute(from, to, profile);
        if (cancelled) break;

        const isWalking = profile === 'foot';
        const line = L.polyline(routeCoords, {
          color: isWalking ? 'hsl(168 100% 36%)' : 'hsl(16 85% 50%)',
          weight: isWalking ? 3 : 4,
          opacity: 0.75,
          dashArray: isWalking ? '4, 6' : undefined,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(markersLayer);
        segmentLines.push(line);
      }

      if (!cancelled && fallbackLine) {
        markersLayer.removeLayer(fallbackLine);
      }
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(resizeTimer);
    };
  }, [day, focusedActivity]);

  return (
    <div className="w-full rounded-lg overflow-hidden border shadow-sm" style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full" aria-label={`Карта за ден ${day.day + 1}`} />
    </div>
  );
};

export default TripMap;
