/* eslint-disable prettier/prettier */
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import t1 from "@/assets/transform-1.jpg";
import t2 from "@/assets/transform-2.jpg";
import t3 from "@/assets/transform-3.jpg";

const cases = [
  { img: t1, name: "Rafael M.", change: "-14 kg", time: "20 semanas", quote: "Voltei a confiar no espelho. Método claro, ajuste constante." },
  { img: t2, name: "Camila S.", change: "+6 kg massa magra", time: "16 semanas", quote: "Primeira vez que vejo evolução semana após semana, com leveza." },
  { img: t3, name: "Bruno A.", change: "+22% força", time: "12 semanas", quote: "Saí do platô em 4 semanas. O GC entende performance de verdade." },
];

export function Results() {
  return (
    <section id="resultados" className="relative py-12 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div className="max-w-xl">
            <p style={{
              display: "inline-block",
              fontSize: 13, fontWeight: 800,
              letterSpacing: ".18em", textTransform: "uppercase",
              color: "#00FF88", marginBottom: 12,
              borderBottom: "1.5px solid rgba(0,255,136,0.35)",
              paddingBottom: 4,
            }}>Prova social</p>
            <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight">
              Quem entra, evolui.<br />
              <span className="text-muted-foreground">E não volta a treinar sem método.</span>
            </h2>
          </div>
          <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
            <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-neon text-neon" />)}</div>
            <span className="text-sm font-medium">4.9 · 320+ avaliações</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {cases.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative rounded-3xl overflow-hidden bg-card border border-border hover:border-neon/40 transition-all"
            >
              {/* Imagem portrait */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img src={c.img} alt={c.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                <div className="absolute top-3 left-3 text-sm font-bold text-neon px-3 py-1.5 border border-neon/30 bg-black/60 backdrop-blur-sm rounded-full">
                  {c.change}
                </div>
              </div>

              {/* Área de texto compacta */}
              <div className="p-3">
                <p className="text-xs leading-relaxed text-foreground/80 border-l-2 border-neon/30 pl-3">"{c.quote}"</p>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">{c.name}</div>
                    <div className="text-xs text-muted-foreground">Aluno GC</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{c.time}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}