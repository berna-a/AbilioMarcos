import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useT } from "@/i18n";

interface ArtworkLightboxProps {
  src: string;
  alt: string;
  children: React.ReactNode;
}

const MAX_SCALE = 5;
const MIN_SCALE = 1;
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
const isTouchDevice = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);

/**
 * Visualizador em ecrã cheio com zoom.
 * Desktop: scroll para ampliar, arrastar para mover, duplo-clique alterna zoom.
 * Telemóvel: pinça (dois dedos) para ampliar, arrastar com um dedo para mover.
 */
const ArtworkLightbox = ({ src, alt, children }: ArtworkLightboxProps) => {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [gesturing, setGesturing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const gesture = useRef({
    mode: "none" as "none" | "pan" | "pinch",
    startDist: 0, startScale: 1, startTx: 0, startTy: 0, startX: 0, startY: 0,
  });

  const reset = () => { setScale(1); setTx(0); setTy(0); };

  // Limita o arrasto para a imagem não desaparecer do ecrã
  const clampPan = useCallback((nx: number, ny: number, s: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: nx, y: ny };
    const maxX = (rect.width * (s - 1)) / 2;
    const maxY = (rect.height * (s - 1)) / 2;
    return { x: clamp(nx, -maxX, maxX), y: clamp(ny, -maxY, maxY) };
  }, []);

  const applyScale = useCallback((next: number) => {
    const s = clamp(next, MIN_SCALE, MAX_SCALE);
    setScale(s);
    if (s === 1) { setTx(0); setTy(0); }
    else setTx((px) => clampPan(px, ty, s).x);
    return s;
  }, [ty, clampPan]);

  useEffect(() => {
    if (open) { document.body.style.overflow = "hidden"; reset(); }
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  // ── Desktop: scroll ──
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation();
    applyScale(scale + (e.deltaY < 0 ? 0.3 : -0.3));
  }, [scale, applyScale]);

  // ── Desktop: arrastar com o rato ──
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (scale <= 1) return;
    const g = gesture.current;
    g.mode = "pan"; g.startX = e.clientX; g.startY = e.clientY; g.startTx = tx; g.startTy = ty;
    setGesturing(true);
  }, [scale, tx, ty]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const g = gesture.current;
    if (g.mode !== "pan") return;
    const { x, y } = clampPan(g.startTx + (e.clientX - g.startX), g.startTy + (e.clientY - g.startY), scale);
    setTx(x); setTy(y);
  }, [scale, clampPan]);

  const endMouse = useCallback(() => { gesture.current.mode = "none"; setGesturing(false); }, []);

  // ── Telemóvel: toque ──
  const dist = (t1: React.Touch, t2: React.Touch) => Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const g = gesture.current;
    if (e.touches.length === 2) {
      g.mode = "pinch"; g.startDist = dist(e.touches[0], e.touches[1]); g.startScale = scale;
      setGesturing(true);
    } else if (e.touches.length === 1 && scale > 1) {
      g.mode = "pan"; g.startX = e.touches[0].clientX; g.startY = e.touches[0].clientY; g.startTx = tx; g.startTy = ty;
      setGesturing(true);
    }
  }, [scale, tx, ty]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const g = gesture.current;
    if (g.mode === "pinch" && e.touches.length === 2) {
      const d = dist(e.touches[0], e.touches[1]);
      applyScale(g.startScale * (d / g.startDist));
    } else if (g.mode === "pan" && e.touches.length === 1) {
      const { x, y } = clampPan(g.startTx + (e.touches[0].clientX - g.startX), g.startTy + (e.touches[0].clientY - g.startY), scale);
      setTx(x); setTy(y);
    }
  }, [scale, applyScale, clampPan]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 0) { gesture.current.mode = "none"; setGesturing(false); }
  }, []);

  const handleDoubleClick = useCallback(() => {
    if (scale > 1) reset(); else applyScale(2.5);
  }, [scale, applyScale]);

  const hint = isTouchDevice
    ? (scale <= 1 ? t.lightbox.hintTouch : t.lightbox.hintTouchZoomed)
    : (scale <= 1 ? t.lightbox.hintDesktop : t.lightbox.hintDesktopZoomed);

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-zoom-in">
        {children}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-6 right-6 z-[101] text-white/60 hover:text-white transition-colors duration-300"
              aria-label={t.lightbox.close}
            >
              <X size={24} />
            </button>

            <div
              ref={containerRef}
              className="w-full h-full flex items-center justify-center overflow-hidden p-8 md:p-16 touch-none"
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={endMouse}
              onMouseLeave={endMouse}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onDoubleClick={handleDoubleClick}
            >
              <img
                src={src}
                alt={alt}
                className="max-w-full max-h-full object-contain will-change-transform select-none"
                style={{
                  transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
                  transition: gesturing ? "none" : "transform 0.18s ease-out",
                  cursor: scale > 1 ? "grab" : "zoom-in",
                }}
                draggable={false}
              />
            </div>

            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[12px] tracking-[0.2em] uppercase text-white/30 text-center px-4">
              {hint}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ArtworkLightbox;
