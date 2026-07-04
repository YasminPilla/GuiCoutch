/* eslint-disable prettier/prettier, @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import {
  useState, useCallback, createContext, useContext, useEffect, useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Firebase ─────────────────────────────────────────────────────────────
import { db, storage } from "@/components/site/firebase";
import {
  collection, doc, getDocs, setDoc, updateDoc, deleteDoc, onSnapshot,
  writeBatch, query, orderBy, limit,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// ─── TIPOS ────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  email: string;
  password: string;
  role: "admin" | "student";
  name: string;
  avatar: string;
  status: "active" | "inactive";
  createdAt: string;
  authUid?: string;
}

export interface Exercise {
  id: string;
  name: string;
  plannedSets: string;
  plannedLoad: string;
  plannedReps: string;
  note: string;
  estimatedTime: number;
  videoUrl?: string;
}

export interface Workout {
  id: number;
  name: string;
  day: string;
  totalEstimatedTime: number;
  exercises: Exercise[];
}

export interface ProgressPhoto {
  id: string;
  url: string | null;
  date: string;
  label: string;
  angle: string;
  coachFeedback: string | null;
  feedbackDate: string | null;
  pendingReview: boolean;
  rejectedByCoach: boolean;
}

export interface WorkoutSession {
  id: string;
  date: string;
  workoutName: string;
  exercises: any[];
  energyLevel: number;
  mood: string;
  sleepQuality: number;
  fatigueLevel: number;
  muscleSoreness: number;
  generalNotes: string;
  completed: boolean;
  duration: number;
  metasBatidas: number;
  metasNaoAtingidas: number;
}

export interface StudentData {
  goal: string;
  weeks: number;
  startWeight: number;
  currentWeight: number;
  streak: number;
  monthlyWorkouts: number;
  level?: number;
  weeklyGoal?: number;
  weightHistory: { d: string; v: number }[];
  weekFreq: { d: string; v: number }[];
  workouts: Workout[];
  coachNote: string;
  goals: { id?: string; type?: string; t?: string; p?: number; progress?: number; target?: number; deadline?: string }[];
  messages: { from: string; text: string; time: string }[];
  workoutSessions: WorkoutSession[];
  personalRecords?: any[];
  bodyMeasurements?: any[];
  achievements?: any[];
  progressPhotos: ProgressPhoto[];
}

// ── NOVO: Biblioteca de Exercícios ────────────────────────────────────────
export interface ExerciseTemplate {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
  videoUrl: string;
  defaultSets: string;
  defaultReps: string;
  defaultLoad: string;
  note: string;
  createdAt: string;
}

export const MUSCLE_GROUPS = [
  "Peito", "Costas", "Ombro", "Bíceps", "Tríceps",
  "Pernas", "Glúteos", "Panturrilha", "Abdômen", "Outro",
];

export const EQUIPMENT_OPTIONS = [
  "Barra", "Halter", "Máquina", "Cabo", "Peso Corporal",
  "Kettlebell", "Elástico", "Smith", "Outro",
];

export interface SharedState {
  users: User[];
  studentsData: Record<number, StudentData>;
  notifications: any[];
  auditLogs: any[];
  permissions: any;
  config: any;
  exerciseLibrary: ExerciseTemplate[];
}

// ─── DADOS PARA SEMENTE ───────────────────────────────────────────────────

const SEED_USERS: User[] = [
  { id: 1, email: "guilherme@gc.com", password: "admin123", role: "admin",   name: "Guilherme Couto", avatar: "GC", status: "active", createdAt: "10/01/2024" },
  { id: 2, email: "rafael@email.com", password: "rafael123", role: "student", name: "Rafael Mendes",   avatar: "RM", status: "active", createdAt: "15/02/2024" },
  { id: 3, email: "camila@email.com", password: "camila123", role: "student", name: "Camila Santos",   avatar: "CS", status: "active", createdAt: "01/03/2024" },
  { id: 4, email: "bruno@email.com",  password: "bruno123",  role: "student", name: "Bruno Alves",    avatar: "BA", status: "active", createdAt: "20/03/2024" },
];

const SEED_STUDENTS_DATA: Record<number, StudentData> = {
  2: {
    goal: "Perder gordura", weeks: 8, startWeight: 88, currentWeight: 82.9,
    streak: 23, monthlyWorkouts: 21, level: 12, weeklyGoal: 5,
    weightHistory: [
      { d: "S1", v: 88 }, { d: "S2", v: 87.2 }, { d: "S3", v: 86.5 }, { d: "S4", v: 85.8 },
      { d: "S5", v: 85.1 }, { d: "S6", v: 84.3 }, { d: "S7", v: 83.6 }, { d: "S8", v: 82.9 },
    ],
    weekFreq: [
      { d: "Seg", v: 1 }, { d: "Ter", v: 1 }, { d: "Qua", v: 0 },
      { d: "Qui", v: 1 }, { d: "Sex", v: 1 }, { d: "Sáb", v: 1 }, { d: "Dom", v: 0 }
    ],
    workouts: [
      {
        id: 1, name: "Treino A · Superior", day: "Segunda", totalEstimatedTime: 60,
        exercises: [
          { id: "ex1", name: "Supino Inclinado",       plannedSets: "4", plannedLoad: "70kg",         plannedReps: "10", note: "Foco na excêntrica",        estimatedTime: 12, videoUrl: "" },
          { id: "ex2", name: "Remada Curvada",          plannedSets: "4", plannedLoad: "80kg",         plannedReps: "8",  note: "Cotovelo próximo ao corpo",  estimatedTime: 12, videoUrl: "" },
          { id: "ex3", name: "Desenvolvimento Halter",  plannedSets: "3", plannedLoad: "22kg",         plannedReps: "12", note: "",                           estimatedTime: 10, videoUrl: "" },
          { id: "ex4", name: "Tríceps Corda",           plannedSets: "3", plannedLoad: "30kg",         plannedReps: "15", note: "",                           estimatedTime: 10, videoUrl: "" },
          { id: "ex5", name: "Rosca Direta",            plannedSets: "3", plannedLoad: "35kg",         plannedReps: "12", note: "",                           estimatedTime: 10, videoUrl: "" },
        ],
      },
      {
        id: 2, name: "Treino B · Inferior", day: "Terça", totalEstimatedTime: 65,
        exercises: [
          { id: "ex6",  name: "Agachamento Livre",  plannedSets: "4", plannedLoad: "100kg", plannedReps: "8",  note: "+5kg esta semana", estimatedTime: 15, videoUrl: "" },
          { id: "ex7",  name: "Leg Press 45°",      plannedSets: "3", plannedLoad: "200kg", plannedReps: "12", note: "",                 estimatedTime: 12, videoUrl: "" },
          { id: "ex8",  name: "Cadeira Extensora",  plannedSets: "3", plannedLoad: "60kg",  plannedReps: "15", note: "",                 estimatedTime: 10, videoUrl: "" },
          { id: "ex9",  name: "Mesa Flexora",       plannedSets: "3", plannedLoad: "55kg",  plannedReps: "12", note: "",                 estimatedTime: 10, videoUrl: "" },
          { id: "ex10", name: "Panturrilha em Pé",  plannedSets: "4", plannedLoad: "80kg",  plannedReps: "20", note: "",                 estimatedTime: 10, videoUrl: "" },
        ],
      },
      {
        id: 3, name: "Treino C · Pull", day: "Quinta", totalEstimatedTime: 50,
        exercises: [
          { id: "ex11", name: "Barra Fixa",      plannedSets: "4", plannedLoad: "Peso corporal", plannedReps: "6",  note: "Adicionar carga em breve", estimatedTime: 12, videoUrl: "" },
          { id: "ex12", name: "Serrote",         plannedSets: "4", plannedLoad: "32kg",          plannedReps: "10", note: "",                         estimatedTime: 12, videoUrl: "" },
          { id: "ex13", name: "Pulldown Aberto", plannedSets: "3", plannedLoad: "70kg",          plannedReps: "12", note: "",                         estimatedTime: 10, videoUrl: "" },
          { id: "ex14", name: "Rosca Martelo",   plannedSets: "3", plannedLoad: "16kg",          plannedReps: "12", note: "",                         estimatedTime: 10, videoUrl: "" },
        ],
      },
    ],
    coachNote: "Excelente semana, Rafael. Aumentamos a carga no agachamento em 5kg e adicionamos um dia de mobilidade. Mantém a constância — você está no caminho exato.",
    goals: [
      { id: "g1", type: "5 treinos completos", progress: 100, target: 100, deadline: "2026-06-06" },
      { id: "g2", type: "Hidratação 3L/dia",   progress: 86,  target: 100, deadline: "2026-06-06" },
      { id: "g3", type: "Sono 7h+",            progress: 71,  target: 100, deadline: "2026-06-06" },
    ],
    messages: [
      { from: "coach",   text: "Oi Rafael! Semana excelente. Próxima semana vamos aumentar volume no superior.", time: "10:32" },
      { from: "student", text: "Obrigado! Me sinto muito mais forte. Agachamento ficou mais fácil hoje.",        time: "11:05" },
      { from: "coach",   text: "Perfeito! Isso é a progressão de carga funcionando. Continua assim 💪",         time: "11:20" },
    ],
    workoutSessions: [
      {
        id: "s1", date: "2026-05-28", workoutName: "Treino A · Superior",
        exercises: [
          { exerciseId: "ex1", exerciseName: "Supino Inclinado", actualWeight: 72, actualReps: 10, actualSets: 4, restTime: 90, rpe: 8, notes: "Senti forte" },
          { exerciseId: "ex2", exerciseName: "Remada Curvada",   actualWeight: 82, actualReps: 8,  actualSets: 4, restTime: 90, rpe: 7, notes: "" },
        ],
        energyLevel: 8, mood: "Motivado", sleepQuality: 8, fatigueLevel: 3,
        muscleSoreness: 2, generalNotes: "Treino excelente", completed: true, duration: 58,
        metasBatidas: 3, metasNaoAtingidas: 1,
      },
    ],
    personalRecords: [
      { id: "pr1", exerciseId: "ex6", exerciseName: "Agachamento Livre", type: "max_weight", value: 105, date: "2026-05-27", isNew: true },
    ],
    bodyMeasurements: [
      { date: "2026-05-01", weight: 88,   chest: 110, waist: 92, arm: 33, thigh: 62, calf: 38 },
      { date: "2026-05-29", weight: 82.9, chest: 108, waist: 88, arm: 34, thigh: 60, calf: 37 },
    ],
    achievements: [
      { id: "first_workout", name: "Primeiro Passo",     description: "Complete seu primeiro treino", icon: "🏃", unlocked: true },
      { id: "week_streak",   name: "Semana Consistente", description: "Treinar 7 dias seguidos",      icon: "🔥", unlocked: true },
    ],
    progressPhotos: [
      { id: "ph1", url: null, date: "2026-05-01", label: "Início do protocolo · Semana 1", angle: "Frontal",
        coachFeedback: "Boa base para começar. Foco em déficit calórico e manter volume muscular.",
        feedbackDate: "2026-05-02", pendingReview: false, rejectedByCoach: false },
      { id: "ph2", url: null, date: "2026-05-15", label: "Semana 3 · Meio de protocolo", angle: "Lateral",
        coachFeedback: "Evolução visível na região abdominal. Continue o trabalho!",
        feedbackDate: "2026-05-16", pendingReview: false, rejectedByCoach: false },
    ],
  },
  3: {
    goal: "Ganhar massa magra", weeks: 12, startWeight: 58, currentWeight: 62.4,
    streak: 18, monthlyWorkouts: 19, level: 8, weeklyGoal: 4,
    weightHistory: [
      { d: "S1", v: 58 }, { d: "S2", v: 58.5 }, { d: "S3", v: 59 }, { d: "S4", v: 59.6 },
      { d: "S5", v: 60.2 }, { d: "S6", v: 60.9 }, { d: "S7", v: 61.5 }, { d: "S8", v: 62.4 },
    ],
    weekFreq: [
      { d: "Seg", v: 1 }, { d: "Ter", v: 0 }, { d: "Qua", v: 1 },
      { d: "Qui", v: 1 }, { d: "Sex", v: 0 }, { d: "Sáb", v: 1 }, { d: "Dom", v: 0 }
    ],
    workouts: [
      {
        id: 1, name: "Treino A · Full Body", day: "Segunda", totalEstimatedTime: 55,
        exercises: [
          { id: "c_ex1", name: "Agachamento Livre", plannedSets: "3", plannedLoad: "50kg", plannedReps: "10", note: "", estimatedTime: 12, videoUrl: "" },
          { id: "c_ex2", name: "Supino Reto",       plannedSets: "3", plannedLoad: "40kg", plannedReps: "10", note: "", estimatedTime: 10, videoUrl: "" },
          { id: "c_ex3", name: "Remada Curvada",    plannedSets: "3", plannedLoad: "50kg", plannedReps: "12", note: "", estimatedTime: 10, videoUrl: "" },
          { id: "c_ex4", name: "Tríceps Francês",   plannedSets: "3", plannedLoad: "15kg", plannedReps: "12", note: "", estimatedTime: 10, videoUrl: "" },
        ],
      },
    ],
    coachNote: "Camila, sua evolução em força está impressionante. Continuamos o foco em hipertrofia controlada.",
    goals: [
      { id: "g1", type: "4 treinos completos", progress: 100, target: 100, deadline: "2026-06-06" },
      { id: "g2", type: "Proteína 120g/dia",   progress: 78,  target: 100, deadline: "2026-06-06" },
      { id: "g3", type: "Sono 8h+",            progress: 64,  target: 100, deadline: "2026-06-06" },
    ],
    messages: [
      { from: "coach",   text: "Camila, seus números de força estão subindo muito bem!", time: "09:15" },
      { from: "student", text: "Estou adorando! Primeira vez que vejo resultado tão consistente.", time: "10:00" },
    ],
    workoutSessions: [],
    achievements: [],
    bodyMeasurements: [],
    personalRecords: [],
    progressPhotos: [
      { id: "ph_c1", url: null, date: "2026-05-10", label: "Semana 1 · Início", angle: "Frontal",
        coachFeedback: null, feedbackDate: null, pendingReview: true, rejectedByCoach: false },
    ],
  },
  4: {
    goal: "Performance", weeks: 6, startWeight: 82, currentWeight: 80.5,
    streak: 31, monthlyWorkouts: 24, level: 18, weeklyGoal: 5,
    weightHistory: [
      { d: "S1", v: 82 }, { d: "S2", v: 81.5 }, { d: "S3", v: 81 },
      { d: "S4", v: 80.8 }, { d: "S5", v: 80.6 }, { d: "S6", v: 80.5 },
    ],
    weekFreq: [
      { d: "Seg", v: 1 }, { d: "Ter", v: 1 }, { d: "Qua", v: 1 },
      { d: "Qui", v: 1 }, { d: "Sex", v: 1 }, { d: "Sáb", v: 0 }, { d: "Dom", v: 0 }
    ],
    workouts: [
      {
        id: 1, name: "Treino A · Força", day: "Segunda", totalEstimatedTime: 75,
        exercises: [
          { id: "b_ex1", name: "Deadlift",             plannedSets: "5", plannedLoad: "140kg", plannedReps: "5", note: "RPE 8", estimatedTime: 20, videoUrl: "" },
          { id: "b_ex2", name: "Agachamento Livre",    plannedSets: "5", plannedLoad: "110kg", plannedReps: "5", note: "RPE 8", estimatedTime: 20, videoUrl: "" },
          { id: "b_ex3", name: "Press Overhead",       plannedSets: "4", plannedLoad: "70kg",  plannedReps: "6", note: "",      estimatedTime: 15, videoUrl: "" },
        ],
      },
    ],
    coachNote: "Bruno, você quebrou seu recorde no deadlift essa semana. 140kg está impecável. Próximo ciclo foco em speed work.",
    goals: [
      { id: "g1", type: "5 treinos força", progress: 100, target: 100, deadline: "2026-06-06" },
      { id: "g2", type: "RPE controlado",  progress: 92,  target: 100, deadline: "2026-06-06" },
      { id: "g3", type: "Mobilidade 15min",progress: 60,  target: 100, deadline: "2026-06-06" },
    ],
    messages: [
      { from: "coach",   text: "Bruno! 140kg no deadlift essa semana. Fantástico!", time: "18:00" },
      { from: "student", text: "Mal acreditei. Obrigado pelo ciclo que montou!",   time: "18:30" },
    ],
    workoutSessions: [],
    bodyMeasurements: [],
    personalRecords: [],
    achievements: [
      { id: "first_workout", name: "Primeiro Passo",     description: "Complete seu primeiro treino", icon: "🏃", unlocked: true },
      { id: "week_streak",   name: "Semana Consistente", description: "Treinar 7 dias seguidos",      icon: "🔥", unlocked: true },
      { id: "pr_broken",     name: "Recorde Pessoal",    description: "Bater um PR",                 icon: "🏆", unlocked: true },
    ],
    progressPhotos: [],
  },
};

const SEED_NOTIFICATIONS = [
  { id: 1, title: "Bruno quebrou recorde no deadlift — 140kg!", time: "2h atrás", read: false, type: "achievement" },
  { id: 2, title: "Rafael completou 23 dias de streak consecutivo",  time: "5h atrás", read: false, type: "streak"      },
  { id: 3, title: "Camila enviou foto de progresso para avaliação",  time: "1d atrás", read: false, type: "photo"       },
];

const SEED_AUDIT_LOGS = [
  { id: 1, user: "Guilherme Couto", action: "Treino de Rafael Mendes editado",  target: "Treino A · Superior", time: "Hoje 14:32", level: "info"    },
  { id: 2, user: "Sistema",         action: "Backup automático realizado",       target: "banco de dados",      time: "Hoje 03:00", level: "success" },
  { id: 3, user: "Guilherme Couto", action: "Login realizado na área admin",     target: "Área Admin",          time: "Hoje 09:11", level: "info"    },
];

// ── NOVO: Seed da biblioteca de exercícios ────────────────────────────────
export const SEED_EXERCISE_LIBRARY: ExerciseTemplate[] = [
  { id: "lib_001", name: "Supino Reto",             muscleGroup: "Peito",      equipment: "Barra",         videoUrl: "", defaultSets: "4", defaultReps: "8",  defaultLoad: "80kg",  note: "Escápulas retraídas e deprimidas.",  createdAt: new Date().toISOString() },
  { id: "lib_002", name: "Supino Inclinado",         muscleGroup: "Peito",      equipment: "Halter",        videoUrl: "", defaultSets: "3", defaultReps: "10", defaultLoad: "26kg",  note: "Inclinação 30–45°.",                 createdAt: new Date().toISOString() },
  { id: "lib_003", name: "Crucifixo",                muscleGroup: "Peito",      equipment: "Halter",        videoUrl: "", defaultSets: "3", defaultReps: "12", defaultLoad: "14kg",  note: "Cotovelo levemente flexionado.",     createdAt: new Date().toISOString() },
  { id: "lib_004", name: "Supino Declinado",         muscleGroup: "Peito",      equipment: "Barra",         videoUrl: "", defaultSets: "3", defaultReps: "10", defaultLoad: "75kg",  note: "",                                   createdAt: new Date().toISOString() },
  { id: "lib_005", name: "Remada Curvada",           muscleGroup: "Costas",     equipment: "Barra",         videoUrl: "", defaultSets: "4", defaultReps: "8",  defaultLoad: "80kg",  note: "Cotovelo próximo ao corpo.",         createdAt: new Date().toISOString() },
  { id: "lib_006", name: "Barra Fixa",               muscleGroup: "Costas",     equipment: "Peso Corporal", videoUrl: "", defaultSets: "4", defaultReps: "6",  defaultLoad: "PC",    note: "Amplitude completa.",               createdAt: new Date().toISOString() },
  { id: "lib_007", name: "Pulldown Aberto",          muscleGroup: "Costas",     equipment: "Cabo",          videoUrl: "", defaultSets: "3", defaultReps: "12", defaultLoad: "70kg",  note: "",                                   createdAt: new Date().toISOString() },
  { id: "lib_008", name: "Serrote",                  muscleGroup: "Costas",     equipment: "Halter",        videoUrl: "", defaultSets: "4", defaultReps: "10", defaultLoad: "32kg",  note: "Apoiar joelho e mão no banco.",     createdAt: new Date().toISOString() },
  { id: "lib_009", name: "Deadlift",                 muscleGroup: "Costas",     equipment: "Barra",         videoUrl: "", defaultSets: "5", defaultReps: "5",  defaultLoad: "120kg", note: "Barra rente às pernas.",            createdAt: new Date().toISOString() },
  { id: "lib_010", name: "Agachamento Livre",        muscleGroup: "Pernas",     equipment: "Barra",         videoUrl: "", defaultSets: "4", defaultReps: "8",  defaultLoad: "100kg", note: "Joelhos na linha dos pés.",         createdAt: new Date().toISOString() },
  { id: "lib_011", name: "Leg Press 45°",            muscleGroup: "Pernas",     equipment: "Máquina",       videoUrl: "", defaultSets: "3", defaultReps: "12", defaultLoad: "200kg", note: "",                                   createdAt: new Date().toISOString() },
  { id: "lib_012", name: "Stiff",                    muscleGroup: "Pernas",     equipment: "Barra",         videoUrl: "", defaultSets: "3", defaultReps: "10", defaultLoad: "60kg",  note: "Quadril para trás, costas neutras.",createdAt: new Date().toISOString() },
  { id: "lib_013", name: "Cadeira Extensora",        muscleGroup: "Pernas",     equipment: "Máquina",       videoUrl: "", defaultSets: "3", defaultReps: "15", defaultLoad: "60kg",  note: "",                                   createdAt: new Date().toISOString() },
  { id: "lib_014", name: "Mesa Flexora",             muscleGroup: "Pernas",     equipment: "Máquina",       videoUrl: "", defaultSets: "3", defaultReps: "12", defaultLoad: "50kg",  note: "",                                   createdAt: new Date().toISOString() },
  { id: "lib_015", name: "Agachamento Goblet",       muscleGroup: "Pernas",     equipment: "Halter",        videoUrl: "", defaultSets: "3", defaultReps: "15", defaultLoad: "24kg",  note: "",                                   createdAt: new Date().toISOString() },
  { id: "lib_016", name: "Desenvolvimento Halter",   muscleGroup: "Ombro",      equipment: "Halter",        videoUrl: "", defaultSets: "3", defaultReps: "12", defaultLoad: "22kg",  note: "",                                   createdAt: new Date().toISOString() },
  { id: "lib_017", name: "Elevação Lateral",         muscleGroup: "Ombro",      equipment: "Halter",        videoUrl: "", defaultSets: "4", defaultReps: "15", defaultLoad: "8kg",   note: "Cotovelo levemente flexionado.",    createdAt: new Date().toISOString() },
  { id: "lib_018", name: "Press Overhead",           muscleGroup: "Ombro",      equipment: "Barra",         videoUrl: "", defaultSets: "4", defaultReps: "6",  defaultLoad: "70kg",  note: "",                                   createdAt: new Date().toISOString() },
  { id: "lib_019", name: "Tríceps Corda",            muscleGroup: "Tríceps",    equipment: "Cabo",          videoUrl: "", defaultSets: "3", defaultReps: "15", defaultLoad: "30kg",  note: "",                                   createdAt: new Date().toISOString() },
  { id: "lib_020", name: "Tríceps Francês",          muscleGroup: "Tríceps",    equipment: "Halter",        videoUrl: "", defaultSets: "3", defaultReps: "12", defaultLoad: "16kg",  note: "",                                   createdAt: new Date().toISOString() },
  { id: "lib_021", name: "Rosca Direta",             muscleGroup: "Bíceps",     equipment: "Barra",         videoUrl: "", defaultSets: "3", defaultReps: "12", defaultLoad: "35kg",  note: "",                                   createdAt: new Date().toISOString() },
  { id: "lib_022", name: "Rosca Martelo",            muscleGroup: "Bíceps",     equipment: "Halter",        videoUrl: "", defaultSets: "3", defaultReps: "12", defaultLoad: "16kg",  note: "",                                   createdAt: new Date().toISOString() },
  { id: "lib_023", name: "Panturrilha em Pé",        muscleGroup: "Panturrilha",equipment: "Máquina",       videoUrl: "", defaultSets: "4", defaultReps: "20", defaultLoad: "80kg",  note: "",                                   createdAt: new Date().toISOString() },
  { id: "lib_024", name: "Abdominal Crunch",         muscleGroup: "Abdômen",    equipment: "Peso Corporal", videoUrl: "", defaultSets: "3", defaultReps: "20", defaultLoad: "PC",    note: "",                                   createdAt: new Date().toISOString() },
  { id: "lib_025", name: "Prancha Isométrica",       muscleGroup: "Abdômen",    equipment: "Peso Corporal", videoUrl: "", defaultSets: "3", defaultReps: "45s",defaultLoad: "PC",    note: "",                                   createdAt: new Date().toISOString() },
];

const INITIAL_PERMISSIONS = {
  admin:   { manageStudents: true,  manageWorkouts: true,  viewReports: true,  sendMessages: true, manageSettings: true,  viewLogs: true,  exportData: true  },
  student: { manageStudents: false, manageWorkouts: false, viewReports: false, sendMessages: true, manageSettings: false, viewLogs: false, exportData: false },
};

const INITIAL_SYSTEM_CONFIG = {
  appName: "GC Fitness", maxStudents: 50, sessionTimeout: 60,
  enableChat: true, enableNotifications: true, maintenanceMode: false,
  autoBackup: true, backupFrequency: "daily",
  timezone: "America/Sao_Paulo", language: "pt-BR",
};

// ─── CONTEXT ──────────────────────────────────────────────────────────────

interface AppContextValue {
  users: User[];
  studentsData: Record<number, StudentData>;
  notifications: any[];
  auditLogs: any[];
  permissions: any;
  config: any;
  loading: boolean;
  // ── NOVO ──
  exerciseLibrary: ExerciseTemplate[];

  setUsers: (users: User[]) => void;
  setStudentsData: (data: Record<number, StudentData>) => void;
  setNotifications: (n: any[]) => void;
  setAuditLogs: (l: any[]) => void;
  setPermissions: (p: any) => void;
  setConfig: (c: any) => void;

  updateStudentWorkouts: (studentId: number, workouts: Workout[]) => void;
  updateCoachNote: (studentId: number, note: string) => void;
  sendMessageToStudent: (studentId: number, text: string) => void;
  sendMessageToCoach: (studentId: number, text: string) => void;
  studentSubmitPhoto: (studentId: number, photo: Omit<ProgressPhoto, "pendingReview" | "rejectedByCoach">) => void;
  adminApprovePhoto: (studentId: number, photoId: string, feedback: string) => void;
  adminRequestResubmit: (studentId: number, photoId: string, reason: string) => void;
  studentResubmitPhoto: (studentId: number, photoId: string, newUrl: string) => void;
  addWorkoutSession: (studentId: number, session: WorkoutSession) => void;
  pendingPhotosCount: number;
  addAuditLog: (action: string, target: string, level?: string) => void;
  // ── NOVO: CRUD biblioteca ──
  addExerciseTemplate:    (t: ExerciseTemplate) => Promise<void>;
  updateExerciseTemplate: (t: ExerciseTemplate) => Promise<void>;
  deleteExerciseTemplate: (id: string)          => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used inside <SharedAppProvider>");
  return ctx;
}

// ─── HELPER: upload base64 para Storage ──────────────────────────────────

async function uploadPhotoToStorage(studentId: number, url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const ext  = blob.type.includes("png") ? "png" : "jpg";
    const storageRef = ref(storage, `progressPhotos/${studentId}/${Date.now()}.${ext}`);
    const snapshot   = await uploadBytes(storageRef, blob);
    return await getDownloadURL(snapshot.ref);
  } catch (e) {
    console.error("Erro no upload da foto:", e);
    return url;
  }
}

// ─── PROVIDER ─────────────────────────────────────────────────────────────

export function SharedAppProvider({ children }: { children: React.ReactNode }) {
  const [users,            setUsersLocal]          = useState<User[]>([]);
  const [studentsData,     setStudentsDataLocal]    = useState<Record<number, StudentData>>({});
  const [notifications,    setNotifications]        = useState<any[]>([]);
  const [auditLogs,        setAuditLogs]            = useState<any[]>([]);
  const [permissions,      setPermissions]          = useState(INITIAL_PERMISSIONS);
  const [config,           setConfig]               = useState(INITIAL_SYSTEM_CONFIG);
  const [loading,          setLoading]              = useState(true);
  // ── NOVO ──
  const [exerciseLibrary,  setExerciseLibraryLocal] = useState<ExerciseTemplate[]>([]);

  const usersRef = useRef<User[]>([]);
  useEffect(() => { usersRef.current = users; }, [users]);

  const studentsDataRef = useRef<Record<number, StudentData>>({});
  useEffect(() => { studentsDataRef.current = studentsData; }, [studentsData]);

  // ── Semente + assinaturas em tempo real ──────────────────────────────────
  useEffect(() => {
    const unsubs: (() => void)[] = [];

    const init = async () => {
      try {
        const usersSnap = await getDocs(collection(db, "users"));
        if (usersSnap.empty) {
          const batch = writeBatch(db);
          SEED_USERS.forEach(u => batch.set(doc(db, "users", String(u.id)), u));
          Object.entries(SEED_STUDENTS_DATA).forEach(([id, data]) =>
            batch.set(doc(db, "studentsData", id), data)
          );
          SEED_NOTIFICATIONS.forEach(n =>
            batch.set(doc(db, "notifications", String(n.id)), n)
          );
          SEED_AUDIT_LOGS.forEach(l =>
            batch.set(doc(db, "auditLogs", String(l.id)), l)
          );
          await batch.commit();
        }

        // ── NOVO: seed da biblioteca de exercícios ──────────────────────
        const libSnap = await getDocs(collection(db, "exerciseLibrary"));
        if (libSnap.empty) {
          const libBatch = writeBatch(db);
          SEED_EXERCISE_LIBRARY.forEach(t =>
            libBatch.set(doc(db, "exerciseLibrary", t.id), t)
          );
          await libBatch.commit();
        }

      } catch (e) {
        console.error("Erro na semente do Firestore:", e);
      }

      // Assinatura — usuários
      unsubs.push(
        onSnapshot(collection(db, "users"), snap => {
          setUsersLocal(snap.docs.map(d => ({ ...d.data(), id: Number(d.id) } as User)));
        })
      );

      // Assinatura — dados dos alunos
      unsubs.push(
        onSnapshot(collection(db, "studentsData"), snap => {
          const data: Record<number, StudentData> = {};
          snap.docs.forEach(d => { data[Number(d.id)] = d.data() as StudentData; });
          setStudentsDataLocal(data);
          setLoading(false);
        })
      );

      // Assinatura — notificações
      unsubs.push(
        onSnapshot(
          query(collection(db, "notifications"), orderBy("id", "desc"), limit(30)),
          snap => setNotifications(snap.docs.map(d => d.data()))
        )
      );

      // Assinatura — logs de auditoria
      unsubs.push(
        onSnapshot(
          query(collection(db, "auditLogs"), orderBy("id", "desc"), limit(50)),
          snap => setAuditLogs(snap.docs.map(d => d.data()))
        )
      );

      // ── NOVO: Assinatura em tempo real — biblioteca de exercícios ──────
      unsubs.push(
        onSnapshot(collection(db, "exerciseLibrary"), snap => {
          setExerciseLibraryLocal(
            snap.docs
              .map(d => d.data() as ExerciseTemplate)
              .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
          );
        })
      );
    };

    init();
    return () => unsubs.forEach(fn => fn());
  }, []);

  // ── Computed ─────────────────────────────────────────────────────────────
  const pendingPhotosCount = Object.values(studentsData).reduce((acc, sd) =>
    acc + (sd?.progressPhotos || []).filter(p => p.pendingReview && !p.coachFeedback).length
  , 0);

  // ── Setters Firestore ─────────────────────────────────────────────────────

  const setUsers = useCallback(async (newUsers: User[]) => {
    const prevUsers = usersRef.current;
    setUsersLocal(newUsers);
    try {
      const batch = writeBatch(db);
      const newIds = new Set(newUsers.map(u => String(u.id)));
      newUsers.forEach(u => batch.set(doc(db, "users", String(u.id)), u));
      prevUsers.forEach(u => {
        if (!newIds.has(String(u.id))) batch.delete(doc(db, "users", String(u.id)));
      });
      await batch.commit();
    } catch (e) {
      console.error("Erro ao salvar usuários:", e);
      setUsersLocal(prevUsers);
      alert("Não foi possível salvar a alteração de alunos. Verifique sua conexão ou as regras do Firestore.");
    }
  }, []);

  const setStudentsData = useCallback(async (data: Record<number, StudentData>) => {
    const prevData = studentsDataRef.current;
    setStudentsDataLocal(data);
    try {
      const batch = writeBatch(db);
      const newIds = new Set(Object.keys(data));
      Object.entries(data).forEach(([id, sd]) => batch.set(doc(db, "studentsData", id), sd));
      Object.keys(prevData).forEach(id => {
        if (!newIds.has(id)) batch.delete(doc(db, "studentsData", id));
      });
      await batch.commit();
    } catch (e) {
      console.error("Erro ao salvar dados dos alunos:", e);
      setStudentsDataLocal(prevData);
      alert("Não foi possível salvar a alteração. Verifique sua conexão ou as regras do Firestore.");
    }
  }, []);

  // ── Helpers internos ─────────────────────────────────────────────────────

  const addAuditLog = useCallback(async (action: string, target: string, level = "info") => {
    const id    = Date.now();
    const now   = new Date();
    const time  = `Hoje ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    const entry = { id, user: "Sistema", action, target, time, level };
    await setDoc(doc(db, "auditLogs", String(id)), entry);
  }, []);

  const addNotification = useCallback(async (title: string, type = "info") => {
    const id    = Date.now();
    const entry = { id, title, time: "Agora", read: false, type };
    await setDoc(doc(db, "notifications", String(id)), entry);
  }, []);

  // ── NOVO: CRUD da biblioteca de exercícios ────────────────────────────────

  const addExerciseTemplate = useCallback(async (t: ExerciseTemplate) => {
    await setDoc(doc(db, "exerciseLibrary", t.id), t);
    await addAuditLog(`Exercício "${t.name}" adicionado à biblioteca`, "Biblioteca", "success");
  }, [addAuditLog]);

  const updateExerciseTemplate = useCallback(async (t: ExerciseTemplate) => {
    await setDoc(doc(db, "exerciseLibrary", t.id), t, { merge: true });
    await addAuditLog(`Exercício "${t.name}" atualizado na biblioteca`, "Biblioteca");
  }, [addAuditLog]);

  const deleteExerciseTemplate = useCallback(async (id: string) => {
    const t = exerciseLibrary.find(e => e.id === id);
    await deleteDoc(doc(db, "exerciseLibrary", id));
    await addAuditLog(`Exercício "${t?.name}" removido da biblioteca`, "Biblioteca", "warning");
  }, [exerciseLibrary, addAuditLog]);

  // ── Treinos ───────────────────────────────────────────────────────────────

  const updateStudentWorkouts = useCallback(async (studentId: number, workouts: Workout[]) => {
    const prevWorkouts = studentsData[studentId]?.workouts;
    setStudentsDataLocal(prev => ({ ...prev, [studentId]: { ...prev[studentId], workouts } }));
    try {
      await setDoc(doc(db, "studentsData", String(studentId)), { workouts }, { merge: true });
      const student = users.find(u => u.id === studentId);
      await addAuditLog(`Treinos de ${student?.name} atualizados`, `${workouts.length} treino(s)`);
      await addNotification(`Coach atualizou seus treinos (${workouts.length} treinos)`, "workout");
    } catch (e) {
      console.error("Erro ao salvar treinos:", e);
      setStudentsDataLocal(prev => ({ ...prev, [studentId]: { ...prev[studentId], workouts: prevWorkouts } }));
      alert("Não foi possível salvar a alteração no treino.");
    }
  }, [users, studentsData, addAuditLog, addNotification]);

  // ── Nota do Coach ─────────────────────────────────────────────────────────

  const updateCoachNote = useCallback(async (studentId: number, note: string) => {
    setStudentsDataLocal(prev => ({ ...prev, [studentId]: { ...prev[studentId], coachNote: note } }));
    await setDoc(doc(db, "studentsData", String(studentId)), { coachNote: note }, { merge: true });
    const student = users.find(u => u.id === studentId);
    await addAuditLog(`Nota do coach atualizada para ${student?.name}`, "Nota do Coach");
  }, [users, addAuditLog]);

  // ── Mensagens ─────────────────────────────────────────────────────────────

  const sendMessageToStudent = useCallback(async (studentId: number, text: string) => {
    const time    = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const newMsg  = { from: "coach", text, time };
    const current = studentsData[studentId];
    const messages = [...(current?.messages || []), newMsg];
    setStudentsDataLocal(prev => ({ ...prev, [studentId]: { ...prev[studentId], messages } }));
    await setDoc(doc(db, "studentsData", String(studentId)), { messages }, { merge: true });
    const student = users.find(u => u.id === studentId);
    await addNotification(`Coach enviou mensagem para ${student?.name}`, "message");
    await addAuditLog(`Mensagem enviada ao aluno ${student?.name}`, "Chat");
  }, [users, studentsData, addAuditLog, addNotification]);

  const sendMessageToCoach = useCallback(async (studentId: number, text: string) => {
    const time    = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    const newMsg  = { from: "student", text, time };
    const current = studentsData[studentId];
    const messages = [...(current?.messages || []), newMsg];
    setStudentsDataLocal(prev => ({ ...prev, [studentId]: { ...prev[studentId], messages } }));
    await setDoc(doc(db, "studentsData", String(studentId)), { messages }, { merge: true });
    const student = users.find(u => u.id === studentId);
    await addNotification(`${student?.name} enviou uma mensagem`, "message");
  }, [users, studentsData, addNotification]);

  // ── Fotos ─────────────────────────────────────────────────────────────────

  const studentSubmitPhoto = useCallback(async (
    studentId: number,
    photo: Omit<ProgressPhoto, "pendingReview" | "rejectedByCoach">
  ) => {
    let finalUrl = photo.url;
    if (photo.url && photo.url.startsWith("data:")) {
      finalUrl = await uploadPhotoToStorage(studentId, photo.url);
    }
    const newPhoto: ProgressPhoto = {
      ...photo, url: finalUrl,
      pendingReview: true, rejectedByCoach: false,
      coachFeedback: null, feedbackDate: null,
    };
    const current        = studentsData[studentId];
    const progressPhotos = [newPhoto, ...(current?.progressPhotos || [])];
    setStudentsDataLocal(prev => ({ ...prev, [studentId]: { ...prev[studentId], progressPhotos } }));
    await setDoc(doc(db, "studentsData", String(studentId)), { progressPhotos }, { merge: true });
    const student = users.find(u => u.id === studentId);
    await addNotification(`📸 ${student?.name} enviou foto para avaliação`, "photo");
    await addAuditLog(`Foto enviada por ${student?.name}`, "Fotos de Progresso");
  }, [users, studentsData, addAuditLog, addNotification]);

  const adminApprovePhoto = useCallback(async (studentId: number, photoId: string, feedback: string) => {
    const today  = new Date().toLocaleDateString("pt-BR");
    const current = studentsData[studentId];
    const progressPhotos = (current?.progressPhotos || []).map(p =>
      p.id === photoId
        ? { ...p, coachFeedback: feedback, feedbackDate: today, pendingReview: false, rejectedByCoach: false }
        : p
    );
    setStudentsDataLocal(prev => ({ ...prev, [studentId]: { ...prev[studentId], progressPhotos } }));
    await setDoc(doc(db, "studentsData", String(studentId)), { progressPhotos }, { merge: true });
    const student = users.find(u => u.id === studentId);
    await addNotification("Coach avaliou sua foto — veja o feedback!", "photo_feedback");
    await addAuditLog(`Coach avaliou foto de ${student?.name}`, "Fotos de Progresso", "success");
  }, [users, studentsData, addAuditLog, addNotification]);

  const adminRequestResubmit = useCallback(async (studentId: number, photoId: string, reason: string) => {
    const today  = new Date().toLocaleDateString("pt-BR");
    const current = studentsData[studentId];
    const progressPhotos = (current?.progressPhotos || []).map(p =>
      p.id === photoId
        ? { ...p, coachFeedback: `⚠️ Reenvio solicitado: ${reason}`, feedbackDate: today, pendingReview: false, rejectedByCoach: true }
        : p
    );
    setStudentsDataLocal(prev => ({ ...prev, [studentId]: { ...prev[studentId], progressPhotos } }));
    await setDoc(doc(db, "studentsData", String(studentId)), { progressPhotos }, { merge: true });
    const student = users.find(u => u.id === studentId);
    await addNotification(`Coach solicitou reenvio de foto de ${student?.name}`, "photo_resubmit");
    await addAuditLog(`Reenvio de foto solicitado para ${student?.name}`, "Fotos de Progresso", "warning");
  }, [users, studentsData, addAuditLog, addNotification]);

  const studentResubmitPhoto = useCallback(async (studentId: number, photoId: string, newUrl: string) => {
    let finalUrl = newUrl;
    if (newUrl.startsWith("data:")) finalUrl = await uploadPhotoToStorage(studentId, newUrl);
    const current = studentsData[studentId];
    const progressPhotos = (current?.progressPhotos || []).map(p =>
      p.id === photoId
        ? { ...p, url: finalUrl, pendingReview: true, rejectedByCoach: false, coachFeedback: null, feedbackDate: null }
        : p
    );
    setStudentsDataLocal(prev => ({ ...prev, [studentId]: { ...prev[studentId], progressPhotos } }));
    await setDoc(doc(db, "studentsData", String(studentId)), { progressPhotos }, { merge: true });
    const student = users.find(u => u.id === studentId);
    await addNotification(`📸 ${student?.name} reenviou foto`, "photo");
  }, [users, studentsData, addNotification]);

  // ── Sessões de treino ─────────────────────────────────────────────────────

  const addWorkoutSession = useCallback(async (studentId: number, session: WorkoutSession) => {
    const current         = studentsData[studentId];
    const workoutSessions = [session, ...(current?.workoutSessions || [])];
    const monthlyWorkouts = (current?.monthlyWorkouts || 0) + 1;
    const streak          = (current?.streak || 0) + 1;
    setStudentsDataLocal(prev => ({
      ...prev, [studentId]: { ...prev[studentId], workoutSessions, monthlyWorkouts, streak }
    }));
    await setDoc(doc(db, "studentsData", String(studentId)),
      { workoutSessions, monthlyWorkouts, streak }, { merge: true });
    const student = users.find(u => u.id === studentId);
    await addNotification(`${student?.name} concluiu: ${session.workoutName}`, "workout");
  }, [users, studentsData, addNotification]);

  // ── Valor do contexto ─────────────────────────────────────────────────────

  const value: AppContextValue = {
    users, studentsData, notifications, auditLogs, permissions, config, loading,
    exerciseLibrary,            // ── NOVO ──
    setUsers, setStudentsData,
    setNotifications, setAuditLogs, setPermissions, setConfig,
    updateStudentWorkouts, updateCoachNote,
    sendMessageToStudent, sendMessageToCoach,
    studentSubmitPhoto, adminApprovePhoto, adminRequestResubmit, studentResubmitPhoto,
    addWorkoutSession,
    pendingPhotosCount,
    addAuditLog,
    addExerciseTemplate,        // ── NOVO ──
    updateExerciseTemplate,     // ── NOVO ──
    deleteExerciseTemplate,     // ── NOVO ──
  };

 if (loading) {
  return (
    <div style={{
      minHeight: "100vh", background: "#0d0d0d",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <img
        src="/logo.png"
        alt="GC Fitness"
        style={{
          width: 200, height: 200, objectFit: "contain",
          animation: "gc-pulse 1.2s ease-in-out infinite",
          opacity: 0.85,
        }}
      />
      <style>{`
        @keyframes gc-pulse {
          0%, 100% { opacity: 0.4; transform: scale(0.95); }
          50%       { opacity: 1;   transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ─── HOOKS ────────────────────────────────────────────────────────────────

export function useAdminProps() {
  const ctx = useAppContext();
  return {
    users:                  ctx.users,
    studentsData:           ctx.studentsData,
    notifications:          ctx.notifications,
    auditLogs:              ctx.auditLogs,
    permissions:            ctx.permissions,
    config:                 ctx.config,
    pendingPhotosCount:     ctx.pendingPhotosCount,
    exerciseLibrary:        ctx.exerciseLibrary,        // ── NOVO ──
    onUsersChange:          ctx.setUsers,
    onStudentsDataChange:   ctx.setStudentsData,
    onNotificationsChange:  ctx.setNotifications,
    onAuditLogsChange:      ctx.setAuditLogs,
    onPermissionsChange:    ctx.setPermissions,
    onConfigChange:         ctx.setConfig,
    updateStudentWorkouts:  ctx.updateStudentWorkouts,
    updateCoachNote:        ctx.updateCoachNote,
    sendMessageToStudent:   ctx.sendMessageToStudent,
    adminApprovePhoto:      ctx.adminApprovePhoto,
    adminRequestResubmit:   ctx.adminRequestResubmit,
    addExerciseTemplate:    ctx.addExerciseTemplate,    // ── NOVO ──
    updateExerciseTemplate: ctx.updateExerciseTemplate, // ── NOVO ──
    deleteExerciseTemplate: ctx.deleteExerciseTemplate, // ── NOVO ──
  };
}

export function useStudentProps(studentId: number) {
  const ctx = useAppContext();
  const sd  = ctx.studentsData[studentId];
  return {
    sharedStudentData:   sd,
    exerciseLibrary:     ctx.exerciseLibrary,           // ── NOVO: aluno pode ver a biblioteca ──
    onSendMessage:       (text: string)                                                            => ctx.sendMessageToCoach(studentId, text),
    onSubmitPhoto:       (photo: Omit<ProgressPhoto, "pendingReview" | "rejectedByCoach">)         => ctx.studentSubmitPhoto(studentId, photo),
    onResubmitPhoto:     (photoId: string, newUrl: string)                                         => ctx.studentResubmitPhoto(studentId, photoId, newUrl),
    onAddWorkoutSession: (session: WorkoutSession)                                                  => ctx.addWorkoutSession(studentId, session),
  };
}

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────
const N       = "#00C96B";
const CARD_BG = "rgba(255,255,255,0.04)";
const BORDER  = "rgba(255,255,255,0.09)";
const MUTED   = "rgba(240,240,240,0.45)";
const DANGER  = "#FF4D5E";
const AMBER   = "#F59E0B";

// ─── PAINEL DE FOTOS PENDENTES ────────────────────────────────────────────

interface PendingPhotosPanelProps {
  users: User[];
  studentsData: Record<number, StudentData>;
  onApprove: (studentId: number, photoId: string, feedback: string) => void;
  onRequestResubmit: (studentId: number, photoId: string, reason: string) => void;
}

export function PendingPhotosPanel({ users, studentsData, onApprove, onRequestResubmit }: PendingPhotosPanelProps) {
  const [feedbacks, setFeedbacks] = useState<Record<string, string>>({});
  const [mode,      setMode]      = useState<Record<string, "approve" | "resubmit" | null>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  const pendingItems: { student: User; photo: ProgressPhoto }[] = [];
  users.filter(u => u.role === "student").forEach(student => {
    const sd = studentsData[student.id];
    if (!sd) return;
    (sd.progressPhotos || []).filter(p => p.pendingReview && !p.coachFeedback).forEach(photo => {
      pendingItems.push({ student, photo });
    });
  });

  if (pendingItems.length === 0) {
    return (
      <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 28, textAlign: "center" }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
        <div style={{ fontSize: 13, color: MUTED }}>Nenhuma foto aguardando avaliação</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {pendingItems.map(({ student, photo }) => {
        const key         = `${student.id}_${photo.id}`;
        const currentMode = mode[key] || null;
        const isSubmitted = submitted[key];

        return (
          <motion.div key={key} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            style={{ background: CARD_BG, border: `1px solid ${isSubmitted ? N + "44" : AMBER + "44"}`, borderRadius: 16, overflow: "hidden" }}>

            <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${BORDER}` }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${N}18`, border: `1.5px solid ${N}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: N, flexShrink: 0 }}>
                {student.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{student.name}</div>
                <div style={{ fontSize: 11, color: MUTED }}>{photo.angle} · {new Date(photo.date).toLocaleDateString("pt-BR")}</div>
              </div>
              <span style={{ background: `${AMBER}18`, color: AMBER, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Aguardando
              </span>
            </div>

            <div style={{ background: "rgba(0,0,0,0.3)", minHeight: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {photo.url
                ? <img src={photo.url} alt={photo.label} style={{ maxHeight: 300, maxWidth: "100%", objectFit: "contain", display: "block" }} />
                : <div style={{ textAlign: "center", color: MUTED, padding: 40 }}><div style={{ fontSize: 32, marginBottom: 8 }}>📷</div><div style={{ fontSize: 12 }}>{photo.label}</div></div>
              }
            </div>

            <div style={{ padding: "10px 16px", borderBottom: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{photo.label}</div>
            </div>

            {!isSubmitted ? (
              <div style={{ padding: 16 }}>
                {!currentMode && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <button onClick={() => setMode(prev => ({ ...prev, [key]: "approve" }))}
                      style={{ padding: "11px", borderRadius: 12, border: "none", background: N, color: "#000", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                      ✓ Avaliar com Feedback
                    </button>
                    <button onClick={() => setMode(prev => ({ ...prev, [key]: "resubmit" }))}
                      style={{ padding: "11px", borderRadius: 12, border: `1px solid ${DANGER}44`, background: `${DANGER}12`, color: DANGER, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                      ↩ Solicitar Reenvio
                    </button>
                  </div>
                )}
                {currentMode === "approve" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: N, textTransform: "uppercase", letterSpacing: "0.06em" }}>Feedback do Coach</div>
                    <textarea rows={3} placeholder="Escreva seu feedback sobre a evolução do aluno..."
                      value={feedbacks[key] || ""} onChange={e => setFeedbacks(prev => ({ ...prev, [key]: e.target.value }))}
                      style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}`, color: "#f0f0f0", borderRadius: 10, padding: "10px 12px", fontSize: 13, outline: "none", resize: "vertical", fontFamily: "DM Sans, sans-serif", width: "100%", boxSizing: "border-box" }} />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => { if (!feedbacks[key]?.trim()) return; onApprove(student.id, photo.id, feedbacks[key].trim()); setSubmitted(prev => ({ ...prev, [key]: true })); }}
                        style={{ flex: 2, padding: "11px", borderRadius: 12, border: "none", background: N, color: "#000", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                        Enviar Feedback
                      </button>
                      <button onClick={() => setMode(prev => ({ ...prev, [key]: null }))}
                        style={{ flex: 1, padding: "11px", borderRadius: 12, border: `1px solid ${BORDER}`, background: "transparent", color: MUTED, fontSize: 13, cursor: "pointer" }}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
                {currentMode === "resubmit" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: DANGER, textTransform: "uppercase", letterSpacing: "0.06em" }}>Motivo do Reenvio</div>
                    <textarea rows={2} placeholder="Ex: Foto com qualidade baixa, ângulo incorreto..."
                      value={feedbacks[key] || ""} onChange={e => setFeedbacks(prev => ({ ...prev, [key]: e.target.value }))}
                      style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${DANGER}44`, color: "#f0f0f0", borderRadius: 10, padding: "10px 12px", fontSize: 13, outline: "none", resize: "vertical", fontFamily: "DM Sans, sans-serif", width: "100%", boxSizing: "border-box" }} />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => { if (!feedbacks[key]?.trim()) return; onRequestResubmit(student.id, photo.id, feedbacks[key].trim()); setSubmitted(prev => ({ ...prev, [key]: true })); }}
                        style={{ flex: 2, padding: "11px", borderRadius: 12, border: "none", background: DANGER, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                        Solicitar Reenvio
                      </button>
                      <button onClick={() => setMode(prev => ({ ...prev, [key]: null }))}
                        style={{ flex: 1, padding: "11px", borderRadius: 12, border: `1px solid ${BORDER}`, background: "transparent", color: MUTED, fontSize: 13, cursor: "pointer" }}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: `${N}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: N, fontSize: 12, fontWeight: 700 }}>✓</span>
                </div>
                <div style={{ fontSize: 12, color: N, fontWeight: 600 }}>Avaliação enviada — aluno será notificado.</div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── TAB COMPLETA DE FOTOS ────────────────────────────────────────────────

export function AdminPhotosTab({ users, studentsData, onApprove, onRequestResubmit }: PendingPhotosPanelProps) {
  const [filterStudent, setFilterStudent] = useState<number | "all">("all");
  const [filterStatus,  setFilterStatus]  = useState<"all" | "pending" | "reviewed">("all");

  const students = users.filter(u => u.role === "student");

  const allPhotos: { student: User; photo: ProgressPhoto }[] = [];
  students.forEach(student => {
    const sd = studentsData[student.id];
    if (!sd) return;
    (sd.progressPhotos || []).forEach(photo => allPhotos.push({ student, photo }));
  });

  const filtered = allPhotos.filter(({ student, photo }) => {
    if (filterStudent !== "all" && student.id !== filterStudent) return false;
    if (filterStatus === "pending"  && (!photo.pendingReview || !!photo.coachFeedback)) return false;
    if (filterStatus === "reviewed" && (photo.pendingReview  || !photo.coachFeedback))  return false;
    return true;
  });

  const pendingCount = allPhotos.filter(({ photo }) => photo.pendingReview && !photo.coachFeedback).length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div style={{ fontSize: 11, color: MUTED }}>{allPhotos.length} foto(s) total</div>
        {pendingCount > 0 && (
          <div style={{ background: `${AMBER}15`, border: `1px solid ${AMBER}44`, borderRadius: 10, padding: "8px 14px", fontSize: 12, color: AMBER, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
            ⏳ {pendingCount} aguardando avaliação
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <select value={filterStudent === "all" ? "all" : filterStudent}
          onChange={e => setFilterStudent(e.target.value === "all" ? "all" : Number(e.target.value))}
          style={{ background: CARD_BG, border: `1px solid ${BORDER}`, color: "#f0f0f0", borderRadius: 10, padding: "8px 12px", fontSize: 13, cursor: "pointer", outline: "none" }}>
          <option value="all">Todos os alunos</option>
          {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>

        <div style={{ display: "flex", gap: 4, background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 4 }}>
          {(["all", "pending", "reviewed"] as const).map(status => (
            <button key={status} onClick={() => setFilterStatus(status)}
              style={{ padding: "6px 12px", borderRadius: 8, border: "none", background: filterStatus === status ? `${N}18` : "transparent", color: filterStatus === status ? N : MUTED, fontSize: 12, fontWeight: filterStatus === status ? 700 : 500, cursor: "pointer", transition: "all .15s" }}>
              {status === "all" ? "Todas" : status === "pending" ? "Pendentes" : "Avaliadas"}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 40, textAlign: "center", color: MUTED }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>📸</div>
          <div style={{ fontSize: 13 }}>Nenhuma foto encontrada</div>
        </div>
      ) : (
        <>
          {filterStatus !== "reviewed" && (
            <PendingPhotosPanel
              users={users}
              studentsData={Object.fromEntries(
                Object.entries(studentsData).map(([id, sd]) => [
                  id, { ...sd, progressPhotos: (sd.progressPhotos || []).filter(() => filterStudent === "all" || Number(id) === filterStudent) }
                ])
              )}
              onApprove={onApprove}
              onRequestResubmit={onRequestResubmit}
            />
          )}
          {filterStatus !== "pending" && (
            <div style={{ marginTop: filterStatus === "all" ? 20 : 0 }}>
              {filterStatus === "all" && filtered.some(({ photo }) => !!photo.coachFeedback) && (
                <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Já avaliadas</div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
                {filtered.filter(({ photo }) => !!photo.coachFeedback).map(({ student, photo }) => (
                  <div key={`${student.id}_${photo.id}`}
                    style={{ background: CARD_BG, border: `1px solid ${photo.rejectedByCoach ? DANGER + "44" : BORDER}`, borderRadius: 14, overflow: "hidden" }}>
                    <div style={{ background: "rgba(0,0,0,0.3)", height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {photo.url
                        ? <img src={photo.url} alt={photo.label} style={{ height: 180, width: "100%", objectFit: "cover" }} />
                        : <div style={{ textAlign: "center", color: MUTED }}><div style={{ fontSize: 28 }}>📷</div><div style={{ fontSize: 11, marginTop: 4 }}>{photo.angle}</div></div>
                      }
                    </div>
                    <div style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <div style={{ width: 22, height: 22, borderRadius: "50%", background: `${N}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: N, flexShrink: 0 }}>{student.avatar}</div>
                        <span style={{ fontSize: 12, fontWeight: 600 }}>{student.name}</span>
                        <span style={{ fontSize: 10, color: MUTED, marginLeft: "auto" }}>{photo.angle}</span>
                      </div>
                      <div style={{ fontSize: 11, color: MUTED, marginBottom: 6 }}>{photo.label}</div>
                      <div style={{ background: photo.rejectedByCoach ? `${DANGER}10` : `${N}10`, border: `1px solid ${photo.rejectedByCoach ? DANGER + "33" : N + "33"}`, borderRadius: 8, padding: "8px 10px" }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: photo.rejectedByCoach ? DANGER : N, marginBottom: 4 }}>
                          {photo.rejectedByCoach ? "⚠️ Reenvio solicitado" : "✓ Coach avaliou"}
                        </div>
                        <div style={{ fontSize: 11, color: "#f0f0f0", lineHeight: 1.5 }}>{photo.coachFeedback}</div>
                        <div style={{ fontSize: 10, color: MUTED, marginTop: 4 }}>{photo.feedbackDate}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── BANNER TREINO ATUALIZADO ─────────────────────────────────────────────

export function WorkoutUpdatedBanner({ lastUpdated, accent }: { lastUpdated?: string; accent?: string }) {
  const [dismissed, setDismissed] = useState(false);
  if (!lastUpdated || dismissed) return null;
  const color = accent || N;
  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      style={{ background: `${color}12`, border: `1px solid ${color}33`, borderRadius: 14, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ fontSize: 18 }}>🏋️</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color }}>Coach atualizou seus treinos!</div>
        <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>Confira os novos exercícios e cargas abaixo.</div>
      </div>
      <button onClick={() => setDismissed(true)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 16, padding: 4 }} aria-label="Dispensar">✕</button>
    </motion.div>
  );
}

// ─── BADGE FEEDBACK COACH ─────────────────────────────────────────────────

export function CoachFeedbackBadge({ photo, accent }: { photo: ProgressPhoto; accent?: string }) {
  const color = accent || N;
  if (!photo.coachFeedback) return null;
  return (
    <div style={{ background: photo.rejectedByCoach ? `${DANGER}18` : `${color}18`, border: `1px solid ${photo.rejectedByCoach ? DANGER + "44" : color + "44"}`, borderRadius: 12, padding: "10px 14px", marginTop: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <div style={{ width: 24, height: 24, borderRadius: 8, background: photo.rejectedByCoach ? DANGER : color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#000", flexShrink: 0 }}>GC</div>
        <span style={{ fontSize: 11, fontWeight: 700, color: photo.rejectedByCoach ? DANGER : color }}>
          {photo.rejectedByCoach ? "Reenvio solicitado" : "Feedback do Coach"}
        </span>
        <span style={{ fontSize: 10, color: MUTED, marginLeft: "auto" }}>{photo.feedbackDate}</span>
      </div>
      <p style={{ fontSize: 12, lineHeight: 1.55, margin: 0, color: "#f0f0f0" }}>{photo.coachFeedback}</p>
    </div>
  );
}

export default SharedAppProvider;