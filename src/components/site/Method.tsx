import { motion } from "framer-motion";
import { Search, Map, Dumbbell, LineChart, Rocket } from "lucide-react";

const steps = [
  { icon: Search, title: "Diagnóstico", text: "Avaliação completa: histórico, biomecânica, rotina, objetivos." },
  { icon: Map, title: "Estratégia", text: "Planejamento de mesociclos com metas claras e mensuráveis." },
  { icon: Dumbbell, title: "Execução", text: "Treinos detalhados com vídeo, carga e tempo sob tensão." },
  { icon: LineChart, title: "Acompanhamento", text: "Check-ins semanais, ajustes finos, suporte contínuo." },
  { icon: Rocket, title: "Evolução", text: "Progressão controlada, novos ciclos, novos picos." },
];

export function Method() {
  return (
    <section id="metodo" className="relative py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-xs uppercase tracking-widest text-neon mb-4">Método GC</p>
          <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight">
            5 etapas. Um sistema. <span className="text-neon">Resultado real.</span>
          </h2>
        </div>

        <div className="relative">
          {/* connecting line */}
          <div className="hidden lg:block absolute left-0 right-0 top-12 h-px bg-gradient-to-r from-transparent via-neon/40 to-transparent" />

          <div className="grid lg:grid-cols-5 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative text-center"
              >
                <div className="relative mx-auto h-24 w-24 mb-6">
                  <div className="absolute inset-0 rounded-full bg-card border border-border" />
                  <div className="absolute inset-2 rounded-full glass grid place-items-center text-neon">
                    <s.icon className="h-8 w-8" />
                  </div>
                  <div className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-neon text-black grid place-items-center text-xs font-bold">
                    {i + 1}
                  </div>
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}