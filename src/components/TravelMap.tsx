import "leaflet/dist/leaflet.css";
import { ExternalLink, MapPinned, Plane, Route as RouteIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { CircleMarker, MapContainer, Popup, Polyline, TileLayer, useMap } from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";
import type { DayPlan } from "../types/travel";
import { formatDateLabel } from "../lib/format";
import { flightStops, photoSpots } from "../data/mapPoints";

interface Props {
  days: DayPlan[];
  onOpenDay: (dayId: string) => void;
}

type MapMode = "japan" | "flights" | "photos";

function FitBounds({ points }: { points: Array<[number, number]> }) {
  const map = useMap();
  useMemo(() => {
    if (points.length > 1) {
      map.fitBounds(points as LatLngBoundsExpression, { padding: [28, 28], maxZoom: 11 });
    }
  }, [map, points]);
  return null;
}

export function TravelMap({ days, onOpenDay }: Props) {
  const [mode, setMode] = useState<MapMode>("japan");
  const japanDays = days.filter((day) => day.region !== "Internacional");
  const japanRoute = japanDays.map((day) => [day.coordinates.lat, day.coordinates.lng] as [number, number]);
  const flightRoute = flightStops.map((stop) => [stop.lat, stop.lng] as [number, number]);
  const photoRoute = photoSpots.map((spot) => [spot.lat, spot.lng] as [number, number]);
  const activePoints = mode === "flights" ? flightRoute : mode === "photos" ? photoRoute : japanRoute;

  return (
    <div className="map-surface">
      <div className="map-mode-tabs">
        <button className={mode === "japan" ? "active" : ""} onClick={() => setMode("japan")}><RouteIcon size={15} /> Japón</button>
        <button className={mode === "flights" ? "active" : ""} onClick={() => setMode("flights")}><Plane size={15} /> Vuelos</button>
        <button className={mode === "photos" ? "active" : ""} onClick={() => setMode("photos")}><MapPinned size={15} /> Fotos</button>
      </div>

      <MapContainer center={[36.2, 136.2]} zoom={5} scrollWheelZoom className="map-canvas">
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitBounds points={activePoints} />

        {mode === "japan" && <>
          <Polyline positions={japanRoute} pathOptions={{ color: "#ef5a4a", weight: 4, dashArray: "8 8" }} />
          {japanDays.map((day) => (
            <CircleMarker key={day.id} center={[day.coordinates.lat, day.coordinates.lng]} radius={7}
              pathOptions={{ color: "#081018", weight: 2, fillColor: day.optionalExtension ? "#6fb5ff" : "#ef5a4a", fillOpacity: 1 }}>
              <Popup><strong>{day.city}</strong><br />{day.japanese} {day.reading ? `（${day.reading}）` : ""}<br />
                {formatDateLabel(day.date)}<br /><button className="map-popup-button" onClick={() => onOpenDay(day.id)}>Abrir día</button></Popup>
            </CircleMarker>
          ))}
        </>}

        {mode === "flights" && <>
          <Polyline positions={flightRoute} pathOptions={{ color: "#f3c66b", weight: 4, dashArray: "10 8" }} />
          {flightStops.map((stop) => (
            <CircleMarker key={stop.id} center={[stop.lat, stop.lng]} radius={8}
              pathOptions={{ color: "#081018", weight: 2, fillColor: "#f3c66b", fillOpacity: 1 }}>
              <Popup><strong>{stop.name}</strong><br />{stop.subtitle}<br /><small>{stop.note}</small></Popup>
            </CircleMarker>
          ))}
        </>}

        {mode === "photos" && photoSpots.map((spot) => (
          <CircleMarker key={spot.id} center={[spot.lat, spot.lng]} radius={8}
            pathOptions={{ color: "#081018", weight: 2, fillColor: "#63d2a4", fillOpacity: 1 }}>
            <Popup><strong>{spot.name}</strong><br />{spot.subtitle}<br /><small>{spot.note}</small><br />
              {spot.mapsUrl && <a className="map-directions-link" href={spot.mapsUrl} target="_blank" rel="noreferrer">Abrir en Maps <ExternalLink size={12} /></a>}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      <div className="map-context">
        {mode === "flights" && <p><strong>Ida confirmada:</strong> MDE → BOG → MAD → PEK → KIX. Madrid: 12 h 55 min de escala. Beijing: 2 h 20 min.</p>}
        {mode === "photos" && <p><strong>Photo map:</strong> pines seleccionados por valor fotográfico y cercanía a la ruta. Cada popup tiene acceso directo a Google Maps.</p>}
        {mode === "japan" && <p><strong>Ruta terrestre:</strong> rojo = ruta base; azul = extensión norte opcional después de Año Nuevo.</p>}
      </div>
    </div>
  );
}
