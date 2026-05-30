/* eslint-disable prettier/prettier */
import { motion } from "framer-motion";
import { CheckCircle2, Trophy } from "lucide-react";

export function WeeklyReport() {
  return (
    <section className="relative py-32 px-6">
      <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs uppercase tracking-widest text-neon mb-4">Relatório semanal</p>
          <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-6">
            Cada semana, um raio-X<br /> da sua evolução.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            Você recebe um relatório automatizado com tudo que importa: treinos
            concluídos, evolução, próximas metas e uma mensagem direta sua.
          </p>
          <ul className="space-y-3">
            {["Métricas objetivas, sem achismo", "Comparativo semana a semana", "Próximos passos definidos", "Mensagem do treinador"].map((t) => (
              <li key={t} className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="h-5 w-5 text-neon" /> {t}
              </li>
            ))}
          </ul>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl glass p-6 md:p-8 relative"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-xs text-muted-foreground">Relatório · Semana 08</div>
              <div className="font-display text-2xl font-semibold">11–17 nov · 2025</div>
            </div>
            <div className="h-10 w-10 rounded-full bg-neon/20 grid place-items-center text-neon">
              <Trophy className="h-5 w-5" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { l: "Treinos", v: "5/5" },
              { l: "Volume", v: "12.4t" },
              { l: "Calorias", v: "3.2k" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl bg-card border border-border p-4 text-center">
                <div className="font-display text-2xl font-bold text-neon">{s.v}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-card border border-border p-4 mb-4">
            <div className="text-xs text-muted-foreground mb-3">Metas da semana</div>
            {[
              { t: "5 treinos completos", p: 100 },
              { t: "Hidratação 3L/dia", p: 86 },
              { t: "Sono 7h+", p: 71 },
            ].map((g) => (
              <div key={g.t} className="mb-3 last:mb-0">
                <div className="flex justify-between text-xs mb-1">
                  <span>{g.t}</span>
                  <span className="text-neon font-semibold">{g.p}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${g.p}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }} className="h-full bg-neon" />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-neon/5 border border-neon/20 p-4 text-sm leading-relaxed">
            <span className="text-neon font-semibold">"</span>
            Semana sólida. Sua constância é a sua maior vantagem competitiva.
            Próxima semana subimos a intensidade no superior.
            <span className="text-neon font-semibold">"</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}