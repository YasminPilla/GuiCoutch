/* eslint-disable prettier/prettier */
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, ArrowLeft, RotateCcw } from "lucide-react";

type Answer = { label: string; value: string };
// `tag` é o rótulo curto usado no resumo enviado ao coach pelo WhatsApp.
type Question = { q: string; tag: string; sub?: string; opts: Answer[] };

// A ordem importa: getProfile lê a resposta de experiência por posição.
const Q_EXPERIENCE = 1;

const questions: Question[] = [
  {
    q: "Qual sua idade?",
    tag: "Idade",
    opts: [
      { label: "Menor de 18 anos", value: "under18" },
      { label: "18 a 24 anos", value: "18-24" },
      { label: "25 a 39 anos", value: "25-39" },
      { label: "40 anos ou mais", value: "40plus" },
    ],
  },
  {
    q: "Qual sua experiência com a musculação?",
    tag: "Experiência",
    opts: [
      { label: "1 ano ou menos", value: "lt1" },
      { label: "1 a 3 anos de treino", value: "1to3" },
      { label: "3 a 5 anos de treino", value: "3to5" },
      { label: "Mais de 5 anos", value: "gt5" },
    ],
  },
  {
    q: "Por que está buscando ajuda profissional?",
    tag: "Motivo da busca",
    opts: [
      { label: "Quero melhorar meus resultados", value: "improve" },
      { label: "Cansei de tentar sozinho", value: "tired" },
      { label: "Quero resultados consistentes", value: "consistent" },
      { label: "Quero aprender a treinar de verdade", value: "learn" },
    ],
  },
  {
    q: "Como você se sente em relação ao seu físico?",
    tag: "Relação com o físico",
    opts: [
      { label: "Insatisfeito, quero melhorar o quanto antes", value: "unhappy" },
      { label: "Satisfeito, mas quero ir além", value: "beyond" },
      { label: "Frustrado, acho que merecia estar melhor", value: "frustrated" },
      { label: "Estou estagnado com meu físico atual", value: "stagnant" },
    ],
  },
  {
    q: "Qual seu principal objetivo?",
    tag: "Objetivo",
    opts: [
      { label: "Ganhar massa", value: "bulk" },
      { label: "Perder gordura", value: "cut" },
      { label: "Recomposição corporal (perder gordura e ganhar massa)", value: "recomp" },
      { label: "Ser mais saudável", value: "health" },
      { label: "Ficar mais forte", value: "strength" },
    ],
  },
  {
    q: "O que acha que faz você não evoluir?",
    tag: "O que trava a evolução",
    opts: [
      { label: "Falta de disciplina no treino", value: "discipline" },
      { label: "Quando tentei com acompanhamento, não funcionou mesmo fazendo tudo certo", value: "coaching_failed" },
      { label: "Não sei estruturar um protocolo eu mesmo", value: "no_protocol" },
      { label: "Minha genética não permite", value: "genetics" },
    ],
  },
];

type ProfileKey = "iniciante" | "intermediario" | "avancado";

const profiles: Record<ProfileKey, { title: string; desc: string }> = {
  iniciante: {
    title: "Perfil: Base Sólida",
    desc: "Você está no momento certo para construir hábitos que duram. Com a estrutura correta desde o início, seu potencial de evolução é enorme. Vamos montar seu plano do zero.",
  },
  intermediario: {
    title: "Perfil: Alto Potencial",
    desc: "Você tem consistência, falta otimização. Um olhar técnico externo vai quebrar esse platô e abrir uma nova fase de evolução. É aqui que os resultados aceleram.",
  },
  avancado: {
    title: "Perfil: Elite em Formação",
    desc: "Você já sabe treinar. O próximo nível exige periodização avançada, gestão de recuperação e estratégia de longo prazo. Vamos afinar o que falta.",
  },
};

function getProfile(answers: Answer[]): ProfileKey {
  const exp = answers[Q_EXPERIENCE]?.value;
  if (exp === "lt1") return "iniciante";
  if (exp === "gt5") return "avancado";
  return "intermediario";
}

// ─── WhatsApp ─────────────────────────────────────────────────────────────────

const COACH_PHONE = "5511959222489";

function buildWhatsappUrl(answers: Answer[], profile: { title: string }): string {
  const msg = [
    "Olá, Guilherme! Fiz o diagnóstico no site e quero começar.",
    "",
    `*${profile.title}*`,
    "",
    "*Minhas respostas:*",
    ...questions.map((q, i) => `• ${q.tag}: ${answers[i]?.label ?? "-"}`),
  ].join("\n");
  return `https://wa.me/${COACH_PHONE}?text=${encodeURIComponent(msg)}`;
}

