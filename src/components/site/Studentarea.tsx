/* eslint-disable prettier/prettier, @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/**
 * GC Fitness — StudentDashboard
 * Fix: relatórios agora aparecem imediatamente após salvar treino (estado local)
 * Fix: navegação livre entre exercícios no modal de treino
 * Upgrade: Peso / Séries / Reps no registro de treino agora usam dropdown
 *          editável (sugere valores por equipamento, mas aceita digitar).
 *          Séries limitado a 5, Reps limitado a 20.
 * Upgrade NOVO: exibe o equipamento definido pelo coach para o exercício
 *          (aba Treino, treino adaptado e modal de execução do treino).
 */

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, LineChart, Line,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import {
  LogIn, Eye, EyeOff, Dumbbell, TrendingUp,
  Calendar, MessageCircle, Bell, Settings,
  Plus, Check, Trophy, LogOut,
  Activity, Send, X, CheckCircle2,
  Clock, Lock, Zap, AlertCircle,
  Gauge, Menu, Timer, Type, Volume2, Moon,
  Play, FileText, Download, Share2, Sun,
  ChevronDown, ChevronRight, Upload, Camera, ZoomIn, RefreshCw,
  Globe, Palette, LayoutGrid, Vibrate, Eye as EyeIcon, Contrast,
  SlidersHorizontal, RotateCcw, Check as CheckIcon,
} from "lucide-react";

import {
  useStudentProps,
  type ProgressPhoto,
  type WorkoutSession,
} from "@/components/site/SharedAppState";

// ─── CONSTANTES ───────────────────────────────────────────────────────────
const N      = "#00FF88";
const DANGER = "#FF4D5E";
const BLUE   = "#00D4FF";
const YELLOW = "#FFD700";
const PURPLE = "#A855F7";

const FONT_SIZE_OPTIONS = [
  { label: "Muito Pequeno", value: 11, desc: "Compacto" },
  { label: "Pequeno",       value: 12, desc: "Denso" },
  { label: "Normal",        value: 13, desc: "Padrão" },
  { label: "Médio",         value: 14, desc: "Confortável" },
  { label: "Grande",        value: 16, desc: "Legível" },
  { label: "Muito Grande",  value: 18, desc: "Acessível" },
  { label: "Extra Grande",  value: 20, desc: "Alto contraste" },
  { label: "Máximo",        value: 22, desc: "Máxima legibilidade" },
];

const ACCENT_COLORS = [
  { label: "Verde Neon",    value: "#00FF88" },
  { label: "Azul Elétrico", value: "#00D4FF" },
  { label: "Roxo",          value: "#A855F7" },
  { label: "Laranja",       value: "#FF8C00" },
  { label: "Rosa",          value: "#FF4DA6" },
  { label: "Vermelho",      value: "#FF4D5E" },
  { label: "Amarelo",       value: "#FFD700" },
  { label: "Cyan",          value: "#00FFFF" },
];

const FONT_FAMILY_OPTIONS = [
  { label: "System (Padrão)", value: "system-ui, sans-serif" },
  { label: "Inter",           value: "'Inter', sans-serif" },
  { label: "Roboto",          value: "'Roboto', sans-serif" },
  { label: "Outfit",          value: "'Outfit', sans-serif" },
];

const LANGUAGE_OPTIONS = [
  { label: "Português (BR)", value: "pt-BR", flag: "🇧🇷" },
  { label: "English (US)",   value: "en-US", flag: "🇺🇸" },
  { label: "Español",        value: "es-ES", flag: "🇪🇸" },
];

// ─── esquemas de carga por equipamento + limites de séries/reps ───────────
// Mesma lógica de equipmentWeightSchemes.ts, embutida aqui para este arquivo
// funcionar sozinho. Se você já tiver aquele arquivo no projeto, pode trocar
// este bloco por um import e apagar a duplicação — ver nota no fim.

function buildWeightRange(ranges) {
  const set = new Set();
  ranges.forEach(({ from, to, step }) => {
    if (step <= 0) { set.add(from); return; }
    for (let v = from; v <= to + 1e-9; v += step) set.add(Math.round(v * 100) / 100);
  });
  return Array.from(set).sort((a, b) => a - b);
}

function fmtKg(n) {
  return `${Number.isInteger(n) ? n : n.toFixed(1)}kg`;
}

const WEIGHT_SCHEMES = {
  "Halter": () => buildWeightRange([{ from: 1, to: 10, step: 1 }, { from: 12, to: 60, step: 2 }]).map(fmtKg),
  "Cabo": () => buildWeightRange([{ from: 2.5, to: 2.5, step: 0 }, { from: 5, to: 150, step: 5 }]).map(fmtKg),
  "Máquina": () => buildWeightRange([{ from: 5, to: 5, step: 0 }, { from: 10, to: 300, step: 5 }]).map(fmtKg),
  "Barra": () => buildWeightRange([{ from: 20, to: 200, step: 2.5 }]).map(fmtKg),
  "Smith": () => buildWeightRange([{ from: 10, to: 200, step: 2.5 }]).map(fmtKg),
  "Kettlebell": () => [4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48].map(fmtKg),
  "Peso Corporal": () => [
    "Peso Corporal (PC)",
    ...buildWeightRange([{ from: 2.5, to: 50, step: 2.5 }]).map((n) => `PC + ${fmtKg(n)}`),
  ],
  "Elástico": () => [
    "Amarela · Extra Leve", "Vermelha · Leve", "Verde · Média",
    "Azul · Forte", "Preta · Extra Forte", "Prata · Muito Forte",
  ],
};

// fallback quando o exercício não é encontrado na biblioteca (equipamento desconhecido)
const GENERIC_WEIGHT_OPTIONS = [
  0, 1, 2, 2.5, 5, 7.5, 10, 12.5, 15, 20, 25, 30, 35, 40, 45, 50,
  60, 70, 80, 90, 100, 120, 140, 160, 180, 200,
].map(fmtKg);

// limite pedido: no máximo 20 reps por registro de treino
const REPS_OPTIONS = Array.from({ length: 20 }, (_, i) => String(i + 1));

function resolveEquipment(exerciseName, library = []) {
  if (!exerciseName) return null;
  const found = library.find(
    (t) => t?.name?.trim().toLowerCase() === exerciseName.trim().toLowerCase()
  );
  return found?.equipment || null;
}

// ── ALTERADO: agora aceita um `explicitEquipment` (o que o coach definiu
// diretamente no exercício do treino). Ordem de prioridade:
// 1) equipamento definido manualmente pelo coach no exercício do treino
// 2) equipamento cadastrado na biblioteca (busca por nome do exercício)
// 3) lista genérica de pesos
function getWeightOptionsFor(exerciseName, library = [], explicitEquipment = null) {
  const equipment = explicitEquipment || resolveEquipment(exerciseName, library);
  if (equipment && WEIGHT_SCHEMES[equipment]) return WEIGHT_SCHEMES[equipment]();
  return GENERIC_WEIGHT_OPTIONS;
}

// converte URL do YouTube (watch/youtu.be/shorts) para URL de embed; null se não for YouTube
function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  return match?.[1] ? `https://www.youtube.com/embed/${match[1]}` : null;
}

const DEFAULT_SETTINGS = {
  isDark: true,
  fontSize: 14,
  accentColor: "#00FF88",
  fontFamily: "system-ui, sans-serif",
  compactMode: false,
  highContrast: false,
  reducedMotion: false,
  notifications: true,
  workoutReminder: true,
  coachMessages: true,
  achievementNotifs: true,
  sounds: true,
  restTimerSound: true,
  haptic: true,
  restTimer: true,
  defaultRestTime: 90,
  loadSuggestion: true,
  rpeTracking: true,
  focusMode: false,
  hideWeight: false,
  privatePhotos: false,
  language: "pt-BR",
  weightUnit: "kg",
};

