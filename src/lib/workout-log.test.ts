import { describe, expect, it } from "vitest";
import {
  MAX_REPS,
  MAX_SETS,
  WEIGHT_REQUIRED_MESSAGE,
  commitLog,
  createInitialLogs,
  findInvalidDone,
  findPendingChanges,
  formatWeight,
  hasPendingChanges,
  isLogValid,
  parseWeightKg,
  revertLog,
  validateLog,
  type ExerciseLog,
} from "./workout-log";

const ex = (over = {}) => ({
  id: "ex1",
  name: "Supino",
  plannedSets: "4",
  plannedReps: "12",
  plannedLoad: "70kg",
  ...over,
});

const log = (over: Partial<ExerciseLog> = {}): ExerciseLog => ({
  exerciseId: "ex1",
  exerciseName: "Supino",
  actualWeight: "70kg",
  actualSets: "4",
  actualReps: "12",
  restTime: 90,
  rpe: 7,
  notes: "",
  ...over,
});

describe("createInitialLogs", () => {
  it("começa com o peso VAZIO mesmo havendo carga planejada", () => {
    const [l] = createInitialLogs([ex()]);
    expect(l.actualWeight).toBe("");
  });

  it("usa séries e reps planejadas", () => {
    const [l] = createInitialLogs([ex()]);
    expect(l.actualSets).toBe("4");
    expect(l.actualReps).toBe("12");
  });

  it("aplica limites de séries (5) e reps (20)", () => {
    const [l] = createInitialLogs([ex({ plannedSets: "12", plannedReps: "50" })]);
    expect(l.actualSets).toBe(String(MAX_SETS));
    expect(l.actualReps).toBe(String(MAX_REPS));
  });

  it("usa 3x10 quando o planejado é inválido/ausente", () => {
    const [a, b] = createInitialLogs([
      ex({ plannedSets: "", plannedReps: "abc" }),
      ex({ plannedSets: undefined, plannedReps: undefined }),
    ]);
    expect([a.actualSets, a.actualReps]).toEqual(["3", "10"]);
    expect([b.actualSets, b.actualReps]).toEqual(["3", "10"]);
  });

  it("aceita valores numéricos e mínimo de 1", () => {
    const [l] = createInitialLogs([ex({ plannedSets: 0, plannedReps: 8 })]);
    expect(l.actualSets).toBe("3"); // 0 é falsy → padrão
    expect(l.actualReps).toBe("8");
  });

  it("propaga o tempo de descanso e não começa com alterações pendentes", () => {
    const [l] = createInitialLogs([ex()], 120);
    expect(l.restTime).toBe(120);
    expect(hasPendingChanges(l)).toBe(false);
  });
});

describe("validateLog", () => {
  it("exige peso", () => {
    expect(validateLog(log({ actualWeight: "" })).weight).toBe(WEIGHT_REQUIRED_MESSAGE);
  });

  it("peso só com espaços também é vazio", () => {
    expect(validateLog(log({ actualWeight: "   " })).weight).toBeDefined();
  });

  it("aceita pesos do dropdown (kg, PC, elástico)", () => {
    for (const w of ["12kg", "72.5kg", "Peso Corporal (PC)", "PC + 5kg", "Verde · Média", "0kg"]) {
      expect(validateLog(log({ actualWeight: w })).weight).toBeUndefined();
    }
  });

  it.each(["0", "6", "-1", "abc", "", "2.5", "3x"])("rejeita séries inválidas: %s", (v) => {
    expect(validateLog(log({ actualSets: v })).sets).toBeDefined();
  });

  it.each(["1", "3", "5"])("aceita séries válidas: %s", (v) => {
    expect(validateLog(log({ actualSets: v })).sets).toBeUndefined();
  });

  it.each(["0", "21", "-3", "abc", "", "8-12"])("rejeita reps inválidas: %s", (v) => {
    expect(validateLog(log({ actualReps: v })).reps).toBeDefined();
  });

  it.each(["1", "12", "20"])("aceita reps válidas: %s", (v) => {
    expect(validateLog(log({ actualReps: v })).reps).toBeUndefined();
  });

  it("isLogValid reflete os erros", () => {
    expect(isLogValid(log())).toBe(true);
    expect(isLogValid(log({ actualWeight: "" }))).toBe(false);
  });
});

