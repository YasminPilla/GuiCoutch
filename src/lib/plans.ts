// Fonte única dos planos: usada pelo site (Plans.tsx) e pelo painel admin (cadastro de alunos).

export type PlanKey = "starter" | "plus" | "premium" | "treino" | "exclusivo";

export interface PlanItem {
  label: string;
  ok: boolean;
}

export interface Plan {
  key: PlanKey;
  name: string;
  /** Mensalidade ("39,90"). Ausente = valor a definir. */
  price?: string;
  /** Não é cobrado (ex: Exclusivos). */
  free?: boolean;
  tagline: string;
  color: string;
  popular: boolean;
  /** Aparece na seção de planos do site. Planos internos só aparecem no painel admin. */
  public: boolean;
  /**
   * Tem acompanhamento: sessões vão para o Firestore (relatórios, progresso, pesquisas).
   * false = "Somente treino": o aluno só executa o treino, tudo fica no localStorage.
   */
  tracking: boolean;
  /** Resumo curto mostrado no seletor de plano do admin. */
  summary: string;
  items: PlanItem[];
}

export const PLANS: Plan[] = [
  {
    key: "starter",
    name: "Starter",
    price: "39,90",
    tagline: "Comece sem desculpa",
    color: "#f87171",
    popular: false,
    public: true,
    tracking: true,
    summary: "Acompanhamento mensal",
    items: [
      { label: "Acesso à plataforma", ok: true },
      { label: "Treino personalizado (casa ou academia)", ok: true },
      { label: "Suporte via plataforma (respostas em 24h)", ok: true },
      { label: "Acompanhamento mensal", ok: true },
      { label: "Fotos e registro de progresso", ok: false },
    ],
  },
  {
    key: "plus",
    name: "Plus",
    price: "89,90",
    tagline: "O mais escolhido",
    color: "#E10600",
    popular: true,
    public: true,
    tracking: true,
    summary: "Acompanhamento quinzenal",
    items: [
      { label: "Acesso à plataforma", ok: true },
      { label: "Treino personalizado com periodização", ok: true },
      { label: "Suporte prioritário (respostas em 24h)", ok: true },
      { label: "Acompanhamento quinzenal", ok: true },
      { label: "Fotos e registro de progresso", ok: true },
    ],
  },
  {
    key: "premium",
    name: "Premium",
    price: "179,90",
    tagline: "Máxima atenção e resultado",
    color: "#facc15",
    popular: false,
    public: true,
    tracking: true,
    summary: "Acompanhamento semanal (check-in)",
    items: [
      { label: "Acesso à plataforma", ok: true },
      { label: "Treino personalizado com periodização", ok: true },
      { label: "Suporte VIP (respostas em 24h)", ok: true },
      { label: "Acompanhamento semanal (check-in)", ok: true },
      { label: "Relatório mensal de progresso", ok: true },
    ],
  },
  {
    key: "treino",
    name: "Somente treino",
    tagline: "Só o treino, sem acompanhamento",
    color: "#60a5fa",
    popular: false,
    public: false,
    tracking: false,
    summary: "Sem acompanhamento · registros só no aparelho, exportáveis",
    items: [
      { label: "Treino montado pelo coach", ok: true },
      { label: "Registro do treino salvo no aparelho", ok: true },
      { label: "Exportar treino concluído com anotações", ok: true },
      { label: "Acompanhamento", ok: false },
      { label: "Histórico e relatórios", ok: false },
    ],
  },
  {
    key: "exclusivo",
    name: "Exclusivos",
    free: true,
    tagline: "Cortesia com todos os benefícios",
    color: "#a78bfa",
    popular: false,
    public: false,
    tracking: true,
    summary: "Sem cobrança · todos os benefícios de acompanhamento",
    items: [
      { label: "Acesso à plataforma", ok: true },
      { label: "Treino personalizado com periodização", ok: true },
      { label: "Suporte VIP (respostas em 24h)", ok: true },
      { label: "Acompanhamento semanal (check-in)", ok: true },
      { label: "Fotos e registro de progresso", ok: true },
    ],
  },
];

/** Planos vendidos no site. */
export const PUBLIC_PLANS = PLANS.filter((p) => p.public);

export const DEFAULT_PLAN: PlanKey = "starter";

export function getPlan(key?: string | null): Plan | undefined {
  return PLANS.find((p) => p.key === key);
}

/** "R$ 39,90/mês", "Grátis" ou "Valor a definir". */
export function formatPlanPrice(plan: Plan): string {
  if (plan.free) return "Grátis";
  return plan.price ? `R$ ${plan.price}/mês` : "Valor a definir";
}

/** Aluno com acompanhamento? Sem plano (cadastros antigos) conta como sim. */
export function hasTracking(key?: string | null): boolean {
  return getPlan(key)?.tracking ?? true;
}
