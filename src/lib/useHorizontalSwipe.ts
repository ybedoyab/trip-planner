import { useRef, type PointerEvent } from "react";

export function useHorizontalSwipe(onSwipe: (direction: number) => void) {
  const start = useRef<{ id: number; x: number; y: number } | null>(null);
  return {
    onPointerDown(event: PointerEvent<HTMLElement>) {
      if (!event.isPrimary || event.button !== 0 || (event.target as Element).closest("a, button")) return;
      start.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    onPointerCancel() { start.current = null; },
    onPointerUp(event: PointerEvent<HTMLElement>) {
      const origin = start.current;
      start.current = null;
      if (origin?.id !== event.pointerId) return;
      const delta = event.clientX - origin.x;
      if (Math.abs(delta) >= 55 && Math.abs(delta) > 1.5 * Math.abs(event.clientY - origin.y)) onSwipe(Math.sign(delta));
    },
  };
}
