/* eslint-disable prettier/prettier */
import { motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import antes1 from "@/assets/shape/antes-1.jpg";
import depois1 from "@/assets/shape/depois-1.jpg";
import antes2 from "@/assets/shape/antes-2.jpg";
import depois2 from "@/assets/shape/depois-2.jpg";
import antes3 from "@/assets/shape/antes-3.jpg";
import depois3 from "@/assets/shape/depois-3.jpg";

const pairs = [
  { antes: antes1, depois: depois1, name: "Aluno GC" },
  { antes: antes2, depois: depois2, name: "Aluno GC" },
  { antes: antes3, depois: depois3, name: "Aluno GC" },
];

function CompareSlider({ antes, depois, name }: { antes: string; depois: string; name: string }) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    updateFromClientX(e.clientX);
  };
  const onPointerUp = () => { dragging.current = false; };

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl border border-border select-none cursor-ew-resize touch-none"
    >
      {/* Depois (base, ocupa tudo) */}
      <img
        src={depois}
        alt={`${name} — depois`}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute top-3 right-3 text-[11px] font-bold tracking-wide uppercase text-white bg-neon px-3 py-1.5 rounded-full">
        Depois
      </div>

      {/* Antes (recortado pelo clip) */}
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img
          src={antes}
          alt={`${name} — antes`}
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute top-3 left-3 text-[11px] font-bold tracking-wide uppercase text-white bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/15">
          Antes
        </div>
      </div>

      {/* Linha + handle */}
      <div
        className="absolute inset-y-0 w-[2px] bg-white/90 pointer-events-none"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white flex items-center justify-center shadow-lg">
          <ArrowLeftRight className="h-4 w-4 text-black" />
        </div>
      </div>
    </div>
  );
}

export function BeforeAfter() {
  return (
    <section id="antes-depois" className="relative py-12 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-xl mb-8">
          <p style={{
            display: "inline-block",
            fontSize: 13, fontWeight: 800,
            letterSpacing: ".18em", textTransform: "uppercase",
            color: "#E10600", marginBottom: 12,
            borderBottom: "1.5px solid rgba(225,6,0,0.35)",
            paddingBottom: 4,
          }}>Transformações reais</p>
          <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight">
            Antes e depois.<br />
            <span className="text-muted-foreground">Arraste e veja a diferença.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {pairs.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <CompareSlider antes={p.antes} depois={p.depois} name={p.name} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
