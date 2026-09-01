/* eslint-disable prettier/prettier */
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, ArrowLeft, RotateCcw, X, Send, CheckCircle } from "lucide-react";

type Answer = { label: string; value: string };
type Question = { q: string; sub?: string; opts: Answer[] };

const questions: Question[] = [
  {
    q: "Qual é o seu principal objetivo agora?",
    sub: "Seja honesto — isso define tudo.",
    opts: [
      { label: "Perder gordura e definir o corpo", value: "cut" },
      { label: "Ganhar massa e força real", value: "bulk" },
      { label: "Melhorar condicionamento e energia", value: "conditioning" },
      { label: "Reabilitação ou saúde a longo prazo", value: "health" },
    ],
  },
  {
    q: "Quantas vezes por semana você consegue treinar de verdade?",
    sub: "Sem mentira — pense na sua rotina real, não na ideal.",
    opts: [
      { label: "1 a 2 vezes — minha agenda é imprevisível", value: "low" },
      { label: "3 vezes — consigo manter constante", value: "mid" },
      { label: "4 a 5 vezes — treino é prioridade", value: "high" },
      { label: "6+ vezes — já sou atleta ou quase", value: "athlete" },
    ],
  },
  {
    q: "Como está sua relação com o treino hoje?",
    opts: [
      { label: "Nunca treinei com consistência", value: "never" },
      { label: "Já treinei, mas parei e quero voltar", value: "returning" },
      { label: "Treino há mais de 1 ano com regularidade", value: "intermediate" },
      { label: "Treino há anos e quero evoluir de verdade", value: "advanced" },
    ],
  },
  {
    q: "O que travou seus resultados até agora?",
    sub: "Seja sincero — isso é entre você e o quiz.",
    opts: [
      { label: "Falta de consistência — começo e paro", value: "consistency" },
      { label: "Não sei o que fazer na academia", value: "knowledge" },
      { label: "Faço tudo certo mas não vejo progresso", value: "plateau" },
      { label: "Não tenho tempo ou energia no dia a dia", value: "time" },
    ],
  },
  {
    q: "Como prefere ser acompanhado?",
    opts: [
      { label: "Online — quero flexibilidade total", value: "online" },
      { label: "Presencial — prefiro treinar junto com o coach", value: "presencial" },
      { label: "Híbrido — o melhor dos dois", value: "hybrid" },
      { label: "Qualquer um — quero só resultado", value: "any" },
    ],
  },
];

type ProfileKey = "iniciante" | "retorno" | "intermediario" | "avancado";

const profiles: Record<ProfileKey, { title: string; desc: string }> = {
  iniciante: {
    title: "Perfil: Base Sólida",
    desc: "Você está no momento certo para construir hábitos que duram. Com a estrutura correta desde o início, seu potencial de evolução é enorme. Vamos montar seu plano do zero.",
  },
  retorno: {
    title: "Perfil: Retomada Estratégica",
    desc: "Você já teve resultados antes — o que faltou foi um sistema. Dessa vez, com acompanhamento real e um plano que respeita sua rotina, a história vai ser diferente.",
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
  const exp = answers[2]?.value;
  if (exp === "never") return "iniciante";
  if (exp === "returning") return "retorno";
  if (exp === "advanced") return "avancado";
  return "intermediario";
}

// ─── Label helpers ────────────────────────────────────────────────────────────

function getObjectiveLabel(value: string): string {
  const map: Record<string, string> = {
    cut: "Perder gordura e definir o corpo",
    bulk: "Ganhar massa e força real",
    conditioning: "Melhorar condicionamento e energia",
    health: "Reabilitação ou saúde a longo prazo",
  };
  return map[value] ?? value;
}

function getFrequencyLabel(value: string): string {
  const map: Record<string, string> = {
    low: "1 a 2 vezes/semana",
    mid: "3 vezes/semana",
    high: "4 a 5 vezes/semana",
    athlete: "6+ vezes/semana",
  };
  return map[value] ?? value;
}

function getExpLabel(value: string): string {
  const map: Record<string, string> = {
    never: "Nunca treinei com consistência",
    returning: "Já treinei, mas parei",
    intermediate: "Treino há mais de 1 ano",
    advanced: "Treino há anos",
  };
  return map[value] ?? value;
}

function getBlockLabel(value: string): string {
  const map: Record<string, string> = {
    consistency: "Falta de consistência",
    knowledge: "Não sei o que fazer",
    plateau: "Não vejo progresso",
    time: "Falta de tempo ou energia",
  };
  return map[value] ?? value;
}

function getModalityLabel(value: string): string {
  const map: Record<string, string> = {
    online: "Online",
    presencial: "Presencial (Cotia/SP)",
    hybrid: "Híbrido",
    any: "Qualquer um",
  };
  return map[value] ?? value;
}

// ─── Form state ───────────────────────────────────────────────────────────────

interface LeadForm {
  nome: string;
  whatsapp: string;
  objetivo: string;
  nivel: string;
  diasSemana: string;
  temAcademia: string;
  limitacao: string;
  cidade: string;
  preferencia: string;
  planoInteresse: string;
}

const emptyForm: LeadForm = {
  nome: "",
  whatsapp: "",
  objetivo: "",
  nivel: "",
  diasSemana: "",
  temAcademia: "",
  limitacao: "",
  cidade: "",
  preferencia: "",
  planoInteresse: "",
};

// ─── Shared input style ────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 10,
  color: "var(--foreground, #fff)",
  fontSize: 14,
  padding: "10px 14px",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: "none",
  cursor: "pointer",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.5)",
  marginBottom: 6,
};

