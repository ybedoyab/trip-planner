import { Download } from "lucide-react";
import { Capacitor } from "@capacitor/core";
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
  const nativeApp = Capacitor.isNativePlatform();
  const [installed, setInstalled] = useState(() => nativeApp || isInstalled());
  const [webPromptAvailable, setWebPromptAvailable] = useState(false);
  const [offlineReady, setOfflineReady] = useState(() => nativeApp || Boolean(navigator.serviceWorker?.controller));

  useEffect(() => {
    const update = () => setOfflineReady(nativeApp || Boolean(navigator.serviceWorker?.controller));
    const complete = () => { setInstalled(true); dialog.current?.close(); };
    navigator.serviceWorker?.addEventListener("controllerchange", update);
    window.addEventListener("appinstalled", complete);
    update();
    return () => {
      navigator.serviceWorker?.removeEventListener("controllerchange", update);
      window.removeEventListener("appinstalled", complete);
    };
  }, [nativeApp]);

  function openInstallOptions() {
    setWebPromptAvailable(Boolean(installPrompt));
    dialog.current?.showModal();
  }

  async function installWeb() {
    const prompt = installPrompt;
    if (prompt && !installed) {
      installPrompt = null;
      setWebPromptAvailable(false);
      try {
        await prompt.prompt();
      } catch {
        // The dialog already shows the browser's manual installation steps.
      }
    }
  }

  return <div className="install-app">
    <button className="install-trigger" type="button" onClick={openInstallOptions}>
      <Download size={16} aria-hidden="true" /> {installed ? "Uso sin conexión" : "Instalar app"}
    </button>
    <dialog ref={dialog} className="install-dialog" aria-label="Instalar Japón 2026">
      <h2>{installed ? "Uso sin conexión" : "Instala Japón 2026"}</h2>
      {!nativeApp && <p><a className="android-download" href="https://github.com/ybedoyab/trip-planner/releases/download/android/japon-2026.apk">Descargar APK para Android</a></p>}
      {webPromptAvailable && !installed && <button type="button" onClick={installWeb}>Instalar versión web</button>}
      {!installed && <ul>
        <li><strong>iPhone</strong> · En Safari, toca Compartir → Añadir a pantalla de inicio → Añadir. Activa «Abrir como app web» si aparece.</li>
        <li><strong>Android</strong> · En Chrome, abre el menú ⋮ → Instalar aplicación o Añadir a pantalla de inicio.</li>
      </ul>}
      <p role="status">{offlineReady
        ? "El itinerario y los datos básicos para el viaje ya están disponibles sin conexión."
        : "Abre la app con conexión y espera a que termine de guardar los datos del viaje."}</p>
      {!nativeApp && <p>Si instalas la versión web, ábrela con conexión una vez antes del viaje.</p>}
      <p>La IA, las fotos externas y las páginas de reservas requieren internet.</p>
      <form method="dialog"><button type="submit">Cerrar</button></form>
    </dialog>
  </div>;
}
