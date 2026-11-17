import "leaflet/dist/leaflet.css";
import { ExternalLink, Plane, Route as RouteIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CircleMarker, GeoJSON, MapContainer, Pane, Popup, Polyline, TileLayer, useMap } from "react-leaflet";
import type { GeoJsonObject } from "geojson";
import { Capacitor } from "@capacitor/core";
import { OfflineStreets } from "./OfflineStreets";
import type { LatLngBoundsExpression } from "leaflet";
import type { DayPlan } from "../types/travel";
import { formatDateLabel } from "../lib/format";
import { flightStops } from "../data/mapPoints";
import { buildMapGroups, mapLayers, type MapLayer } from "../data/mapOverlays";

interface Props {
  days: DayPlan[];
  onOpenDay: (dayId: string) => void;
}

type MapMode = "japan" | "flights";
const flightRoute: Array<[number, number]> = flightStops.map((stop) => [stop.lat, stop.lng]);
const layers = Object.keys(mapLayers) as MapLayer[];
const colors: Record<MapLayer, string> = { photos: "#63d2a4", dining: "#fa9d69", lodging: "#b7a1ff" };

function FitBounds({ points }: { points: Array<[number, number]> }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 1) map.setView(points[0], 13, { animate: false });
    if (points.length > 1) {
      map.fitBounds(points as LatLngBoundsExpression, { padding: [28, 28], maxZoom: 11, animate: false });
    }
  }, [map, points]);
  return null;
}

function OfflineOverview() {
  const [data, setData] = useState<GeoJsonObject | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/maps/world-overview.geojson", { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then(setData)
      .catch(() => {});
    return () => controller.abort();
  }, []);
  return data && <GeoJSON data={data} interactive={false} style={{ color: "#637c88", weight: 1, fillColor: "#334e51", fillOpacity: .75 }} />;
}

export function TravelMap({ days, onOpenDay }: Props) {
  const [mode, setMode] = useState<MapMode>("japan");
  const [online, setOnline] = useState(navigator.onLine);
  const [streetsReady, setStreetsReady] = useState(false);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  const [enabled, setEnabled] = useState<Record<MapLayer, boolean>>({ photos: false, dining: false, lodging: false });
  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  const [focus, setFocus] = useState<Array<[number, number]> | null>(null);
  const japanDays = useMemo(() => days.filter((day) => day.region !== "Internacional"), [days]);
  const japanRoute = useMemo(() => japanDays.map((day) => [day.coordinates.lat, day.coordinates.lng] as [number, number]), [japanDays]);
  const groups = useMemo(() => buildMapGroups(days), [days]);
  const visibleGroups = groups.filter((group) => enabled[group.layer])
    .map((group) => ({ ...group, places: group.places.filter((place) => !hidden[place.id]) }))
    .filter((group) => group.places.length);
  const activePoints = focus ?? (mode === "flights" ? flightRoute : japanRoute);

  return (
    <div className="map-surface">
      <div className="map-mode-tabs">
        <button aria-pressed={mode === "japan"} className={mode === "japan" ? "active" : ""} onClick={() => { setMode("japan"); setFocus(null); }}><RouteIcon size={15} /> Japón</button>
        <button aria-pressed={mode === "flights"} className={mode === "flights" ? "active" : ""} onClick={() => { setMode("flights"); setFocus(null); }}><Plane size={15} /> Vuelos</button>
      </div>
      <div className="map-mode-tabs" role="group" aria-label="Capas del mapa">
        {layers.map((layer) => <button key={layer} aria-pressed={enabled[layer]}
          className={enabled[layer] ? "active" : ""}
          onClick={() => setEnabled((current) => ({ ...current, [layer]: !current[layer] }))}>
          <span className="map-layer-dot" style={{ backgroundColor: colors[layer] }} /> {mapLayers[layer]}
        </button>)}
      </div>

      {!online && <p className="operation-note">{streetsReady
        ? "Sin conexión. Calles descargadas alrededor de los destinos. Acércate a una zona para ver el detalle."
        : "Sin conexión. Mapa general de Natural Earth con ruta, puntos y vuelos."}</p>}
      <MapContainer id="trip-map" center={[36.2, 136.2]} zoom={5} scrollWheelZoom zoomAnimation={false} className={online ? "map-canvas" : "map-canvas map-offline"}>
        {online && <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />}
        {!online && <Pane name="offline-basemap" style={{ zIndex: 250 }}><OfflineOverview /></Pane>}
        {!online && Capacitor.isNativePlatform() && <Pane name="offline-streets" style={{ zIndex: 300 }}>
          <OfflineStreets onReady={setStreetsReady} />
        </Pane>}
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

        {visibleGroups.map((group) => (
          <CircleMarker key={group.id} center={group.center} radius={group.layer === "lodging" ? 12 : 8}
            className={`map-pin-${group.layer}`} pathOptions={{ color: colors[group.layer], weight: 3, fillOpacity: .65 }}>
            <Popup><strong>{group.title}</strong>
              {group.approximate && <p>Marcador de referencia. Consulta cada ubicación en su enlace.</p>}
              {group.places.map((place) => <p key={place.id}>
                {place.url ? <a href={place.url} target="_blank" rel="noreferrer">{place.name} <ExternalLink size={12} /></a> : place.name}
                {place.note && <><br /><small>{place.note}</small></>}
              </p>)}
              {group.dayId && <button className="map-popup-button" onClick={() => onOpenDay(group.dayId!)}>Abrir día</button>}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      <div className="map-context">
        {mode === "flights" && <ol className="flight-stops">
          {flightStops.map((stop) => <li key={stop.id}>
            <strong>{stop.name}</strong><span>{stop.subtitle}</span><small>{stop.note}</small>
          </li>)}
        </ol>}
        {mode === "flights" && <p><strong>Ida confirmada:</strong> MDE → BOG → MAD → PEK → KIX. Madrid: 12 h 55 min de escala. Beijing: 2 h 20 min.</p>}
        {mode === "japan" && <p><strong>Ruta terrestre:</strong> rojo = ruta base; azul = extensión norte opcional después de Año Nuevo.</p>}
        {layers.map((layer) => enabled[layer] && <details key={layer} className="map-layer-list">
          <summary>{mapLayers[layer]} · {visibleGroups.filter((group) => group.layer === layer).reduce((sum, group) => sum + group.places.length, 0)} visibles</summary>
          {groups.filter((group) => group.layer === layer).map((group) => <fieldset key={group.id}>
            <legend>{group.title}</legend>
            <button className="map-popup-button" onClick={() => {
              setFocus([group.center]);
              document.getElementById("trip-map")?.scrollIntoView({ block: "center" });
            }}>Centrar mapa</button>
            {group.places.map((place) => <div className="map-place" key={place.id}>
              <label><input type="checkbox" checked={!hidden[place.id]}
                onChange={(event) => { const checked = event.target.checked; setHidden((current) => ({ ...current, [place.id]: !checked })); }} /> {place.name}</label>
              {place.url && <a href={place.url} target="_blank" rel="noreferrer">{place.url.startsWith("https://www.airbnb.com/") ? "Airbnb" : "Maps"}</a>}
            </div>)}
          </fieldset>)}
        </details>)}
      </div>
    </div>
  );
}
