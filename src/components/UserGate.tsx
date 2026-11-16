import { useTravel } from "../state/TravelProvider";

export function UserGate() {
  const { selectTraveler } = useTravel();

  return (
    <div className="user-gate">
      <div className="user-card">
        <span className="eyebrow">日本 2026</span>
        <h1>¿Quién eres?</h1>
        <p>Sin autenticación. El progreso y las reservas se guardan por separado en este dispositivo.</p>
        <div className="user-actions">
          <button onClick={() => selectTraveler("Yulian")}>Yulian</button>
          <button onClick={() => selectTraveler("Daniel")}>Daniel</button>
        </div>
      </div>
    </div>
  );
}
