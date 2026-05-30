/* eslint-disable prettier/prettier */
import { motion } from "framer-motion";
import { LogIn, MessageCircle } from "lucide-react";

interface CTAProps {
  onAccessStudentArea?: () => void; onAccessadmin_dashboard?: () => void; // Corrigido para dois "ss"
}

export function CTA({ onAccessStudentArea, onAccessadmin_dashboard }: CTAProps) {
  return (
    <section id="cta" className="relative py-32 px-6">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-[2.5rem] overflow-hidden p-12 md:p-20 text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-neon/10 via-card to-card" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,136,0.2),transparent_60%)]" />
          <div className="absolute -inset-px rounded-[2.5rem] ring-1 ring-inset ring-neon/30" />

          <div className="relative">
            <p className="text-xs uppercase tracking-widest text-neon mb-6">Última chamada</p>
            <h2 className="font-display text-4xl md:text-7xl font-bold leading-[0.95] tracking-tight">
              Seu resultado começa<br /> com uma <span className="text-neon">decisão</span>.
            </h2>
            <p className="mt-6 text-muted-foreground max-w-xl mx-auto text-lg">
              Entre para um acompanhamento profissional focado em evolução real.
              Vagas limitadas para 2026.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-full bg-neon text-black px-8 py-5 font-semibold text-lg neon-glow hover:scale-[1.03] transition-all animate-pulse-glow"
              >
                <MessageCircle className="h-5 w-5" />
                Falar com Guilherme
              </a>
              
              <button
                onClick={onAccessStudentArea}
                className="inline-flex items-center gap-2 rounded-full glass px-8 py-5 font-medium hover:bg-white/5 transition-all text-lg"
              >
                Já sou aluno
              </button>

              <button
                onClick={onAccessadmin_dashboard}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium text-sm text-muted-foreground hover:text-neon hover:bg-neon/5 transition-all border border-neon/20 hover:border-neon/50"
              >
                <LogIn className="h-4 w-4" />
                Admin
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}