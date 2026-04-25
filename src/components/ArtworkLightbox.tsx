import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ArtworkLightboxProps {
  src: string;
  alt: string;
  children: React.ReactNode;
}

const ArtworkLightbox = ({ src, alt, children }: ArtworkLightboxProps) => {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [origin, setOrigin] = useState("50% 50%");
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setScale(1);
      setOrigin("50% 50%");
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation();
    setScale((prev) => Math.min(Math.max(prev + (e.deltaY < 0 ? 0.3 : -0.3), 1), 5));
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (scale <= 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  }, [scale]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-zoom-in">
        {children}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-6 right-6 z-[101] text-white/60 hover:text-white transition-colors duration-300"
              aria-label="Close"
            >
              <X size={24} />
            </button>

            <div
              className="w-full h-full flex items-center justify-center overflow-hidden p-8 md:p-16"
              onWheel={handleWheel}
              onMouseMove={handleMouseMove}
            >
              <img
                ref={imgRef}
                src={src}
                alt={alt}
                className="max-w-full max-h-full object-contain transition-transform duration-200 ease-out will-change-transform"
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: origin,
                  cursor: scale > 1 ? "grab" : "zoom-in",
                }}
                draggable={false}
              />
            </div>

            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[12px] tracking-[0.2em] uppercase text-white/30">
              {scale <= 1 ? "Scroll to zoom" : "Scroll to zoom · Click outside to close"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ArtworkLightbox;
