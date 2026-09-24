import { describe, expect, it } from "vitest";
import {
  formatSessionDate,
  formatSessionText,
  sessionFileName,
  type ExportableSession,
} from "./workout-export";
import { getPlan, hasTracking, formatPlanPrice, PUBLIC_PLANS } from "./plans";

const session = (over: Partial<ExportableSession> = {}): ExportableSession => ({
  id: "s1",
  date: "2026-09-24",
  workoutName: "Superior A",
  exercises: [
    {
      exerciseName: "Supino",
      actualWeight: "70",
      actualSets: 4,
      actualReps: 10,
      restTime: 90,
      rpe: 8,
      notes: "Ombro incomodou na última",
    },
    { exerciseName: "Barra Fixa", actualWeight: "0", actualSets: 3, actualReps: 6 },
  ],
  energyLevel: 7,
  generalNotes: "Dormi mal.",
  duration: 52,
  metasBatidas: 2,
  metasNaoAtingidas: 1,
  ...over,
});

describe("formatSessionText", () => {
  it("inclui cabeçalho, exercícios e anotações", () => {
    const text = formatSessionText(session(), "João Silva");
    expect(text).toContain("TREINO: Superior A");
    expect(text).toContain("Data: 24/09/2026");
    expect(text).toContain("Aluno: João Silva");
    expect(text).toContain("Duração: 52 min");
    expect(text).toContain("2 concluídos · 1 pulados");
    expect(text).toContain("1. Supino\n   4 x 10 · 70kg\n   RPE 8 · descanso 90s");
    expect(text).toContain("Anotação: Ombro incomodou na última");
    expect(text).toContain("2. Barra Fixa\n   3 x 6 · Peso corporal");
    expect(text).toContain("Anotações gerais:\nDormi mal.");
  });

  it("omite partes vazias", () => {
    const text = formatSessionText(session({ generalNotes: " ", duration: 0, metasNaoAtingidas: 0 }));
    expect(text).not.toContain("Aluno:");
    expect(text).not.toContain("Duração");
    expect(text).not.toContain("pulados");
    expect(text).not.toContain("Anotações gerais");
  });
});

describe("formatSessionDate / sessionFileName", () => {
  it("formata data e gera nome de arquivo sem acentos", () => {
    expect(formatSessionDate("2026-09-24")).toBe("24/09/2026");
    expect(formatSessionDate("24/09/2026")).toBe("24/09/2026");
    expect(sessionFileName({ workoutName: "Inferior — Glúteo", date: "2026-09-24" })).toBe(
      "treino-inferior-gluteo-2026-09-24.txt",
    );
  });
});

describe("planos", () => {
  it("somente treino não tem acompanhamento; exclusivos tem e é grátis", () => {
    expect(hasTracking("treino")).toBe(false);
    expect(hasTracking("exclusivo")).toBe(true);
    expect(hasTracking(undefined)).toBe(true); // cadastros antigos sem plano
    expect(formatPlanPrice(getPlan("exclusivo")!)).toBe("Grátis");
    expect(formatPlanPrice(getPlan("starter")!)).toBe("R$ 39,90/mês");
  });

  it("planos internos não aparecem no site", () => {
    expect(PUBLIC_PLANS.map((p) => p.key)).toEqual(["starter", "plus", "premium"]);
  });
});
