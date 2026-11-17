import { stays } from "../data/stays";
import { useTravel } from "../state/TravelProvider";

const details: Record<string, { url: string; hours: string; direct?: boolean }> = {
  "ibis Styles Kyoto Station": { url: "https://all.accor.com/hotel/9418/index.en.shtml", hours: "Entrada desde las 14:00 · salida hasta las 11:00." },
  "Piece Hostel Kyoto": { url: "https://piecehotel.com/hotels/piecehostelkyoto", hours: "Entrada 16:00–23:00 · salida hasta las 11:00. Habitación privada según disponibilidad. Avisar si llegan después de las 23:00." },
  "Airbnb cerca de Daikokuchō": { url: "https://www.airbnb.com/rooms/36128728", hours: "Entrada autónoma con caja de llaves. Confirmar hora y equipaje con el anfitrión.", direct: true },
  "Tokyu Stay Hakata": { url: "https://www.tokyustay.co.jp/en/hotel/hakata-fukuoka/", hours: "Consultar condiciones de entrada, salida y lavadora según habitación." },
  "Hotel Granvia Hiroshima": { url: "https://www.hgh.co.jp/english/index.html", hours: "Entrada desde las 14:00 · salida hasta las 12:00. Conectado directamente a JR Hiroshima." },
  "Fairfield by Marriott Kumamoto Aso": { url: "https://www.marriott.com/en-us/hotels/kmjfi-fairfield-kumamoto-aso/overview/", hours: "Entrada desde las 15:00 · salida hasta las 11:00." },
  "Hotel Sardonyx Ueno": { url: "https://www.hotel-sardonyx.com/ueno/en/faq/", hours: "El hotel publica consigna antes de la entrada y después de la salida. Consultar horarios y tipo de cama." },
  "Airbnb en Okachimachi": { url: "https://www.airbnb.com/okachimachi-japan/stays", hours: "Buscar alojamiento entero y entrada autónoma. Horarios y consigna dependen del anuncio.", direct: true },
  "JR Inn Sapporo": { url: "https://www.jr-inn.jp/sapporo/qa_en/", hours: "Entrada desde las 15:00 · salida hasta las 10:00. Pueden dejar maletas antes de la entrada; avisar si llegan después de medianoche." },
};

const labelDate = (date: string) => new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(date));

export function LodgingView() {
  const { state, traveler, selectStay } = useTravel();
  const choices = traveler ? state.progress[traveler].lodgingChoices : undefined;

  return <section className="section-block journey lodging-list">
    <h2>Alojamientos por tramo</h2>
    <p>Opciones para dos adultos. Una favorita es una preselección. Las tarifas y cupos se consultan en cada plataforma. Las horas propuestas son locales y dependen de los billetes y horarios confirmados.</p>
    <p>Para cambios de ciudad, comprueben si guardan equipaje el mismo día. En Airbnb, confirmen el acceso y la custodia de maletas con el anfitrión. <a href="https://www.reddit.com/r/JapanTravelTips/comments/15becbc/airbnb_vs_hotels/" target="_blank" rel="noreferrer">Experiencias de viajeros</a></p>
    {stays.map(([start, end, city, station, schedule, ...options]) => <article className="discovery-card" key={start}>
      <span className="eyebrow">{labelDate(start)} → {labelDate(end)} · entrada y salida</span>
      <h3>{city}</h3>
      <p><strong>Base</strong> {station}</p>
      <p>{schedule}</p>
      {options.map((name) => {
        const info = details[name];
        const selected = choices?.[start] === name;
        const booking = new URLSearchParams({ ss: name, checkin: start, checkout: end, group_adults: "2", no_rooms: "1", group_children: "0" });
        const maps = new URLSearchParams({ api: "1", query: name + " " + city });
        return <div className="lodging-option" key={name}>
          <h4>{name}</h4>
          <p>{info?.hours ?? "Confirmen entrada, salida, recepción nocturna y consigna en las condiciones de la opción elegida."}</p>
          <div className="journey-actions">
            {info?.direct
              ? <a href={info.url} target="_blank" rel="noreferrer">Ver en Airbnb</a>
              : <>
                <a href={`https://www.booking.com/searchresults.es.html?${booking}`} target="_blank" rel="noreferrer">Buscar en Booking</a>
                {info && <a href={info.url} target="_blank" rel="noreferrer">Sitio oficial</a>}
              </>}
            {!info?.direct && <a href={`https://www.google.com/maps/search/?${maps}`} target="_blank" rel="noreferrer">Mapa y reseñas</a>}
            <button aria-pressed={selected} onClick={() => selectStay(start, selected ? null : name)}>{selected ? "Favorita guardada" : "Guardar favorita"}</button>
          </div>
        </div>;
      })}
    </article>)}
  </section>;
}
