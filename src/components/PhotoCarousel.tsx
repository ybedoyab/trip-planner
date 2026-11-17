import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, type PropsWithChildren } from "react";
import { useHorizontalSwipe } from "../lib/useHorizontalSwipe";
import type { GalleryImage } from "../types/travel";

export function PhotoCarousel({ images, children }: PropsWithChildren<{ images: GalleryImage[] }>) {
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState<string[]>([]);
  const available = images.filter((image) => !failed.includes(image.url));
  const position = Math.min(index, available.length - 1);
  const current = available[position];
  const go = (direction: number) => {
    if (available.length > 1) setIndex((position + direction + available.length) % available.length);
  };
  const swipe = useHorizontalSwipe((direction) => go(-direction));

  return <section className="day-hero journey-hero" aria-label="Resumen y fotografías del día" {...swipe}>
    {current && <img key={current.url} className="day-hero-media"
      src={current.url} alt={current.alt} draggable={false}
      onError={() => setFailed((previous) => [...previous, current.url])} />}
    {available.length > 1 && <div className="hero-controls">
      <button onClick={() => go(-1)} aria-label="Foto anterior"><ChevronLeft /></button>
      <span aria-live="polite">{position + 1} / {available.length}</span>
      <button onClick={() => go(1)} aria-label="Foto siguiente"><ChevronRight /></button>
    </div>}
    <div className="hero-copy">
      {children}
      {current && <small>{current.title} · {current.sourceUrl
        ? <a href={current.sourceUrl} target="_blank" rel="noreferrer">{current.credit}</a>
        : current.credit}
        {current.mapsUrl && <> · <a href={current.mapsUrl} target="_blank" rel="noreferrer">Mapa y reseñas</a></>}
      </small>}
    </div>
  </section>;
}
