/* eslint-disable prettier/prettier */
import { motion } from "framer-motion";
import { ClipboardList, Dumbbell, TrendingUp } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Assine seu plano",
    desc: "Escolha o plano ideal pro seu objetivo e nível. Em minutos você já tem acesso à plataforma e o Guilherme começa a montar seu treino.",
  },
  {
    number: "02",
    icon: Dumbbell,
    title: "Receba seu treino",
    desc: "Treino personalizado entregue diretamente na plataforma — para academia ou casa. Vídeos, séries, cargas e notas do coach incluídos.",
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Evolua com acompanhamento",
    desc: "Registre seus treinos, fotos e medidas. O Guilherme acompanha sua evolução e ajusta o plano conforme você avança.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="relative py-28 px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(0,255,136,0.05),transparent_55%)]" />

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p style={{
            display: "inline-block",
            fontSize: 13, fontWeight: 800,
            letterSpacing: ".18em", textTransform: "uppercase",
            color: "#00FF88", marginBottom: 16,
            borderBottom: "1.5px solid rgba(0,255,136,0.35)",
            paddingBottom: 4,
          }}>
            Simples assim
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight">
            Como funciona
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-base leading-relaxed">
            Do primeiro acesso ao resultado — tudo num processo direto, sem complicação.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          <div
            className="hidden md:block absolute top-10 left-[calc(16.66%+16px)] right-[calc(16.66%+16px)] h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(0,255,136,0.3), transparent)" }}
          />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.15 }}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 24,
                  padding: "32px 28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                  position: "relative",
                  boxShadow: 'inset 0 1px 0 rgba(0,255,136,0.1)'
                }}
              >
                <div style={{
                  position: "absolute", top: -16, left: 28,
                  background: "#00FF88", color: "#000",
                  fontWeight: 800, fontSize: 12,
                  letterSpacing: "0.1em",
                  borderRadius: 99,
                  padding: "4px 12px",
                  fontFamily: "var(--font-display, inherit)",
                }}>
                  {step.number}
                </div>

                <div style={{
                  width: 48, height: 48,
                  background: "rgba(0,255,136,0.1)",
                  borderRadius: 14,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginTop: 8,
                }}>
                  <Icon size={22} color="#00FF88" strokeWidth={1.5} />
                </div>

                <div>
                  <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>
                    {step.title}
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.7 }}>
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-14"
        >
          <a
            href="#quiz"
            className="inline-flex items-center gap-2 rounded-full bg-neon text-black px-8 py-4 font-semibold neon-glow hover:scale-[1.02] transition-all text-sm"
          >
            Fazer o diagnóstico gratuito
          </a>
        </motion.div>
      </div>
    </section>
  );
}