describe("alterações não salvas", () => {
  it("sem snapshot (cache antigo) não acusa pendência", () => {
    expect(hasPendingChanges(log())).toBe(false);
    expect(hasPendingChanges(undefined)).toBe(false);
  });

  it("detecta mudança de peso, séries e reps depois de salvo", () => {
    const saved = commitLog(log());
    expect(hasPendingChanges(saved)).toBe(false);
    expect(hasPendingChanges({ ...saved, actualWeight: "80kg" })).toBe(true);
    expect(hasPendingChanges({ ...saved, actualSets: "3" })).toBe(true);
    expect(hasPendingChanges({ ...saved, actualReps: "10" })).toBe(true);
  });

  it("ignora espaços e mudanças em observações", () => {
    const saved = commitLog(log());
    expect(hasPendingChanges({ ...saved, actualWeight: " 70kg " })).toBe(false);
    expect(hasPendingChanges({ ...saved, notes: "doeu" })).toBe(false);
  });

  it("voltar ao valor salvo deixa de ser pendência", () => {
    const saved = commitLog(log());
    const edited = { ...saved, actualWeight: "80kg" };
    expect(hasPendingChanges({ ...edited, actualWeight: "70kg" })).toBe(false);
  });

  it("commitLog registra o novo estado como salvo", () => {
    const edited = { ...commitLog(log()), actualWeight: "80kg" };
    expect(hasPendingChanges(commitLog(edited))).toBe(false);
  });

  it("revertLog volta para o último estado salvo e não altera o original", () => {
    const saved = commitLog(log());
    const edited = { ...saved, actualWeight: "99kg", actualSets: "1", actualReps: "1", notes: "x" };
    const reverted = revertLog(edited);
    expect(reverted.actualWeight).toBe("70kg");
    expect(reverted.actualSets).toBe("4");
    expect(reverted.actualReps).toBe("12");
    expect(reverted.notes).toBe("x"); // observações não fazem parte do "salvar"
    expect(edited.actualWeight).toBe("99kg");
  });

  it("revertLog sem snapshot devolve o log intacto", () => {
    const l = log();
    expect(revertLog(l)).toBe(l);
  });

  it("findPendingChanges lista os índices alterados", () => {
    const a = commitLog(log());
    const b = { ...commitLog(log()), actualWeight: "1kg" };
    expect(findPendingChanges([a, b, a])).toEqual([1]);
  });
});

describe("findInvalidDone", () => {
  it("só considera exercícios concluídos", () => {
    const logs = [log({ actualWeight: "" }), log({ actualWeight: "" }), log()];
    expect(findInvalidDone(logs, [true, false, true])).toEqual([0]);
  });

  it("vazio quando tudo concluído está válido", () => {
    expect(findInvalidDone([log(), log()], [true, true])).toEqual([]);
  });
});

describe("formatWeight / parseWeightKg", () => {
  it("formata número legado, número em texto e texto livre", () => {
    expect(formatWeight(72)).toBe("72kg");
    expect(formatWeight("72")).toBe("72kg");
    expect(formatWeight("72,5")).toBe("72,5kg");
    expect(formatWeight("70kg")).toBe("70kg");
    expect(formatWeight("PC + 5kg")).toBe("PC + 5kg");
  });

  it("vazio/zero vira Peso corporal", () => {
    for (const v of [0, "0", "", "  ", null, undefined]) {
      expect(formatWeight(v)).toBe("Peso corporal");
    }
  });

  it("parseWeightKg extrai o número inicial", () => {
    expect(parseWeightKg(72.5)).toBe(72.5);
    expect(parseWeightKg("72.5kg")).toBe(72.5);
    expect(parseWeightKg("72,5kg")).toBe(72.5);
    expect(parseWeightKg("PC + 5kg")).toBe(0);
    expect(parseWeightKg("Verde · Média")).toBe(0);
    expect(parseWeightKg("")).toBe(0);
    expect(parseWeightKg(null)).toBe(0);
    expect(parseWeightKg(NaN)).toBe(0);
  });
});
