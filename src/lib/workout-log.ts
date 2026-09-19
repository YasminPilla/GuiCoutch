/**
 * Regras do registro de treino do aluno (peso / séries / reps).
 *
 * Lógica pura, sem React — usada por WorkoutCarouselModal em Studentarea.tsx
 * e coberta por testes em workout-log.test.ts.
 */

export const MAX_SETS = 5;
export const MAX_REPS = 20;

/** Campos que o aluno edita e que precisam ser "salvos" ao concluir o exercício. */
export interface LogValues {
  weight: string;
  sets: string;
  reps: string;
}

export interface ExerciseLog {
  exerciseId: string;
  exerciseName: string;
  actualWeight: string;
  actualSets: string;
  actualReps: string;
  restTime: number;
  rpe: number;
  notes: string;
  /** Último estado salvo (concluído) ou o estado inicial, se ainda não foi salvo. */
  saved?: LogValues;
}

export interface LogErrors {
  weight?: string;
  sets?: string;
  reps?: string;
}

export interface PlannedExercise {
  id: string;
  name: string;
  plannedSets?: string | number;
  plannedReps?: string | number;
  plannedLoad?: string;
}

export const WEIGHT_REQUIRED_MESSAGE = "Informe o peso que você usou para concluir o exercício.";

function parseIntStrict(value: string): number | null {
  const v = String(value ?? "").trim();
  return /^\d+$/.test(v) ? parseInt(v, 10) : null;
}

export function getValues(
  log: Pick<ExerciseLog, "actualWeight" | "actualSets" | "actualReps">,
): LogValues {
  return {
    weight: String(log.actualWeight ?? "").trim(),
    sets: String(log.actualSets ?? "").trim(),
    reps: String(log.actualReps ?? "").trim(),
  };
}

/** Valida o que o aluno digitou. Peso é obrigatório: é a carga que ele realmente aguentou. */
export function validateLog(
  log: Pick<ExerciseLog, "actualWeight" | "actualSets" | "actualReps">,
): LogErrors {
  const { weight, sets, reps } = getValues(log);
  const errors: LogErrors = {};

  if (!weight) errors.weight = WEIGHT_REQUIRED_MESSAGE;

  const setsN = parseIntStrict(sets);
  if (setsN === null || setsN < 1 || setsN > MAX_SETS) {
    errors.sets = `Séries: informe de 1 a ${MAX_SETS}.`;
  }

  const repsN = parseIntStrict(reps);
  if (repsN === null || repsN < 1 || repsN > MAX_REPS) {
    errors.reps = `Reps: informe de 1 a ${MAX_REPS}.`;
  }

  return errors;
}

export function isLogValid(log: Pick<ExerciseLog, "actualWeight" | "actualSets" | "actualReps">) {
  return Object.keys(validateLog(log)).length === 0;
}

/** true quando peso/séries/reps atuais diferem do último estado salvo. */
export function hasPendingChanges(log: ExerciseLog | undefined): boolean {
  if (!log?.saved) return false; // cache antigo (sem snapshot): nada a comparar
  const cur = getValues(log);
  return (
    cur.weight !== log.saved.weight || cur.sets !== log.saved.sets || cur.reps !== log.saved.reps
  );
}

/** Grava o estado atual como "salvo" (chamado ao concluir/salvar alteração). */
export function commitLog(log: ExerciseLog): ExerciseLog {
  return { ...log, saved: getValues(log) };
}

/** Volta peso/séries/reps para o último estado salvo. */
export function revertLog(log: ExerciseLog): ExerciseLog {
  if (!log.saved) return log;
  return {
    ...log,
    actualWeight: log.saved.weight,
    actualSets: log.saved.sets,
    actualReps: log.saved.reps,
  };
}

/**
 * Logs iniciais do treino. O peso começa VAZIO de propósito: a carga planejada é só
 * sugestão (mostrada em "Planejado"); o aluno precisa informar o que realmente usou.
 */
export function createInitialLogs(
  exercises: PlannedExercise[],
  defaultRestTime = 90,
): ExerciseLog[] {
  return exercises.map((ex) => {
    const log: ExerciseLog = {
      exerciseId: ex.id,
      exerciseName: ex.name,
      actualWeight: "",
      actualSets: String(Math.min(MAX_SETS, Math.max(1, parseInt(String(ex.plannedSets)) || 3))),
      actualReps: String(Math.min(MAX_REPS, Math.max(1, parseInt(String(ex.plannedReps)) || 10))),
      restTime: defaultRestTime,
      rpe: 7,
      notes: "",
    };
    return commitLog(log);
  });
}

/** Índices de exercícios concluídos que ainda estão com peso/séries/reps inválidos. */
export function findInvalidDone(logs: ExerciseLog[], doneStatus: boolean[]): number[] {
  return logs.reduce<number[]>((acc, log, i) => {
    if (doneStatus[i] && !isLogValid(log)) acc.push(i);
    return acc;
  }, []);
}

/** Índices com alterações não salvas (concluídos editados ou digitados sem concluir). */
export function findPendingChanges(logs: ExerciseLog[]): number[] {
  return logs.reduce<number[]>((acc, log, i) => {
    if (hasPendingChanges(log)) acc.push(i);
    return acc;
  }, []);
}

/**
 * Peso para exibição. Aceita número legado (72), número em texto ("72"),
 * ou texto do dropdown ("72.5kg", "PC + 5kg", "Verde · Média").
 */
export function formatWeight(value: unknown): string {
  if (typeof value === "number") return value > 0 ? `${value}kg` : "Peso corporal";
  const v = String(value ?? "").trim();
  if (!v || v === "0") return "Peso corporal";
  return /^\d+([.,]\d+)?$/.test(v) ? `${v}kg` : v;
}

/** Valor numérico em kg para estatísticas ("72.5kg" → 72.5). Sem número no início → 0. */
export function parseWeightKg(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const m = String(value ?? "").match(/^\s*(\d+(?:[.,]\d+)?)/);
  return m ? parseFloat(m[1].replace(",", ".")) : 0;
}
