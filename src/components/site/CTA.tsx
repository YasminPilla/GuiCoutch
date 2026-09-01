/* eslint-disable prettier/prettier */
import { motion } from "framer-motion";
import { LogIn, MessageCircle } from "lucide-react";

interface CTAProps {
  onAccessLogin: () => void;
}

export function CTA({ onAccessLogin }: CTAProps) {
  return (
    <section id="cta" className="relative py-16 md:py-32 px-4 md:px-6">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-[1.75rem] md:rounded-[2.5rem] overflow-hidden p-8 sm:p-12 md:p-20 text-center"
          style={{ boxShadow: '0 0 80px rgba(225,6,0,0.08)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-neon/10 via-card to-card" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,6,0,0.28),transparent_60%)]" />
          <div className="absolute -inset-px rounded-[1.75rem] md:rounded-[2.5rem] ring-1 ring-inset ring-neon/30" />

          <div className="relative">
            <p style={{
              display: "inline-block",
              fontSize: 13, fontWeight: 800,
              letterSpacing: ".18em", textTransform: "uppercase",
              color: "#E10600", marginBottom: 20,
              borderBottom: "1.5px solid rgba(225,6,0,0.35)",
              paddingBottom: 4,
            }}>
              Última chamada
            </p>

            <h2 className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight">
              Seu resultado começa{" "}
              <br className="hidden sm:block" />
              com uma{" "}
              <span className="text-neon">decisão</span>.
            </h2>

            <p className="mt-4 md:mt-6 text-muted-foreground max-w-xl mx-auto text-base md:text-lg leading-relaxed">
              Entre para um acompanhamento profissional focado em evolução real.
              Vagas limitadas para 2026.
            </p>

            <div className="mt-8 md:mt-10 flex flex-col items-stretch sm:flex-row sm:items-center sm:justify-center gap-3 md:gap-4">
              <a
                href="https://wa.me/5511959222489"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-neon text-white px-8 py-4 md:py-5 font-semibold text-base md:text-lg neon-glow hover:scale-[1.03] transition-all animate-pulse-glow"
              >
                <MessageCircle className="h-5 w-5 flex-shrink-0" />
                Falar com Guilherme
              </a>

              <button
                onClick={onAccessLogin}
                className="inline-flex items-center justify-center gap-2 rounded-full glass px-8 py-4 md:py-5 font-medium hover:bg-white/5 transition-all text-base md:text-lg"
              >
                <LogIn className="h-5 w-5 flex-shrink-0 text-neon" />
                Acessar Minha Área
              </button>
            </div>

            <p className="mt-6 text-xs text-muted-foreground/60">
              Acesso exclusivo para alunos matriculados e administradores.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}