function loadSettings() {
  try {
    const raw = localStorage.getItem("gym_settings_v2");
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch { return DEFAULT_SETTINGS; }
}
function saveSettings(s: any) {
  try { localStorage.setItem("gym_settings_v2", JSON.stringify(s)); } catch {}
}

// ─── THEME CSS ────────────────────────────────────────────────────────────
function getThemeCss(isDark, fontSize, accentColor, fontFamily, compactMode, highContrast, reducedMotion) {
  const accent = accentColor || N;
  const CARD_BG = isDark
    ? (highContrast ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)")
    : (highContrast ? "rgba(0,0,0,0.06)"       : "rgba(0,0,0,0.03)");
  const BORDER_COLOR = isDark
    ? (highContrast ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)")
    : (highContrast ? "rgba(0,0,0,0.18)"       : "rgba(0,0,0,0.08)");
  const TEXT_COLOR  = isDark ? (highContrast ? "#ffffff" : "#f5f5f5") : (highContrast ? "#000000" : "#1a1a1a");
  const BG_COLOR    = isDark ? (highContrast ? "#000000" : "#0d0d0d") : (highContrast ? "#ffffff" : "#f8f9fa");
  const MUTED_COLOR = isDark
    ? (highContrast ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.45)")
    : (highContrast ? "rgba(0,0,0,0.7)"        : "rgba(0,0,0,0.5)");
  const spacing = compactMode ? 0.75 : 1;

  return `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap');
  * { box-sizing: border-box; }
  .student-area {
    font-family: ${fontFamily || "system-ui, sans-serif"};
    background: ${BG_COLOR}; color: ${TEXT_COLOR}; font-size: ${fontSize}px;
    transition: background 0.3s, color 0.3s, font-size 0.2s;
    --card-bg: ${CARD_BG}; --border: ${BORDER_COLOR}; --text: ${TEXT_COLOR};
    --bg: ${BG_COLOR}; --muted: ${MUTED_COLOR}; --accent: ${accent};
    --spacing: ${spacing}; --fs: ${fontSize}px;
  }
  .student-area .display { font-family: system-ui, sans-serif; }
  .student-area .neon    { color: ${accent}; }
  .student-area .muted   { color: ${MUTED_COLOR}; }
  .student-area input, .student-area textarea {
    background: ${CARD_BG}; border: 1px solid ${BORDER_COLOR}; color: ${TEXT_COLOR};
    font-family: ${fontFamily || "system-ui, sans-serif"}; border-radius: 12px;
    padding: 12px 16px; width: 100%; font-size: inherit; outline: none; transition: border .2s;
  }
  .student-area input:focus, .student-area textarea:focus { border-color: ${accent}44; }
  .student-area button { cursor: pointer; font-family: ${fontFamily || "system-ui, sans-serif"}; font-size: inherit; }
  .student-area .card {
    background: ${CARD_BG}; border: 1px solid ${BORDER_COLOR};
    border-radius: ${compactMode ? "14px" : "20px"}; padding: ${compactMode ? "14px" : "20px"};
  }
  @media (max-width: 640px) {
    .student-area .card { border-radius: ${compactMode ? "10px" : "16px"}; padding: ${compactMode ? "10px" : "16px"}; }
  }
  @keyframes pulse { 0%, 100% { opacity:1; } 50% { opacity:.5; } }
  .student-area .pulse { animation: ${reducedMotion ? "none" : "pulse 2s infinite"}; }
  .student-area .tab-btn {
    background: none; border: none; padding: ${compactMode ? "6px 12px" : "8px 16px"};
    border-radius: 10px; font-size: ${compactMode ? "0.86em" : "0.93em"}; font-weight: 500;
    color: ${MUTED_COLOR}; transition: ${reducedMotion ? "none" : "all .2s"}; white-space: nowrap;
  }
  .student-area .tab-btn.active { background: ${accent}18; color: ${accent}; }
  .student-area .badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 10px; border-radius: 20px; font-size: 0.79em; font-weight: 600;
  }
  .student-area .slider {
    width: 100%; height: 6px; border-radius: 3px; background: ${BORDER_COLOR};
    appearance: none; -webkit-appearance: none; cursor: pointer;
  }
  .student-area .slider::-webkit-slider-thumb {
    appearance: none; -webkit-appearance: none; width: 18px; height: 18px;
    border-radius: 50%; background: ${accent}; cursor: pointer; box-shadow: 0 0 10px ${accent}44;
  }
  .student-area .photo-card {
    border-radius: 16px; overflow: hidden; border: 1px solid ${BORDER_COLOR}; position: relative;
    background: ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"};
  }
  .student-area .lightbox-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.97); z-index: 1000;
    display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(20px);
  }
  .student-area .settings-section { margin-bottom: ${compactMode ? "16px" : "24px"}; }
  .student-area .settings-section-title {
    font-size: 0.71em; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;
    color: ${accent}; margin-bottom: ${compactMode ? "8px" : "12px"}; padding: 0 4px;
  }
  .student-area .settings-item {
    background: ${CARD_BG}; border: 1px solid ${BORDER_COLOR};
    border-radius: ${compactMode ? "12px" : "16px"}; padding: ${compactMode ? "12px 14px" : "16px 18px"};
    display: flex; justify-content: space-between; align-items: center; gap: 12px;
    transition: ${reducedMotion ? "none" : "border-color .2s"}; margin-bottom: 6px;
  }
  .student-area .settings-item:hover { border-color: ${accent}25; }
  .student-area .toggle-track {
    width: 50px; height: 28px; border-radius: 14px; border: none; cursor: pointer;
    transition: ${reducedMotion ? "none" : "background .2s"}; position: relative; flex-shrink: 0;
  }
  .student-area .toggle-thumb {
    width: 22px; height: 22px; border-radius: 11px;
    background: ${isDark ? "#0d0d0d" : "#f8f9fa"}; position: absolute; top: 3px;
    transition: ${reducedMotion ? "none" : "transform .2s"};
  }
  .student-area .main-content {
    max-width: 1200px; margin: 0 auto; padding: ${compactMode ? "12px" : "20px 16px"};
  }
  .student-area .kpi-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(150px,1fr));
    gap: ${compactMode ? "8px" : "10px"}; margin-bottom: ${compactMode ? "14px" : "20px"};
  }
  `;
}

// ─── UTILITÁRIOS ──────────────────────────────────────────────────────────
function NeonBtn({ children, onClick, secondary = false, small = false, style = {}, accent }: any) {
  const color = accent || N;
  const base: any = {
    display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 100,
    fontWeight: 600, cursor: "pointer", transition: "all .2s", border: "none",
    fontSize: small ? "0.93em" : "1.07em", padding: small ? "8px 18px" : "14px 28px",
  };
  const variant = secondary
    ? { background: "rgba(255,255,255,0.06)", color: "inherit", border: "1px solid rgba(255,255,255,0.1)" }
    : { background: color, color: "#000" };
  return <button style={{ ...base, ...variant, ...style }} onClick={onClick}>{children}</button>;
}

function Toggle({ value, onChange, accent, isDark }: any) {
  const color = accent || N;
  return (
    <button onClick={() => onChange(!value)} className="toggle-track"
      style={{ background: value ? color : "rgba(255,255,255,0.1)" }}>
      <div className="toggle-thumb" style={{ background: isDark ? "#0d0d0d" : "#f8f9fa", transform: value ? "translateX(22px)" : "translateX(3px)" }} />
    </button>
  );
}

function Dropdown({ options, value, onChange, isDark, accent }: any) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const color = accent || N;
  const selected = options.find((o: any) => o.value === value) || options[0];

  useEffect(() => {
    function h(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", minWidth: 180 }}>
      <button onClick={() => setOpen(!open)}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, width: "100%", padding: "10px 14px",
          background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
          border: `1px solid ${open ? color + "55" : isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
          borderRadius: 12, color: "inherit", fontFamily: "inherit", fontWeight: 600, fontSize: "0.93em", cursor: "pointer" }}>
        <span>{selected?.label}</span>
        <ChevronDown size={14} style={{ color: "var(--muted)", transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform .2s" }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}
            style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: isDark ? "#1a1a1a" : "#fff",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
              borderRadius: 14, overflow: "hidden", zIndex: 200, boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
            {options.map((opt: any) => (
              <button key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "11px 14px",
                  background: opt.value === value ? `${color}14` : "transparent", border: "none",
                  color: opt.value === value ? color : "inherit", fontFamily: "inherit",
                  fontWeight: opt.value === value ? 700 : 500, fontSize: "0.93em", cursor: "pointer", textAlign: "left" }}>
                <div>
                  <div>{opt.label}</div>
                  {opt.desc && <div style={{ fontSize: "0.86em", color: "var(--muted)", marginTop: 1 }}>{opt.desc}</div>}
                </div>
                {opt.value === value && <CheckIcon size={14} />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── EditableDropdown — combobox que sugere valores mas aceita digitar ────
// Usado para Peso / Séries / Reps no registro de treino.
function EditableDropdown({ value, onChange, options, isDark, accent, placeholder }: any) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value != null ? String(value) : "");
  const ref = useRef<HTMLDivElement>(null);
  const color = accent || N;

  useEffect(() => { setQuery(value != null ? String(value) : ""); }, [value]);

  useEffect(() => {
    function h(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        if (query !== String(value)) onChange(query);
      }
    }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [query, value, onChange]);

  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.toLowerCase();
    return options.filter((o: string) => o.toLowerCase().includes(q));
  }, [options, query]);

  function select(opt: string) {
    setQuery(opt);
    onChange(opt);
    setOpen(false);
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <input
        value={query}
        onFocus={() => setOpen(true)}
        onChange={e => { setQuery(e.target.value); setOpen(true); }}
        placeholder={placeholder}
        style={{
          width: "100%", boxSizing: "border-box",
          background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
          border: `1px solid ${open ? color + "66" : isDark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.09)"}`,
          color: "inherit", borderRadius: 12, padding: "10px 12px",
          fontSize: "0.93em", fontWeight: 700, textAlign: "center",
          outline: "none", fontFamily: "inherit",
        }}
      />
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.14 }}
            style={{
              position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 30,
              background: isDark ? "#1a1a1a" : "#fff",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
              borderRadius: 12, maxHeight: 180, overflowY: "auto",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}>
            {filtered.length === 0 ? (
              <div style={{ padding: "10px 12px", fontSize: "0.79em", color: "var(--muted)" }}>
                Valor customizado: "{query}"
              </div>
            ) : (
              filtered.map((opt: string) => (
                <button key={opt} type="button" onClick={() => select(opt)}
                  style={{
                    display: "block", width: "100%", textAlign: "left", padding: "8px 12px",
                    background: opt === query ? `${color}14` : "transparent", border: "none",
                    color: opt === query ? color : "inherit", fontWeight: opt === query ? 700 : 500,
                    fontSize: "0.86em", cursor: "pointer",
                  }}>
                  {opt}
                </button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── TAB: TREINOS ─────────────────────────────────────────────────────────
function WorkoutTab({ sd, onStartWorkout, onAdaptiveWorkout, accent }: any) {
  const [expandedWorkout, setExpandedWorkout] = useState<number | null>(null);
  const workouts = sd?.workouts || [];

  const groupColors: Record<string, string> = {
    Superior: BLUE, Inferior: DANGER, Pull: PURPLE, Push: accent || N,
  };
  function getColor(name: string) {
    for (const [k, v] of Object.entries(groupColors)) if (name.includes(k)) return v;
    return accent || N;
  }

  if (workouts.length === 0) {
    return (
      <motion.div key="treino" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div style={{ marginBottom: 24 }}>
          <h2 className="display" style={{ fontSize: "clamp(1.43em,6vw,1.86em)", fontWeight: 800 }}>Meus Treinos</h2>
          <p style={{ fontSize: "0.93em", color: "var(--muted)", marginTop: 4 }}>Aguardando seu coach configurar os treinos</p>
        </div>
        <div className="card" style={{ textAlign: "center", padding: 60 }}>
          <Dumbbell size={48} style={{ color: "var(--muted)", marginBottom: 16 }} />
          <div style={{ fontSize: "1.14em", fontWeight: 600, marginBottom: 8 }}>Nenhum treino ainda</div>
          <div style={{ fontSize: "0.93em", color: "var(--muted)" }}>Seu coach vai adicionar os treinos em breve.</div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div key="treino" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 className="display" style={{ fontSize: "clamp(1.43em,6vw,1.86em)", fontWeight: 800 }}>Meus Treinos</h2>
        <p style={{ fontSize: "0.93em", color: "var(--muted)", marginTop: 4 }}>Semana atual · {workouts.length} treinos programados</p>
      </div>

      {sd?.coachNote && (
        <div className="card" style={{ marginBottom: 20, background: `${accent || N}08`, borderColor: `${accent || N}22` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: accent || N, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.64em", fontWeight: 800, color: "#000" }}>GC</div>
            <span style={{ fontSize: "0.86em", fontWeight: 700, color: accent || N }}>Nota do Coach</span>
          </div>
          <p style={{ fontSize: "0.93em", lineHeight: 1.6, margin: 0 }}>{sd.coachNote}</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {workouts.map((w: any) => {
          const isExpanded = expandedWorkout === w.id;
          const color = getColor(w.name);
          return (
            <motion.div key={w.id} layout className="card" style={{ borderLeft: `3px solid ${color}`, padding: 0, overflow: "hidden" }}>
              <div style={{ padding: "18px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                onClick={() => setExpandedWorkout(isExpanded ? null : w.id)}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Dumbbell size={20} style={{ color }} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.79em", color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 2 }}>{w.day}</div>
                    <div className="display" style={{ fontSize: "1.21em", fontWeight: 800 }}>{w.name}</div>
                    <div style={{ fontSize: "0.86em", color: "var(--muted)", marginTop: 2, display: "flex", gap: 12 }}>
                      <span>{(w.exercises || []).length} exercícios</span>
                    </div>
                  </div>
                </div>
                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={20} style={{ color: "var(--muted)" }} />
                </motion.div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: "hidden" }}>
                    <div style={{ padding: "0 20px 8px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 70px 70px 70px", gap: 8, padding: "10px 16px 6px", fontSize: "0.71em", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        <span>Exercício</span>
                        <span style={{ textAlign: "center" }}>Carga</span>
                        <span style={{ textAlign: "center" }}>Séries</span>
                        <span style={{ textAlign: "center" }}>Reps</span>
                      </div>
                      {(w.exercises || []).map((ex: any, idx: number) => (
                        <div key={ex.id} style={{ display: "grid", gridTemplateColumns: "1fr 80px 70px 70px 70px", gap: 8, alignItems: "center", padding: "10px 16px", borderRadius: 12, background: idx % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent", marginBottom: 4 }}>
                          <div>
                            <div style={{ fontSize: "1em", fontWeight: 600 }}>{ex.name}</div>
                            {/* NOVO: equipamento definido pelo coach para este exercício */}
                            {/* NOVO: equipamento definido pelo coach para este exercício */}
                            {ex.equipment && (
                              <div style={{ fontSize: "0.79em", color: BLUE, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                                <Dumbbell size={11} /> {ex.equipment}
                              </div>
                            )}
                          </div>
                          <div style={{ textAlign: "center" }}><span style={{ fontSize: "0.93em", fontWeight: 700, color }}>{ex.plannedLoad}</span></div>
                          <div style={{ textAlign: "center" }}><span style={{ display: "inline-block", background: `${color}18`, color, fontSize: "0.93em", fontWeight: 700, padding: "3px 10px", borderRadius: 8 }}>{ex.plannedSets}x</span></div>
                          <div style={{ textAlign: "center" }}><span style={{ fontSize: "0.93em", fontWeight: 600 }}>{ex.plannedReps}</span></div>
                          <div style={{ textAlign: "center" }}><span style={{ fontSize: "0.86em", color: "var(--muted)" }}>~{ex.estimatedTime}m</span></div>
                        </div>
                      ))}
                    </div>
                    <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 12, flexWrap: "wrap" }}>
                      <NeonBtn accent={accent} onClick={() => onStartWorkout(w)} style={{ flex: 1, justifyContent: "center", minWidth: 160 }}>
                        <Play size={16} fill="currentColor" /> Iniciar Treino
                      </NeonBtn>
                      <NeonBtn accent={accent} secondary onClick={() => onAdaptiveWorkout(w)} style={{ flex: 1, justifyContent: "center", minWidth: 160 }}>
                        <Zap size={16} /> Adaptar ao Tempo
                      </NeonBtn>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── TAB: RELATÓRIOS ──────────────────────────────────────────────────────
// Recebe `extraSessions` para mostrar sessões salvas localmente antes do Firestore atualizar
function ReportsTab({ sd, accent, extraSessions = [] }: any) {
  const [filterMode, setFilterMode] = useState("semanal");
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [dateRange, setDateRange] = useState({ from: "2026-01-01", to: "2026-12-31" });
  const [useCustomRange, setUseCustomRange] = useState(false);
  const color = accent || N;

  // Mescla sessões do Firestore com as locais, eliminando duplicatas por id
  const remoteSessions: any[] = sd?.workoutSessions || [];
  const allSessionsMap = new Map<string, any>();
  // locais têm prioridade (mais recentes)
  extraSessions.forEach((s: any) => allSessionsMap.set(s.id, s));
  remoteSessions.forEach((s: any) => { if (!allSessionsMap.has(s.id)) allSessionsMap.set(s.id, s); });
  const sessions = Array.from(allSessionsMap.values()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  function getFiltered() {
    const now = new Date();
    return sessions.filter(s => {
      if (useCustomRange) {
        const d = new Date(s.date);
        return d >= new Date(dateRange.from) && d <= new Date(dateRange.to);
      }
      const diff = (now.getTime() - new Date(s.date).getTime()) / (1000 * 60 * 60 * 24);
      if (filterMode === "diario")  return diff < 1;
      if (filterMode === "semanal") return diff < 7;
      if (filterMode === "mensal")  return diff < 31;
      return true;
    });
  }

  const filtered = getFiltered();
  const totalMetas = filtered.reduce((a: number, s: any) => a + (s.metasBatidas || 0), 0);
  const totalNao   = filtered.reduce((a: number, s: any) => a + (s.metasNaoAtingidas || 0), 0);
  const avgEnergy  = filtered.length ? (filtered.reduce((a: number, s: any) => a + s.energyLevel, 0) / filtered.length).toFixed(1) : "-";

  return (
    <motion.div key="relatorios" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 className="display" style={{ fontSize: "clamp(1.43em,6vw,1.86em)", fontWeight: 800 }}>Relatórios de Treino</h2>
          <p style={{ fontSize: "0.93em", color: "var(--muted)", marginTop: 4 }}>{filtered.length} sessão(ões) no período</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20, padding: "14px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 6, background: "rgba(255,255,255,0.04)", padding: 4, borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)" }}>
            {["diario", "semanal", "mensal"].map(m => (
              <button key={m} onClick={() => { setFilterMode(m); setUseCustomRange(false); }}
                style={{ padding: "6px 16px", borderRadius: 8, border: "none", fontSize: "0.93em", fontWeight: 600, cursor: "pointer", textTransform: "capitalize",
                  background: (filterMode === m && !useCustomRange) ? color : "transparent",
                  color: (filterMode === m && !useCustomRange) ? "#000" : "var(--muted)", transition: "all .2s" }}>
                {m === "diario" ? "Diário" : m === "semanal" ? "Semanal" : "Mensal"}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.86em", color: "var(--muted)" }}>Período:</span>
            <input type="date" value={dateRange.from} onChange={e => { setDateRange(p => ({ ...p, from: e.target.value })); setUseCustomRange(true); }} style={{ width: "auto", padding: "6px 10px", fontSize: "0.86em", borderRadius: 8 }} />
            <span style={{ fontSize: "0.86em", color: "var(--muted)" }}>até</span>
            <input type="date" value={dateRange.to} onChange={e => { setDateRange(p => ({ ...p, to: e.target.value })); setUseCustomRange(true); }} style={{ width: "auto", padding: "6px 10px", fontSize: "0.86em", borderRadius: 8 }} />
          </div>
        </div>
      </div>

      {filtered.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px,1fr))", gap: 10, marginBottom: 20 }}>
          {[
            { label: "Sessões",       value: filtered.length, color },
            { label: "Metas Batidas", value: totalMetas,      color },
            { label: "Não Atingidas", value: totalNao,        color: DANGER },
            { label: "Energia Média", value: avgEnergy,       color: YELLOW },
          ].map(k => (
            <div key={k.label} className="card" style={{ padding: 14, textAlign: "center" }}>
              <div style={{ fontSize: "0.79em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>{k.label}</div>
              <div className="display" style={{ fontSize: "1.71em", fontWeight: 800, color: k.color }}>{k.value}</div>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: "2.86em", marginBottom: 12 }}>📋</div>
          <div style={{ fontSize: "1.14em", fontWeight: 600, marginBottom: 8 }}>Nenhuma sessão encontrada</div>
          <div style={{ fontSize: "0.93em", color: "var(--muted)" }}>Complete treinos para ver relatórios aqui.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filtered.map((s: any) => (
            <div key={s.id} className="card" style={{ borderLeft: `4px solid ${s.completed ? color : DANGER}`, padding: "18px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
                <div>
                  <div style={{ fontSize: "0.79em", color: "var(--muted)", marginBottom: 4 }}>
                    {new Date(s.date).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}
                  </div>
                  <h4 className="display" style={{ fontSize: "1.21em", fontWeight: 800 }}>{s.workoutName}</h4>
                  <div style={{ fontSize: "0.86em", color: "var(--muted)", marginTop: 4 }}>Duração: {s.duration} min · {(s.exercises || []).length} exercícios</div>
                </div>
                <div className="badge" style={{ background: s.completed ? `${color}18` : `${DANGER}18`, color: s.completed ? color : DANGER, alignSelf: "flex-start" }}>
                  {s.completed ? <><Check size={10} /> Concluído</> : "Incompleto"}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
                <div style={{ padding: "10px 12px", background: `${color}0A`, borderRadius: 12, border: `1px solid ${color}22` }}>
                  <div style={{ fontSize: "0.71em", color: "var(--muted)", marginBottom: 4, textTransform: "uppercase" }}>Metas Batidas</div>
                  <div style={{ fontWeight: 800, color, fontSize: "1.29em" }}>{s.metasBatidas || 0}</div>
                </div>
                <div style={{ padding: "10px 12px", background: `${DANGER}0A`, borderRadius: 12, border: `1px solid ${DANGER}22` }}>
                  <div style={{ fontSize: "0.71em", color: "var(--muted)", marginBottom: 4, textTransform: "uppercase" }}>Não Atingidas</div>
                  <div style={{ fontWeight: 800, color: DANGER, fontSize: "1.29em" }}>{s.metasNaoAtingidas || 0}</div>
                </div>
                <div style={{ padding: "10px 12px", background: `${YELLOW}0A`, borderRadius: 12, border: `1px solid ${YELLOW}22` }}>
                  <div style={{ fontSize: "0.71em", color: "var(--muted)", marginBottom: 4, textTransform: "uppercase" }}>Energia</div>
                  <div style={{ fontWeight: 800, color: YELLOW, fontSize: "1.29em" }}>{s.energyLevel}/10</div>
                </div>
              </div>
              <NeonBtn accent={accent} secondary small onClick={() => setSelectedSession(s)} style={{ width: "100%", justifyContent: "center" }}>
                <FileText size={14} /> Ver Relatório Completo
              </NeonBtn>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedSession && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, backdropFilter: "blur(4px)" }}
            onClick={() => setSelectedSession(null)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="card" style={{ background: "var(--bg)", maxWidth: 640, width: "100%", maxHeight: "90vh", overflowY: "auto", borderRadius: 24 }}
              onClick={e => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                  <h3 className="display" style={{ fontSize: "1.43em", fontWeight: 800 }}>Relatório Completo</h3>
                  <p style={{ fontSize: "0.86em", color, marginTop: 4 }}>{selectedSession.workoutName}</p>
                </div>
                <button onClick={() => setSelectedSession(null)} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 10, padding: 8, color: "var(--muted)", cursor: "pointer" }}><X size={20} /></button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    { label: "Data",    value: new Date(selectedSession.date).toLocaleDateString("pt-BR") },
                    { label: "Duração", value: `${selectedSession.duration} min` },
                    { label: "Energia", value: `${selectedSession.energyLevel}/10` },
                    { label: "Fadiga",  value: `${selectedSession.fatigueLevel}/10` },
                  ].map(item => (
                    <div key={item.label} className="card" style={{ padding: 12 }}>
                      <div style={{ fontSize: "0.71em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 4 }}>{item.label}</div>
                      <div style={{ fontSize: "1.14em", fontWeight: 700 }}>{item.value}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 style={{ fontSize: "0.93em", fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                    <Dumbbell size={15} style={{ color }} /> Exercícios Realizados
                  </h4>
                  {(selectedSession.exercises || []).map((ex: any, i: number) => (
                    <div key={i} style={{ padding: "12px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 12, marginBottom: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ fontWeight: 600, marginBottom: 6 }}>{ex.exerciseName}</div>
                      <div style={{ display: "flex", gap: 16, fontSize: "0.86em", color: "var(--muted)", flexWrap: "wrap" }}>
                        <span>{ex.actualSets} séries × {ex.actualReps} reps</span>
                        <span>@ {ex.actualWeight || "Peso corporal"}</span>
                        <span>RPE {ex.rpe}</span>
                      </div>
                      {ex.notes && <div style={{ fontSize: "0.86em", color, marginTop: 4 }}>{ex.notes}</div>}
                    </div>
                  ))}
                </div>
                {selectedSession.generalNotes && (
                  <div className="card" style={{ background: `${color}08`, borderColor: `${color}22` }}>
                    <div style={{ fontSize: "0.79em", color: "var(--muted)", marginBottom: 6, textTransform: "uppercase" }}>Observações</div>
                    <div>{selectedSession.generalNotes}</div>
                  </div>
                )}
                <div style={{ display: "flex", gap: 12 }}>
                  <NeonBtn accent={accent} onClick={() => window.print()} style={{ flex: 1, justifyContent: "center" }}><Download size={16} /> Baixar PDF</NeonBtn>
                  <NeonBtn accent={accent} secondary style={{ flex: 1, justifyContent: "center" }}><Share2 size={16} /> Compartilhar</NeonBtn>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── PHOTO UPLOAD MODAL ───────────────────────────────────────────────────
function PhotoUploadModal({ isDark, onClose, onSubmit, accent }: any) {
  const [step, setStep] = useState(1);
  const [newPhoto, setNewPhoto] = useState({
    label: "", angle: "Frontal",
    date: new Date().toISOString().split("T")[0],
    file: null as File | null,
    preview: null as string | null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const angles = ["Frontal", "Lateral Esquerda", "Lateral Direita", "Costas"];
  const color = accent || N;

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = ev => {
      setNewPhoto(p => ({ ...p, file, preview: ev.target?.result as string }));
      setStep(2);
    };
    reader.readAsDataURL(file);
  }

  function handleSubmitPhoto() {
    const photo: Omit<ProgressPhoto, "pendingReview" | "rejectedByCoach"> = {
      id: `ph${Date.now()}`,
      url: newPhoto.preview,
      date: newPhoto.date,
      label: newPhoto.label || `${newPhoto.angle} · ${newPhoto.date}`,
      angle: newPhoto.angle,
      coachFeedback: null,
      feedbackDate: null,
    };
    onSubmit(photo);
    onClose();
  }

  const stepLabels = ["Selecionar Foto", "Detalhes", "Confirmar"];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, backdropFilter: "blur(8px)" }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ type: "spring", damping: 26, stiffness: 280 }}
        style={{ width: "100%", maxWidth: 560, background: isDark ? "#141414" : "#f8f9fa", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, borderRadius: 24, overflow: "hidden", maxHeight: "92vh", display: "flex", flexDirection: "column" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ padding: "20px 20px 14px", borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`, flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "0.79em", color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Passo {step} de 3</div>
              <h3 style={{ fontFamily: "system-ui,sans-serif", fontSize: "1.43em", fontWeight: 800, margin: 0 }}>{stepLabels[step - 1]}</h3>
            </div>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,0.07)", border: "none", borderRadius: 10, padding: 8, color: isDark ? "#aaa" : "#666", cursor: "pointer" }}><X size={18} /></button>
          </div>
          <div style={{ marginTop: 16 }}>
            <div style={{ height: 3, background: "rgba(255,255,255,0.07)", borderRadius: 2, marginBottom: 10, overflow: "hidden" }}>
              <motion.div animate={{ width: `${(step / 3) * 100}%` }} transition={{ duration: 0.4 }} style={{ height: "100%", background: color, borderRadius: 2 }} />
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -60, opacity: 0 }} transition={{ duration: 0.22 }} style={{ padding: 20 }}>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} style={{ display: "none" }} />
                <div
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); e.dataTransfer.files?.[0] && handleFile(e.dataTransfer.files[0]); }}
                  onClick={() => fileInputRef.current?.click()}
                  style={{ border: `2px dashed ${color}44`, borderRadius: 20, padding: "48px 24px", textAlign: "center", cursor: "pointer", background: `${color}06`, marginBottom: 20 }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <Camera size={28} style={{ color }} />
                  </div>
                  <div style={{ fontSize: "1.14em", fontWeight: 700, marginBottom: 6 }}>Selecione ou arraste uma foto</div>
                  <div style={{ fontSize: "0.93em", color: "var(--muted)" }}>JPG, PNG ou WEBP</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <button onClick={() => fileInputRef.current?.click()} style={{ padding: "14px", borderRadius: 14, border: "none", background: color, color: "#000", fontFamily: "inherit", fontWeight: 700, fontSize: "1em", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <Upload size={16} /> Da Galeria
                  </button>
                  <button onClick={() => fileInputRef.current?.click()} style={{ padding: "14px", borderRadius: 14, border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, background: "transparent", color: "inherit", fontFamily: "inherit", fontWeight: 600, fontSize: "1em", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <Camera size={16} /> Câmera
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -60, opacity: 0 }} transition={{ duration: 0.22 }} style={{ padding: 20 }}>
                {newPhoto.preview && (
                  <div style={{ marginBottom: 20, borderRadius: 16, overflow: "hidden", maxHeight: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)" }}>
                    <img src={newPhoto.preview} alt="Preview" style={{ maxHeight: 200, maxWidth: "100%", objectFit: "contain", display: "block" }} />
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label style={{ fontSize: "0.79em", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 8 }}>Data da Foto</label>
                    <input type="date" value={newPhoto.date} onChange={e => setNewPhoto(p => ({ ...p, date: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.79em", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 8 }}>Ângulo</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {angles.map(a => (
                        <button key={a} onClick={() => setNewPhoto(p => ({ ...p, angle: a }))}
                          style={{ padding: "10px 14px", borderRadius: 12, border: `2px solid ${newPhoto.angle === a ? color : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, background: newPhoto.angle === a ? `${color}18` : "transparent", color: newPhoto.angle === a ? color : "inherit", fontFamily: "inherit", fontWeight: 600, fontSize: "0.93em", cursor: "pointer", textAlign: "left" }}>
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: "0.79em", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 8 }}>Legenda (opcional)</label>
                    <input type="text" placeholder="Ex: Semana 4 · Início do protocolo" value={newPhoto.label} onChange={e => setNewPhoto(p => ({ ...p, label: e.target.value }))} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                  <button onClick={() => setStep(1)} style={{ flex: 1, padding: "13px", borderRadius: 14, border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, background: "transparent", color: "inherit", fontFamily: "inherit", fontWeight: 600, fontSize: "1em", cursor: "pointer" }}>← Voltar</button>
                  <button onClick={() => setStep(3)} style={{ flex: 2, padding: "13px", borderRadius: 14, border: "none", background: color, color: "#000", fontFamily: "inherit", fontWeight: 700, fontSize: "1em", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>Continuar →</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -60, opacity: 0 }} transition={{ duration: 0.22 }} style={{ padding: 20 }}>
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <div style={{ fontSize: "3.43em", marginBottom: 8 }}>📸</div>
                  <div style={{ fontFamily: "system-ui,sans-serif", fontSize: "1.43em", fontWeight: 800, marginBottom: 4 }}>Tudo certo!</div>
                  <div style={{ fontSize: "0.93em", color: "var(--muted)" }}>Revise os detalhes antes de enviar ao coach</div>
                </div>
                {newPhoto.preview && (
                  <div style={{ borderRadius: 14, overflow: "hidden", maxHeight: 180, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)", marginBottom: 16 }}>
                    <img src={newPhoto.preview} alt="Preview" style={{ maxHeight: 180, maxWidth: "100%", objectFit: "contain", display: "block" }} />
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                  {[
                    { label: "Data",    value: new Date(newPhoto.date).toLocaleDateString("pt-BR") },
                    { label: "Ângulo",  value: newPhoto.angle },
                    { label: "Legenda", value: newPhoto.label || `${newPhoto.angle} · ${newPhoto.date}` },
                  ].map(item => (
                    <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", borderRadius: 12, border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}` }}>
                      <span style={{ fontSize: "0.86em", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{item.label}</span>
                      <span style={{ fontSize: "0.93em", fontWeight: 600 }}>{item.value}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setStep(2)} style={{ flex: 1, padding: "13px", borderRadius: 14, border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, background: "transparent", color: "inherit", fontFamily: "inherit", fontWeight: 600, fontSize: "1em", cursor: "pointer" }}>← Editar</button>
                  <button onClick={handleSubmitPhoto} style={{ flex: 2, padding: "13px", borderRadius: 14, border: "none", background: color, color: "#000", fontFamily: "inherit", fontWeight: 700, fontSize: "1.07em", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <Upload size={16} /> Enviar ao Coach
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── LIGHTBOX ─────────────────────────────────────────────────────────────
function PhotoLightbox({ photo, photos, onClose, onReplace, isDark, accent }: any) {
  const [current, setCurrent] = useState(photo);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const color = accent || N;
  const idx = photos.findIndex((p: any) => p.id === current.id);

  function goNext() { setCurrent(photos[(idx + 1) % photos.length]); }
  function goPrev() { setCurrent(photos[(idx - 1 + photos.length) % photos.length]); }

  useEffect(() => {
    function h(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [idx]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lightbox-overlay" onClick={onClose}>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={e => {
        const file = e.target.files?.[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
          const url = ev.target?.result as string;
          onReplace(current.id, url);
          setCurrent((p: any) => ({ ...p, url }));
        };
        reader.readAsDataURL(file);
      }} style={{ display: "none" }} />
      <button onClick={onClose} style={{ position: "absolute", top: 20, right: 20, background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 12, padding: 10, color: "#fff", cursor: "pointer", zIndex: 10 }}><X size={22} /></button>
      {photos.length > 1 && (
        <>
          <button onClick={e => { e.stopPropagation(); goPrev(); }} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 12, padding: "12px 10px", color: "#fff", cursor: "pointer", zIndex: 10, fontSize: "1.43em" }}>‹</button>
          <button onClick={e => { e.stopPropagation(); goNext(); }} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 12, padding: "12px 10px", color: "#fff", cursor: "pointer", zIndex: 10, fontSize: "1.43em" }}>›</button>
        </>
      )}
      <motion.div key={current.id} initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }} transition={{ duration: 0.2 }}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 700, width: "100%", gap: 16 }} onClick={e => e.stopPropagation()}>
        <div style={{ width: "100%", borderRadius: 20, overflow: "hidden", background: "rgba(255,255,255,0.04)", maxHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {current.url
            ? <img src={current.url} alt={current.label} style={{ maxHeight: "60vh", maxWidth: "100%", objectFit: "contain" }} />
            : <div style={{ height: 300, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                <Camera size={48} style={{ color: "rgba(255,255,255,0.2)" }} />
                <span style={{ color: "rgba(255,255,255,0.4)" }}>Sem imagem</span>
              </div>
          }
        </div>
        <div style={{ width: "100%", background: "rgba(255,255,255,0.06)", borderRadius: 16, padding: "16px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
            <div>
              <div style={{ fontSize: "1.14em", fontWeight: 700, color: "#fff", marginBottom: 4 }}>{current.label}</div>
              <div style={{ fontSize: "0.86em", color: "rgba(255,255,255,0.5)" }}>{current.angle} · {new Date(current.date).toLocaleDateString("pt-BR")}</div>
            </div>
            {photos.length > 1 && <div style={{ fontSize: "0.86em", color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.08)", padding: "4px 12px", borderRadius: 20 }}>{idx + 1} / {photos.length}</div>}
          </div>
          {current.coachFeedback && (
            <div style={{ background: `${color}12`, border: `1px solid ${color}25`, borderRadius: 12, padding: "10px 14px", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.64em", fontWeight: 800, color: "#000" }}>GC</div>
                <span style={{ fontSize: "0.79em", color, fontWeight: 700 }}>Feedback do Coach</span>
              </div>
              <p style={{ fontSize: "0.93em", color: "#fff", lineHeight: 1.5, margin: 0 }}>{current.coachFeedback}</p>
            </div>
          )}
          {current.rejectedByCoach && (
            <div style={{ background: `${DANGER}12`, border: `1px solid ${DANGER}33`, borderRadius: 12, padding: "10px 14px", marginBottom: 12, fontSize: "0.86em", color: DANGER, fontWeight: 600 }}>
              ⚠️ Coach solicitou reenvio
            </div>
          )}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => fileInputRef.current?.click()} style={{ flex: 1, padding: "11px 14px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.08)", color: "#fff", fontFamily: "inherit", fontWeight: 600, fontSize: "0.93em", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <RefreshCw size={14} /> Reenviar Foto
            </button>
            <button onClick={onClose} style={{ padding: "11px 18px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "rgba(255,255,255,0.6)", fontFamily: "inherit", fontWeight: 600, fontSize: "0.93em", cursor: "pointer" }}>Fechar</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── TAB: FOTOS ───────────────────────────────────────────────────────────
function ProgressPhotosTab({ sd, isDark, accent, onSubmitPhoto, onResubmitPhoto }: any) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<any>(null);
  const reuploadRef = useRef<HTMLInputElement>(null);
  const [reuploadId, setReuploadId] = useState<string | null>(null);
  const color = accent || N;

  const photos: ProgressPhoto[] = sd?.progressPhotos || [];

  function handleReuploadClick(photoId: string, e: React.MouseEvent) {
    e.stopPropagation();
    setReuploadId(photoId);
    reuploadRef.current?.click();
  }

  function handleReuploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !reuploadId) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const url = ev.target?.result as string;
      onResubmitPhoto(reuploadId, url);
      setLightboxPhoto((prev: any) => prev?.id === reuploadId ? { ...prev, url } : prev);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <motion.div key="fotos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <input ref={reuploadRef} type="file" accept="image/*" onChange={handleReuploadFile} style={{ display: "none" }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 className="display" style={{ fontSize: "clamp(1.43em,6vw,1.86em)", fontWeight: 800 }}>Evolução em Fotos</h2>
          <p style={{ fontSize: "0.93em", color: "var(--muted)", marginTop: 4 }}>Registre seu progresso e receba feedback do coach</p>
        </div>
        <NeonBtn accent={accent} small onClick={() => setShowUploadModal(true)}>
          <Camera size={14} /> Enviar Foto
        </NeonBtn>
      </div>

      {photos.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 60 }}>
          <Camera size={48} style={{ color: "var(--muted)", marginBottom: 16 }} />
          <div style={{ fontSize: "1.14em", fontWeight: 600, marginBottom: 8 }}>Nenhuma foto ainda</div>
          <div style={{ fontSize: "0.93em", color: "var(--muted)", marginBottom: 20 }}>Envie sua primeira foto para o coach avaliar</div>
          <NeonBtn accent={accent} onClick={() => setShowUploadModal(true)}><Camera size={15} /> Enviar Primeira Foto</NeonBtn>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 16 }}>
          {photos.map((photo: ProgressPhoto) => (
            <motion.div key={photo.id} layout className="photo-card">
              <div style={{ position: "relative", aspectRatio: "4/5", background: "rgba(255,255,255,0.04)", overflow: "hidden", cursor: "pointer" }} onClick={() => setLightboxPhoto(photo)}>
                {photo.url
                  ? <img src={photo.url} alt={photo.label} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .3s" }} onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")} onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
                  : <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${color}08, rgba(0,212,255,0.05))` }}>
                      <Camera size={40} style={{ color: "var(--muted)", marginBottom: 8 }} />
                      <span style={{ fontSize: "0.86em", color: "var(--muted)" }}>Sem imagem</span>
                    </div>
                }
                <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", padding: "4px 10px", borderRadius: 20, fontSize: "0.79em", fontWeight: 600, color: "#fff" }}>{photo.angle}</div>
                <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", padding: "4px 10px", borderRadius: 20, fontSize: "0.79em", fontWeight: 600, color }}>
                  {new Date(photo.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "2-digit" })}
                </div>
                {photo.pendingReview && !photo.coachFeedback && (
                  <div style={{ position: "absolute", bottom: 10, left: 10, background: "rgba(245,158,11,0.9)", padding: "3px 10px", borderRadius: 20, fontSize: "0.71em", fontWeight: 700, color: "#000" }}>⏳ Aguardando avaliação</div>
                )}
                {photo.rejectedByCoach && (
                  <div style={{ position: "absolute", bottom: 10, left: 10, background: `rgba(255,77,94,0.9)`, padding: "3px 10px", borderRadius: 20, fontSize: "0.71em", fontWeight: 700, color: "#fff" }}>⚠️ Reenvio solicitado</div>
                )}
              </div>

              <div style={{ padding: "14px 16px" }}>
                <div style={{ fontSize: "1em", fontWeight: 700, marginBottom: 4 }}>{photo.label}</div>
                <div style={{ fontSize: "0.79em", color: "var(--muted)", marginBottom: 12 }}>{new Date(photo.date).toLocaleDateString("pt-BR")}</div>

                {photo.coachFeedback ? (
                  <div style={{ background: photo.rejectedByCoach ? `${DANGER}0D` : `${color}0D`, border: `1px solid ${photo.rejectedByCoach ? DANGER : color}25`, borderRadius: 12, padding: "10px 12px", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 6, background: photo.rejectedByCoach ? DANGER : color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.64em", fontWeight: 800, color: "#000" }}>GC</div>
                      <span style={{ fontSize: "0.79em", color: photo.rejectedByCoach ? DANGER : color, fontWeight: 700 }}>{photo.rejectedByCoach ? "Reenvio solicitado" : "Coach"}</span>
                      <span style={{ fontSize: "0.71em", color: "var(--muted)", marginLeft: "auto" }}>{photo.feedbackDate}</span>
                    </div>
                    <p style={{ fontSize: "0.93em", lineHeight: 1.5, margin: 0 }}>{photo.coachFeedback}</p>
                  </div>
                ) : (
                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "10px 12px", display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <Clock size={14} style={{ color: "var(--muted)" }} />
                    <span style={{ fontSize: "0.86em", color: "var(--muted)" }}>Aguardando feedback do coach</span>
                  </div>
                )}

                {photo.rejectedByCoach && (
                  <div style={{ background: "rgba(255,77,94,0.1)", border: "1px solid #FF4D5E", padding: "12px 14px", borderRadius: 12, marginBottom: 12 }}>
                    <p style={{ color: "#FF4D5E", fontSize: "0.86em", fontWeight: 700, margin: "0 0 4px 0" }}>⚠️ Reenvio solicitado pelo Coach</p>
                    <p style={{ color: "#f0f0f0", fontSize: "0.79em", margin: 0 }}>Motivo: {photo.coachFeedback}</p>
                  </div>
                )}

                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setLightboxPhoto(photo)} style={{ flex: 1, padding: "9px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "inherit", fontFamily: "inherit", fontWeight: 600, fontSize: "0.86em", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                    <ZoomIn size={13} /> Ampliar
                  </button>
                  <button onClick={e => handleReuploadClick(photo.id, e)} style={{ flex: 1, padding: "9px 12px", borderRadius: 10, border: `1px solid ${photo.rejectedByCoach ? DANGER + "44" : color + "44"}`, background: photo.rejectedByCoach ? `${DANGER}10` : `${color}10`, color: photo.rejectedByCoach ? DANGER : color, fontFamily: "inherit", fontWeight: 600, fontSize: "0.86em", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                    <RefreshCw size={13} /> {photo.rejectedByCoach ? "Reenviar" : "Atualizar"}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showUploadModal && <PhotoUploadModal isDark={isDark} accent={accent} onClose={() => setShowUploadModal(false)} onSubmit={onSubmitPhoto} />}
      </AnimatePresence>
      <AnimatePresence>
        {lightboxPhoto && <PhotoLightbox photo={lightboxPhoto} photos={photos} isDark={isDark} accent={accent} onClose={() => setLightboxPhoto(null)} onReplace={(id: string, url: string) => onResubmitPhoto(id, url)} />}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── TAB: SETTINGS ────────────────────────────────────────────────────────
function SettingsTab({ settings, onSettingsChange, isDark, accent, onResetSettings }: any) {
  const color = accent || N;
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  function update(key: string, value: any) {
    onSettingsChange({ ...settings, [key]: value });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 1800);
  }

  const fontSizeSelected = FONT_SIZE_OPTIONS.find(o => o.value === settings.fontSize) || FONT_SIZE_OPTIONS[3];

  return (
    <motion.div key="config" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <AnimatePresence>
        {savedToast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{ position: "fixed", top: 80, right: 20, background: color, color: "#000", padding: "10px 18px", borderRadius: 12, fontWeight: 700, fontSize: "0.93em", zIndex: 999, display: "flex", alignItems: "center", gap: 8, boxShadow: `0 4px 20px ${color}44` }}>
            <CheckCircle2 size={16} /> Configuração salva
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 className="display" style={{ fontSize: "clamp(1.43em,6vw,1.86em)", fontWeight: 800 }}>Configurações</h2>
          <p style={{ fontSize: "0.93em", color: "var(--muted)", marginTop: 4 }}>Personalize sua experiência</p>
        </div>
      </div>

      {/* Aparência */}
      <div className="settings-section">
        <div className="settings-section-title">🎨 Aparência</div>

        <div className="settings-item">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}><Moon size={18} style={{ color }} /></div>
            <div><div style={{ fontWeight: 600 }}>Modo Escuro</div><div style={{ fontSize: "0.86em", color: "var(--muted)" }}>Alterna entre tema claro e escuro</div></div>
          </div>
          <Toggle value={settings.isDark} onChange={v => update("isDark", v)} accent={color} isDark={settings.isDark} />
        </div>

        <div className="settings-item" style={{ flexDirection: "column", alignItems: "flex-start", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%" }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}><Palette size={18} style={{ color }} /></div>
            <div><div style={{ fontWeight: 600 }}>Cor de Destaque</div><div style={{ fontSize: "0.86em", color: "var(--muted)" }}>Cor principal dos elementos</div></div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", paddingLeft: 50 }}>
            {ACCENT_COLORS.map(c => (
              <button key={c.value} onClick={() => update("accentColor", c.value)} title={c.label}
                style={{ width: 34, height: 34, borderRadius: "50%", border: `3px solid ${settings.accentColor === c.value ? "white" : "transparent"}`, background: c.value, cursor: "pointer", transition: "all .2s", outline: settings.accentColor === c.value ? `2px solid ${c.value}` : "none", outlineOffset: 2, transform: settings.accentColor === c.value ? "scale(1.15)" : "scale(1)" }} />
            ))}
          </div>
        </div>

        <div className="settings-item" style={{ flexDirection: "column", alignItems: "flex-start", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%" }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}><Type size={18} style={{ color }} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>Tamanho da Fonte</div>
              <div style={{ fontSize: "0.86em", color: "var(--muted)" }}>Afeta todo o texto do aplicativo</div>
            </div>
            <Dropdown options={FONT_SIZE_OPTIONS} value={settings.fontSize} onChange={v => update("fontSize", v)} isDark={settings.isDark} accent={color} />
          </div>
          <div style={{ paddingLeft: 50, width: "100%" }}>
            <div style={{ fontSize: "1em", color, fontWeight: 600, background: `${color}0A`, padding: "10px 14px", borderRadius: 10, border: `1px solid ${color}22` }}>
              Prévia: {settings.fontSize}px — {fontSizeSelected.desc}
            </div>
          </div>
        </div>

        <div className="settings-item">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}><FileText size={18} style={{ color }} /></div>
            <div><div style={{ fontWeight: 600 }}>Família Tipográfica</div><div style={{ fontSize: "0.86em", color: "var(--muted)" }}>Fonte usada no app</div></div>
          </div>
          <Dropdown options={FONT_FAMILY_OPTIONS} value={settings.fontFamily} onChange={v => update("fontFamily", v)} isDark={settings.isDark} accent={color} />
        </div>

        <div className="settings-item">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}><LayoutGrid size={18} style={{ color }} /></div>
            <div><div style={{ fontWeight: 600 }}>Modo Compacto</div><div style={{ fontSize: "0.86em", color: "var(--muted)" }}>Reduz espaçamentos</div></div>
          </div>
          <Toggle value={settings.compactMode} onChange={v => update("compactMode", v)} accent={color} isDark={settings.isDark} />
        </div>

        <div className="settings-item">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}><Contrast size={18} style={{ color }} /></div>
            <div><div style={{ fontWeight: 600 }}>Alto Contraste</div><div style={{ fontSize: "0.86em", color: "var(--muted)" }}>Aumenta contraste de bordas e texto</div></div>
          </div>
          <Toggle value={settings.highContrast} onChange={v => update("highContrast", v)} accent={color} isDark={settings.isDark} />
        </div>

        <div className="settings-item">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}><Activity size={18} style={{ color }} /></div>
            <div><div style={{ fontWeight: 600 }}>Reduzir Animações</div><div style={{ fontSize: "0.86em", color: "var(--muted)" }}>Desativa transições</div></div>
          </div>
          <Toggle value={settings.reducedMotion} onChange={v => update("reducedMotion", v)} accent={color} isDark={settings.isDark} />
        </div>
      </div>

      {/* Notificações */}
      <div className="settings-section">
        <div className="settings-section-title">🔔 Notificações</div>
        {[
          { key: "notifications",    icon: Bell,          label: "Notificações Push",   desc: "Alertas de treinos e metas" },
          { key: "workoutReminder",  icon: Dumbbell,      label: "Lembrete de Treino",  desc: "30 min antes do horário" },
          { key: "coachMessages",    icon: MessageCircle, label: "Mensagens do Coach",  desc: "Feedback e atualizações" },
          { key: "achievementNotifs",icon: Trophy,        label: "Conquistas",          desc: "Novas conquistas desbloqueadas" },
        ].map(item => (
          <div key={item.key} className="settings-item">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}><item.icon size={18} style={{ color }} /></div>
              <div><div style={{ fontWeight: 600 }}>{item.label}</div><div style={{ fontSize: "0.86em", color: "var(--muted)" }}>{item.desc}</div></div>
            </div>
            <Toggle value={settings[item.key]} onChange={v => update(item.key, v)} accent={color} isDark={settings.isDark} />
          </div>
        ))}
      </div>

      {/* Treino */}
      <div className="settings-section">
        <div className="settings-section-title">💪 Treino</div>

        <div className="settings-item">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}><Timer size={18} style={{ color }} /></div>
            <div><div style={{ fontWeight: 600 }}>Timer de Descanso</div><div style={{ fontSize: "0.86em", color: "var(--muted)" }}>Cronômetro automático entre séries</div></div>
          </div>
          <Toggle value={settings.restTimer} onChange={v => update("restTimer", v)} accent={color} isDark={settings.isDark} />
        </div>

        <div className="settings-item" style={{ flexDirection: "column", alignItems: "flex-start", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%" }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}><SlidersHorizontal size={18} style={{ color }} /></div>
            <span style={{ fontSize: "1.29em", fontWeight: 800, color, minWidth: 50, textAlign: "right" }}>{settings.defaultRestTime}s</span>
          </div>
          <div style={{ paddingLeft: 50, width: "100%" }}>
            <input type="range" min="30" max="300" step="15" value={settings.defaultRestTime} onChange={e => update("defaultRestTime", parseInt(e.target.value))} className="slider" />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.79em", color: "var(--muted)", marginTop: 4 }}>
              <span>30s</span><span>1min</span><span>2min</span><span>3min</span><span>5min</span>
            </div>
          </div>
        </div>

        {[
          { key: "loadSuggestion", icon: TrendingUp, label: "Sugestão de Carga", desc: "Baseada no histórico" },
          { key: "rpeTracking",    icon: Gauge,      label: "Contagem de RPE",   desc: "Percepção de esforço por série" },
          { key: "focusMode",      icon: Zap,        label: "Modo Foco",         desc: "Oculta distrações durante treino" },
        ].map(item => (
          <div key={item.key} className="settings-item">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}><item.icon size={18} style={{ color }} /></div>
              <div><div style={{ fontWeight: 600 }}>{item.label}</div><div style={{ fontSize: "0.86em", color: "var(--muted)" }}>{item.desc}</div></div>
            </div>
            <Toggle value={settings[item.key]} onChange={v => update(item.key, v)} accent={color} isDark={settings.isDark} />
          </div>
        ))}
      </div>

      {/* Privacidade */}
      <div className="settings-section">
        <div className="settings-section-title">🔒 Privacidade</div>
        {[
          { key: "hideWeight",    icon: EyeIcon, label: "Ocultar Peso",   desc: "Peso invisível na tela inicial" },
          { key: "privatePhotos", icon: Lock,    label: "Fotos Privadas", desc: "Requer autenticação para ver" },
        ].map(item => (
          <div key={item.key} className="settings-item">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}><item.icon size={18} style={{ color }} /></div>
              <div><div style={{ fontWeight: 600 }}>{item.label}</div><div style={{ fontSize: "0.86em", color: "var(--muted)" }}>{item.desc}</div></div>
            </div>
            <Toggle value={settings[item.key]} onChange={v => update(item.key, v)} accent={color} isDark={settings.isDark} />
          </div>
        ))}
      </div>

      {/* Região */}
      <div className="settings-section">
        <div className="settings-section-title">🌍 Idioma & Região</div>
        <div className="settings-item">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}><Globe size={18} style={{ color }} /></div>
            <div><div style={{ fontWeight: 600 }}>Idioma</div><div style={{ fontSize: "0.86em", color: "var(--muted)" }}>Idioma da interface</div></div>
          </div>
          <Dropdown options={LANGUAGE_OPTIONS.map(l => ({ ...l, label: `${l.flag} ${l.label}` }))} value={settings.language} onChange={v => update("language", v)} isDark={settings.isDark} accent={color} />
        </div>
        <div className="settings-item">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}><Gauge size={18} style={{ color }} /></div>
            <div><div style={{ fontWeight: 600 }}>Unidade de Peso</div><div style={{ fontSize: "0.86em", color: "var(--muted)" }}>Quilogramas ou libras</div></div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["kg", "lbs"].map(unit => (
              <button key={unit} onClick={() => update("weightUnit", unit)}
                style={{ padding: "8px 16px", borderRadius: 10, border: `2px solid ${settings.weightUnit === unit ? color : "rgba(255,255,255,0.1)"}`, background: settings.weightUnit === unit ? `${color}18` : "transparent", color: settings.weightUnit === unit ? color : "var(--muted)", fontWeight: 700, fontSize: "0.93em", cursor: "pointer" }}>
                {unit}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Restaurar */}
      <div className="settings-section">
        <div className="settings-section-title">⚙️ Dados</div>
        {!showResetConfirm ? (
          <div className="settings-item" style={{ cursor: "pointer", borderColor: `${DANGER}22` }} onClick={() => setShowResetConfirm(true)}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `${DANGER}12`, display: "flex", alignItems: "center", justifyContent: "center" }}><RotateCcw size={18} style={{ color: DANGER }} /></div>
              <div><div style={{ fontWeight: 600, color: DANGER }}>Restaurar Padrões</div><div style={{ fontSize: "0.86em", color: "var(--muted)" }}>Redefinir todas as configurações</div></div>
            </div>
            <ChevronRight size={16} style={{ color: DANGER }} />
          </div>
        ) : (
          <div className="settings-item" style={{ flexDirection: "column", gap: 12, borderColor: `${DANGER}44`, background: `${DANGER}08` }}>
            <div style={{ fontWeight: 600, color: DANGER }}>Confirmar restauração?</div>
            <div style={{ fontSize: "0.93em", color: "var(--muted)" }}>Todas as preferências serão redefinidas.</div>
            <div style={{ display: "flex", gap: 10, width: "100%" }}>
              <button onClick={() => setShowResetConfirm(false)} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "inherit", fontFamily: "inherit", fontWeight: 600, fontSize: "0.93em", cursor: "pointer" }}>Cancelar</button>
              <button onClick={() => { onResetSettings(); setShowResetConfirm(false); setSavedToast(true); setTimeout(() => setSavedToast(false), 1800); }} style={{ flex: 2, padding: "10px", borderRadius: 10, border: "none", background: DANGER, color: "#fff", fontFamily: "inherit", fontWeight: 700, fontSize: "0.93em", cursor: "pointer" }}>Restaurar Padrões</button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── ADAPTIVE WORKOUT MODAL ───────────────────────────────────────────────
function AdaptiveWorkoutModal({ workout, onClose, onStart, accent }: any) {
  const [availableTime, setAvailableTime] = useState(workout.totalEstimatedTime || 60);
  const color = accent || N;

  const adaptedExercises = useMemo(() => {
    const exs = [...(workout.exercises || [])];
    const total = exs.reduce((s: number, ex: any) => s + (ex.estimatedTime || 10), 0);
    if (total <= availableTime) return exs;
    const adapted: any[] = []; let t = 0;
    for (const ex of exs) { const et = ex.estimatedTime || 10; if (t + et <= availableTime) { adapted.push(ex); t += et; } }
    return adapted.length > 0 ? adapted : [exs[0]];
  }, [availableTime, workout.exercises]);

  const totalAdaptedTime = adaptedExercises.reduce((s: number, ex: any) => s + (ex.estimatedTime || 10), 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 1000, padding: 16, backdropFilter: "blur(3px)" }}
      onClick={onClose}>
      <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
        className="card" style={{ maxWidth: 600, maxHeight: "85vh", overflowY: "auto", width: "100%", borderRadius: "20px 20px 0 0" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 className="display" style={{ fontSize: "1.29em", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}><Zap size={20} style={{ color }} /> Treino Adaptado</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer" }}><X size={20} /></button>
        </div>
        <div className="card" style={{ background: `${color}08`, borderColor: `${color}22`, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <Timer size={20} style={{ color }} />
            <div>
              <div style={{ fontSize: "0.79em", color: "var(--muted)", textTransform: "uppercase" }}>Tempo disponível</div>
              <div className="display" style={{ fontSize: "1.71em", fontWeight: 800, color }}>{availableTime} min</div>
            </div>
          </div>
          <input type="range" min="15" max={(workout.totalEstimatedTime || 60) + 30} value={availableTime} onChange={e => setAvailableTime(parseInt(e.target.value))} className="slider" />
        </div>
        <div style={{ marginBottom: 20, fontSize: "0.93em", color: "var(--muted)" }}>{adaptedExercises.length} de {(workout.exercises || []).length} exercícios · {totalAdaptedTime} min</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {adaptedExercises.map((ex: any, i: number) => (
            <div key={ex.id} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 12 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.71em", fontWeight: 700, color }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.93em", fontWeight: 500 }}>{ex.name}</div>
                {/* NOVO: mostra também o equipamento definido pelo coach, quando houver */}
                <div style={{ fontSize: "0.79em", color: "var(--muted)" }}>
                  {ex.plannedSets}x · {ex.plannedLoad}{ex.equipment ? ` · ${ex.equipment}` : ""}
                </div>
              </div>
              <div style={{ fontSize: "0.79em", color: "var(--muted)" }}>~{ex.estimatedTime || 10}m</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <NeonBtn accent={accent} onClick={() => onStart(adaptedExercises)} style={{ justifyContent: "center", width: "100%" }}><Dumbbell size={14} /> Começar Treino Adaptado</NeonBtn>
          <NeonBtn accent={accent} secondary onClick={onClose} style={{ justifyContent: "center", width: "100%" }}>Cancelar</NeonBtn>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── WORKOUT CAROUSEL MODAL (NAVEGAÇÃO LIVRE) ─────────────────────────────
function WorkoutCarouselModal({
  workout,
  workoutLogs,
  setWorkoutLogs,
  postWorkoutData,
  setPostWorkoutData,
  currentIdx,
  setCurrentIdx,
  doneStatus,
  setDoneStatus,
  skippedStatus,
  setSkippedStatus,
  isDark,
  onClose,
  onSave,
  accent,
  exerciseLibrary,
}: any) {
  const [direction,     setDirection]     = useState(1);
  const [showFeedback,  setShowFeedback]  = useState(false);
  const [showExList,    setShowExList]    = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);

  const color          = accent || N;
  const total          = workoutLogs.length;
  const log            = workoutLogs[currentIdx];
  const isDone         = doneStatus[currentIdx];
  const isSkipped      = skippedStatus[currentIdx];
  const completedCount = doneStatus.filter(Boolean).length;
  const skippedCount   = skippedStatus.filter(Boolean).length;
  const allEvaluated   = completedCount + skippedCount === total;
  const isLastExercise = currentIdx === total - 1;

  // ── NOVO: exercício planejado atual — usado para saber o equipamento
  // que o coach definiu para este exercício específico do treino.
  const currentPlannedEx = useMemo(
    () => (workout.exercises || []).find((e: any) => e.id === log?.exerciseId),
    [workout.exercises, log?.exerciseId]
  );

  // ── opções de carga sugeridas para o exercício atual. Prioriza o
  // equipamento definido manualmente pelo coach no exercício do treino;
  // se não houver, cai para o equipamento cadastrado na biblioteca
  // (busca por nome); por fim, usa a lista genérica.
  const weightOptions = useMemo(
    () => getWeightOptionsFor(log?.exerciseName, exerciseLibrary, currentPlannedEx?.equipment),
    [log?.exerciseName, exerciseLibrary, currentPlannedEx?.equipment]
  );

  function go(nextIdx: number) {
    setDirection(nextIdx > currentIdx ? 1 : -1);
    setCurrentIdx(nextIdx);
    setShowExList(false);
  }

  function goNext() { if (currentIdx < total - 1) go(currentIdx + 1); }
  function goPrev() { if (currentIdx > 0) go(currentIdx - 1); }

  function handleValidate() {
    const nextDone = [...doneStatus];
    nextDone[currentIdx] = true;
    const nextSkip = [...skippedStatus];
    nextSkip[currentIdx] = false;
    setDoneStatus(nextDone);
    setSkippedStatus(nextSkip);
  }

  function handleSkip() {
    if (isSkipped) {
      const next = [...skippedStatus];
      next[currentIdx] = false;
      setSkippedStatus(next);
      return;
    }
    const nextSkip = [...skippedStatus];
    nextSkip[currentIdx] = true;
    const nextDone = [...doneStatus];
    nextDone[currentIdx] = false;
    setSkippedStatus(nextSkip);
    setDoneStatus(nextDone);
  }

  function handleUndo() {
    const nextDone = [...doneStatus];
    const nextSkip = [...skippedStatus];
    nextDone[currentIdx] = false;
    nextSkip[currentIdx] = false;
    setDoneStatus(nextDone);
    setSkippedStatus(nextSkip);
  }

  function updateLog(key: string, value: any) {
    const next = [...workoutLogs];
    next[currentIdx][key] = value;
    setWorkoutLogs(next);
  }

  function handleSave() {
    const session: WorkoutSession = {
      id: `s${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      workoutName: workout.name,
      exercises: workoutLogs.map((l: any) => ({
        exerciseId:   l.exerciseId,
        exerciseName: l.exerciseName,
        actualWeight: l.actualWeight,
        actualReps:   l.actualReps,
        actualSets:   l.actualSets,
        restTime:     l.restTime,
        rpe:          l.rpe,
        notes:        l.notes,
      })),
      energyLevel:      postWorkoutData.energyLevel,
      mood:             "Normal",
      sleepQuality:     7,
      fatigueLevel:     Math.max(1, 10 - postWorkoutData.energyLevel),
      muscleSoreness:   3,
      generalNotes:     postWorkoutData.generalNotes,
      completed:        true,
      duration:         workout.totalEstimatedTime || 0,
      metasBatidas:     completedCount,
      metasNaoAtingidas: skippedCount,
    };
    onSave(session);
  }

  function dotColor(i: number) {
    if (doneStatus[i])    return color;
    if (skippedStatus[i]) return DANGER;
    if (i === currentIdx) return `${color}88`;
    return "rgba(255,255,255,0.15)";
  }

  function statusLabel(i: number) {
    if (doneStatus[i])    return "✓";
    if (skippedStatus[i]) return "✕";
    return i + 1;
  }

  const variants = {
    enter:  (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <>
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16, backdropFilter: "blur(8px)" }}>
      <motion.div
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
        style={{ width: "100%", maxWidth: 560,
          background: isDark ? "#141414" : "#f8f9fa",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
          borderRadius: 24, overflow: "hidden", maxHeight: "95vh",
          display: "flex", flexDirection: "column" }}>

        {/* HEADER */}
        <div style={{ padding: "18px 20px 14px",
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
          flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "0.79em", color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>
                {showFeedback ? "Feedback Final" : "Registrando Agora"}
              </div>
              <h3 style={{ fontFamily: "system-ui,sans-serif", fontSize: "1.29em", fontWeight: 800, margin: 0 }}>{workout.name}</h3>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {!showFeedback && (
                <button onClick={() => setShowExList(v => !v)}
                  style={{ background: showExList ? `${color}22` : "rgba(255,255,255,0.07)",
                    border: `1px solid ${showExList ? color + "44" : "transparent"}`,
                    borderRadius: 10, padding: "7px 11px",
                    color: showExList ? color : isDark ? "#aaa" : "#666",
                    cursor: "pointer", fontSize: "0.86em", fontWeight: 700,
                    display: "flex", alignItems: "center", gap: 5 }}>
                  <Menu size={15} /> Lista
                </button>
              )}
              <button onClick={onClose}
                style={{ background: "rgba(255,255,255,0.07)", border: "none", borderRadius: 10, padding: 8, color: isDark ? "#aaa" : "#666", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>
          </div>

          {!showFeedback && (
            <div style={{ marginTop: 14 }}>
              <div style={{ height: 3, background: "rgba(255,255,255,0.07)", borderRadius: 2, marginBottom: 10, overflow: "hidden" }}>
                <motion.div animate={{ width: `${((completedCount + skippedCount) / total) * 100}%` }} transition={{ duration: 0.4 }}
                  style={{ height: "100%", background: color, borderRadius: 2 }} />
              </div>
              <div style={{ display: "flex", gap: 5, alignItems: "center", flexWrap: "wrap" }}>
                {workoutLogs.map((_: any, i: number) => (
                  <button key={i} onClick={() => go(i)}
                    title={(workout.exercises || [])[i]?.name || `Exercício ${i + 1}`}
                    style={{ minWidth: i === currentIdx ? 28 : 22, height: 22, borderRadius: 6,
                      border: "none", cursor: "pointer", transition: "all .2s",
                      background: dotColor(i),
                      color: (doneStatus[i] || skippedStatus[i]) ? "#000" : "transparent",
                      fontSize: "0.64em", fontWeight: 800,
                      outline: i === currentIdx ? `2px solid ${color}` : "none",
                      outlineOffset: 1, padding: 0,
                      display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {i === currentIdx || doneStatus[i] || skippedStatus[i] ? statusLabel(i) : ""}
                  </button>
                ))}
                <span style={{ fontSize: "0.79em", color: "var(--muted)", marginLeft: 4 }}>{currentIdx + 1}/{total}</span>
                <span style={{ marginLeft: "auto", fontSize: "0.79em" }}>
                  <span style={{ color }}>{completedCount} ✓</span>
                  {skippedCount > 0 && <span style={{ color: DANGER, marginLeft: 6 }}>{skippedCount} ✕</span>}
                  <span style={{ color: "var(--muted)", marginLeft: 6 }}>{total - completedCount - skippedCount} restantes</span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* LISTA DROPDOWN */}
        <AnimatePresence>
          {showExList && !showFeedback && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
              style={{ overflow: "hidden",
                borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
                flexShrink: 0, maxHeight: 260, overflowY: "auto" }}>
              <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 4 }}>
                {workoutLogs.map((l: any, i: number) => {
                  const done = doneStatus[i]; const skipped = skippedStatus[i]; const active = i === currentIdx;
                  return (
                    <button key={i} onClick={() => go(i)}
                      style={{ display: "flex", alignItems: "center", gap: 10,
                        padding: "9px 12px", borderRadius: 12, border: "none", cursor: "pointer",
                        background: active ? `${color}18` : done ? "rgba(0,255,136,0.04)" : skipped ? "rgba(255,77,94,0.04)" : "rgba(255,255,255,0.03)",
                        textAlign: "left", width: "100%" }}>
                      <div style={{ width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: done ? `${color}22` : skipped ? `${DANGER}22` : active ? `${color}18` : "rgba(255,255,255,0.07)",
                        color: done ? color : skipped ? DANGER : active ? color : "var(--muted)",
                        fontSize: "0.79em", fontWeight: 800 }}>
                        {done ? "✓" : skipped ? "✕" : i + 1}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "0.93em", fontWeight: active ? 700 : 500,
                          color: done ? color : skipped ? DANGER : active ? color : "inherit",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {l.exerciseName}
                        </div>
                        <div style={{ fontSize: "0.75em", color: "var(--muted)" }}>
                          {(() => { const ex = (workout.exercises || []).find((e: any) => e.id === l.exerciseId); return ex ? `${ex.plannedSets}×${ex.plannedReps} @ ${ex.plannedLoad}${ex.equipment ? ` · ${ex.equipment}` : ""}` : ""; })()}
                        </div>
                      </div>
                      {active && <ChevronRight size={14} style={{ color, flexShrink: 0 }} />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CORPO */}
        <div style={{ flex: 1, overflowY: "auto", position: "relative" }}>
          {!showFeedback ? (
            <div style={{ overflow: "hidden" }}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div key={currentIdx} custom={direction} variants={variants}
                  initial="enter" animate="center" exit="exit"
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  style={{ padding: "20px 20px 0" }}>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: "1.43em", fontWeight: 800, fontFamily: "system-ui,sans-serif",
                        color: isDone ? color : isSkipped ? DANGER : "inherit" }}>
                        {log?.exerciseName}
                      </div>
                      {/* ── NOVO: equipamento definido pelo coach para este exercício ── */}
                       {/* ── NOVO: equipamento definido pelo coach para este exercício ── */}
                      {currentPlannedEx?.equipment && (
                        <div style={{ fontSize: "0.86em", color: BLUE, marginTop: 4, display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
                          <Dumbbell size={13} /> Equipamento: {currentPlannedEx.equipment}
                        </div>
                      )}
                      {/* ── Observação do exercício: abre modal com explicação + vídeo ── */}
                      {(currentPlannedEx?.note || currentPlannedEx?.videoUrl) && (
                        <button type="button" onClick={() => setShowNoteModal(true)}
                          style={{ fontSize: "0.86em", color, marginTop: 4, display: "flex", alignItems: "center", gap: 6,
                            fontWeight: 600, background: "none", border: "none", padding: 0, cursor: "pointer",
                            textDecoration: "underline", width: "fit-content", fontFamily: "inherit" }}>
                          💡 Observação
                        </button>
                      )}
                      {isDone && (
                        <div style={{ fontSize: "0.86em", color, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                          <CheckCircle2 size={13} /> Concluído
                          <button onClick={handleUndo} style={{ marginLeft: 8, fontSize: "0.86em", background: "none", border: "none", color: "var(--muted)", cursor: "pointer", textDecoration: "underline" }}>Desfazer</button>
                        </div>
                      )}
                      {isSkipped && (
                        <div style={{ fontSize: "0.86em", color: DANGER, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                          Pulado
                          <button onClick={handleUndo} style={{ marginLeft: 8, fontSize: "0.86em", background: "none", border: "none", color: "var(--muted)", cursor: "pointer", textDecoration: "underline" }}>Desfazer</button>
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: "right", fontSize: "0.79em", color: "var(--muted)", background: "rgba(255,255,255,0.05)", padding: "6px 10px", borderRadius: 10 }}>
                      <div>Planejado</div>
                      <div style={{ fontWeight: 700, color: isDark ? "#f5f5f5" : "#1a1a1a", marginTop: 2 }}>
                        {currentPlannedEx ? `${currentPlannedEx.plannedSets}x${currentPlannedEx.plannedReps} @ ${currentPlannedEx.plannedLoad}` : ""}
                      </div>
                    </div>
                  </div>

                  {/* ── Séries (fixo, definido pelo coach) / Reps / Peso como dropdown editável ── */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={{ fontSize: "0.71em", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 6 }}>Séries</label>
                      <div style={{
                        width: "100%", boxSizing: "border-box",
                        background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
                        color: "var(--muted)", borderRadius: 12, padding: "10px 12px",
                        fontSize: "0.93em", fontWeight: 700, textAlign: "center",
                      }}>
                        {log?.actualSets ?? ""}
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: "0.71em", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 6 }}>Reps</label>
                      <EditableDropdown
                        value={String(log?.actualReps ?? "")}
                        onChange={v => updateLog("actualReps", v)}
                        options={REPS_OPTIONS}
                        isDark={isDark}
                        accent={color}
                        placeholder="Ex: 12"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.71em", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 6 }}>Peso</label>
                      <EditableDropdown
                        value={log?.actualWeight ?? ""}
                        onChange={v => updateLog("actualWeight", v)}
                        options={weightOptions}
                        isDark={isDark}
                        accent={color}
                        placeholder="Ex: 12kg"
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: "0.71em", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", display: "block", marginBottom: 6 }}>Observações</label>
                    <textarea rows={2} value={log?.notes || ""} onChange={e => updateLog("notes", e.target.value)}
                      placeholder="Sensação, dor, ajuste de carga..."
                      style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                        color: "inherit", borderRadius: 12, padding: "10px 14px", width: "100%",
                        fontSize: "0.93em", outline: "none", resize: "vertical", fontFamily: "inherit" }} />
                  </div>
                </motion.div>
              </AnimatePresence>

              <div style={{ padding: "0 20px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                <button onClick={handleValidate} disabled={isDone}
                  style={{ width: "100%", padding: "14px", borderRadius: 14, border: "none",
                    cursor: isDone ? "default" : "pointer",
                    background: isDone ? `${color}33` : color,
                    color: isDone ? color : "#000",
                    fontFamily: "inherit", fontWeight: 700, fontSize: "1.07em",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <CheckCircle2 size={18} />
                  {isDone ? "Exercício Concluído ✓" : "Marcar como Concluído"}
                </button>

                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={goPrev} disabled={currentIdx === 0}
                    style={{ flex: 1, padding: "11px", borderRadius: 12,
                      border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                      background: "transparent",
                      color: currentIdx === 0 ? "rgba(255,255,255,0.2)" : "inherit",
                      fontFamily: "inherit", fontWeight: 600, fontSize: "1em",
                      cursor: currentIdx === 0 ? "default" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    ← Anterior
                  </button>
                  <button onClick={handleSkip}
                    style={{ flex: 1, padding: "11px", borderRadius: 12,
                      border: `1px solid ${isSkipped ? DANGER + "55" : isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                      background: isSkipped ? `${DANGER}12` : "transparent",
                      color: isSkipped ? DANGER : isDark ? "#aaa" : "#666",
                      fontFamily: "inherit", fontWeight: isSkipped ? 700 : 600, fontSize: "1em", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    {isSkipped ? "Desmarcar Pulo" : "Pular"}
                  </button>
                  <button onClick={goNext} disabled={currentIdx === total - 1}
                    style={{ flex: 1, padding: "11px", borderRadius: 12,
                      border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                      background: "transparent",
                      color: currentIdx === total - 1 ? "rgba(255,255,255,0.2)" : "inherit",
                      fontFamily: "inherit", fontWeight: 600, fontSize: "1em",
                      cursor: currentIdx === total - 1 ? "default" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    Próximo →
                  </button>
                </div>

                <button onClick={() => setShowFeedback(true)}
                  style={{ width: "100%", padding: "11px", borderRadius: 12,
                    border: `1px solid ${(allEvaluated || isLastExercise) ? color + "66" : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                    background: (allEvaluated || isLastExercise) ? `${color}14` : "transparent",
                    color: (allEvaluated || isLastExercise) ? color : "var(--muted)",
                    fontFamily: "inherit", fontWeight: (allEvaluated || isLastExercise) ? 700 : 500,
                    fontSize: "0.93em", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    transition: "all .3s" }}>
                  {allEvaluated
                    ? "✓ Todos avaliados — Salvar Treino →"
                    : isLastExercise
                      ? "Finalizar e Salvar Treino →"
                      : `Ver Resumo (${completedCount + skippedCount}/${total} avaliados)`}
                </button>
              </div>
            </div>
          ) : (
            /* FEEDBACK FINAL */
            <div style={{ padding: 20 }}>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ fontSize: "3.43em", marginBottom: 8 }}>🎯</div>
                <div style={{ fontFamily: "system-ui,sans-serif", fontSize: "1.57em", fontWeight: 800, marginBottom: 4 }}>Treino Finalizado!</div>
                <div style={{ fontSize: "0.93em", color: "var(--muted)" }}>{completedCount} de {total} exercícios concluídos</div>
              </div>

              {/* Resumo por exercício */}
              <div style={{ marginBottom: 20, display: "flex", flexDirection: "column", gap: 6 }}>
                {workoutLogs.map((l: any, i: number) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 10,
                    background: doneStatus[i] ? `${color}0A` : skippedStatus[i] ? `${DANGER}0A` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${doneStatus[i] ? color + "22" : skippedStatus[i] ? DANGER + "22" : "rgba(255,255,255,0.06)"}` }}>
                    <div style={{ width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: doneStatus[i] ? `${color}22` : skippedStatus[i] ? `${DANGER}22` : "rgba(255,255,255,0.07)",
                      color: doneStatus[i] ? color : skippedStatus[i] ? DANGER : "var(--muted)",
                      fontSize: "0.79em", fontWeight: 800 }}>
                      {doneStatus[i] ? "✓" : skippedStatus[i] ? "✕" : "–"}
                    </div>
                    <div style={{ flex: 1, fontSize: "0.86em", color: doneStatus[i] ? color : skippedStatus[i] ? DANGER : "var(--muted)" }}>{l.exerciseName}</div>
                    {doneStatus[i] && (
                      <div style={{ fontSize: "0.79em", color: "var(--muted)" }}>{l.actualSets}×{l.actualReps} @ {l.actualWeight}</div>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                <div style={{ padding: 14, background: `${color}0D`, border: `1px solid ${color}22`, borderRadius: 14, textAlign: "center" }}>
                  <div style={{ fontSize: "0.79em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 4 }}>Concluídos</div>
                  <div style={{ fontSize: "2em", fontWeight: 800, color }}>{completedCount}</div>
                </div>
                <div style={{ padding: 14, background: `${DANGER}0D`, border: `1px solid ${DANGER}22`, borderRadius: 14, textAlign: "center" }}>
                  <div style={{ fontSize: "0.79em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 4 }}>Pulados</div>
                  <div style={{ fontSize: "2em", fontWeight: 800, color: DANGER }}>{skippedCount}</div>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <label style={{ fontSize: "0.86em", color: "var(--muted)" }}>Nível de Energia</label>
                  <span style={{ fontSize: "0.86em", fontWeight: 700, color }}>{postWorkoutData.energyLevel}/10</span>
                </div>
                <input type="range" min="1" max="10" value={postWorkoutData.energyLevel}
                  onChange={e => setPostWorkoutData({ ...postWorkoutData, energyLevel: parseInt(e.target.value) })} className="slider" />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: "0.86em", color: "var(--muted)", display: "block", marginBottom: 8 }}>Observações gerais</label>
                <textarea rows={3} value={postWorkoutData.generalNotes}
                  onChange={e => setPostWorkoutData({ ...postWorkoutData, generalNotes: e.target.value })}
                  placeholder="Como foi o treino?"
                  style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                    color: "inherit", borderRadius: 12, padding: "10px 14px", width: "100%",
                    fontSize: "0.93em", outline: "none", resize: "none", fontFamily: "inherit" }} />
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setShowFeedback(false)}
                  style={{ flex: 1, padding: "14px", borderRadius: 14,
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                    background: "transparent", color: isDark ? "#aaa" : "#666",
                    fontFamily: "inherit", fontWeight: 600, fontSize: "1em", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  ← Voltar
                </button>
                <button onClick={handleSave}
                  style={{ flex: 2, padding: "14px", borderRadius: 14, border: "none",
                    background: color, color: "#000",
                    fontFamily: "inherit", fontWeight: 700, fontSize: "1.07em", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <CheckCircle2 size={17} /> Salvar Treino
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>

    {/* ── Modal de Observação: explicação do exercício + vídeo do YouTube ── */}
    <AnimatePresence>
      {showNoteModal && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => setShowNoteModal(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 150,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16, backdropFilter: "blur(6px)" }}>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            style={{ width: "100%", maxWidth: 520,
              background: isDark ? "#141414" : "#f8f9fa",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
              borderRadius: 20, overflow: "hidden", maxHeight: "88vh",
              display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center",
              borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`, flexShrink: 0 }}>
              <h3 style={{ fontFamily: "system-ui,sans-serif", fontSize: "1.14em", fontWeight: 800, margin: 0 }}>
                💡 {currentPlannedEx?.name || log?.exerciseName}
              </h3>
              <button onClick={() => setShowNoteModal(false)}
                style={{ background: "rgba(255,255,255,0.07)", border: "none", borderRadius: 10, padding: 8, color: isDark ? "#aaa" : "#666", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: 18, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
              {currentPlannedEx?.note && (
                <p style={{ margin: 0, fontSize: "0.93em", lineHeight: 1.6 }}>{currentPlannedEx.note}</p>
              )}
              {currentPlannedEx?.videoUrl && (
                getYouTubeEmbedUrl(currentPlannedEx.videoUrl) ? (
                  <div style={{ position: "relative", paddingTop: "56.25%", borderRadius: 14, overflow: "hidden" }}>
                    <iframe
                      src={getYouTubeEmbedUrl(currentPlannedEx.videoUrl)}
                      title="Vídeo demonstrativo do exercício"
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <a href={currentPlannedEx.videoUrl} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: "0.93em", color, display: "flex", alignItems: "center", gap: 6, fontWeight: 600, textDecoration: "underline", width: "fit-content" }}>
                    <Play size={14} /> Ver vídeo demonstrativo
                  </a>
                )
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}

// ─── STUDENT DASHBOARD ────────────────────────────────────────────────────
export function StudentDashboard({ user, onLogout }: { user: any; onLogout: () => void }) {
  const [tab,               setTab]               = useState("treino");
  const [settings,          setSettings]          = useState(loadSettings);
  const [showWorkoutModal,  setShowWorkoutModal]  = useState(false);
  const [showAdaptiveModal, setShowAdaptiveModal] = useState(false);
  const [selectedWorkout,   setSelectedWorkout]   = useState<any>(null);
  const [workoutLogs,       setWorkoutLogs]       = useState<any[]>([]);
  const [postWorkoutData,   setPostWorkoutData]   = useState({ energyLevel: 7, generalNotes: "" });
  const [workoutCurrentIdx,    setWorkoutCurrentIdx]    = useState(0);
  const [workoutDoneStatus,    setWorkoutDoneStatus]    = useState<boolean[]>([]);
  const [workoutSkippedStatus, setWorkoutSkippedStatus] = useState<boolean[]>([]);

  // ── FIX RELATÓRIOS: cache local das sessões salvas nesta sessão ──────────
  // Evita depender do snapshot do Firestore para mostrar o treino imediatamente
  const [localSessions, setLocalSessions] = useState<WorkoutSession[]>([]);

  // ── Cache do treino em andamento: se o aluno fechar o modal ou o navegador,
  // o progresso (exercício atual, séries/reps/peso digitados, concluídos/pulados)
  // é restaurado ao reabrir. Só é limpo quando o treino é salvo.
  const activeWorkoutKey = `gym_active_workout_${user.id}`;
  const restoredActiveWorkout = useRef(false);

  useEffect(() => {
    if (restoredActiveWorkout.current) return;
    restoredActiveWorkout.current = true;
    try {
      const raw = localStorage.getItem(activeWorkoutKey);
      if (!raw) return;
      const cache = JSON.parse(raw);
      if (!cache?.workout) return;
      setSelectedWorkout(cache.workout);
      setWorkoutLogs(cache.logs || []);
      setPostWorkoutData(cache.post || { energyLevel: 7, generalNotes: "" });
      setWorkoutCurrentIdx(cache.currentIdx || 0);
      setWorkoutDoneStatus(cache.doneStatus || []);
      setWorkoutSkippedStatus(cache.skippedStatus || []);
      setShowWorkoutModal(true);
    } catch {}
  }, [activeWorkoutKey]);

  useEffect(() => {
    if (!showWorkoutModal || !selectedWorkout) return;
    try {
      localStorage.setItem(activeWorkoutKey, JSON.stringify({
        workout: selectedWorkout,
        logs: workoutLogs,
        post: postWorkoutData,
        currentIdx: workoutCurrentIdx,
        doneStatus: workoutDoneStatus,
        skippedStatus: workoutSkippedStatus,
      }));
    } catch {}
  }, [activeWorkoutKey, showWorkoutModal, selectedWorkout, workoutLogs, postWorkoutData, workoutCurrentIdx, workoutDoneStatus, workoutSkippedStatus]);

  const {
    sharedStudentData,
    exerciseLibrary,
    onSendMessage,
    onSubmitPhoto,
    onResubmitPhoto,
    onAddWorkoutSession,
  } = useStudentProps(user.id);

  const sd = sharedStudentData ?? null;

  useEffect(() => { saveSettings(settings); }, [settings]);

  const accent = settings.accentColor || N;

  function handleStartWorkout(w: any, exercises?: any[]) {
    // Se já existe um treino em andamento (mesmo id) em cache — em memória ou
    // no localStorage (ex: modal foi fechado com X mas não finalizado) —
    // reabre exatamente de onde parou em vez de reiniciar do zero.
    if (!exercises) {
      try {
        const raw = localStorage.getItem(activeWorkoutKey);
        const cache = raw ? JSON.parse(raw) : null;
        if (cache?.workout?.id === w.id) {
          setSelectedWorkout(cache.workout);
          setWorkoutLogs(cache.logs || []);
          setPostWorkoutData(cache.post || { energyLevel: 7, generalNotes: "" });
          setWorkoutCurrentIdx(cache.currentIdx || 0);
          setWorkoutDoneStatus(cache.doneStatus || []);
          setWorkoutSkippedStatus(cache.skippedStatus || []);
          setShowWorkoutModal(true);
          setShowAdaptiveModal(false);
          return;
        }
      } catch {}
    }
    setSelectedWorkout(w);
    const exToUse = exercises || w.exercises || [];
    setWorkoutLogs(exToUse.map((ex: any) => ({
      exerciseId:   ex.id,
      exerciseName: ex.name,
      // Peso mantém o texto planejado (ex: "70kg", "PC") — o coach já formatou certo
      actualWeight: ex.plannedLoad || "",
      // limites pedidos: no máximo 5 séries e 20 reps
      actualSets:   String(Math.min(5, Math.max(1, parseInt(ex.plannedSets) || 3))),
      actualReps:   String(Math.min(20, Math.max(1, parseInt(ex.plannedReps) || 10))),
      restTime:     settings.defaultRestTime,
      rpe:          7,
      notes:        "",
    })));
    setPostWorkoutData({ energyLevel: 7, generalNotes: "" });
    setWorkoutCurrentIdx(0);
    setWorkoutDoneStatus(exToUse.map(() => false));
    setWorkoutSkippedStatus(exToUse.map(() => false));
    setShowWorkoutModal(true);
    setShowAdaptiveModal(false);
  }

  // ── FIX: salva localmente + no Firestore ─────────────────────────────────
  function handleSaveSession(session: WorkoutSession) {
    // 1. Adiciona ao cache local imediatamente (relatórios aparecem na hora)
    setLocalSessions(prev => [session, ...prev]);
    // 2. Persiste no Firestore via SharedAppState
    onAddWorkoutSession(session);
    // 3. Fecha o modal e limpa o cache do treino em andamento
    setShowWorkoutModal(false);
    try { localStorage.removeItem(activeWorkoutKey); } catch {}
  }

  const tabs = [
    { id: "treino",  label: "Treino",     icon: Dumbbell },
    { id: "diario",  label: "Relatórios", icon: Calendar },
    { id: "fotos",   label: "Progresso",  icon: Camera },
    { id: "config",  label: "Config",     icon: Settings },
  ];

  if (sharedStudentData === undefined) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d0d0d", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "#00C96B", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#000", fontSize: 16 }}>GC</div>
        <p style={{ color: "rgba(240,240,240,0.5)", fontSize: 13, margin: 0 }}>Carregando seus dados…</p>
      </div>
    );
  }

  return (
    <div className="student-area">
      <style>{getThemeCss(settings.isDark, settings.fontSize, settings.accentColor, settings.fontFamily, settings.compactMode, settings.highContrast, settings.reducedMotion)}</style>

      {/* Header */}
      <div style={{ background: "rgba(0,0,0,0.4)", borderBottom: "1px solid rgba(255,255,255,0.08)", position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: accent, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#000", fontSize: "1em" }}>
              {user.avatar || user.name?.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: "0.86em", color: "var(--muted)" }}>Bem-vindo</div>
              <div style={{ fontSize: "1em", fontWeight: 600 }}>{user.name?.split(" ")[0]}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={() => setSettings(s => ({ ...s, isDark: !s.isDark }))}
              style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 10, padding: 8, color: "inherit", cursor: "pointer" }}>
              {settings.isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={onLogout}
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "8px 16px", color: "inherit", cursor: "pointer", fontSize: "0.93em", fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
              <LogOut size={13} /> Sair
            </button>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", overflowX: "auto", overflowY: "hidden", WebkitOverflowScrolling: "touch" }}>
          <div style={{ display: "flex", gap: 2, padding: "6px 12px", minWidth: "min-content", maxWidth: 1200, margin: "0 auto" }}>
            {tabs.map(t => {
              const Icon = t.icon;
              return (
                <button key={t.id} onClick={() => setTab(t.id)} className={`tab-btn ${tab === t.id ? "active" : ""}`} style={{ display: "flex", alignItems: "center", gap: 6, border: "none" }}>
                  <Icon size={15} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="main-content">
        <AnimatePresence mode="wait">
          {tab === "treino" && (
            <WorkoutTab key="treino" sd={sd} accent={accent}
              onStartWorkout={handleStartWorkout}
              onAdaptiveWorkout={(w: any) => { setSelectedWorkout(w); setShowAdaptiveModal(true); }} />
          )}
          {tab === "diario" && (
            // ── FIX: passa localSessions para mesclar com as do Firestore ──
            <ReportsTab key="diario" sd={sd} accent={accent} extraSessions={localSessions} />
          )}
          {tab === "fotos" && (
            <ProgressPhotosTab key="fotos" sd={sd} isDark={settings.isDark} accent={accent}
              onSubmitPhoto={onSubmitPhoto}
              onResubmitPhoto={onResubmitPhoto} />
          )}
          {tab === "config" && (
            <SettingsTab key="config" settings={settings} onSettingsChange={setSettings} isDark={settings.isDark} accent={accent} onResetSettings={() => setSettings(DEFAULT_SETTINGS)} />
          )}
        </AnimatePresence>
      </div>

      {/* Modal treino adaptado */}
      <AnimatePresence>
        {showAdaptiveModal && selectedWorkout && (
          <AdaptiveWorkoutModal workout={selectedWorkout} accent={accent}
            onClose={() => setShowAdaptiveModal(false)}
            onStart={(ex: any) => handleStartWorkout(selectedWorkout, ex)} />
        )}
      </AnimatePresence>

      {/* Modal carrossel de treino */}
      <AnimatePresence>
        {showWorkoutModal && selectedWorkout && (
          <WorkoutCarouselModal
            workout={selectedWorkout}
            workoutLogs={workoutLogs} setWorkoutLogs={setWorkoutLogs}
            postWorkoutData={postWorkoutData} setPostWorkoutData={setPostWorkoutData}
            currentIdx={workoutCurrentIdx} setCurrentIdx={setWorkoutCurrentIdx}
            doneStatus={workoutDoneStatus} setDoneStatus={setWorkoutDoneStatus}
            skippedStatus={workoutSkippedStatus} setSkippedStatus={setWorkoutSkippedStatus}
            isDark={settings.isDark} accent={accent}
            exerciseLibrary={exerciseLibrary}
            onClose={() => setShowWorkoutModal(false)}
            onSave={handleSaveSession}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default StudentDashboard;