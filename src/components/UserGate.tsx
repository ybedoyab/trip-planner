import { useState } from "react";
import { categories, type Category } from "../data/discovery";
import { useTravel } from "../state/TravelProvider";
import { InstallApp } from "./InstallApp";

export function UserGate() {
  const { traveler, selectTraveler, clearTraveler, finishOnboarding } = useTravel();
  const [preferences, setPreferences] = useState<Category[]>([]);
  const [ready, setReady] = useState(false);
  return (
    <div className="user-gate">
      <div className="user-card journey">
        <span className="eyebrow">日本 2026 · {traveler ? ready ? "3" : "2" : "1"} de 3</span>
        {!traveler ? <>
          <h1>¿Quién viaja?</h1>
          <p>Cada viajero tiene su propio progreso y sus propios guardados en este dispositivo.</p>
          <div className="user-actions">
            <button onClick={() => selectTraveler("Yulian")}>Yulian</button>
            <button onClick={() => selectTraveler("Daniel")}>Daniel</button>
          </div>
        </> : ready ? <>
          <h1>Tu viaje, a tu ritmo</h1>
          <p>Abre un día desde Ruta. En Explorar, desliza a la derecha para guardar o a la izquierda para descartar. También puedes tocar los botones.</p>
          <p>Guardados reúne tus ideas para cuando tengas tiempo libre.</p>
          <button onClick={() => finishOnboarding(preferences)}>Empezar viaje</button>
          <button onClick={() => setReady(false)}>Atrás</button>
        </> : <>
          <h1>¿Qué te interesa?</h1>
          <p>Elige qué quieres ver primero al explorar.</p>
          <div className="journey-actions">
            {categories.map((category) => <button key={category} aria-pressed={preferences.includes(category)}
              onClick={() => setPreferences((current) => current.includes(category) ? current.filter((item) => item !== category) : [...current, category])}>{category}</button>)}
          </div>
          <button onClick={() => setReady(true)}>Continuar</button>
          <button onClick={clearTraveler}>Cambiar viajero</button>
        </>}
        <InstallApp />
      </div>
    </div>
  );
}
