import { Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface InstallPrompt extends Event {
  prompt(): Promise<{ outcome: "accepted" | "dismissed" }>;
}

let installPrompt: InstallPrompt | null = null;
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event as InstallPrompt;
});
window.addEventListener("appinstalled", () => { installPrompt = null; });

function isInstalled() {
  return window.matchMedia("(display-mode: standalone)").matches
    || Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
}

export function InstallApp() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [installed, setInstalled] = useState(isInstalled);
  const [offlineReady, setOfflineReady] = useState(Boolean(navigator.serviceWorker?.controller));

  useEffect(() => {
    const update = () => setOfflineReady(Boolean(navigator.serviceWorker?.controller));
    const complete = () => { setInstalled(true); dialog.current?.close(); };
    navigator.serviceWorker?.addEventListener("controllerchange", update);
    window.addEventListener("appinstalled", complete);
    update();
    return () => {
      navigator.serviceWorker?.removeEventListener("controllerchange", update);
      window.removeEventListener("appinstalled", complete);
    };
  }, []);

  async function install() {
    const prompt = installPrompt;
    if (prompt && !installed) {
      installPrompt = null;
      try {
        const choice = await prompt.prompt();
        if (choice.outcome === "accepted") return;
      } catch {
        // Show the browser-specific instructions if its prompt is unavailable.
      }
    }
    dialog.current?.showModal();
  }

  return <div className="install-app">
    <button className="install-trigger" type="button" onClick={install}>
      <Download size={16} aria-hidden="true" /> {installed ? "Uso sin conexión" : "Instalar app"}
    </button>
    <dialog ref={dialog} className="install-dialog" aria-label="Instalar Japón 2026">
      <h2>{installed ? "Uso sin conexión" : "Instala Japón 2026"}</h2>
      {!installed && <ul>
        <li><strong>iPhone</strong> · En Safari, toca Compartir → Añadir a pantalla de inicio → Añadir. Activa «Abrir como app web» si aparece.</li>
        <li><strong>Android</strong> · En Chrome, abre el menú ⋮ → Instalar aplicación o Añadir a pantalla de inicio.</li>
      </ul>}
      <p role="status">{offlineReady
        ? "El itinerario y los datos básicos para el viaje ya están disponibles sin conexión."
        : "Abre la app con conexión y espera a que termine de guardar los datos del viaje."}</p>
      <p>Abre el icono con conexión una vez antes del viaje. El mapa de calles, las fotos externas, la IA y las páginas externas requieren conexión.</p>
      <form method="dialog"><button type="submit">Cerrar</button></form>
    </dialog>
  </div>;
}
