/* eslint-disable prettier/prettier */
import { motion } from "framer-motion";
import { ArrowRight, Play, LogIn } from "lucide-react";
import heroImg from "@/assets/hero-trainer.jpg";

interface HeroProps {
  onAccessStudentArea?: () => void;
  onAccessadmin_dashboard?: () => void;
}

const stats = [
  { v: "850+", l: "Alunos transformados" },
  { v: "94%", l: "Taxa de retenção" },
  { v: "12", l: "Anos de experiência" },
];

export function Hero({ onAccessStudentArea, onAccessadmin_dashboard }: HeroProps) {
  return (
    <section id="top" className="relative min-h-screen overflow-hidden pt-28 pb-20 grain">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,255,136,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,255,136,0.05),transparent_50%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left */}
        <div className="lg:col-span-7 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground mb-8"
          >
            <span className="h-2 w-2 rounded-full bg-neon animate-pulse-glow" />
            Vagas abertas para 2026 · Turma limitada
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight"
          >
            Transforme<br />
            seu corpo com{" "}
            <span className="relative inline-block">
              <span className="text-neon">método</span>
              <svg className="absolute -bottom-2 left-0 w-full" height="10" viewBox="0 0 200 10">
                <path d="M0 5 Q 100 -5 200 5" stroke="#00FF88" strokeWidth="2" fill="none" />
              </svg>
            </span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-8 text-lg text-muted-foreground max-w-xl leading-relaxed"
          >
            Acompanhamento personalizado para resultados reais — treino,
            evolução e suporte contínuo numa plataforma profissional de alto desempenho.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex flex-wrap gap-4 items-center"
          >
            <a
              href="#quiz"
              className="group inline-flex items-center gap-2 rounded-full bg-neon text-black px-7 py-4 font-semibold neon-glow hover:scale-[1.02] transition-all"
            >
              Começar Agora
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#resultados"
              className="inline-flex items-center gap-2 rounded-full glass px-7 py-4 font-medium hover:bg-white/5 transition-all"
            >
              <Play className="h-4 w-4 text-neon" />
              Ver Resultados
            </a>
            
            {/* Link discreto para Admin */}
            <button
              onClick={onAccessadmin_dashboard}
              className="ml-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-neon transition-colors"
            >
              <LogIn className="h-3 w-3" />
              Admin
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-16 grid grid-cols-3 gap-6 max-w-xl"
          >
            {stats.map((s) => (
              <div key={s.l} className="border-l border-border pl-4">
                <div className="font-display text-3xl md:text-4xl font-bold text-neon">
                  {s.v}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right - portrait */}
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="lg:col-span-5 relative"
        >
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden">
            <img
              src={heroImg}
              alt="Guilherme Couto, personal trainer"
              className="absolute inset-0 h-full w-full object-cover"
              width={1080}
              height={1440}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl" />

            {/* Floating card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute bottom-6 left-6 right-6 glass rounded-2xl p-4 flex items-center gap-3"
            >
              <div className="h-10 w-10 rounded-full bg-neon/20 grid place-items-center text-neon font-bold">
                ✓
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold">CREF 098765-G/SP</div>
                <div className="text-xs text-muted-foreground">
                  Certificação NSCA · CSCS
                </div>
              </div>
            </motion.div>
          </div>

          {/* Decorative orbs */}
          <div className="absolute -top-8 -right-8 h-40 w-40 rounded-full bg-neon/20 blur-3xl -z-10" />
        </motion.div>
      </div>

      {/* Marquee */}
      <div className="relative mt-24 border-y border-border py-5 overflow-hidden">
        <div className="flex gap-12 animate-marquee whitespace-nowrap font-display text-2xl text-muted-foreground/40 uppercase tracking-widest">
          {Array(2).fill(0).map((_, i) => (
            <div key={i} className="flex gap-12">
              <span>Performance</span><span className="text-neon">/</span>
              <span>Disciplina</span><span className="text-neon">/</span>
              <span>Evolução</span><span className="text-neon">/</span>
              <span>Estratégia</span><span className="text-neon">/</span>
              <span>Resultado</span><span className="text-neon">/</span>
              <span>Método</span><span className="text-neon">/</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}