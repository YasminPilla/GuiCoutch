import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, ArrowLeft, MessageCircle, Check } from "lucide-react";

const questions = [
  { q: "Qual seu objetivo principal?", opts: ["Perder gordura", "Ganhar músculo", "Performance", "Saúde geral"] },
  { q: "Quantos dias por semana consegue treinar?", opts: ["2 dias", "3 dias", "4–5 dias", "6+ dias"] },
  { q: "Você já treina atualmente?", opts: ["Nunca treinei", "Treino há < 1 ano", "Treino há 1–3 anos", "Treino há 3+ anos"] },
  { q: "Qual sua maior dificuldade?", opts: ["Constância", "Falta de plano", "Resultados parados", "Tempo"] },
  { q: "Prefere presencial ou online?", opts: ["Presencial", "Online", "Híbrido", "Tanto faz"] },
];

export function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const finished = step >= questions.length;
  const progress = (Math.min(step, questions.length) / questions.length) * 100;

  function pick(i: number) {
    setAnswers((a) => [...a, i]);
    setTimeout(() => setStep((s) => s + 1), 250);
  }

  function reset() {
    setStep(0);
    setAnswers([]);
  }

  return (
    <section id="quiz" className="relative py-32 px-6">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(0,255,136,0.05),transparent_60%)]" />
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-neon mb-4">Diagnóstico em 60 segundos</p>
          <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight">
            Descubra seu perfil<br />de transformação.
          </h2>
        </div>

        <div className="rounded-[2rem] glass p-8 md:p-12 relative overflow-hidden">
          {/* progress */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
            <motion.div
              className="h-full bg-neon"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          <AnimatePresence mode="wait">
            {!finished ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-6">
                  <span>Pergunta {step + 1} / {questions.length}</span>
                  <span>{Math.round(progress)}% completo</span>
                </div>
                <h3 className="font-display text-2xl md:text-4xl font-semibold mb-8">
                  {questions[step].q}
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {questions[step].opts.map((o, i) => (
                    <button
                      key={o}
                      onClick={() => pick(i)}
                      className="group text-left rounded-2xl bg-card border border-border hover:border-neon hover:bg-neon/5 px-5 py-4 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{o}</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-neon group-hover:translate-x-1 transition-all" />
                      </div>
                    </button>
                  ))}
                </div>

                {step > 0 && (
                  <button
                    onClick={() => { setStep(s => s - 1); setAnswers(a => a.slice(0, -1)); }}
                    className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4" /> Voltar
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-6"
              >
                <div className="inline-flex h-16 w-16 rounded-full bg-neon/15 grid place-items-center text-neon mb-6 animate-pulse-glow">
                  <Check className="h-7 w-7" />
                </div>
                <h3 className="font-display text-3xl md:text-5xl font-bold mb-4">
                  Perfil: Alto Potencial
                </h3>
                <p className="text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
                  Seu perfil indica alto potencial para transformação com foco em
                  consistência e acompanhamento estratégico. Vamos conversar e
                  desenhar seu plano.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <a
                    href="https://wa.me/5511999999999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-neon text-black px-6 py-3 font-semibold neon-glow"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Falar no WhatsApp
                  </a>
                  <button
                    onClick={reset}
                    className="rounded-full glass px-6 py-3 font-medium"
                  >
                    Refazer
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}