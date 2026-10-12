import { describe, expect, it } from "vitest";
import { EXERCISE_DEMOS, findExerciseDemo, normalizeExerciseName } from "./exercise-demos";
import { figureMarkup } from "./exercise-figure";
import { FIGURES } from "./exercise-figures-data";
import { SEED_EXERCISE_LIBRARY } from "@/components/site/SharedAppState";

const slugOf = (name: string, equipment?: string) =>
  findExerciseDemo(name, equipment)?.slug ?? null;

describe("catálogo de demonstrações", () => {
  it("slugs são únicos", () => {
    const slugs = EXERCISE_DEMOS.map((d) => d.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("todo exercício tem desenho animado que renderiza nas duas poses", () => {
    const colors = {
      body: "#fff",
      bodyFar: "#888",
      prop: "#999",
      propDark: "#333",
      floor: "#222",
      muscle: "#0f8",
    };
    for (const demo of EXERCISE_DEMOS) {
      const fig = FIGURES[demo.slug];
      expect(fig, demo.slug).toBeDefined();
      expect(fig.muscles.length, demo.slug).toBeGreaterThan(0);
      for (const t of [0, 0.5, 1]) {
        const svg = figureMarkup(fig, t, colors);
        expect(svg, demo.slug).not.toMatch(/NaN|undefined/);
        expect(svg.length, demo.slug).toBeGreaterThan(200);
      }
    }
  });

  it("não há desenho sobrando sem exercício no catálogo", () => {
    const slugs = new Set(EXERCISE_DEMOS.map((d) => d.slug));
    for (const slug of Object.keys(FIGURES)) expect(slugs.has(slug), slug).toBe(true);
  });

  it("todo exercício tem passo a passo", () => {
    for (const demo of EXERCISE_DEMOS) expect(demo.steps.length, demo.slug).toBeGreaterThan(0);
  });

  it("nenhum apelido aponta para dois exercícios diferentes", () => {
    const seen = new Map<string, string>();
    for (const demo of EXERCISE_DEMOS) {
      for (const alias of [demo.name, ...demo.aliases]) {
        const key = normalizeExerciseName(alias).join(" ");
        const prev = seen.get(key);
        expect(
          prev === undefined || prev === demo.slug,
          `"${alias}" em ${prev} e ${demo.slug}`,
        ).toBe(true);
        seen.set(key, demo.slug);
      }
    }
  });
});

describe("findExerciseDemo", () => {
  it("encontra todos os exercícios da biblioteca padrão", () => {
    for (const ex of SEED_EXERCISE_LIBRARY) {
      expect(findExerciseDemo(ex.name, ex.equipment), ex.name).not.toBeNull();
    }
  });

  it("ignora acentos, maiúsculas e pontuação", () => {
    expect(slugOf("TRÍCEPS FRANCÊS")).toBe("triceps-frances");
    expect(slugOf("Leg Press 45°")).toBe("leg-press");
    expect(slugOf("elevação pélvica")).toBe("elevacao-pelvica");
  });

  it("usa o equipamento para escolher a variação", () => {
    expect(slugOf("Supino Inclinado", "Barra")).toBe("supino-inclinado");
    expect(slugOf("Supino Inclinado", "Halter")).toBe("supino-inclinado-halter");
    expect(slugOf("Supino Reto", "Máquina")).toBe("supino-maquina");
    expect(slugOf("Elevação Lateral", "Cabo")).toBe("elevacao-lateral-cabo");
  });

  it("prefere o apelido mais específico", () => {
    expect(slugOf("Panturrilha Sentado")).toBe("panturrilha-sentado");
    expect(slugOf("Panturrilha no Leg Press")).toBe("panturrilha-leg-press");
    expect(slugOf("Coice glúteo no cabo")).toBe("gluteo-cabo");
    expect(slugOf("Tríceps coice")).toBe("triceps-coice");
    expect(slugOf("Puxada com triângulo")).toBe("puxada-triangulo");
    expect(slugOf("Terra Romeno")).toBe("terra-romeno");
  });

  it("reconhece variações de escrita comuns do coach", () => {
    expect(slugOf("Agachamento livre c/ barra")).toBe("agachamento-livre");
    expect(slugOf("Remada baixa (triângulo)")).toBe("remada-baixa");
    expect(slugOf("Crucifixo inverso na máquina")).toBe("voador-invertido");
    expect(slugOf("Abdominal infra")).toBe("abdominal-infra");
  });

  it("retorna null quando não conhece o exercício", () => {
    expect(findExerciseDemo("Corrida na esteira")).toBeNull();
    expect(findExerciseDemo("")).toBeNull();
  });
});