// ─── Quiz component ───────────────────────────────────────────────────────────

export function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [dir, setDir] = useState(1);

  const finished = step >= questions.length;
  const progress = (Math.min(step, questions.length) / questions.length) * 100;
  const profile = finished ? profiles[getProfile(answers)] : null;

  function pick(opt: Answer) {
    setDir(1);
    setAnswers((a) => [...a, opt]);
    setTimeout(() => setStep((s) => s + 1), 220);
  }

  function back() {
    setDir(-1);
    setStep((s) => s - 1);
    setAnswers((a) => a.slice(0, -1));
  }

  function reset() {
    setStep(0);
    setAnswers([]);
  }

  return (
    <>
      {/* ── Quiz section ── */}
      <section id="quiz" className="relative py-32 px-6">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(225,6,0,0.05),transparent_60%)]" />
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <p style={{
              display: "inline-block",
              fontSize: 13, fontWeight: 800,
              letterSpacing: ".18em", textTransform: "uppercase",
              color: "#E10600", marginBottom: 16,
              borderBottom: "1.5px solid rgba(225,6,0,0.35)",
              paddingBottom: 4,
            }}>
              Diagnóstico em 60 segundos
            </p>
            <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight">
              Descubra o que<br />trava o seu resultado.
            </h2>
          </div>

          <div className="rounded-[2rem] glass relative overflow-hidden">
            {/* progress bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/5">
              <motion.div
                className="h-full"
                style={{ background: "#E10600" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              />
            </div>

            <AnimatePresence mode="wait" custom={dir}>
              {!finished ? (
                <motion.div
                  key={step}
                  custom={dir}
                  variants={{
                    enter: (d: number) => ({ opacity: 0, x: d * 40 }),
                    center: { opacity: 1, x: 0 },
                    exit: (d: number) => ({ opacity: 0, x: d * -40 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="p-8 md:p-12"
                >
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-6">
                    <span>{step + 1} / {questions.length}</span>
                    <span>{Math.round(progress)}% completo</span>
                  </div>

                  <h3 className="font-display text-2xl md:text-4xl font-semibold mb-2">
                    {questions[step].q}
                  </h3>
                  {questions[step].sub ? (
                    <p className="text-sm text-muted-foreground mb-8">{questions[step].sub}</p>
                  ) : (
                    <div className="mb-8" />
                  )}

                  <div className="grid sm:grid-cols-2 gap-3">
                    {questions[step].opts.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => pick(opt)}
                        className="group text-left rounded-2xl bg-card border border-border hover:border-neon hover:bg-neon/5 px-5 py-4 transition-all duration-200"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-medium text-sm leading-snug">{opt.label}</span>
                          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-neon group-hover:translate-x-1 transition-all" />
                        </div>
                      </button>
                    ))}
                  </div>

                  {step > 0 && (
                    <button onClick={back} className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <ArrowLeft className="h-4 w-4" /> Voltar
                    </button>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-16 px-8 md:px-12"
                >
                  {/* animated ring */}
                  <div className="relative mx-auto h-20 w-20 mb-8">
                    <svg className="absolute inset-0 -rotate-90" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(225,6,0,0.15)" strokeWidth="3" />
                      <motion.circle
                        cx="40" cy="40" r="34" fill="none" stroke="#E10600" strokeWidth="3" strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 34}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                        animate={{ strokeDashoffset: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 grid place-items-center text-neon text-2xl font-bold font-display">✓</div>
                  </div>

                  <h3 className="font-display text-3xl md:text-5xl font-bold mb-4">{profile?.title}</h3>
                  <p className="text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed text-base">{profile?.desc}</p>

                  <div className="flex flex-wrap justify-center gap-3">
                    {/* Abre o WhatsApp do coach já com o perfil e as respostas do quiz */}
                    <motion.a
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      href={buildWhatsappUrl(answers, profile!)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-neon text-white px-7 py-3.5 font-semibold neon-glow text-sm"
                      style={{ textDecoration: "none" }}
                    >
                      Quero começar agora
                      <ArrowRight className="h-4 w-4" />
                    </motion.a>

                    <button
                      onClick={reset}
                      className="inline-flex items-center gap-2 rounded-full glass px-6 py-3.5 font-medium text-sm"
                    >
                      <RotateCcw className="h-4 w-4" /> Refazer
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
}