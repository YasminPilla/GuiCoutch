// Fonte única dos planos: usada pelo site (Plans.tsx) e pelo painel admin (cadastro de alunos).

export type PlanKey = "starter" | "plus" | "premium";

export interface PlanItem {
  label: string;
  ok: boolean;
}

export interface Plan {
  key: PlanKey;
  name: string;
  price: string;
  tagline: string;
  color: string;
  popular: boolean;
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
    items: [
      { label: "Acesso à plataforma", ok: true },
      { label: "Treino personalizado com periodização", ok: true },
      { label: "Suporte VIP (respostas em 24h)", ok: true },
      { label: "Acompanhamento semanal (check-in)", ok: true },
      { label: "Relatório mensal de progresso", ok: true },
    ],
  },
];

export const DEFAULT_PLAN: PlanKey = "starter";

export function getPlan(key?: string | null): Plan | undefined {
  return PLANS.find((p) => p.key === key);
}
