/**
 * Plano "Somente treino": sem acompanhamento, as sessões concluídas ficam só no
 * aparelho (localStorage) e o aluno exporta o treino em texto ao terminar.
 *
 * Lógica pura, sem React — usada por StudentDashboard em Studentarea.tsx
 * e coberta por testes em workout-export.test.ts.
 */

import { formatWeight } from "./workout-log";

export interface ExportedExercise {
  exerciseName: string;
  actualWeight: string;
  actualSets: number | string;
  actualReps: number | string;
  restTime?: number;
  rpe?: number;
  notes?: string;
}

export interface ExportableSession {
  id: string;
  date: string; // "YYYY-MM-DD"
  workoutName: string;
  exercises: ExportedExercise[];
  energyLevel: number;
  generalNotes: string;
  duration: number;
  metasBatidas: number;
  metasNaoAtingidas: number;
}

/** Quantas sessões guardar no aparelho (as mais recentes). */
export const MAX_LOCAL_SESSIONS = 60;

export function localSessionsKey(userId: string | number): string {
  return `gym_local_sessions_${userId}`;
}

export function loadLocalSessions<T extends { id: string }>(userId: string | number): T[] {
  try {
    const raw = localStorage.getItem(localSessionsKey(userId));
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveLocalSessions<T extends { id: string }>(userId: string | number, sessions: T[]) {
  try {
    localStorage.setItem(
      localSessionsKey(userId),
      JSON.stringify(sessions.slice(0, MAX_LOCAL_SESSIONS)),
    );
  } catch {}
}

/** "2026-09-24" → "24/09/2026". Outros formatos passam como estão. */
export function formatSessionDate(date: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(date ?? "").trim());
  return m ? `${m[3]}/${m[2]}/${m[1]}` : String(date ?? "");
}

/** Texto do treino concluído (para baixar, copiar ou compartilhar). */
export function formatSessionText(session: ExportableSession, studentName?: string): string {
  const lines: string[] = [];
  lines.push(`TREINO: ${session.workoutName}`);
  lines.push(`Data: ${formatSessionDate(session.date)}`);
  if (studentName) lines.push(`Aluno: ${studentName}`);
  if (session.duration > 0) lines.push(`Duração: ${session.duration} min`);
  lines.push(`Energia: ${session.energyLevel}/10`);
  lines.push(
    `Exercícios: ${session.metasBatidas} concluídos` +
      (session.metasNaoAtingidas > 0 ? ` · ${session.metasNaoAtingidas} pulados` : ""),
  );
  lines.push("");

  session.exercises.forEach((ex, i) => {
    lines.push(`${i + 1}. ${ex.exerciseName}`);
    lines.push(`   ${ex.actualSets} x ${ex.actualReps} · ${formatWeight(ex.actualWeight)}`);
    const extra: string[] = [];
    if (ex.rpe) extra.push(`RPE ${ex.rpe}`);
    if (ex.restTime) extra.push(`descanso ${ex.restTime}s`);
    if (extra.length) lines.push(`   ${extra.join(" · ")}`);
    const notes = String(ex.notes ?? "").trim();
    if (notes) lines.push(`   Anotação: ${notes}`);
  });

  const general = String(session.generalNotes ?? "").trim();
  if (general) {
    lines.push("");
    lines.push("Anotações gerais:");
    lines.push(general);
  }

  return lines.join("\n");
}

/** Nome do arquivo: "treino-superior-a-2026-09-24.txt". */
export function sessionFileName(session: Pick<ExportableSession, "workoutName" | "date">): string {
  const slug = String(session.workoutName ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `treino-${slug || "sessao"}-${session.date}.txt`;
}
