import "leaflet/dist/leaflet.css";
import { CircleMarker, MapContainer, Popup, Polyline, TileLayer } from "react-leaflet";
import type { DayPlan } from "../types/travel";
import { formatDateLabel } from "../lib/format";

interface Props {
  days: DayPlan[];
  onOpenDay: (dayId: string) => void;
}

export function TravelMap({ days, onOpenDay }: Props) {
  const route = days.map((day) => [day.coordinates.lat, day.coordinates.lng] as [number, number]);

  return (
    <MapContainer center={[36.2, 136.2]} zoom={5} scrollWheelZoom className="map-canvas">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline positions={route} pathOptions={{ color: "#ef5a4a", weight: 4, dashArray: "8 8" }} />
      {days.map((day) => (
        <CircleMarker
          key={day.id}
          center={[day.coordinates.lat, day.coordinates.lng]}
          radius={7}
          pathOptions={{
            color: "#081018",
            weight: 2,
            fillColor: day.optionalExtension ? "#6fb5ff" : "#ef5a4a",
            fillOpacity: 1,
          }}
        >
          <Popup>
            <strong>{day.city}</strong>
            <br />
            {day.japanese} {day.reading ? `（${day.reading}）` : ""}
            <br />
            {formatDateLabel(day.date)}
            <br />
            <button className="map-popup-button" onClick={() => onOpenDay(day.id)}>Abrir día</button>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
