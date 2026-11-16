import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useState } from "react";
import type { GalleryImage } from "../types/travel";

interface Props {
  images: GalleryImage[];
}

export function PhotoCarousel({ images }: Props) {
  const [index, setIndex] = useState(0);
  if (!images.length) return null;

  const current = images[index];
  const go = (direction: number) =>
    setIndex((currentIndex) => (currentIndex + direction + images.length) % images.length);

  return (
    <section className="photo-carousel">
      <div className="photo-stage">
        <img src={current.url} alt={current.alt} loading="lazy" />
        {images.length > 1 && (
          <>
            <button className="carousel-arrow left" onClick={() => go(-1)} aria-label="Foto anterior">
              <ChevronLeft />
            </button>
            <button className="carousel-arrow right" onClick={() => go(1)} aria-label="Foto siguiente">
              <ChevronRight />
            </button>
          </>
        )}
        <div className="photo-caption">
          <div>
            <strong>{current.title}</strong>
            <small>{current.credit}</small>
          </div>
          {current.sourceUrl && (
            <a href={current.sourceUrl} target="_blank" rel="noreferrer">
              Fuente <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>
      {images.length > 1 && (
        <div className="carousel-dots">
          {images.map((image, imageIndex) => (
            <button
              key={image.url}
              className={imageIndex === index ? "active" : ""}
              onClick={() => setIndex(imageIndex)}
              aria-label={`Ver foto ${imageIndex + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
