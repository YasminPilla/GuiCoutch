/* eslint-disable prettier/prettier */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import antes1 from "@/assets/shape/antes-1.jpg";
import depois1 from "@/assets/shape/depois-1.jpg";
import antes2 from "@/assets/shape/antes-2.jpg";
import depois2 from "@/assets/shape/depois-2.jpg";
import antes3 from "@/assets/shape/antes-3.jpg";
import depois3 from "@/assets/shape/depois-3.jpg";
import antes4 from "@/assets/shape/antes-4.jpg";
import depois4 from "@/assets/shape/depois-4.jpg";

const pairs = [
  { antes: antes1, depois: depois1, name: "Aluno GC" },
  { antes: antes2, depois: depois2, name: "Aluno GC" },
  { antes: antes3, depois: depois3, name: "Aluno GC" },
  { antes: antes4, depois: depois4, name: "Aluno GC" },
];

function CompareSlider({ antes, depois, name, onOpen }: { antes: string; depois: string; name: string; onOpen: (src: string, alt: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      <button
        type="button"
        onClick={() => onOpen(antes, `${name} — antes`)}
        className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-border cursor-zoom-in"
      >
        <img
          src={antes}
          alt={`${name} — antes`}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute top-3 left-3 text-[11px] font-bold tracking-wide uppercase text-white bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/15">
          Antes
        </div>
      </button>
      <button
        type="button"
        onClick={() => onOpen(depois, `${name} — depois`)}
        className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-border cursor-zoom-in"
      >
        <img
          src={depois}
          alt={`${name} — depois`}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute top-3 right-3 text-[11px] font-bold tracking-wide uppercase text-white bg-neon px-3 py-1.5 rounded-full">
          Depois
        </div>
      </button>
    </div>
  );
}

export function BeforeAfter() {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  return (
    <section id="antes-depois" className="relative py-12 px-6">
      <div className="mx-auto max-w-6xl">
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
            <span className="text-muted-foreground">Resultados reais de alunos.</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {pairs.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <CompareSlider antes={p.antes} depois={p.depois} name={p.name} onOpen={(src, alt) => setLightbox({ src, alt })} />
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-6 cursor-zoom-out"
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              className="absolute top-5 right-5 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.img
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={lightbox.src}
              alt={lightbox.alt}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain cursor-default"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