// ─── Modal component ──────────────────────────────────────────────────────────

interface LeadModalProps {
  quizAnswers: Answer[];
  profile: { title: string; desc: string };
  onClose: () => void;
}

function LeadModal({ quizAnswers, profile, onClose }: LeadModalProps) {
  const [form, setForm] = useState<LeadForm>({
    ...emptyForm,
    objetivo: quizAnswers[0]?.value ?? "",
    preferencia: quizAnswers[4]?.value ?? "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadForm, string>>>({});

  function set(field: keyof LeadForm, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof LeadForm, string>> = {};
    if (!form.nome.trim()) newErrors.nome = "Informe seu nome";
    if (!form.whatsapp.trim()) newErrors.whatsapp = "Informe seu WhatsApp";
    if (!form.objetivo) newErrors.objetivo = "Selecione seu objetivo";
    if (!form.nivel) newErrors.nivel = "Selecione seu nível";
    if (!form.diasSemana) newErrors.diasSemana = "Selecione os dias disponíveis";
    if (!form.temAcademia) newErrors.temAcademia = "Selecione uma opção";
    if (!form.cidade.trim()) newErrors.cidade = "Informe sua cidade";
    if (!form.preferencia) newErrors.preferencia = "Selecione uma preferência";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;

    // Build the WhatsApp message for the coach — phone number is only in this string, never shown in UI
    const COACH_PHONE = "5511959222489";

    const msg = [
      "🔔 *Novo lead pelo site GC Fitness!*",
      "",
      `*Nome:* ${form.nome}`,
      `*WhatsApp:* ${form.whatsapp}`,
      `*Perfil (quiz):* ${profile.title}`,
      "",
      `*Objetivo:* ${getObjectiveLabel(form.objetivo)}`,
      `*Nível:* ${form.nivel}`,
      `*Dias disponíveis:* ${form.diasSemana}`,
      `*Acesso à academia:* ${form.temAcademia}`,
      `*Cidade:* ${form.cidade}`,
      `*Preferência de acompanhamento:* ${getModalityLabel(form.preferencia)}`,
      `*Plano de interesse:* ${form.planoInteresse || "Não informado"}`,
      `*Limitação/lesão:* ${form.limitacao || "Nenhuma"}`,
      "",
      `*Respostas do quiz:*`,
      `  • Objetivo: ${getObjectiveLabel(quizAnswers[0]?.value ?? "")}`,
      `  • Frequência: ${getFrequencyLabel(quizAnswers[1]?.value ?? "")}`,
      `  • Experiência: ${getExpLabel(quizAnswers[2]?.value ?? "")}`,
      `  • Bloqueio: ${getBlockLabel(quizAnswers[3]?.value ?? "")}`,
      `  • Modalidade preferida: ${getModalityLabel(quizAnswers[4]?.value ?? "")}`,
    ].join("\n");

    const url = `https://wa.me/${COACH_PHONE}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <ModalShell onClose={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
          style={{ textAlign: "center", padding: "48px 32px" }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            style={{ display: "inline-flex", marginBottom: 24 }}
          >
            <CheckCircle size={56} color="#E10600" strokeWidth={1.5} />
          </motion.div>

          <h3 style={{ fontWeight: 700, fontSize: 26, marginBottom: 12 }}>
            Mensagem enviada!
          </h3>
          <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, fontSize: 15, maxWidth: 360, margin: "0 auto 32px" }}>
            O coach Guilherme vai analisar o seu perfil e entrar em contato em breve. Fique de olho no seu WhatsApp!
          </p>

          <button
            onClick={onClose}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#E10600", color: "#fff", border: "none",
              borderRadius: 99, padding: "12px 28px",
              fontWeight: 700, fontSize: 14, cursor: "pointer",
            }}
          >
            Fechar
          </button>
        </motion.div>
      </ModalShell>
    );
  }

  // ── Form screen ─────────────────────────────────────────────────────────────
  return (
    <ModalShell onClose={onClose}>
      {/* Header */}
      <div style={{ padding: "28px 28px 0", borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: 20, marginBottom: 4 }}>
        <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#E10600", marginBottom: 6 }}>
          Quase lá
        </p>
        <h3 style={{ fontWeight: 700, fontSize: 22, lineHeight: 1.3, margin: 0 }}>
          Preencha seus dados para o coach entrar em contato
        </h3>
      </div>

      {/* Scrollable body */}
      <div style={{ padding: "20px 28px 28px", overflowY: "auto", maxHeight: "calc(80vh - 120px)", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Nome */}
        <Field label="Nome completo *" error={errors.nome}>
          <input
            style={inputStyle}
            type="text"
            placeholder="Seu nome"
            value={form.nome}
            onChange={(e) => set("nome", e.target.value)}
          />
        </Field>

        {/* WhatsApp */}
        <Field label="WhatsApp / Telefone *" error={errors.whatsapp}>
          <input
            style={inputStyle}
            type="tel"
            placeholder="(11) 99999-0000"
            value={form.whatsapp}
            onChange={(e) => set("whatsapp", e.target.value)}
          />
        </Field>

        {/* Objetivo */}
        <Field label="Objetivo principal *" error={errors.objetivo}>
          <select style={selectStyle} value={form.objetivo} onChange={(e) => set("objetivo", e.target.value)}>
            <option value="">Selecione</option>
            <option value="cut">Emagrecer</option>
            <option value="bulk">Ganhar massa muscular</option>
            <option value="conditioning">Condicionamento físico</option>
            <option value="health">Saúde geral</option>
          </select>
        </Field>

        {/* Nível */}
        <Field label="Nível atual *" error={errors.nivel}>
          <select style={selectStyle} value={form.nivel} onChange={(e) => set("nivel", e.target.value)}>
            <option value="">Selecione</option>
            <option value="Sedentário">Sedentário</option>
            <option value="Iniciante">Iniciante</option>
            <option value="Intermediário">Intermediário</option>
            <option value="Avançado">Avançado</option>
          </select>
        </Field>

        {/* Dias por semana */}
        <Field label="Dias disponíveis por semana *" error={errors.diasSemana}>
          <select style={selectStyle} value={form.diasSemana} onChange={(e) => set("diasSemana", e.target.value)}>
            <option value="">Selecione</option>
            <option value="1-2 dias">1–2 dias</option>
            <option value="3-4 dias">3–4 dias</option>
            <option value="5+ dias">5+ dias</option>
          </select>
        </Field>

        {/* Academia */}
        <Field label="Tem acesso a academia? *" error={errors.temAcademia}>
          <select style={selectStyle} value={form.temAcademia} onChange={(e) => set("temAcademia", e.target.value)}>
            <option value="">Selecione</option>
            <option value="Sim">Sim</option>
            <option value="Não">Não</option>
            <option value="Às vezes">Às vezes</option>
          </select>
        </Field>

        {/* Limitação */}
        <Field label="Limitação física ou lesão? (opcional)">
          <input
            style={inputStyle}
            type="text"
            placeholder="Ex: joelho, lombar… ou deixe em branco"
            value={form.limitacao}
            onChange={(e) => set("limitacao", e.target.value)}
          />
        </Field>

        {/* Cidade */}
        <Field label="Cidade *" error={errors.cidade}>
          <input
            style={inputStyle}
            type="text"
            placeholder="Ex: Cotia, São Paulo…"
            value={form.cidade}
            onChange={(e) => set("cidade", e.target.value)}
          />
        </Field>

        {/* Preferência */}
        <Field label="Como prefere o acompanhamento? *" error={errors.preferencia}>
          <select style={selectStyle} value={form.preferencia} onChange={(e) => set("preferencia", e.target.value)}>
            <option value="">Selecione</option>
            <option value="online">Online</option>
            <option value="presencial">Presencial (Cotia/SP)</option>
            <option value="hybrid">Híbrido</option>
            <option value="any">Qualquer um</option>
          </select>
        </Field>

        {/* Plano */}
        <Field label="Plano de interesse (opcional)">
          <select style={selectStyle} value={form.planoInteresse} onChange={(e) => set("planoInteresse", e.target.value)}>
            <option value="">Ainda não sei</option>
            <option value="Starter (R$ 39,90/mês)">Starter — R$ 39,90/mês</option>
            <option value="Plus (R$ 89,90/mês)">Plus — R$ 89,90/mês</option>
            <option value="Premium (R$ 179,90/mês)">Premium — R$ 179,90/mês</option>
          </select>
        </Field>

        {/* Submit */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          style={{
            marginTop: 8,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            width: "100%",
            background: "#E10600", color: "#fff",
            border: "none", borderRadius: 12,
            padding: "14px 0",
            fontWeight: 700, fontSize: 15, cursor: "pointer",
            boxShadow: "0 0 24px rgba(225,6,0,0.35)",
          }}
        >
          <Send size={16} /> Enviar e aguardar contato
        </motion.button>

        <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: -4 }}>
          Seus dados são usados apenas para que o coach entre em contato com você.
        </p>
      </div>
    </ModalShell>
  );
}

// ─── Modal shell ──────────────────────────────────────────────────────────────

function ModalShell({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      key="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px 16px",
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.96 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "relative",
          width: "100%", maxWidth: 520,
          background: "#0f0f0f",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 24,
          overflow: "hidden",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 16,
            background: "rgba(255,255,255,0.07)",
            border: "none", borderRadius: 99,
            width: 32, height: 32,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "rgba(255,255,255,0.6)",
            zIndex: 2,
          }}
        >
          <X size={15} />
        </button>

        {children}
      </motion.div>
    </motion.div>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={labelStyle}>{label}</label>
      {children}
      {error && (
        <span style={{ fontSize: 11, color: "#ff6b6b", marginTop: 2 }}>{error}</span>
      )}
    </div>
  );
}

// ─── Quiz component ───────────────────────────────────────────────────────────

export function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [dir, setDir] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

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
    setModalOpen(false);
  }

  return (
    <>
      {/* ── Lead modal ── */}
      <AnimatePresence>
        {modalOpen && profile && (
          <LeadModal
            quizAnswers={answers}
            profile={profile}
            onClose={() => setModalOpen(false)}
          />
        )}
      </AnimatePresence>

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
                    {/* ── NEW: Open form modal instead of direct WhatsApp ── */}
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setModalOpen(true)}
                      className="inline-flex items-center gap-2 rounded-full bg-neon text-white px-7 py-3.5 font-semibold neon-glow text-sm"
                      style={{ border: "none", cursor: "pointer" }}
                    >
                      Quero começar agora
                      <ArrowRight className="h-4 w-4" />
                    </motion.button>

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