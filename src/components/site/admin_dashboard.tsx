/* eslint-disable prettier/prettier, @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell,
} from "recharts";
import {
  LogOut, Users, Dumbbell, TrendingUp, MessageCircle, Bell, Settings,
  ChevronRight, ChevronDown, Plus, Check, Trophy, BarChart2,
  Activity, Send, X, CheckCircle2, Clock, Edit2, Trash2, Save,
  AlertCircle, Download, Search, Award, Shield, FileText,
  AlertTriangle, UserPlus, Database, Sliders, Menu, Image,
  Camera, ZoomIn, RefreshCw, ArrowLeft, GripVertical,
  Play, Video, Link, Eye, ChevronUp, RotateCcw, Copy,
  Calendar, CalendarOff, BarChart as BarChartIcon, Layers,
  BookOpen, Filter, Tag, Zap, Star,
} from "lucide-react";

import {
  useAdminProps,
  AdminPhotosTab,
  type User,
  type StudentData,
  type Workout,
  type Exercise,
  type ProgressPhoto,
  type WorkoutSession,
  type ExerciseTemplate,
  type WorkoutTemplate,
  MUSCLE_GROUPS,
  EQUIPMENT_OPTIONS,
  WORKOUT_CATEGORIES,
} from "@/components/site/SharedAppState";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────
const N       = "#00C96B";
const CARD_BG = "rgba(255,255,255,0.04)";
const CARD_BG2= "rgba(255,255,255,0.07)";
const BORDER  = "rgba(255,255,255,0.09)";
const BORDER2 = "rgba(255,255,255,0.15)";
const MUTED   = "rgba(240,240,240,0.45)";
const MUTED2  = "rgba(240,240,240,0.65)";
const DANGER  = "#FF4D5E";
const AMBER   = "#F59E0B";
const BLUE    = "#3B82F6";
const TEAL    = "#14B8A6";
const PURPLE  = "#A855F7";

const CHART_TOOLTIP = {
  contentStyle: { background: "#1a1a1a", border: `1px solid ${BORDER}`, borderRadius: 10, fontSize: 12 },
  labelStyle: { color: "#f0f0f0" },
  itemStyle: { color: MUTED2 },
};

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
  .adm * { box-sizing: border-box; }
  .adm { font-family: 'DM Sans', system-ui, sans-serif; }
  .adm .display { font-family: 'DM Sans', system-ui, sans-serif; font-weight: 800; letter-spacing: -.01em; }
  .adm .muted  { color: ${MUTED}; }
  .adm .muted2 { color: ${MUTED2}; }
  .adm .neon   { color: ${N}; }
  .adm input, .adm textarea, .adm select {
    background: ${CARD_BG}; border: 1px solid ${BORDER}; color: #f0f0f0;
    font-family: 'DM Sans', sans-serif; border-radius: 10px;
    padding: 10px 14px; width: 100%; font-size: 14px; outline: none; transition: border .2s;
  }
  .adm input:focus, .adm textarea:focus, .adm select:focus {
    border-color: ${N}44; box-shadow: 0 0 0 3px ${N}10;
  }
  .adm select option { background: #1a1a1a; }
  .adm button { cursor: pointer; font-family: 'DM Sans', sans-serif; }
  .adm .card  { background: ${CARD_BG}; border: 1px solid ${BORDER}; border-radius: 18px; padding: 16px; }
  @media (min-width: 640px) { .adm .card { padding: 20px; } }
  .adm .tab-btn {
    background: none; border: none; padding: 7px 12px; border-radius: 10px;
    font-size: 13px; font-weight: 500; color: ${MUTED}; transition: all .2s; white-space: nowrap;
  }
  .adm .tab-btn.active { background: ${N}18; color: ${N}; font-weight: 600; }
  .adm .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
  .adm .badge-green  { background: ${N}15; color: ${N}; }
  .adm .badge-red    { background: ${DANGER}15; color: ${DANGER}; }
  .adm .badge-amber  { background: ${AMBER}15; color: ${AMBER}; }
  .adm .badge-blue   { background: ${BLUE}15; color: ${BLUE}; }
  .adm .badge-purple { background: ${PURPLE}15; color: ${PURPLE}; }
  .adm .badge-teal   { background: ${TEAL}15; color: ${TEAL}; }
  .adm .student-row {
    display: flex; align-items: center; padding: 12px 14px; border-radius: 12px;
    background: ${CARD_BG}; border: 1px solid ${BORDER}; margin-bottom: 8px;
    transition: all .2s; cursor: pointer;
  }
  .adm .student-row:hover, .adm .student-row.selected { background: ${N}08; border-color: ${N}33; }
  .adm .nav-item {
    display: flex; align-items: center; gap: 10px; padding: 11px 14px; border-radius: 10px;
    font-size: 14px; font-weight: 500; color: ${MUTED2}; cursor: pointer; transition: all .15s;
  }
  .adm .nav-item:hover { background: ${CARD_BG2}; color: #f0f0f0; }
  .adm .nav-item.active { background: ${N}15; color: ${N}; }
  .adm ::-webkit-scrollbar { width: 4px; height: 4px; }
  .adm ::-webkit-scrollbar-track { background: transparent; }
  .adm ::-webkit-scrollbar-thumb { background: ${BORDER2}; border-radius: 4px; }
  .adm .progress-bar { height: 6px; background: ${CARD_BG2}; border-radius: 3px; overflow: hidden; }
  .adm .progress-fill { height: 100%; background: ${N}; border-radius: 3px; transition: width .5s ease; }
  .adm .config-row {
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    padding: 13px 0; border-bottom: 1px solid ${BORDER};
  }
  .adm .config-row:last-child { border-bottom: none; }
  .adm .toggle { position: relative; width: 36px; height: 20px; display: inline-block; flex-shrink: 0; }
  .adm .toggle input { opacity: 0; width: 0; height: 0; }
  .adm .toggle-slider {
    position: absolute; inset: 0; background: ${CARD_BG2}; border-radius: 20px;
    cursor: pointer; transition: .3s; border: 1px solid ${BORDER};
  }
  .adm .toggle-slider:before {
    position: absolute; content: ""; width: 14px; height: 14px;
    left: 2px; top: 2px; border-radius: 50%; background: ${MUTED}; transition: .3s;
  }
  .adm .toggle input:checked + .toggle-slider { background: ${N}20; border-color: ${N}55; }
  .adm .toggle input:checked + .toggle-slider:before { transform: translateX(16px); background: ${N}; }
  .adm .perm-item {
    background: ${CARD_BG}; border: 1px solid ${BORDER}; border-radius: 10px;
    padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; gap: 8px;
  }
  .adm table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .adm thead th {
    font-size: 11px; font-weight: 700; color: ${MUTED}; text-transform: uppercase;
    letter-spacing: .06em; padding: 10px 12px; text-align: left;
    border-bottom: 1px solid ${BORDER}; white-space: nowrap;
  }
  .adm tbody tr { border-bottom: 1px solid ${BORDER}; transition: background .15s; }
  .adm tbody tr:hover { background: ${CARD_BG2}; }
  .adm tbody tr:last-child { border: none; }
  .adm td { padding: 11px 12px; vertical-align: middle; }
  @keyframes adm-fadein { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
  .adm .toast { animation: adm-fadein .25s ease; }
  .adm .kpi-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; }
  @media (min-width: 768px) { .adm .kpi-grid { grid-template-columns: repeat(4,1fr); gap: 14px; } }
  .adm .chart-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
  @media (min-width: 900px) { .adm .chart-grid { grid-template-columns: 1.2fr 1fr; } }
  .adm .report-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
  @media (min-width: 900px) { .adm .report-grid { grid-template-columns: 1.3fr 1fr; } }
  .adm .perm-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
  @media (min-width: 640px) { .adm .perm-grid { grid-template-columns: repeat(2,1fr); } }
  @media (min-width: 900px) { .adm .perm-grid { grid-template-columns: repeat(3,1fr); } }
  .adm .student-stats-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; }
  @media (min-width: 480px) { .adm .student-stats-grid { grid-template-columns: repeat(4,1fr); } }
  .adm .table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .adm .ex-row {
    display: grid;
    grid-template-columns: 28px 1fr 80px 70px 60px 70px 36px;
    gap: 8px; align-items: center;
    padding: 10px 12px; border-radius: 12px;
    background: ${CARD_BG}; border: 1px solid ${BORDER}; margin-bottom: 8px;
    transition: border-color .15s;
  }
  .adm .ex-row:hover { border-color: ${BORDER2}; }
  .adm .ex-row.editing { border-color: ${N}44; background: ${N}06; }
  @media (max-width: 640px) {
    .adm .ex-row { grid-template-columns: 1fr; }
  }
  .adm .day-dot {
    width: 32px; height: 32px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 700; flex-shrink: 0;
  }
  .adm .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7,1fr);
    gap: 4px;
  }
  /* ── Autocomplete dropdown ── */
  .adm .autocomplete-dropdown {
    position: absolute; top: 100%; left: 0; right: 0; z-index: 200;
    background: #1a1a1a; border: 1px solid ${BORDER2}; border-radius: 12px;
    overflow: hidden; box-shadow: 0 12px 32px rgba(0,0,0,0.6);
    max-height: 260px; overflow-y: auto;
  }
  .adm .autocomplete-item {
    display: flex; align-items: flex-start; gap: 10; padding: 10px 14px;
    cursor: pointer; transition: background .12s; border-bottom: 1px solid ${BORDER};
  }
  .adm .autocomplete-item:last-child { border-bottom: none; }
  .adm .autocomplete-item:hover { background: ${N}12; }
  .adm .autocomplete-item.highlighted { background: ${N}18; }
  /* ── Biblioteca grid ── */
  .adm .lib-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px;
  }
  .adm .lib-card {
    background: ${CARD_BG}; border: 1px solid ${BORDER}; border-radius: 14px;
    overflow: hidden; transition: border-color .18s, transform .18s;
  }
  .adm .lib-card:hover { border-color: ${BORDER2}; transform: translateY(-1px); }
`;

// ─── UTILITÁRIOS ──────────────────────────────────────────────────────────

function Btn({ children, onClick, variant = "primary", size = "md", icon: Icon, disabled = false, style = {} }) {
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
    borderRadius: 100, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
    transition: "all .18s", border: "none", opacity: disabled ? 0.5 : 1,
    fontSize: size === "sm" ? 12 : 14,
    padding: size === "sm" ? "8px 16px" : "12px 22px",
    minHeight: size === "sm" ? 36 : 44,
  };
  const variants = {
    primary:   { background: N, color: "#000" },
    secondary: { background: CARD_BG, color: "#f0f0f0", border: `1px solid ${BORDER}` },
    danger:    { background: `${DANGER}15`, color: DANGER, border: `1px solid ${DANGER}33` },
    ghost:     { background: "transparent", color: MUTED2 },
    amber:     { background: `${AMBER}15`, color: AMBER, border: `1px solid ${AMBER}33` },
  };
  return (
    <button style={{ ...base, ...variants[variant], ...style }} onClick={!disabled ? onClick : undefined} disabled={disabled}>
      {Icon && <Icon size={size === "sm" ? 13 : 15} />}
      {children}
    </button>
  );
}

function Avatar({ initials, size = 36, color = N }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `${color}18`, border: `1.5px solid ${color}44`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.3, fontWeight: 700, color, flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, delta, color = N }) {
  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 10, color: MUTED, textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 700 }}>{label}</span>
        <Icon size={15} style={{ color, flexShrink: 0 }} />
      </div>
      <div className="display" style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 11, color: MUTED }}>{delta}</div>
    </div>
  );
}

function Badge({ children, variant = "green" }) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}

function ProgressBar({ value, max = 100, color = N }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="toggle" title={label}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="toggle-slider" />
    </label>
  );
}

function ConfigRow({ label, description, control }) {
  return (
    <div className="config-row">
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
        {description && <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{description}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{control}</div>
    </div>
  );
}

// ─── TOAST ────────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  }, []);

  const ToastContainer = () => (
    <div style={{ position: "fixed", bottom: 16, right: 16, left: 16, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none" }}>
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div key={t.id}
            initial={{ opacity: 0, y: 10, scale: .97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: .97 }}
            style={{
              background: "#1c1c1c",
              border: `1px solid ${t.type === "success" ? N + "44" : t.type === "error" ? DANGER + "44" : BLUE + "44"}`,
              borderRadius: 12, padding: "12px 16px", fontSize: 13,
              display: "flex", alignItems: "center", gap: 10,
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)", pointerEvents: "auto",
            }}>
            {t.type === "success"
              ? <CheckCircle2 size={16} style={{ color: N, flexShrink: 0 }} />
              : t.type === "error"
              ? <AlertCircle size={16} style={{ color: DANGER, flexShrink: 0 }} />
              : <AlertTriangle size={16} style={{ color: BLUE, flexShrink: 0 }} />}
            <span>{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  return { toast: push, ToastContainer };
}

function useConfirm() {
  const [state, setState] = useState(null); // { message, title, danger, resolve }

  const confirm = useCallback((message, opts = {}) => {
    return new Promise(resolve => {
      setState({
        message,
        title: opts.title || "Confirmar ação",
        danger: opts.danger !== false,
        resolve,
      });
    });
  }, []);

  function handle(result) {
    state?.resolve(result);
    setState(null);
  }

  const ConfirmDialog = () => (
    <AnimatePresence>
      {state && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.96 }}
            style={{ background: "#141414", border: `1px solid ${BORDER2}`, borderRadius: 18, padding: 22, width: "100%", maxWidth: 380 }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: state.danger ? `${DANGER}15` : `${N}15`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <AlertTriangle size={18} style={{ color: state.danger ? DANGER : N }} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="display" style={{ fontSize: 15, marginBottom: 4 }}>{state.title}</div>
                <div style={{ fontSize: 13, color: MUTED2, lineHeight: 1.5 }}>{state.message}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="secondary" onClick={() => handle(false)} style={{ flex: 1, justifyContent: "center" }}>Cancelar</Btn>
              <Btn variant={state.danger ? "danger" : "primary"} onClick={() => handle(true)} style={{ flex: 1, justifyContent: "center" }}>OK</Btn>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return { confirm, ConfirmDialog };
}

// ─── MODAL ────────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children, width = 480 }) {
  useEffect(() => {
    const handler = e => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={e => e.target === e.currentTarget && onClose()}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", zIndex: 500, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
            style={{
              background: "#141414", border: `1px solid ${BORDER2}`,
              borderRadius: "20px 20px 0 0", padding: "24px 20px",
              width: "100%", maxWidth: width, position: "relative",
              maxHeight: "92vh", overflowY: "auto",
            }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: BORDER2, margin: "0 auto 20px" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 className="display" style={{ fontSize: 17, margin: 0 }}>{title}</h3>
              <button onClick={onClose} style={{ background: "none", border: "none", color: MUTED, cursor: "pointer", padding: 6, minHeight: 44, minWidth: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────
// ── ALTERADO: adicionada entrada "biblioteca" ──
const SIDEBAR_ITEMS = [
  { section: "Principal", items: [
    { id: "dashboard",  label: "Dashboard",   icon: BarChart2 },
    { id: "alunos",     label: "Alunos",      icon: Users },
    { id: "treinos",    label: "Treinos",      icon: Dumbbell },
    { id: "treinos-prontos", label: "Treinos Prontos", icon: Layers },
    { id: "biblioteca", label: "Biblioteca",   icon: BookOpen },
    { id: "fotos",      label: "Fotos",        icon: Camera, badgeKey: "photos" },
    { id: "relatorios", label: "Relatórios",   icon: TrendingUp },
  ]},
  { section: "Sistema", items: [
    { id: "notificacoes",  label: "Notificações",  icon: Bell,    badgeKey: "notifs" },
    { id: "permissoes",    label: "Permissões",    icon: Shield },
    { id: "auditoria",     label: "Auditoria",     icon: FileText },
    { id: "configuracoes", label: "Configurações", icon: Settings },
  ]},
];

function Sidebar({ activeTab, onTabChange, user, onLogout, unreadNotifs, pendingPhotos, isMobile, onClose }) {
  const content = (
    <>
      <div style={{ padding: "16px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: N, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span className="display" style={{ fontWeight: 800, color: "#000", fontSize: 13 }}>GC</span>
          </div>
          <div>
            <div className="display" style={{ fontSize: 15 }}>GC Fitness</div>
            <div style={{ fontSize: 10, color: MUTED }}>Admin Panel</div>
          </div>
        </div>
        {isMobile && (
          <button onClick={onClose} style={{ background: "none", border: "none", color: MUTED, cursor: "pointer", minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={18} />
          </button>
        )}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "12px 10px" }}>
        {SIDEBAR_ITEMS.map(section => (
          <div key={section.section} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: ".08em", padding: "0 10px", marginBottom: 6 }}>
              {section.section}
            </div>
            {section.items.map(item => {
              const Icon = item.icon;
              const badgeCount = item.badgeKey === "notifs" ? unreadNotifs : item.badgeKey === "photos" ? pendingPhotos : 0;
              return (
                <div key={item.id}
                  className={`nav-item${activeTab === item.id ? " active" : ""}`}
                  onClick={() => { onTabChange(item.id); if (isMobile) onClose?.(); }}
                  role="button" tabIndex={0}
                  onKeyDown={e => e.key === "Enter" && onTabChange(item.id)}>
                  <Icon size={17} style={{ flexShrink: 0 }} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {badgeCount > 0 && (
                    <span style={{ background: DANGER, color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 20, padding: "1px 7px", minWidth: 18, textAlign: "center" }}>
                      {badgeCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ padding: "12px 10px", borderTop: `1px solid ${BORDER}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 12, background: CARD_BG }}>
          <Avatar initials={user.avatar || "GC"} size={32} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
            <div style={{ fontSize: 10, color: MUTED }}>Administrador</div>
          </div>
          <button onClick={onLogout} title="Sair"
            style={{ background: "none", border: "none", color: MUTED, cursor: "pointer", minWidth: 36, minHeight: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200 }} />
        <motion.nav
          initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: 280, zIndex: 201, background: "rgba(13,13,13,0.98)", borderRight: `1px solid ${BORDER}`, display: "flex", flexDirection: "column" }}>
          {content}
        </motion.nav>
      </AnimatePresence>
    );
  }

  return (
    <nav style={{ background: "rgba(0,0,0,0.45)", borderRight: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0 }}>
      {content}
    </nav>
  );
}

// ─── TAB: DASHBOARD ───────────────────────────────────────────────────────
function TabDashboard({ users, studentsData, onNavigate }) {
  const students = users.filter(u => u.role === "student");
  const avgStreak = students.length
    ? Math.round(students.reduce((s, u) => s + (studentsData[u.id]?.streak || 0), 0) / students.length)
    : 0;
  const totalWorkouts = students.reduce((s, u) => s + (studentsData[u.id]?.monthlyWorkouts || 0), 0);
  const activeCount = students.filter(u => (studentsData[u.id]?.streak || 0) > 0).length;
  const activeRate = students.length ? Math.round((activeCount / students.length) * 100) : 0;

  const freqData = [
    { w: "S1", v: 12 }, { w: "S2", v: 14 }, { w: "S3", v: 13 }, { w: "S4", v: 16 },
    { w: "S5", v: 15 }, { w: "S6", v: 17 }, { w: "S7", v: 18 }, { w: "S8", v: totalWorkouts },
  ];

  const goalCounts = {};
  students.forEach(u => {
    const g = studentsData[u.id]?.goal || "Outros";
    goalCounts[g] = (goalCounts[g] || 0) + 1;
  });
  const GOAL_COLORS = [N, DANGER, TEAL, AMBER, BLUE];
  const goalData = Object.entries(goalCounts).map(([name, value], i) => ({ name, value, color: GOAL_COLORS[i % GOAL_COLORS.length] }));

  return (
    <div>
      <div className="kpi-grid" style={{ marginBottom: 16 }}>
        <KpiCard icon={Users}      label="Total de Alunos" value={students.length}   delta={`${activeCount} ativos`} />
        <KpiCard icon={Award}      label="Streak Médio"    value={`${avgStreak}d`}   delta="dias consecutivos" color={AMBER} />
        <KpiCard icon={Dumbbell}   label="Treinos/Mês"     value={totalWorkouts}     delta="sessões totais"    color={DANGER} />
        <KpiCard icon={TrendingUp} label="Taxa Ativa"      value={`${activeRate}%`}  delta="em progresso"     color={TEAL} />
      </div>

      <div className="chart-grid" style={{ marginBottom: 14 }}>
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, gap: 8 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Frequência de Treinos</div>
              <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>Últimas 8 semanas</div>
            </div>
            <Badge variant="green">Atualizado</Badge>
          </div>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={freqData}>
                <defs>
                  <linearGradient id="neonGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={N} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={N} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
                <XAxis dataKey="w" stroke="transparent" tick={{ fill: MUTED, fontSize: 10 }} />
                <YAxis stroke="transparent" tick={{ fill: MUTED, fontSize: 10 }} />
                <Tooltip {...CHART_TOOLTIP} formatter={v => [`${v} sessões`, "Total"]} />
                <Area type="monotone" dataKey="v" stroke={N} strokeWidth={2.5} fill="url(#neonGrad)" dot={{ fill: N, r: 4 }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Distribuição de Objetivos</div>
          <div style={{ fontSize: 11, color: MUTED, marginBottom: 14 }}>Todos os alunos ativos</div>
          {goalData.length > 0 ? (
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ height: 140, flex: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={goalData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4} dataKey="value">
                      {goalData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#1a1a1a", border: `1px solid ${BORDER}`, borderRadius: 10, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {goalData.map((g, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: g.color, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>{g.name}</div>
                      <div style={{ fontSize: 10, color: MUTED }}>{g.value} aluno{g.value > 1 ? "s" : ""}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: 24, color: MUTED, fontSize: 12 }}>Nenhum aluno cadastrado</div>
          )}
        </div>
      </div>

      <div className="card">
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Resumo de Alunos</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Aluno</th><th>Objetivo</th><th>Streak</th><th>Treinos</th><th>Variação</th><th>Status</th></tr>
            </thead>
            <tbody>
              {students.map(s => {
                const sd = studentsData[s.id];
                if (!sd) return null;
                const diff = (sd.currentWeight - sd.startWeight).toFixed(1);
                return (
                  <tr key={s.id} style={{ cursor: "pointer" }} onClick={() => onNavigate("alunos", s.id)}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Avatar initials={s.avatar} size={28} />
                        <span style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>{s.name}</span>
                      </div>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>{sd.goal}</td>
                    <td style={{ color: N, fontWeight: 700 }}>{sd.streak}d</td>
                    <td>{sd.monthlyWorkouts}</td>
                    <td style={{ color: Number(diff) < 0 ? DANGER : TEAL, fontWeight: 600, whiteSpace: "nowrap" }}>
                      {Number(diff) > 0 ? "+" : ""}{diff} kg
                    </td>
                    <td><Badge variant="green"><Check size={11} /> Ativo</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── TAB: ALUNOS ──────────────────────────────────────────────────────────
function TabAlunos({ users, studentsData, onUsersChange, onStudentsDataChange, onNavigate, toast, confirm }) {
  const [search,    setSearch]    = useState("");
  const [selected,  setSelected]  = useState(null);
  const [newModal,  setNewModal]  = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [editForm,  setEditForm]  = useState({});
  const [newForm,   setNewForm]   = useState({ name: "", email: "", password: "", goal: "Perder gordura" });
  const [formErrors,setFormErrors]= useState({});

  const students = users.filter(u => u.role === "student");
  const filtered  = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  function validateNew() {
    const errors = {};
    if (!newForm.name.trim())  errors.name = "Nome obrigatório";
    if (!newForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newForm.email)) errors.email = "E-mail inválido";
    if (newForm.password.length < 6) errors.password = "Mínimo 6 caracteres";
    if (users.find(u => u.email === newForm.email)) errors.email = "E-mail já cadastrado";
    return errors;
  }

  function handleCreate() {
    const errors = validateNew();
    if (Object.keys(errors).length) { setFormErrors(errors); return; }
    const newId = Math.max(0, ...users.map(u => u.id)) + 1;
    const initials = newForm.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
    const newUser = {
      id: newId, email: newForm.email, password: newForm.password,
      role: "student", name: newForm.name, avatar: initials,
      status: "active", createdAt: new Date().toLocaleDateString("pt-BR"),
    };
    const emptyData = {
      goal: newForm.goal, weeks: 0, startWeight: 0, currentWeight: 0,
      streak: 0, monthlyWorkouts: 0, level: 1, weeklyGoal: 4,
      weightHistory: [], weekFreq: [], workouts: [], coachNote: "",
      goals: [], messages: [], workoutSessions: [],
      personalRecords: [], bodyMeasurements: [], achievements: [],
      progressPhotos: [],
    };
    onUsersChange([...users, newUser]);
    onStudentsDataChange({ ...studentsData, [newId]: emptyData });
    setNewModal(false);
    setNewForm({ name: "", email: "", password: "", goal: "Perder gordura" });
    setFormErrors({});
    toast(`Aluno ${newForm.name} criado!`);
  }

   async function handleDelete(student) {
    const ok = await confirm(`Remover ${student.name}? Esta ação não pode ser desfeita.`, { title: "Remover aluno" });
    if (!ok) return;
    onUsersChange(users.filter(u => u.id !== student.id));
    const newData = { ...studentsData };
    delete newData[student.id];
    onStudentsDataChange(newData);
    if (selected === student.id) setSelected(null);
    toast(`${student.name} removido.`, "info");
  }

  function openEdit(student) {
    const sd = studentsData[student.id];
    setEditForm({
      name: student.name,
      email: student.email,
      password: student.password,
      goal: sd?.goal || "",
      coachNote: sd?.coachNote || "",
      startWeight: sd?.startWeight ?? 0,
      currentWeight: sd?.currentWeight ?? 0,
      height: sd?.height ?? "",
      monthlyWorkouts: sd?.monthlyWorkouts ?? 0,
    });
    setEditModal(student.id);
  }

  function handleSaveEdit() {
    if (!editForm.name.trim()) { toast("Nome obrigatório", "error"); return; }
    if (!editForm.password || editForm.password.length < 6) {
      toast("Senha deve ter no mínimo 6 caracteres", "error"); return;
    }
    onUsersChange(users.map(u =>
      u.id === editModal
        ? { ...u, name: editForm.name, email: editForm.email, password: editForm.password }
        : u
    ));
    onStudentsDataChange({
      ...studentsData,
      [editModal]: {
        ...studentsData[editModal],
        goal: editForm.goal,
        coachNote: editForm.coachNote,
        startWeight: Number(editForm.startWeight) || 0,
        currentWeight: Number(editForm.currentWeight) || 0,
        height: editForm.height === "" ? undefined : Number(editForm.height),
        monthlyWorkouts: Number(editForm.monthlyWorkouts) || 0,
      },
    });
    toast("Dados atualizados!");
    setEditModal(null);
  }

  function exportCSV() {
    const rows = [["Nome", "Email", "Objetivo", "Streak", "Treinos/Mês", "Peso Atual", "Status"]];
    students.forEach(s => {
      const sd = studentsData[s.id];
      rows.push([s.name, s.email, sd?.goal || "", String(sd?.streak || 0), String(sd?.monthlyWorkouts || 0), String(sd?.currentWeight || 0), s.status]);
    });
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href = url; a.download = "alunos-gc.csv"; a.click();
    URL.revokeObjectURL(url);
    toast("CSV exportado!");
  }

  const fieldStyle = (err?) => ({
    background: CARD_BG, border: `1px solid ${err ? DANGER + "66" : BORDER}`,
    color: "#f0f0f0", borderRadius: 10, padding: "12px 14px",
    width: "100%", fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif",
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, gap: 10, flexWrap: "wrap" }}>
        <div style={{ fontSize: 12, color: MUTED }}>{filtered.length} aluno(s)</div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="secondary" size="sm" icon={Download} onClick={exportCSV}>Exportar</Btn>
          <Btn size="sm" icon={Plus} onClick={() => setNewModal(true)}>Novo</Btn>
        </div>
      </div>

      <div style={{ position: "relative", marginBottom: 14 }}>
        <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: MUTED, pointerEvents: "none" }} />
        <input type="text" placeholder="Buscar aluno..." value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: 38, background: CARD_BG, border: `1px solid ${BORDER}`, color: "#f0f0f0", borderRadius: 10, padding: "12px 14px 12px 38px", width: "100%", fontSize: 14, outline: "none" }} />
      </div>

      {filtered.length === 0 && (
        <div className="card" style={{ textAlign: "center", padding: 40, color: MUTED }}>
          <Users size={32} style={{ margin: "0 auto 12px" }} />
          <div>Nenhum aluno encontrado</div>
        </div>
      )}

      {filtered.map(student => {
        const sd = studentsData[student.id];
        const isSelected = selected === student.id;
        const diff = sd ? (sd.currentWeight - sd.startWeight).toFixed(1) : "0";

        return (
          <div key={student.id}>
            <div className={`student-row${isSelected ? " selected" : ""}`}
              onClick={() => setSelected(isSelected ? null : student.id)}
              role="button" tabIndex={0} aria-expanded={isSelected}
              onKeyDown={e => e.key === "Enter" && setSelected(isSelected ? null : student.id)}>
              <Avatar initials={student.avatar} size={38} />
              <div style={{ flex: 1, marginLeft: 12, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{student.name}</div>
                <div style={{ fontSize: 11, color: MUTED, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{student.email}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: N }}>{sd?.goal}</div>
                  <div style={{ fontSize: 10, color: MUTED }}>{sd?.streak || 0}d streak</div>
                </div>
                {isSelected ? <ChevronDown size={15} style={{ color: MUTED }} /> : <ChevronRight size={15} style={{ color: MUTED }} />}
              </div>
            </div>

            <AnimatePresence>
              {isSelected && sd && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden" }}>
                  <div className="card" style={{ marginBottom: 12, marginTop: 4, background: `${N}06`, borderColor: `${N}22` }}>
                    <div className="student-stats-grid" style={{ marginBottom: 14 }}>
                      {[
                        { label: "Início",   value: `${sd.startWeight}kg` },
                        { label: "Atual",    value: `${sd.currentWeight}kg` },
                        { label: "Variação", value: `${Number(diff) > 0 ? "+" : ""}${diff}kg`, color: Number(diff) < 0 ? DANGER : TEAL },
                        { label: "Treinos",  value: sd.monthlyWorkouts },
                      ].map((stat, i) => (
                        <div key={i}>
                          <div style={{ fontSize: 10, color: MUTED, textTransform: "uppercase", letterSpacing: ".04em", fontWeight: 700 }}>{stat.label}</div>
                          <div style={{ fontSize: 16, fontWeight: 700, marginTop: 3, color: stat.color || "#f0f0f0" }}>{stat.value}</div>
                        </div>
                      ))}
                    </div>

                    {sd.weightHistory.length > 0 && (
                      <div style={{ height: 110, marginBottom: 14 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={sd.weightHistory}>
                            <XAxis dataKey="d" stroke="transparent" tick={{ fill: MUTED, fontSize: 10 }} />
                            <YAxis stroke="transparent" tick={{ fill: MUTED, fontSize: 10 }} domain={["auto", "auto"]} />
                            <Tooltip {...CHART_TOOLTIP} formatter={v => [`${v} kg`, "Peso"]} />
                            <Line type="monotone" dataKey="v" stroke={N} strokeWidth={2} dot={{ fill: N, r: 3 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <Btn variant="secondary" size="sm" icon={Edit2}    onClick={e => { e.stopPropagation(); openEdit(student); }} style={{ justifyContent: "center" }}>Editar</Btn>
                      <Btn variant="secondary" size="sm" icon={Dumbbell} onClick={e => { e.stopPropagation(); onNavigate("treinos", student.id); }} style={{ justifyContent: "center" }}>Treinos</Btn>
                      <Btn variant="danger"    size="sm" icon={Trash2}   onClick={e => { e.stopPropagation(); handleDelete(student); }} style={{ justifyContent: "center", gridColumn: "1 / -1" }}>Remover</Btn>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      <Modal open={newModal} onClose={() => { setNewModal(false); setFormErrors({}); }} title="Novo Aluno">
        {[
          { label: "Nome completo", key: "name",     type: "text",     placeholder: "Ex: João Silva" },
          { label: "E-mail",        key: "email",    type: "email",    placeholder: "joao@email.com" },
          { label: "Senha inicial", key: "password", type: "password", placeholder: "mínimo 6 caracteres" },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>{f.label}</label>
            <input type={f.type} placeholder={f.placeholder} value={newForm[f.key]}
              onChange={e => { setNewForm(p => ({ ...p, [f.key]: e.target.value })); setFormErrors(p => ({ ...p, [f.key]: undefined })); }}
              style={fieldStyle(formErrors[f.key])} />
            {formErrors[f.key] && <div style={{ fontSize: 12, color: DANGER, marginTop: 4 }}>{formErrors[f.key]}</div>}
          </div>
        ))}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>Objetivo</label>
          <select value={newForm.goal} onChange={e => setNewForm(p => ({ ...p, goal: e.target.value }))} style={fieldStyle()}>
            {["Perder gordura", "Ganhar massa magra", "Performance", "Condicionamento"].map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Btn onClick={handleCreate} icon={UserPlus} style={{ width: "100%", justifyContent: "center" }}>Criar Aluno</Btn>
          <Btn variant="secondary" onClick={() => { setNewModal(false); setFormErrors({}); }} style={{ width: "100%", justifyContent: "center" }}>Cancelar</Btn>
        </div>
      </Modal>

      <Modal open={!!editModal} onClose={() => setEditModal(null)} title={`Editar: ${editForm.name}`}>
        {[
          { label: "Nome",   key: "name",     type: "text" },
          { label: "E-mail", key: "email",    type: "email" },
          { label: "Senha",  key: "password", type: "text" },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>{f.label}</label>
            <input type={f.type} value={editForm[f.key] || ""}
              onChange={e => setEditForm(p => ({ ...p, [f.key]: e.target.value }))}
              style={fieldStyle()} />
          </div>
        ))}
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>Objetivo</label>
          <select value={editForm.goal || ""} onChange={e => setEditForm(p => ({ ...p, goal: e.target.value }))} style={fieldStyle()}>
            {["Perder gordura", "Ganhar massa magra", "Performance", "Condicionamento"].map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>Peso Inicial (kg)</label>
            <input type="number" step="0.1" value={editForm.startWeight ?? ""}
              onChange={e => setEditForm(p => ({ ...p, startWeight: e.target.value }))}
              style={fieldStyle()} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>Peso Atual (kg)</label>
            <input type="number" step="0.1" value={editForm.currentWeight ?? ""}
              onChange={e => setEditForm(p => ({ ...p, currentWeight: e.target.value }))}
              style={fieldStyle()} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>Altura (cm)</label>
            <input type="number" step="1" value={editForm.height ?? ""}
              onChange={e => setEditForm(p => ({ ...p, height: e.target.value }))}
              style={fieldStyle()} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>Treinos no Mês</label>
            <input type="number" step="1" value={editForm.monthlyWorkouts ?? ""}
              onChange={e => setEditForm(p => ({ ...p, monthlyWorkouts: e.target.value }))}
              style={fieldStyle()} />
          </div>
        </div>
        <div style={{ fontSize: 11, color: MUTED, marginBottom: 20, marginTop: -8 }}>
          A variação é calculada automaticamente (Peso Atual − Peso Inicial).
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>Nota do Coach</label>
          <textarea rows={3} value={editForm.coachNote || ""}
            onChange={e => setEditForm(p => ({ ...p, coachNote: e.target.value }))}
            style={{ ...fieldStyle(), resize: "vertical" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Btn onClick={handleSaveEdit} icon={Save} style={{ width: "100%", justifyContent: "center" }}>Salvar</Btn>
          <Btn variant="secondary" onClick={() => setEditModal(null)} style={{ width: "100%", justifyContent: "center" }}>Cancelar</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── EDITOR DE EXERCÍCIO (com autocomplete da biblioteca) ─────────────────
const BLANK_EXERCISE = () => ({
  id: `ex_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
  name: "", plannedSets: "3", plannedReps: "12", plannedLoad: "",
  note: "", videoUrl: "", equipment: "Barra",
});

function ExerciseEditor({ exercise, onSave, onCancel, accent = N, exerciseLibrary = [] }) {
  const [form,          setForm]          = useState({ ...exercise });
  const [suggestions,   setSuggestions]   = useState([]);
  const [showDropdown,  setShowDropdown]  = useState(false);
  const [highlighted,   setHighlighted]   = useState(-1);
  const [groupFilter,   setGroupFilter]   = useState("all");
  const dropdownRef = useRef(null);
  const inputRef    = useRef(null);

  // Filtra biblioteca ao digitar e/ou por grupo muscular selecionado no chip
  useEffect(() => {
    const q = form.name.trim().toLowerCase();
    let pool = exerciseLibrary;
    if (groupFilter !== "all") pool = pool.filter(t => t.muscleGroup === groupFilter);
    // com grupo selecionado, mostra a lista do grupo mesmo sem digitar nada;
    // sem grupo selecionado, só busca depois que o coach começa a digitar
    if (!q && groupFilter === "all") { setSuggestions([]); setShowDropdown(false); return; }
    const matches = (q ? pool.filter(t => t.name.toLowerCase().includes(q)) : pool).slice(0, 8);
    setSuggestions(matches);
    setShowDropdown(matches.length > 0);
    setHighlighted(-1);
  }, [form.name, exerciseLibrary, groupFilter]);

  // Fecha ao clicar fora
  useEffect(() => {
    const handler = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Seleciona sugestão e preenche campos automaticamente
function selectSuggestion(template) {
    setForm(prev => ({
      ...prev,
      name:         template.name,
      plannedSets:  template.defaultSets  || prev.plannedSets,
      plannedReps:  template.defaultReps  || prev.plannedReps,
      plannedLoad:  template.defaultLoad  || prev.plannedLoad,
      note:         template.note         || prev.note,
      videoUrl:     template.videoUrl     || prev.videoUrl,
      equipment:    template.equipment    || prev.equipment,
    }));
          setShowDropdown(false);
    setSuggestions([]);
  }

  // Navegação com teclado no dropdown
  function handleKeyDown(e) {
    if (!showDropdown || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted(h => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted(h => Math.max(h - 1, 0));
    } else if (e.key === "Enter" && highlighted >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[highlighted]);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  }

  function f(key) { return e => setForm(p => ({ ...p, [key]: e.target.value })); }

  const inputStyle = {
    background: CARD_BG2, border: `1px solid ${BORDER}`, color: "#f0f0f0",
    borderRadius: 8, padding: "8px 11px", fontSize: 13, outline: "none",
    fontFamily: "'DM Sans', sans-serif", width: "100%",
  };
  const labelStyle = {
    display: "block", fontSize: 10, fontWeight: 700, color: MUTED,
    textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 5,
  };

  // Cor do grupo muscular do template selecionado (se houver)
  const matchedTemplate = exerciseLibrary.find(t => t.name.toLowerCase() === form.name.toLowerCase());
  const muscleColors = {
    "Peito": "#3B82F6", "Costas": "#8B5CF6", "Ombro": "#F59E0B",
    "Pernas": "#EF4444", "Glúteos": "#EC4899", "Bíceps": "#10B981",
    "Tríceps": "#14B8A6", "Abdômen": "#F97316", "Panturrilha": "#6366F1", "Outro": MUTED,
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: `${accent}08`, border: `1px solid ${accent}33`, borderRadius: 14, padding: 16, marginBottom: 10 }}>

      {/* ── Chip de grupo muscular (quando há match na biblioteca) */}
      {matchedTemplate && (
        <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
          <span style={{
            padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
            background: `${muscleColors[matchedTemplate.muscleGroup] || MUTED}18`,
            color: muscleColors[matchedTemplate.muscleGroup] || MUTED,
            border: `1px solid ${muscleColors[matchedTemplate.muscleGroup] || MUTED}33`,
          }}>
            {matchedTemplate.muscleGroup}
          </span>
          <span style={{
            padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
            background: CARD_BG2, color: MUTED, border: `1px solid ${BORDER}`,
          }}>
            {matchedTemplate.equipment}
          </span>
          <span style={{
            padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
            background: `${N}10`, color: N, border: `1px solid ${N}22`,
            display: "flex", alignItems: "center", gap: 4,
          }}>
            <Zap size={10} /> Da biblioteca
          </span>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>

        {/* ── Nome com autocomplete */}
        <div style={{ position: "relative" }}>
          <label style={labelStyle}>Nome do Exercício *</label>

          {/* Filtro por grupo muscular — restringe as sugestões da biblioteca */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
            <button type="button" onClick={() => setGroupFilter("all")}
              style={{
                padding: "4px 11px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                background: groupFilter === "all" ? `${accent}22` : CARD_BG2,
                color: groupFilter === "all" ? accent : MUTED,
                border: `1px solid ${groupFilter === "all" ? `${accent}55` : BORDER}`,
                cursor: "pointer",
              }}>
              Todos
            </button>
            {MUSCLE_GROUPS.map(g => (
              <button key={g} type="button" onClick={() => setGroupFilter(g)}
                style={{
                  padding: "4px 11px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                  background: groupFilter === g ? `${muscleColors[g] || MUTED}22` : CARD_BG2,
                  color: groupFilter === g ? (muscleColors[g] || MUTED) : MUTED,
                  border: `1px solid ${groupFilter === g ? `${muscleColors[g] || MUTED}55` : BORDER}`,
                  cursor: "pointer",
                }}>
                {g}
              </button>
            ))}
          </div>

          <div style={{ position: "relative" }}>
            <input
              ref={inputRef}
              value={form.name}
              onChange={f("name")}
              onKeyDown={handleKeyDown}
              onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
              placeholder="Digite para buscar na biblioteca..."
              style={{
                ...inputStyle,
                borderColor: !form.name.trim() ? `${DANGER}55` : showDropdown ? `${N}55` : BORDER,
                paddingRight: 36,
              }}
              autoComplete="off"
            />
            <Search size={14} style={{
              position: "absolute", right: 10, top: "50%",
              transform: "translateY(-50%)", color: MUTED, pointerEvents: "none",
            }} />
          </div>

          {/* Dropdown de sugestões */}
          <AnimatePresence>
            {showDropdown && suggestions.length > 0 && (
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                className="autocomplete-dropdown">
                {suggestions.map((s, i) => (
                  <div
                    key={s.id}
                    className={`autocomplete-item${highlighted === i ? " highlighted" : ""}`}
                    onMouseDown={e => { e.preventDefault(); selectSuggestion(s); }}
                    onMouseEnter={() => setHighlighted(i)}>
                    {/* Ícone de grupo muscular */}
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                      background: `${muscleColors[s.muscleGroup] || MUTED}18`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13,
                    }}>
                      💪
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{s.name}</div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 10, color: muscleColors[s.muscleGroup] || MUTED, fontWeight: 600 }}>{s.muscleGroup}</span>
                        <span style={{ fontSize: 10, color: MUTED }}>·</span>
                        <span style={{ fontSize: 10, color: MUTED }}>{s.equipment}</span>
                        <span style={{ fontSize: 10, color: MUTED }}>·</span>
                        <span style={{ fontSize: 10, color: MUTED }}>{s.defaultSets}×{s.defaultReps} @ {s.defaultLoad}</span>
                      </div>
                    </div>
                    <div style={{ flexShrink: 0 }}>
                      <ChevronRight size={13} style={{ color: MUTED }} />
                    </div>
                  </div>
                ))}
                <div style={{ padding: "8px 14px", borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 6 }}>
                  <BookOpen size={11} style={{ color: MUTED }} />
                  <span style={{ fontSize: 10, color: MUTED }}>{exerciseLibrary.length} exercícios na biblioteca</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Séries / Reps / Carga */}
       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
          <div>
            <label style={labelStyle}>Séries</label>
            <input type="number" min="1" max="20" value={form.plannedSets} onChange={f("plannedSets")} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Reps</label>
            <input value={form.plannedReps} onChange={f("plannedReps")} placeholder="12 ou 8-12" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Carga</label>
            <input value={form.plannedLoad} onChange={f("plannedLoad")} placeholder="70kg / PC" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Equipamento</label>
            <select value={form.equipment || "Barra"} onChange={f("equipment")} style={{ ...inputStyle, cursor: "pointer" }}>
              {EQUIPMENT_OPTIONS.map(eq => <option key={eq} value={eq}>{eq}</option>)}
            </select>
          </div>
        </div>

        {/* ── Observação */}
        <div>
          <label style={labelStyle}>Observação / Dica de execução</label>
          <textarea rows={2} value={form.note} onChange={f("note")}
            placeholder="Ex: Foco na excêntrica, cotovelo a 45°, amplitude máxima..."
            style={{ ...inputStyle, resize: "vertical" }} />
        </div>

        {/* ── URL do vídeo */}
        <div>
          <label style={labelStyle}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Video size={11} /> Vídeo demonstrativo (URL YouTube / Vimeo)
            </span>
          </label>
          <input value={form.videoUrl || ""} onChange={f("videoUrl")}
            placeholder="https://youtube.com/watch?v=..." style={inputStyle} />
          {form.videoUrl && (
            <div style={{ marginTop: 8, fontSize: 11, color: BLUE, display: "flex", alignItems: "center", gap: 4 }}>
              <Link size={11} />
              <a href={form.videoUrl} target="_blank" rel="noopener noreferrer" style={{ color: BLUE }}>Pré-visualizar vídeo</a>
            </div>
          )}
        </div>
      </div>

      {/* Botões */}
      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <Btn onClick={() => { if (!form.name.trim()) return; onSave(form); }} icon={Save} style={{ flex: 1, justifyContent: "center" }}>
          Salvar exercício
        </Btn>
        <Btn variant="secondary" onClick={onCancel} style={{ justifyContent: "center", padding: "12px 16px" }}>
          Cancelar
        </Btn>
      </div>
    </motion.div>
  );
}

// ─── CARD DE EXERCÍCIO (visualização) ────────────────────────────────────
function ExerciseCard({ exercise, index, onEdit, onDelete, accent = N, onDragStart, onDragEnter, onDrop, onDragEnd, isDragging, isDragOver }) {
  const [showVideo, setShowVideo] = useState(false);

  function getYoutubeId(url) {
    if (!url) return null;
    const m = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
    return m ? m[1] : null;
  }
  const ytId = getYoutubeId(exercise.videoUrl);

  const draggable = !!(onDragStart && onDragEnter && onDrop);

  return (
    <motion.div layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      onDragEnter={draggable ? (e) => { e.preventDefault(); onDragEnter(index); } : undefined}
      onDragOver={draggable ? (e) => e.preventDefault() : undefined}
      onDrop={draggable ? (e) => { e.preventDefault(); onDrop(index); } : undefined}
      style={{
        background: CARD_BG, border: `1px solid ${isDragOver ? accent : BORDER}`, borderRadius: 12, overflow: "hidden", marginBottom: 8,
        opacity: isDragging ? 0.4 : 1,
        boxShadow: isDragOver ? `0 0 0 1px ${accent}` : undefined,
      }}>

      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px" }}>
        {draggable && (
          <div
            draggable
            onDragStart={(e) => { e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", String(index)); onDragStart(index); }}
            onDragEnd={() => onDragEnd && onDragEnd()}
            title="Arrastar para reordenar"
            style={{ cursor: "grab", color: MUTED, flexShrink: 0, display: "flex", alignItems: "center" }}
          >
            <GripVertical size={16} />
          </div>
        )}
        <div style={{ width: 26, height: 26, borderRadius: "50%", background: `${accent}18`, color: accent, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {index + 1}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{exercise.name}</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: accent, fontWeight: 700 }}>
              {exercise.plannedSets}× {exercise.plannedReps}
            </span>
            {exercise.plannedLoad && (
              <span style={{ fontSize: 11, color: MUTED2 }}>@ {exercise.plannedLoad}</span>
            )}
            {exercise.equipment && (
              <span style={{ fontSize: 11, color: BLUE, fontWeight: 600 }}>🔧 {exercise.equipment}</span>
            )}
          </div>
          {exercise.note && (
            <div style={{ fontSize: 11, color: MUTED, marginTop: 4, fontStyle: "italic" }}>
              💡 {exercise.note}
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          {exercise.videoUrl && (
            <button onClick={() => setShowVideo(v => !v)} title="Ver vídeo"
              style={{ background: showVideo ? `${BLUE}22` : CARD_BG2, border: `1px solid ${showVideo ? BLUE + "55" : BORDER}`, borderRadius: 8, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", color: BLUE, cursor: "pointer" }}>
              <Play size={13} fill={showVideo ? BLUE : "none"} />
            </button>
          )}
          <button onClick={() => onEdit(exercise)}
            style={{ background: CARD_BG2, border: `1px solid ${BORDER}`, borderRadius: 8, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", color: MUTED2, cursor: "pointer" }}>
            <Edit2 size={13} />
          </button>
          <button onClick={() => onDelete(exercise.id)}
            style={{ background: `${DANGER}12`, border: `1px solid ${DANGER}33`, borderRadius: 8, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", color: DANGER, cursor: "pointer" }}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showVideo && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
            <div style={{ padding: "0 14px 14px" }}>
              {ytId ? (
                <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: 10, overflow: "hidden", border: `1px solid ${BORDER}` }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${ytId}?modestbranding=1&rel=0`}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen title={exercise.name}
                  />
                </div>
              ) : (
                <div style={{ padding: "12px 14px", background: `${BLUE}08`, border: `1px solid ${BLUE}22`, borderRadius: 10 }}>
                  <div style={{ fontSize: 12, color: BLUE, marginBottom: 4 }}>Link do vídeo</div>
                  <a href={exercise.videoUrl} target="_blank" rel="noopener noreferrer" style={{ color: BLUE, fontSize: 12 }}>{exercise.videoUrl}</a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── TAB: TREINOS ─────────────────────────────────────────────────────────
// ── ALTERADO: passa exerciseLibrary para ExerciseEditor ──
function TabTreinos({ users, studentsData, updateStudentWorkouts, selectedStudent, onSelectStudent, toast, confirm, exerciseLibrary, workoutTemplates = [], addWorkoutTemplate }) {
  const students = users.filter(u => u.role === "student");
  const current  = selectedStudent ? students.find(s => s.id === selectedStudent) : null;
  const sd       = current ? studentsData[current.id] : null;

  const [activeWorkoutId, setActiveWorkoutId] = useState(null);
  const [editingWorkout,  setEditingWorkout]  = useState(null);
  const [addingExercise,  setAddingExercise]  = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [dragIndex,       setDragIndex]       = useState(null);
  const [dragOverIndex,   setDragOverIndex]   = useState(null);
  const [showNewWorkout,  setShowNewWorkout]  = useState(false);
  const [newWorkoutForm,  setNewWorkoutForm]  = useState({ name: "", day: "Segunda" });
  const [showTemplates,   setShowTemplates]   = useState(false);
  const [showCopyFrom,    setShowCopyFrom]    = useState(false);
  const [copySourceId,    setCopySourceId]    = useState("");
  const [copySelected,    setCopySelected]    = useState({});

  const DAYS = ["Segunda","Terça","Quarta","Quinta","Sexta","Sábado","Domingo"];
  const COLORS_BY_KEYWORD = { Superior: BLUE, Inferior: DANGER, Pull: PURPLE, Push: N, Full: TEAL, Força: AMBER };

  function getWorkoutColor(name) {
    for (const [k, c] of Object.entries(COLORS_BY_KEYWORD)) if (name.includes(k)) return c;
    return N;
  }

  function guessCategory(name) {
    for (const c of WORKOUT_CATEGORIES) if (name.includes(c)) return c;
    return "Outro";
  }

  const workouts = sd?.workouts || [];
  const activeWorkout = workouts.find(w => w.id === activeWorkoutId) || null;

  // ── Copiar treinos de outro aluno ──────────────────────────────────────
  const copySource         = copySourceId ? studentsData[Number(copySourceId)] : null;
  const copySourceWorkouts = copySource?.workouts || [];

  useEffect(() => {
    const sel = {};
    copySourceWorkouts.forEach(w => { sel[w.id] = true; });
    setCopySelected(sel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [copySourceId]);

  // Divisão por grupo muscular do treino ativo (cruza os exercícios do treino com a biblioteca pelo nome)
  const muscleBreakdown = useMemo(() => {
    const exercises = activeWorkout?.exercises || [];
    const counts = {};
    exercises.forEach(ex => {
      const template = exerciseLibrary.find(t => t.name.toLowerCase() === (ex.name || "").toLowerCase());
      const group = template?.muscleGroup || "Outro";
      counts[group] = (counts[group] || 0) + 1;
    });
    return MUSCLE_GROUPS.filter(g => counts[g]).map(g => ({ group: g, count: counts[g] }));
  }, [activeWorkout, exerciseLibrary]);

  function handleCreateWorkout() {
    if (!current || !newWorkoutForm.name.trim()) { toast("Nome do treino obrigatório.", "error"); return; }
    const newId = Math.max(0, ...workouts.map(w => w.id), 0) + 1;
    const newWorkout = { id: newId, name: newWorkoutForm.name.trim(), day: newWorkoutForm.day, totalEstimatedTime: 0, exercises: [] };
    updateStudentWorkouts(current.id, [...workouts, newWorkout]);
    setActiveWorkoutId(newId);
    setShowNewWorkout(false);
    setNewWorkoutForm({ name: "", day: "Segunda" });
    toast("Treino criado!");
  }

  function handleSaveWorkoutMeta() {
    if (!editingWorkout || !current) return;
    const updated = workouts.map(w => w.id === activeWorkoutId ? { ...w, name: editingWorkout.name, day: editingWorkout.day } : w);
    updateStudentWorkouts(current.id, updated);
    setEditingWorkout(null);
    toast("Treino atualizado!");
  }

  async function handleDeleteWorkout(wid) {
    if (!current) return;
    const ok = await confirm("Remover este treino e todos os exercícios?", { title: "Remover treino" });
    if (!ok) return;
    updateStudentWorkouts(current.id, workouts.filter(w => w.id !== wid));
    if (activeWorkoutId === wid) setActiveWorkoutId(null);
    toast("Treino removido.", "info");
  }

  function handleSaveExercise(ex) {
    if (!current || !activeWorkout) return;
    const existsIdx = activeWorkout.exercises.findIndex(e => e.id === ex.id);
    let exercises;
    if (existsIdx >= 0) {
      exercises = activeWorkout.exercises.map((e, i) => i === existsIdx ? ex : e);
    } else {
      exercises = [...activeWorkout.exercises, ex];
    }
    updateStudentWorkouts(current.id, workouts.map(w => w.id === activeWorkoutId ? { ...w, exercises } : w));
    setAddingExercise(false);
    setEditingExercise(null);
    toast(existsIdx >= 0 ? "Exercício atualizado!" : "Exercício adicionado!");
  }

   async function handleDeleteExercise(exId) {
    if (!current || !activeWorkout) return;
    const ok = await confirm("Remover exercício?", { title: "Remover exercício" });
    if (!ok) return;
    const exercises = activeWorkout.exercises.filter(e => e.id !== exId);
    updateStudentWorkouts(current.id, workouts.map(w => w.id === activeWorkoutId ? { ...w, exercises } : w));
    toast("Exercício removido.", "info");
  }

  function handleReorderExercise(fromIndex, toIndex) {
    if (!current || !activeWorkout || fromIndex === toIndex) return;
    const exercises = [...activeWorkout.exercises];
    const [moved] = exercises.splice(fromIndex, 1);
    exercises.splice(toIndex, 0, moved);
    updateStudentWorkouts(current.id, workouts.map(w => w.id === activeWorkoutId ? { ...w, exercises } : w));
  }

  function handleDuplicateWorkout(w) {
    if (!current) return;
    const newId = Math.max(0, ...workouts.map(x => x.id), 0) + 1;
    const dup = {
      ...w, id: newId, name: `${w.name} (cópia)`,
      exercises: w.exercises.map(e => ({ ...e, id: `ex_${Date.now()}_${Math.random().toString(36).slice(2,6)}` })),
    };
    updateStudentWorkouts(current.id, [...workouts, dup]);
    toast("Treino duplicado!");
  }

  function handleApplyTemplate(template) {
    if (!current) return;
    const newId = Math.max(0, ...workouts.map(w => w.id), 0) + 1;
    const newWorkout = {
      id: newId, name: template.name, day: DAYS[0],
      totalEstimatedTime: (template.exercises || []).reduce((s, e) => s + Number(e.estimatedTime || 0), 0),
      exercises: (template.exercises || []).map(e => ({ ...e, id: `ex_${Date.now()}_${Math.random().toString(36).slice(2, 6)}` })),
    };
    updateStudentWorkouts(current.id, [...workouts, newWorkout]);
    toast(`Modelo "${template.name}" adicionado para ${current.name}!`);
  }

  function handleCopyFromStudent() {
    if (!current || !copySource) return;
    const toCopy = copySourceWorkouts.filter(w => copySelected[w.id]);
    if (toCopy.length === 0) { toast("Selecione ao menos um treino.", "error"); return; }
    let nextId = Math.max(0, ...workouts.map(w => w.id), 0);
    const copied = toCopy.map(w => {
      nextId += 1;
      return {
        ...w, id: nextId,
        exercises: (w.exercises || []).map(e => ({ ...e, id: `ex_${Date.now()}_${Math.random().toString(36).slice(2, 6)}` })),
      };
    });
    updateStudentWorkouts(current.id, [...workouts, ...copied]);
    const sourceStudent = users.find(u => u.id === Number(copySourceId));
    toast(`${copied.length} treino(s) copiado(s) de ${sourceStudent?.name} para ${current.name}!`);
    setShowCopyFrom(false);
    setCopySourceId("");
  }

  async function handleSaveAsTemplate(w) {
    if (!addWorkoutTemplate) return;
    const template = {
      id: `wt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: w.name, category: guessCategory(w.name), note: "",
      exercises: (w.exercises || []).map(e => ({ ...e, id: `ex_${Date.now()}_${Math.random().toString(36).slice(2, 6)}` })),
      createdAt: new Date().toISOString(),
    };
    try {
      await addWorkoutTemplate(template);
      toast(`"${w.name}" salvo em Treinos Prontos!`);
    } catch (e) {
      toast("Erro ao salvar modelo.", "error");
    }
  }

  const color = activeWorkout ? getWorkoutColor(activeWorkout.name) : N;

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>Aluno</label>
        <select value={selectedStudent || ""} onChange={e => { onSelectStudent(Number(e.target.value) || null); setActiveWorkoutId(null); }}
          style={{ background: CARD_BG, border: `1px solid ${BORDER}`, color: "#f0f0f0", borderRadius: 10, padding: "12px 14px", width: "100%", fontSize: 14, cursor: "pointer" }}>
          <option value="">Selecione um aluno...</option>
          {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {!current && (
        <div className="card" style={{ textAlign: "center", padding: 40 }}>
          <Dumbbell size={32} style={{ color: MUTED, margin: "0 auto 12px" }} />
          <p style={{ color: MUTED }}>Selecione um aluno para gerenciar treinos</p>
        </div>
      )}

      {current && sd && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 12, background: `${N}08`, border: `1px solid ${N}22`, marginBottom: 16 }}>
            <Avatar initials={current.avatar} size={36} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{current.name}</div>
              <div style={{ fontSize: 11, color: N }}>{sd.goal} · {workouts.length} treino(s)</div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Btn variant="secondary" size="sm" icon={Copy} onClick={() => { setShowCopyFrom(v => !v); setShowTemplates(false); setShowNewWorkout(false); }}>
                {showCopyFrom ? "Cancelar" : "Copiar de Aluno"}
              </Btn>
              <Btn variant="secondary" size="sm" icon={Layers} onClick={() => { setShowTemplates(v => !v); setShowCopyFrom(false); setShowNewWorkout(false); }}>
                {showTemplates ? "Cancelar" : "Usar Modelo"}
              </Btn>
              <Btn size="sm" icon={Plus} onClick={() => { setShowNewWorkout(v => !v); setShowTemplates(false); setShowCopyFrom(false); }}>
                {showNewWorkout ? "Cancelar" : "Novo Treino"}
              </Btn>
            </div>
          </div>

          <AnimatePresence>
            {showCopyFrom && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden" }}>
                <div className="card" style={{ marginBottom: 14, background: `${PURPLE}06`, borderColor: `${PURPLE}33` }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: PURPLE, display: "flex", alignItems: "center", gap: 6 }}>
                    <Copy size={14} /> Copiar treinos de outro aluno
                  </div>
                  <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 5 }}>Aluno de origem</label>
                  <select value={copySourceId} onChange={e => setCopySourceId(e.target.value)}
                    style={{ background: CARD_BG2, border: `1px solid ${BORDER}`, color: "#f0f0f0", borderRadius: 8, padding: "9px 12px", fontSize: 13, outline: "none", cursor: "pointer", width: "100%", marginBottom: 12 }}>
                    <option value="">Selecione um aluno...</option>
                    {students.filter(s => s.id !== current?.id).map(s => (
                      <option key={s.id} value={s.id}>{s.name} · {(studentsData[s.id]?.workouts || []).length} treino(s)</option>
                    ))}
                  </select>

                  {copySourceId && (
                    copySourceWorkouts.length === 0 ? (
                      <div style={{ fontSize: 12, color: MUTED, textAlign: "center", padding: 12 }}>Este aluno não tem treinos ainda.</div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                        {copySourceWorkouts.map(w => (
                          <label key={w.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, background: CARD_BG2, border: `1px solid ${BORDER}`, cursor: "pointer" }}>
                            <input type="checkbox" checked={!!copySelected[w.id]}
                              onChange={() => setCopySelected(p => ({ ...p, [w.id]: !p[w.id] }))}
                              style={{ width: 16, height: 16, cursor: "pointer", flexShrink: 0 }} />
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 600 }}>{w.name}</div>
                              <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{w.day} · {(w.exercises || []).length} exerc.</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    )
                  )}

                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn icon={Copy} disabled={!copySourceId || copySourceWorkouts.length === 0} onClick={handleCopyFromStudent} style={{ flex: 1, justifyContent: "center" }}>
                      Copiar Selecionados
                    </Btn>
                    <Btn variant="secondary" onClick={() => { setShowCopyFrom(false); setCopySourceId(""); }} style={{ justifyContent: "center", padding: "12px 16px" }}>Cancelar</Btn>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showTemplates && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden" }}>
                <div className="card" style={{ marginBottom: 14, background: `${BLUE}06`, borderColor: `${BLUE}33` }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: BLUE, display: "flex", alignItems: "center", gap: 6 }}>
                    <Layers size={14} /> Treinos Prontos ({workoutTemplates.length})
                  </div>
                  {workoutTemplates.length === 0 ? (
                    <div style={{ fontSize: 12, color: MUTED, textAlign: "center", padding: 12 }}>
                      Nenhum modelo cadastrado ainda. Crie um em "Treinos Prontos".
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {workoutTemplates.map(t => (
                        <div key={t.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "10px 12px", borderRadius: 10, background: CARD_BG2, border: `1px solid ${BORDER}` }}>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
                            <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{t.category} · {(t.exercises || []).length} exerc.</div>
                          </div>
                          <Btn size="sm" icon={Plus} onClick={() => handleApplyTemplate(t)} style={{ flexShrink: 0 }}>Adicionar</Btn>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showNewWorkout && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden" }}>
                <div className="card" style={{ marginBottom: 14, background: `${N}06`, borderColor: `${N}33` }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: N }}>Novo Treino</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, marginBottom: 12 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 5 }}>Nome</label>
                      <input value={newWorkoutForm.name} onChange={e => setNewWorkoutForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="Ex: Treino A · Superior"
                        style={{ background: CARD_BG2, border: `1px solid ${BORDER}`, color: "#f0f0f0", borderRadius: 8, padding: "9px 12px", fontSize: 13, outline: "none", width: "100%" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 5 }}>Dia</label>
                      <select value={newWorkoutForm.day} onChange={e => setNewWorkoutForm(p => ({ ...p, day: e.target.value }))}
                        style={{ background: CARD_BG2, border: `1px solid ${BORDER}`, color: "#f0f0f0", borderRadius: 8, padding: "9px 12px", fontSize: 13, outline: "none", cursor: "pointer" }}>
                        {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn icon={Plus} onClick={handleCreateWorkout} style={{ flex: 1, justifyContent: "center" }}>Criar</Btn>
                    <Btn variant="secondary" onClick={() => setShowNewWorkout(false)} style={{ justifyContent: "center", padding: "12px 16px" }}>Cancelar</Btn>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ display: "grid", gridTemplateColumns: activeWorkoutId ? "260px 1fr" : "1fr", gap: 14 }}>
            {/* Lista de treinos */}
            <div>
              {workouts.length === 0 && (
                <div className="card" style={{ textAlign: "center", padding: 32, color: MUTED }}>
                  <Dumbbell size={28} style={{ margin: "0 auto 10px" }} />
                  <div style={{ fontSize: 13 }}>Nenhum treino ainda.<br />Crie o primeiro acima.</div>
                </div>
              )}
              {workouts.map(w => {
                const wcolor = getWorkoutColor(w.name);
                const isActive = activeWorkoutId === w.id;
                return (
                  <motion.div key={w.id} layout
                    onClick={() => setActiveWorkoutId(isActive ? null : w.id)}
                    style={{
                      padding: "12px 14px", borderRadius: 12, marginBottom: 8, cursor: "pointer",
                      background: isActive ? `${wcolor}12` : CARD_BG,
                      border: `1px solid ${isActive ? wcolor + "44" : BORDER}`,
                      borderLeft: `4px solid ${wcolor}`, transition: "all .2s",
                    }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, color: wcolor, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 2 }}>{w.day}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.name}</div>
                        <div style={{ fontSize: 11, color: MUTED, marginTop: 3 }}>{(w.exercises || []).length} exerc.</div>
                      </div>
                      <div style={{ display: "flex", gap: 4, flexShrink: 0, marginLeft: 8 }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => handleSaveAsTemplate(w)} title="Salvar como modelo (Treinos Prontos)"
                          style={{ background: "none", border: "none", color: MUTED, cursor: "pointer", padding: 4 }}>
                          <Star size={13} />
                        </button>
                        <button onClick={() => handleDuplicateWorkout(w)} title="Duplicar"
                          style={{ background: "none", border: "none", color: MUTED, cursor: "pointer", padding: 4 }}>
                          <Copy size={13} />
                        </button>
                        <button onClick={() => handleDeleteWorkout(w.id)} title="Remover"
                          style={{ background: "none", border: "none", color: DANGER, cursor: "pointer", padding: 4 }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Editor do treino ativo */}
            {activeWorkout && (
              <motion.div key={activeWorkoutId} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
                <div className="card" style={{ marginBottom: 14, borderColor: `${color}33`, background: `${color}06` }}>
                  {editingWorkout ? (
                    <div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, marginBottom: 12 }}>
                        <div>
                          <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 5 }}>Nome</label>
                          <input value={editingWorkout.name} onChange={e => setEditingWorkout(p => ({ ...p, name: e.target.value }))}
                            style={{ background: CARD_BG2, border: `1px solid ${BORDER}`, color: "#f0f0f0", borderRadius: 8, padding: "9px 12px", fontSize: 13, outline: "none", width: "100%" }} />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 5 }}>Dia</label>
                          <select value={editingWorkout.day} onChange={e => setEditingWorkout(p => ({ ...p, day: e.target.value }))}
                            style={{ background: CARD_BG2, border: `1px solid ${BORDER}`, color: "#f0f0f0", borderRadius: 8, padding: "9px 12px", fontSize: 13, outline: "none", cursor: "pointer" }}>
                            {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <Btn icon={Save} onClick={handleSaveWorkoutMeta} style={{ justifyContent: "center" }}>Salvar</Btn>
                        <Btn variant="secondary" onClick={() => setEditingWorkout(null)} style={{ justifyContent: "center", padding: "12px 16px" }}>Cancelar</Btn>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 11, color, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 }}>{activeWorkout.day}</div>
                        <div className="display" style={{ fontSize: 16, marginBottom: 4 }}>{activeWorkout.name}</div>
                        <div style={{ fontSize: 12, color: MUTED }}>{(activeWorkout.exercises || []).length}</div>
                      </div>
                      <button onClick={() => setEditingWorkout({ name: activeWorkout.name, day: activeWorkout.day })}
                        style={{ background: CARD_BG2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "8px 12px", color: MUTED2, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                        <Edit2 size={13} /> Editar
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>
                      Exercícios <span style={{ fontSize: 11, color: MUTED, fontWeight: 400 }}>({(activeWorkout.exercises || []).length})</span>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {exerciseLibrary.length > 0 && (
                        <span style={{ fontSize: 11, color: MUTED, display: "flex", alignItems: "center", gap: 4 }}>
                          <BookOpen size={11} /> {exerciseLibrary.length} na biblioteca
                        </span>
                      )}
                      <Btn size="sm" icon={Plus} onClick={() => { setAddingExercise(true); setEditingExercise(null); }}>
                        Adicionar
                      </Btn>
                    </div>
                  </div>

                  <AnimatePresence>
                    {addingExercise && !editingExercise && (
                      <ExerciseEditor
                        exercise={BLANK_EXERCISE()}
                        accent={color}
                        exerciseLibrary={exerciseLibrary}
                        onSave={handleSaveExercise}
                        onCancel={() => setAddingExercise(false)}
                      />
                    )}
                  </AnimatePresence>

                  {(activeWorkout.exercises || []).length === 0 && !addingExercise && (
                    <div className="card" style={{ textAlign: "center", padding: 28, color: MUTED }}>
                      <Dumbbell size={24} style={{ margin: "0 auto 8px" }} />
                      <div style={{ fontSize: 12 }}>Nenhum exercício ainda.<br />Clique em "Adicionar" para buscar da biblioteca.</div>
                    </div>
                  )}

                  {(activeWorkout.exercises || []).map((ex, idx) => (
                    <div key={ex.id}>
                      {editingExercise?.id === ex.id ? (
                        <ExerciseEditor
                          exercise={editingExercise}
                          accent={color}
                          exerciseLibrary={exerciseLibrary}
                          onSave={handleSaveExercise}
                          onCancel={() => setEditingExercise(null)}
                        />
                      ) : (
                        <ExerciseCard
                          exercise={ex} index={idx} accent={color}
                          onEdit={e => { setEditingExercise(e); setAddingExercise(false); }}
                          onDelete={handleDeleteExercise}
                          onDragStart={setDragIndex}
                          onDragEnter={(i) => { if (i !== dragOverIndex) setDragOverIndex(i); }}
                          onDrop={(i) => {
                            if (dragIndex !== null) handleReorderExercise(dragIndex, i);
                            setDragIndex(null);
                            setDragOverIndex(null);
                          }}
                          onDragEnd={() => { setDragIndex(null); setDragOverIndex(null); }}
                          isDragging={dragIndex === idx}
                          isDragOver={dragOverIndex === idx && dragIndex !== idx}
                        />
                      )}
                    </div>
                  ))}

                  {(activeWorkout.exercises || []).length > 0 && (
                    <div style={{ marginTop: 14, padding: "12px 16px", borderRadius: 12, background: CARD_BG2, border: `1px solid ${BORDER}`, display: "flex", gap: 24, flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontSize: 10, color: MUTED, textTransform: "uppercase", fontWeight: 700 }}>Total de Séries</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color }}>{(activeWorkout.exercises || []).reduce((s, e) => s + Number(e.plannedSets || 0), 0)}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: MUTED, textTransform: "uppercase", fontWeight: 700 }}>Exercícios</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color }}>{(activeWorkout.exercises || []).length}</div>
                      </div>
                    </div>
                  )}

                  {muscleBreakdown.length > 0 && (
                    <div style={{ marginTop: 10, padding: "12px 16px", borderRadius: 12, background: CARD_BG2, border: `1px solid ${BORDER}` }}>
                      <div style={{ fontSize: 10, color: MUTED, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>Divisão por Grupo Muscular</div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {muscleBreakdown.map(({ group, count }) => {
                          const gcolor = MUSCLE_COLOR[group] || MUTED;
                          return (
                            <span key={group} style={{
                              display: "flex", alignItems: "center", gap: 6,
                              padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                              background: `${gcolor}18`, color: gcolor, border: `1px solid ${gcolor}33`,
                            }}>
                              {group} <span style={{ opacity: 0.75, fontWeight: 600 }}>× {count}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TAB: TREINOS PRONTOS (NOVO) ─────────────────────────────────────────
// Modelos de treino reutilizáveis: o coach monta uma vez e aplica a
// qualquer aluno (cria um novo treino na conta dele) sem precisar recriar
// os exercícios do zero. Também alimentado pelo botão "Salvar como modelo"
// dentro da aba Treinos (copia um treino existente de um aluno para cá).
function TabTreinosProntos({ users, studentsData, updateStudentWorkouts, workoutTemplates, addWorkoutTemplate, updateWorkoutTemplate, deleteWorkoutTemplate, exerciseLibrary, toast, confirm }) {
  const students = users.filter(u => u.role === "student");

  const [activeTemplateId, setActiveTemplateId] = useState(null);
  const [editingMeta,      setEditingMeta]      = useState(null);
  const [addingExercise,   setAddingExercise]   = useState(false);
  const [editingExercise,  setEditingExercise]  = useState(null);
  const [dragIndex,        setDragIndex]        = useState(null);
  const [dragOverIndex,    setDragOverIndex]    = useState(null);
  const [showNewTemplate,  setShowNewTemplate]  = useState(false);
  const [newTemplateForm,  setNewTemplateForm]  = useState({ name: "", category: WORKOUT_CATEGORIES[0] });
  const [applyingId,       setApplyingId]       = useState(null);
  const [applyStudentId,   setApplyStudentId]   = useState("");
  const [applyDay,         setApplyDay]         = useState("Segunda");

  const DAYS = ["Segunda","Terça","Quarta","Quinta","Sexta","Sábado","Domingo"];
  const color = BLUE;

  const activeTemplate = workoutTemplates.find(t => t.id === activeTemplateId) || null;

  async function handleCreateTemplate() {
    if (!newTemplateForm.name.trim()) { toast("Nome do modelo obrigatório.", "error"); return; }
    const newTemplate = {
      id: `wt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: newTemplateForm.name.trim(), category: newTemplateForm.category, note: "",
      exercises: [], createdAt: new Date().toISOString(),
    };
    try {
      await addWorkoutTemplate(newTemplate);
      setActiveTemplateId(newTemplate.id);
      setShowNewTemplate(false);
      setNewTemplateForm({ name: "", category: WORKOUT_CATEGORIES[0] });
      toast("Modelo criado!");
    } catch (e) {
      toast("Erro ao criar modelo.", "error");
    }
  }

  async function handleSaveMeta() {
    if (!editingMeta || !activeTemplate) return;
    try {
      await updateWorkoutTemplate({ ...activeTemplate, name: editingMeta.name, category: editingMeta.category });
      setEditingMeta(null);
      toast("Modelo atualizado!");
    } catch (e) {
      toast("Erro ao atualizar modelo.", "error");
    }
  }

  async function handleDeleteTemplate(id) {
    const ok = await confirm("Remover este modelo? Treinos já aplicados a alunos não serão afetados.", { title: "Remover modelo" });
    if (!ok) return;
    try {
      await deleteWorkoutTemplate(id);
      if (activeTemplateId === id) setActiveTemplateId(null);
      toast("Modelo removido.", "info");
    } catch (e) {
      toast("Erro ao remover modelo.", "error");
    }
  }

  async function handleDuplicateTemplate(t) {
    const dup = {
      ...t, id: `wt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, name: `${t.name} (cópia)`,
      exercises: (t.exercises || []).map(e => ({ ...e, id: `ex_${Date.now()}_${Math.random().toString(36).slice(2, 6)}` })),
      createdAt: new Date().toISOString(),
    };
    try {
      await addWorkoutTemplate(dup);
      toast("Modelo duplicado!");
    } catch (e) {
      toast("Erro ao duplicar modelo.", "error");
    }
  }

  async function handleSaveExercise(ex) {
    if (!activeTemplate) return;
    const existsIdx = activeTemplate.exercises.findIndex(e => e.id === ex.id);
    const exercises = existsIdx >= 0
      ? activeTemplate.exercises.map((e, i) => i === existsIdx ? ex : e)
      : [...activeTemplate.exercises, ex];
    try {
      await updateWorkoutTemplate({ ...activeTemplate, exercises });
      setAddingExercise(false);
      setEditingExercise(null);
      toast(existsIdx >= 0 ? "Exercício atualizado!" : "Exercício adicionado!");
    } catch (e) {
      toast("Erro ao salvar exercício.", "error");
    }
  }

  async function handleDeleteExercise(exId) {
    if (!activeTemplate) return;
    const ok = await confirm("Remover exercício do modelo?", { title: "Remover exercício" });
    if (!ok) return;
    try {
      await updateWorkoutTemplate({ ...activeTemplate, exercises: activeTemplate.exercises.filter(e => e.id !== exId) });
      toast("Exercício removido.", "info");
    } catch (e) {
      toast("Erro ao remover exercício.", "error");
    }
  }

  async function handleReorderExercise(fromIndex, toIndex) {
    if (!activeTemplate || fromIndex === toIndex) return;
    const exercises = [...activeTemplate.exercises];
    const [moved] = exercises.splice(fromIndex, 1);
    exercises.splice(toIndex, 0, moved);
    try {
      await updateWorkoutTemplate({ ...activeTemplate, exercises });
    } catch (e) {
      toast("Erro ao reordenar exercícios.", "error");
    }
  }

  function handleApplyToStudent(template) {
    if (!applyStudentId) { toast("Selecione um aluno.", "error"); return; }
    const studentId = Number(applyStudentId);
    const workouts  = studentsData[studentId]?.workouts || [];
    const newId = Math.max(0, ...workouts.map(w => w.id), 0) + 1;
    const newWorkout = {
      id: newId, name: template.name, day: applyDay,
      totalEstimatedTime: (template.exercises || []).reduce((s, e) => s + Number(e.estimatedTime || 0), 0),
      exercises: (template.exercises || []).map(e => ({ ...e, id: `ex_${Date.now()}_${Math.random().toString(36).slice(2, 6)}` })),
    };
    updateStudentWorkouts(studentId, [...workouts, newWorkout]);
    const student = users.find(u => u.id === studentId);
    toast(`"${template.name}" adicionado ao treino de ${student?.name}!`);
    setApplyingId(null);
    setApplyStudentId("");
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div style={{ fontSize: 13, color: MUTED }}>{workoutTemplates.length} modelo(s) de treino cadastrados</div>
        <Btn size="sm" icon={Plus} onClick={() => setShowNewTemplate(v => !v)}>
          {showNewTemplate ? "Cancelar" : "Novo Modelo"}
        </Btn>
      </div>

      <AnimatePresence>
        {showNewTemplate && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden" }}>
            <div className="card" style={{ marginBottom: 14, background: `${N}06`, borderColor: `${N}33` }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: N }}>Novo Modelo</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, marginBottom: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 5 }}>Nome</label>
                  <input value={newTemplateForm.name} onChange={e => setNewTemplateForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Ex: Full Body Iniciante"
                    style={{ background: CARD_BG2, border: `1px solid ${BORDER}`, color: "#f0f0f0", borderRadius: 8, padding: "9px 12px", fontSize: 13, outline: "none", width: "100%" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 5 }}>Categoria</label>
                  <select value={newTemplateForm.category} onChange={e => setNewTemplateForm(p => ({ ...p, category: e.target.value }))}
                    style={{ background: CARD_BG2, border: `1px solid ${BORDER}`, color: "#f0f0f0", borderRadius: 8, padding: "9px 12px", fontSize: 13, outline: "none", cursor: "pointer" }}>
                    {WORKOUT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn icon={Plus} onClick={handleCreateTemplate} style={{ flex: 1, justifyContent: "center" }}>Criar</Btn>
                <Btn variant="secondary" onClick={() => setShowNewTemplate(false)} style={{ justifyContent: "center", padding: "12px 16px" }}>Cancelar</Btn>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {workoutTemplates.length === 0 && !showNewTemplate && (
        <div className="card" style={{ textAlign: "center", padding: 40 }}>
          <Layers size={32} style={{ color: MUTED, margin: "0 auto 12px" }} />
          <p style={{ color: MUTED }}>Nenhum modelo de treino ainda.<br />Crie o primeiro acima ou salve um treino existente na aba Treinos (ícone ⭐).</p>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: activeTemplateId ? "260px 1fr" : "1fr", gap: 14 }}>
        <div>
          {workoutTemplates.map(t => {
            const isActive = activeTemplateId === t.id;
            return (
              <motion.div key={t.id} layout
                onClick={() => { setActiveTemplateId(isActive ? null : t.id); setApplyingId(null); }}
                style={{
                  padding: "12px 14px", borderRadius: 12, marginBottom: 8, cursor: "pointer",
                  background: isActive ? `${color}12` : CARD_BG,
                  border: `1px solid ${isActive ? color + "44" : BORDER}`,
                  borderLeft: `4px solid ${color}`, transition: "all .2s",
                }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 2 }}>{t.category}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: MUTED, marginTop: 3 }}>{(t.exercises || []).length} exerc.</div>
                  </div>
                  <div style={{ display: "flex", gap: 4, flexShrink: 0, marginLeft: 8 }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => handleDuplicateTemplate(t)} title="Duplicar"
                      style={{ background: "none", border: "none", color: MUTED, cursor: "pointer", padding: 4 }}>
                      <Copy size={13} />
                    </button>
                    <button onClick={() => handleDeleteTemplate(t.id)} title="Remover"
                      style={{ background: "none", border: "none", color: DANGER, cursor: "pointer", padding: 4 }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <div onClick={e => e.stopPropagation()} style={{ marginTop: 10 }}>
                  {applyingId === t.id ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <select value={applyStudentId} onChange={e => setApplyStudentId(e.target.value)}
                        style={{ background: CARD_BG2, border: `1px solid ${BORDER}`, color: "#f0f0f0", borderRadius: 8, padding: "7px 10px", fontSize: 12, outline: "none", cursor: "pointer" }}>
                        <option value="">Selecione um aluno...</option>
                        {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                      <select value={applyDay} onChange={e => setApplyDay(e.target.value)}
                        style={{ background: CARD_BG2, border: `1px solid ${BORDER}`, color: "#f0f0f0", borderRadius: 8, padding: "7px 10px", fontSize: 12, outline: "none", cursor: "pointer" }}>
                        {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <div style={{ display: "flex", gap: 6 }}>
                        <Btn size="sm" icon={Check} onClick={() => handleApplyToStudent(t)} style={{ flex: 1, justifyContent: "center" }}>Confirmar</Btn>
                        <Btn size="sm" variant="secondary" onClick={() => setApplyingId(null)} style={{ justifyContent: "center" }}>Cancelar</Btn>
                      </div>
                    </div>
                  ) : (
                    <Btn size="sm" icon={UserPlus} onClick={() => { setApplyingId(t.id); setApplyStudentId(""); setApplyDay(DAYS[0]); }} style={{ width: "100%", justifyContent: "center" }}>
                      Aplicar a Aluno
                    </Btn>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {activeTemplate && (
          <motion.div key={activeTemplateId} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
            <div className="card" style={{ marginBottom: 14, borderColor: `${color}33`, background: `${color}06` }}>
              {editingMeta ? (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, marginBottom: 12 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 5 }}>Nome</label>
                      <input value={editingMeta.name} onChange={e => setEditingMeta(p => ({ ...p, name: e.target.value }))}
                        style={{ background: CARD_BG2, border: `1px solid ${BORDER}`, color: "#f0f0f0", borderRadius: 8, padding: "9px 12px", fontSize: 13, outline: "none", width: "100%" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 5 }}>Categoria</label>
                      <select value={editingMeta.category} onChange={e => setEditingMeta(p => ({ ...p, category: e.target.value }))}
                        style={{ background: CARD_BG2, border: `1px solid ${BORDER}`, color: "#f0f0f0", borderRadius: 8, padding: "9px 12px", fontSize: 13, outline: "none", cursor: "pointer" }}>
                        {WORKOUT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn icon={Save} onClick={handleSaveMeta} style={{ justifyContent: "center" }}>Salvar</Btn>
                    <Btn variant="secondary" onClick={() => setEditingMeta(null)} style={{ justifyContent: "center", padding: "12px 16px" }}>Cancelar</Btn>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 11, color, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 }}>{activeTemplate.category}</div>
                    <div className="display" style={{ fontSize: 16, marginBottom: 4 }}>{activeTemplate.name}</div>
                    <div style={{ fontSize: 12, color: MUTED }}>{(activeTemplate.exercises || []).length} exercício(s)</div>
                  </div>
                  <button onClick={() => setEditingMeta({ name: activeTemplate.name, category: activeTemplate.category })}
                    style={{ background: CARD_BG2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "8px 12px", color: MUTED2, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                    <Edit2 size={13} /> Editar
                  </button>
                </div>
              )}
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>
                  Exercícios <span style={{ fontSize: 11, color: MUTED, fontWeight: 400 }}>({(activeTemplate.exercises || []).length})</span>
                </div>
                <Btn size="sm" icon={Plus} onClick={() => { setAddingExercise(true); setEditingExercise(null); }}>
                  Adicionar
                </Btn>
              </div>

              <AnimatePresence>
                {addingExercise && !editingExercise && (
                  <ExerciseEditor
                    exercise={BLANK_EXERCISE()}
                    accent={color}
                    exerciseLibrary={exerciseLibrary}
                    onSave={handleSaveExercise}
                    onCancel={() => setAddingExercise(false)}
                  />
                )}
              </AnimatePresence>

              {(activeTemplate.exercises || []).length === 0 && !addingExercise && (
                <div className="card" style={{ textAlign: "center", padding: 28, color: MUTED }}>
                  <Dumbbell size={24} style={{ margin: "0 auto 8px" }} />
                  <div style={{ fontSize: 12 }}>Nenhum exercício ainda.<br />Clique em "Adicionar" para buscar da biblioteca.</div>
                </div>
              )}

              {(activeTemplate.exercises || []).map((ex, idx) => (
                <div key={ex.id}>
                  {editingExercise?.id === ex.id ? (
                    <ExerciseEditor
                      exercise={editingExercise}
                      accent={color}
                      exerciseLibrary={exerciseLibrary}
                      onSave={handleSaveExercise}
                      onCancel={() => setEditingExercise(null)}
                    />
                  ) : (
                    <ExerciseCard
                      exercise={ex} index={idx} accent={color}
                      onEdit={e => { setEditingExercise(e); setAddingExercise(false); }}
                      onDelete={handleDeleteExercise}
                      onDragStart={setDragIndex}
                      onDragEnter={(i) => { if (i !== dragOverIndex) setDragOverIndex(i); }}
                      onDrop={(i) => {
                        if (dragIndex !== null) handleReorderExercise(dragIndex, i);
                        setDragIndex(null);
                        setDragOverIndex(null);
                      }}
                      onDragEnd={() => { setDragIndex(null); setDragOverIndex(null); }}
                      isDragging={dragIndex === idx}
                      isDragOver={dragOverIndex === idx && dragIndex !== idx}
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── TAB: BIBLIOTECA DE EXERCÍCIOS (NOVO) ────────────────────────────────
// ── NOVO: aba completa de CRUD da biblioteca global de exercícios ──

const BLANK_TEMPLATE = (): ExerciseTemplate => ({
  id: `lib_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
  name: "",
  muscleGroup: "Peito",
  equipment: "Barra",
  videoUrl: "",
  defaultSets: "3",
  defaultReps: "12",
  defaultLoad: "",
  note: "",
  createdAt: new Date().toISOString(),
});

// Cores por grupo muscular
const MUSCLE_COLOR: Record<string, string> = {
  "Peito":       "#3B82F6",
  "Costas":      "#8B5CF6",
  "Ombro":       "#F59E0B",
  "Bíceps":      "#10B981",
  "Tríceps":     "#14B8A6",
  "Pernas":      "#EF4444",
  "Glúteos":     "#EC4899",
  "Panturrilha": "#6366F1",
  "Abdômen":     "#F97316",
  "Outro":       "#6B7280",
};

function TemplateForm({ initial, onSave, onCancel, existingNames = [] }: {
  initial: ExerciseTemplate;
  onSave: (t: ExerciseTemplate) => void;
  onCancel: () => void;
  existingNames?: string[];
}) {
  const [form, setForm] = useState<ExerciseTemplate>({ ...initial });
  const [error, setError] = useState("");

  function f(key: string) {
    return (e: any) => setForm(p => ({ ...p, [key]: e.target.value }));
  }

  function handleSave() {
    if (!form.name.trim()) { setError("Nome é obrigatório."); return; }
    if (existingNames.includes(form.name.trim().toLowerCase()) &&
        form.name.trim().toLowerCase() !== initial.name.trim().toLowerCase()) {
      setError("Já existe um exercício com este nome."); return;
    }
    onSave({ ...form, name: form.name.trim() });
  }

  const inputStyle = {
    background: CARD_BG2, border: `1px solid ${BORDER}`, color: "#f0f0f0",
    borderRadius: 8, padding: "9px 12px", fontSize: 13, outline: "none",
    fontFamily: "'DM Sans', sans-serif", width: "100%",
  };
  const labelStyle = {
    display: "block", fontSize: 10, fontWeight: 700, color: MUTED,
    textTransform: "uppercase" as const, letterSpacing: ".06em", marginBottom: 5,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Nome */}
      <div>
        <label style={labelStyle}>Nome do Exercício *</label>
        <input value={form.name} onChange={f("name")} placeholder="Ex: Supino Inclinado com Halter"
          style={{ ...inputStyle, borderColor: error && !form.name.trim() ? `${DANGER}66` : BORDER }} />
        {error && <div style={{ fontSize: 12, color: DANGER, marginTop: 4 }}>{error}</div>}
      </div>

      {/* Grupo Muscular / Equipamento */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={labelStyle}>Grupo Muscular</label>
          <select value={form.muscleGroup} onChange={f("muscleGroup")} style={{ ...inputStyle, cursor: "pointer" }}>
            {MUSCLE_GROUPS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Equipamento</label>
          <select value={form.equipment} onChange={f("equipment")} style={{ ...inputStyle, cursor: "pointer" }}>
            {EQUIPMENT_OPTIONS.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
      </div>

      {/* Padrões */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <div>
          <label style={labelStyle}>Séries padrão</label>
          <input type="number" min="1" max="20" value={form.defaultSets} onChange={f("defaultSets")} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Reps padrão</label>
          <input value={form.defaultReps} onChange={f("defaultReps")} placeholder="12 ou 8-12" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Carga padrão</label>
          <input value={form.defaultLoad} onChange={f("defaultLoad")} placeholder="70kg / PC" style={inputStyle} />
        </div>
      </div>

      {/* Observação */}
      <div>
        <label style={labelStyle}>Observação / Dica de execução</label>
        <textarea rows={2} value={form.note} onChange={f("note")}
          placeholder="Ex: Escápulas retraídas, amplitude máxima..."
          style={{ ...inputStyle, resize: "vertical" }} />
      </div>

      {/* URL do vídeo */}
      <div>
        <label style={labelStyle}><span style={{ display: "flex", alignItems: "center", gap: 5 }}><Video size={11} /> Vídeo demonstrativo (URL YouTube)</span></label>
        <input value={form.videoUrl} onChange={f("videoUrl")} placeholder="https://youtube.com/watch?v=..." style={inputStyle} />
        {form.videoUrl && (
          <a href={form.videoUrl} target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: BLUE, marginTop: 6 }}>
            <Link size={11} /> Abrir vídeo
          </a>
        )}
      </div>

      {/* Preview chip */}
      <div style={{ padding: "10px 12px", background: `${MUSCLE_COLOR[form.muscleGroup] || MUTED}10`, border: `1px solid ${MUSCLE_COLOR[form.muscleGroup] || MUTED}30`, borderRadius: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: MUSCLE_COLOR[form.muscleGroup] || MUTED, fontWeight: 700 }}>{form.muscleGroup}</span>
        <span style={{ fontSize: 11, color: MUTED }}>·</span>
        <span style={{ fontSize: 11, color: MUTED2 }}>{form.equipment}</span>
        <span style={{ fontSize: 11, color: MUTED }}>·</span>
        <span style={{ fontSize: 11, color: N }}>{form.defaultSets}×{form.defaultReps} @ {form.defaultLoad || "—"}</span>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <Btn onClick={handleSave} icon={Save} style={{ flex: 1, justifyContent: "center" }}>Salvar na Biblioteca</Btn>
        <Btn variant="secondary" onClick={onCancel} style={{ justifyContent: "center", padding: "12px 16px" }}>Cancelar</Btn>
      </div>
    </div>
  );
}

function TabBiblioteca({ exerciseLibrary, addExerciseTemplate, updateExerciseTemplate, deleteExerciseTemplate, toast, confirm }) {
  const [search,          setSearch]          = useState("");
  const [filterMuscle,    setFilterMuscle]    = useState("all");
  const [filterEquipment, setFilterEquipment] = useState("all");
  const [showForm,        setShowForm]        = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ExerciseTemplate | null>(null);
  const [viewMode,        setViewMode]        = useState<"grid" | "table">("grid");

  // Filtros
  const filtered = exerciseLibrary.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase());
    const matchMuscle = filterMuscle === "all" || t.muscleGroup === filterMuscle;
    const matchEquip  = filterEquipment === "all" || t.equipment === filterEquipment;
    return matchSearch && matchMuscle && matchEquip;
  });

  // Contagem por grupo muscular
  const groupCounts: Record<string, number> = {};
  exerciseLibrary.forEach(t => { groupCounts[t.muscleGroup] = (groupCounts[t.muscleGroup] || 0) + 1; });

  // Nomes existentes para validação de duplicatas
  const existingNames = exerciseLibrary.map(t => t.name.toLowerCase());

  async function handleSaveNew(template: ExerciseTemplate) {
    try {
      await addExerciseTemplate(template);
      setShowForm(false);
      toast(`"${template.name}" adicionado à biblioteca!`);
    } catch (e) {
      toast("Erro ao salvar exercício.", "error");
    }
  }

  async function handleSaveEdit(template: ExerciseTemplate) {
    try {
      await updateExerciseTemplate(template);
      setEditingTemplate(null);
      toast(`"${template.name}" atualizado!`);
    } catch (e) {
      toast("Erro ao atualizar exercício.", "error");
    }
  }

  async function handleDelete(template: ExerciseTemplate) {
    const ok = await confirm(`Remover "${template.name}" da biblioteca? Os treinos existentes que referenciam este exercício não serão afetados.`, { title: "Remover exercício da biblioteca" });
    if (!ok) return;
    try {
      await deleteExerciseTemplate(template.id);
      toast(`"${template.name}" removido.`, "info");
    } catch (e) {
      toast("Erro ao remover exercício.", "error");
    }
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(exerciseLibrary, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "biblioteca-exercicios.json"; a.click();
    toast("JSON exportado!");
  }

  return (
    <div>
      {/* Header com stats */}
      <div className="kpi-grid" style={{ marginBottom: 16 }}>
        <KpiCard icon={BookOpen}  label="Total de Exercícios" value={exerciseLibrary.length} delta="na biblioteca global" />
        <KpiCard icon={Tag}       label="Grupos Musculares"   value={Object.keys(groupCounts).length} delta="categorias cobertas" color={AMBER} />
        <KpiCard icon={Dumbbell}  label="Com Equipamento"     value={exerciseLibrary.filter(t => t.equipment !== "Peso Corporal").length} delta="requerem equipamento" color={BLUE} />
        <KpiCard icon={Video}     label="Com Vídeo"           value={exerciseLibrary.filter(t => !!t.videoUrl).length} delta="exercícios com demo" color={TEAL} />
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 10, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", flex: 1, minWidth: 0 }}>
          {/* Busca */}
          <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: MUTED, pointerEvents: "none" }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar exercício..."
              style={{ background: CARD_BG, border: `1px solid ${BORDER}`, color: "#f0f0f0", borderRadius: 10, padding: "9px 12px 9px 32px", fontSize: 13, outline: "none", width: "100%" }} />
          </div>

          {/* Filtro grupo muscular */}
          <select value={filterMuscle} onChange={e => setFilterMuscle(e.target.value)}
            style={{ background: CARD_BG, border: `1px solid ${BORDER}`, color: "#f0f0f0", borderRadius: 10, padding: "9px 12px", fontSize: 13, cursor: "pointer", outline: "none" }}>
            <option value="all">Todos os grupos</option>
            {MUSCLE_GROUPS.map(m => <option key={m} value={m}>{m} ({groupCounts[m] || 0})</option>)}
          </select>

          {/* Filtro equipamento */}
          <select value={filterEquipment} onChange={e => setFilterEquipment(e.target.value)}
            style={{ background: CARD_BG, border: `1px solid ${BORDER}`, color: "#f0f0f0", borderRadius: 10, padding: "9px 12px", fontSize: 13, cursor: "pointer", outline: "none" }}>
            <option value="all">Todos os equipamentos</option>
            {EQUIPMENT_OPTIONS.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>

        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          {/* Toggle view */}
          <div style={{ display: "flex", gap: 2, background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 4 }}>
            <button onClick={() => setViewMode("grid")}
              style={{ width: 34, height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, border: "none", background: viewMode === "grid" ? `${N}18` : "transparent", color: viewMode === "grid" ? N : MUTED, cursor: "pointer" }}>
              <Layers size={14} />
            </button>
            <button onClick={() => setViewMode("table")}
              style={{ width: 34, height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, border: "none", background: viewMode === "table" ? `${N}18` : "transparent", color: viewMode === "table" ? N : MUTED, cursor: "pointer" }}>
              <FileText size={14} />
            </button>
          </div>
          <Btn variant="secondary" size="sm" icon={Download} onClick={exportJSON}>JSON</Btn>
          <Btn size="sm" icon={Plus} onClick={() => { setShowForm(true); setEditingTemplate(null); }}>Novo Exercício</Btn>
        </div>
      </div>

      {/* Formulário de novo exercício */}
      <AnimatePresence>
        {showForm && !editingTemplate && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden" }}>
            <div className="card" style={{ marginBottom: 16, background: `${N}06`, borderColor: `${N}33` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: N, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <BookOpen size={16} /> Novo Exercício na Biblioteca
              </div>
              <TemplateForm
                initial={BLANK_TEMPLATE()}
                onSave={handleSaveNew}
                onCancel={() => setShowForm(false)}
                existingNames={existingNames}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de edição */}
      <Modal open={!!editingTemplate} onClose={() => setEditingTemplate(null)} title="Editar Exercício" width={540}>
        {editingTemplate && (
          <TemplateForm
            initial={editingTemplate}
            onSave={handleSaveEdit}
            onCancel={() => setEditingTemplate(null)}
            existingNames={existingNames}
          />
        )}
      </Modal>

      {/* Info de filtro */}
      {(search || filterMuscle !== "all" || filterEquipment !== "all") && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 12, color: MUTED }}>{filtered.length} resultado(s)</span>
          <button onClick={() => { setSearch(""); setFilterMuscle("all"); setFilterEquipment("all"); }}
            style={{ background: "none", border: "none", color: BLUE, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            <RotateCcw size={11} /> Limpar filtros
          </button>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="card" style={{ textAlign: "center", padding: 48, color: MUTED }}>
          <BookOpen size={36} style={{ margin: "0 auto 12px", color: MUTED }} />
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
            {exerciseLibrary.length === 0 ? "Biblioteca vazia" : "Nenhum exercício encontrado"}
          </div>
          <div style={{ fontSize: 12 }}>
            {exerciseLibrary.length === 0
              ? "Cadastre o primeiro exercício clicando em \"Novo Exercício\"."
              : "Tente ajustar os filtros ou a busca."}
          </div>
        </div>
      )}

      {/* ── VISUALIZAÇÃO EM GRADE */}
      {viewMode === "grid" && filtered.length > 0 && (
        <div>
          {/* Agrupa por grupo muscular */}
          {MUSCLE_GROUPS.filter(g => filtered.some(t => t.muscleGroup === g)).map(group => {
            const groupItems = filtered.filter(t => t.muscleGroup === group);
            const color = MUSCLE_COLOR[group] || MUTED;
            return (
              <div key={group} style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: ".08em" }}>{group}</span>
                  <span style={{ fontSize: 11, color: MUTED }}>({groupItems.length})</span>
                </div>
                <div className="lib-grid">
                  {groupItems.map(template => (
                    <motion.div key={template.id} layout className="lib-card">
                      {/* Cabeçalho colorido */}
                      <div style={{ height: 4, background: color }} />
                      <div style={{ padding: "12px 14px" }}>
                        {/* Nome + ações */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3, flex: 1 }}>{template.name}</div>
                          <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                            <button onClick={() => setEditingTemplate(template)}
                              style={{ background: CARD_BG2, border: `1px solid ${BORDER}`, borderRadius: 7, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", color: MUTED2, cursor: "pointer" }}>
                              <Edit2 size={12} />
                            </button>
                            <button onClick={() => handleDelete(template)}
                              style={{ background: `${DANGER}12`, border: `1px solid ${DANGER}33`, borderRadius: 7, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", color: DANGER, cursor: "pointer" }}>
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>

                        {/* Chips */}
                        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 8 }}>
                          <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: `${color}18`, color }}>
                            {template.muscleGroup}
                          </span>
                          <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 600, background: CARD_BG2, color: MUTED }}>
                            {template.equipment}
                          </span>
                          {template.videoUrl && (
                            <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 600, background: `${BLUE}12`, color: BLUE }}>
                              <Play size={9} /> Vídeo
                            </span>
                          )}
                        </div>

                        {/* Padrões */}
                        <div style={{ display: "flex", gap: 12, marginBottom: template.note ? 8 : 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: N }}>{template.defaultSets}× {template.defaultReps}</div>
                          {template.defaultLoad && <div style={{ fontSize: 12, color: MUTED2 }}>@ {template.defaultLoad}</div>}
                        </div>

                        {/* Nota */}
                        {template.note && (
                          <div style={{ fontSize: 11, color: MUTED, fontStyle: "italic", lineHeight: 1.4 }}>
                            💡 {template.note}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── VISUALIZAÇÃO EM TABELA */}
      {viewMode === "table" && filtered.length > 0 && (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Exercício</th>
                  <th>Grupo</th>
                  <th>Equipamento</th>
                  <th>Séries</th>
                  <th>Reps</th>
                  <th>Carga</th>
                  <th>Vídeo</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => {
                  const color = MUSCLE_COLOR[t.muscleGroup] || MUTED;
                  return (
                    <tr key={t.id}>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{t.name}</div>
                        {t.note && <div style={{ fontSize: 11, color: MUTED, marginTop: 2, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.note}</div>}
                      </td>
                      <td>
                        <span style={{ padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700, background: `${color}18`, color }}>{t.muscleGroup}</span>
                      </td>
                      <td style={{ fontSize: 12, color: MUTED2 }}>{t.equipment}</td>
                      <td style={{ fontSize: 12, fontWeight: 700, color: N }}>{t.defaultSets}</td>
                      <td style={{ fontSize: 12, color: MUTED2 }}>{t.defaultReps}</td>
                      <td style={{ fontSize: 12, color: MUTED2 }}>{t.defaultLoad || "—"}</td>
                      <td>
                        {t.videoUrl
                          ? <a href={t.videoUrl} target="_blank" rel="noopener noreferrer" style={{ color: BLUE, display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}><Play size={11} /> Ver</a>
                          : <span style={{ color: MUTED, fontSize: 11 }}>—</span>
                        }
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => setEditingTemplate(t)}
                            style={{ background: CARD_BG2, border: `1px solid ${BORDER}`, borderRadius: 7, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", color: MUTED2, cursor: "pointer" }}>
                            <Edit2 size={12} />
                          </button>
                          <button onClick={() => handleDelete(t)}
                            style={{ background: `${DANGER}12`, border: `1px solid ${DANGER}33`, borderRadius: 7, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", color: DANGER, cursor: "pointer" }}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── HELPERS DE RELATÓRIO ─────────────────────────────────────────────────
// Datas de sessão são salvas como "YYYY-MM-DD" (sem horário). `new Date("YYYY-MM-DD")`
// interpreta isso como meia-noite UTC, então em fusos atrás de UTC (ex: Brasil) o dia
// exibido acaba voltando um dia. Construímos a data em horário local para evitar isso.
function parseLocalDate(dateStr) {
  if (typeof dateStr === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(dateStr);
}

function buildAttendanceCalendar(sessions) {
  const map = {};
  (sessions || []).forEach(s => { if (s.date) map[s.date] = true; });
  return map;
}

function getMonthDays(year, month) {
  const days = [];
  const firstDay = new Date(year, month, 1).getDay();
  const total = new Date(year, month + 1, 0).getDate();
  const offset = (firstDay + 6) % 7;
  for (let i = 0; i < offset; i++) days.push(null);
  for (let d = 1; d <= total; d++) days.push(d);
  return days;
}

function isoDate(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function AttendanceCalendar({ sessions, accent = N }) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const attendanceMap = buildAttendanceCalendar(sessions);
  const days = getMonthDays(viewYear, viewMonth);
  const WEEK_LABELS = ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"];
  const MONTH_NAMES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

  function prevMonth() { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); }
  function nextMonth() { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); }

  const presentCount = days.filter(d => d && attendanceMap[isoDate(viewYear, viewMonth, d)]).length;
  const totalDays    = days.filter(Boolean).length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <button onClick={prevMonth} style={{ background: CARD_BG2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "6px 10px", color: MUTED2, cursor: "pointer" }}>‹</button>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{MONTH_NAMES[viewMonth]} {viewYear}</div>
        <button onClick={nextMonth} style={{ background: CARD_BG2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "6px 10px", color: MUTED2, cursor: "pointer" }}>›</button>
      </div>
      <div className="calendar-grid" style={{ marginBottom: 4 }}>
        {WEEK_LABELS.map(l => (
          <div key={l} style={{ textAlign: "center", fontSize: 9, fontWeight: 700, color: MUTED, textTransform: "uppercase", padding: "2px 0" }}>{l}</div>
        ))}
      </div>
      <div className="calendar-grid">
        {days.map((d, i) => {
          if (!d) return <div key={`blank-${i}`} />;
          const dateStr = isoDate(viewYear, viewMonth, d);
          const isPresent = !!attendanceMap[dateStr];
          const isToday   = dateStr === isoDate(today.getFullYear(), today.getMonth(), today.getDate());
          return (
            <div key={d} style={{
              aspectRatio: "1", borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: isPresent ? 700 : 400,
              background: isPresent ? `${accent}22` : "transparent",
              border: `1px solid ${isToday ? accent : isPresent ? accent + "44" : BORDER}`,
              color: isPresent ? accent : isToday ? accent : MUTED,
            }}>{d}</div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 12, justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}>
          <div style={{ width: 10, height: 10, borderRadius: 3, background: `${accent}22`, border: `1px solid ${accent}44` }} />
          <span style={{ color: accent, fontWeight: 700 }}>{presentCount} presentes</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}>
          <div style={{ width: 10, height: 10, borderRadius: 3, background: "transparent", border: `1px solid ${BORDER}` }} />
          <span style={{ color: MUTED }}>{totalDays - presentCount} ausentes</span>
        </div>
      </div>
    </div>
  );
}

function SessionDetailModal({ session, onClose, accent = N }) {
  if (!session) return null;
  const exercises = session.exercises || [];
  return (
    <Modal open={!!session} onClose={onClose} title="Detalhes da Sessão" width={560}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        {[
          { label: "Data",        value: parseLocalDate(session.date).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" }) },
          { label: "Treino",      value: session.workoutName },
          { label: "Duração",     value: `${session.duration} min` },
          { label: "Energia",     value: `${session.energyLevel}/10` },
          { label: "Fadiga",      value: `${session.fatigueLevel}/10` },
          { label: "Concluído",   value: session.completed ? "Sim" : "Incompleto" },
          { label: "Metas batidas",  value: session.metasBatidas || 0 },
          { label: "Não atingidas",  value: session.metasNaoAtingidas || 0 },
        ].map(item => (
          <div key={item.label} style={{ padding: "10px 12px", background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 10 }}>
            <div style={{ fontSize: 10, color: MUTED, textTransform: "uppercase", marginBottom: 3 }}>{item.label}</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{item.value}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10 }}>Exercícios realizados</div>
      {exercises.length === 0 && <div style={{ color: MUTED, fontSize: 12, marginBottom: 12 }}>Sem detalhe de exercícios registrado.</div>}
      {exercises.map((ex, i) => (
        <div key={i} style={{ padding: "10px 12px", background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 10, marginBottom: 8 }}>
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{ex.exerciseName}</div>
          <div style={{ display: "flex", gap: 16, fontSize: 12, color: MUTED2, flexWrap: "wrap" }}>
            <span>{ex.actualSets} séries × {ex.actualReps} reps</span>
            <span>@ {ex.actualWeight > 0 ? `${ex.actualWeight}kg` : "Peso corporal"}</span>
            <span style={{ color: AMBER }}>RPE {ex.rpe}</span>
            <span>Descanso: {ex.restTime}s</span>
          </div>
          {ex.notes && <div style={{ fontSize: 11, color: accent, marginTop: 4 }}>💬 {ex.notes}</div>}
        </div>
      ))}
      {session.generalNotes && (
        <div style={{ marginTop: 12, padding: "12px 14px", background: `${accent}08`, border: `1px solid ${accent}22`, borderRadius: 10 }}>
          <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>Observações gerais</div>
          <div style={{ fontSize: 13 }}>{session.generalNotes}</div>
        </div>
      )}
    </Modal>
  );
}

// ─── TAB: RELATÓRIOS ──────────────────────────────────────────────────────
function TabRelatorios({ users, studentsData, toast }) {
  const students = users.filter(u => u.role === "student");
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || null);
  const [viewMode,          setViewMode]          = useState("overview");
  const [selectedSession,   setSelectedSession]   = useState(null);
  const [filterMonth,       setFilterMonth]       = useState("all");

  const student = students.find(s => s.id === selectedStudentId);
  const sd      = selectedStudentId ? studentsData[selectedStudentId] : null;
  const allSessions = sd?.workoutSessions || [];
  const filteredSessions = allSessions.filter(s => filterMonth === "all" || s.date?.startsWith(filterMonth));
  const availableMonths = [...new Set(allSessions.map(s => s.date?.slice(0, 7)).filter(Boolean))].sort().reverse();

  const allExercises = filteredSessions.flatMap(s => s.exercises || []);
  const exerciseStats = {};
  allExercises.forEach(ex => {
    if (!exerciseStats[ex.exerciseName]) exerciseStats[ex.exerciseName] = { name: ex.exerciseName, count: 0, totalSets: 0, maxWeight: 0 };
    exerciseStats[ex.exerciseName].count++;
    exerciseStats[ex.exerciseName].totalSets += ex.actualSets || 0;
    if ((ex.actualWeight || 0) > exerciseStats[ex.exerciseName].maxWeight) exerciseStats[ex.exerciseName].maxWeight = ex.actualWeight || 0;
  });
  const exerciseList = Object.values(exerciseStats).sort((a, b) => b.count - a.count);
  const attendanceMap = buildAttendanceCalendar(allSessions);
  const presentDates  = allSessions.map(s => s.date).filter(Boolean);
  const totalCompleted = filteredSessions.filter(s => s.completed).length;
  const totalIncomplete = filteredSessions.filter(s => !s.completed).length;
  const totalMetasBatidas = filteredSessions.reduce((a, s) => a + (s.metasBatidas || 0), 0);
  const totalMetasNao     = filteredSessions.reduce((a, s) => a + (s.metasNaoAtingidas || 0), 0);
  const avgEnergy = filteredSessions.length
    ? (filteredSessions.reduce((a, s) => a + s.energyLevel, 0) / filteredSessions.length).toFixed(1) : "-";
  const energyChartData = [...filteredSessions].reverse().map(s => ({
    date: parseLocalDate(s.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    energia: s.energyLevel, fadiga: s.fatigueLevel,
  }));

  function exportCSV() {
    const rows = [["Nome", "Email", "Objetivo", "Streak", "Treinos/Mês", "Variação (kg)", "Status"]];
    students.forEach(s => {
      const ssd = studentsData[s.id];
      const diff = ssd ? (ssd.currentWeight - ssd.startWeight).toFixed(1) : "0";
      rows.push([s.name, s.email, ssd?.goal || "", String(ssd?.streak || 0), String(ssd?.monthlyWorkouts || 0), diff, s.status]);
    });
    const csv  = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a    = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "relatorio-gc.csv"; a.click();
    toast("Relatório exportado!");
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, gap: 10, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 4, background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 4 }}>
          {[
            { id: "overview",   label: "Visão Geral",  icon: BarChart2 },
            { id: "sessions",   label: "Sessões",       icon: Dumbbell },
            { id: "attendance", label: "Presença",      icon: Calendar },
          ].map(m => (
            <button key={m.id} onClick={() => setViewMode(m.id)} className={`tab-btn${viewMode === m.id ? " active" : ""}`} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <m.icon size={13} /> {m.label}
            </button>
          ))}
        </div>
        <Btn variant="secondary" size="sm" icon={Download} onClick={exportCSV}>Exportar CSV</Btn>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <select value={selectedStudentId || ""} onChange={e => setSelectedStudentId(Number(e.target.value) || null)}
          style={{ background: CARD_BG, border: `1px solid ${BORDER}`, color: "#f0f0f0", borderRadius: 10, padding: "9px 12px", fontSize: 13, cursor: "pointer", outline: "none" }}>
          <option value="">Selecione aluno...</option>
          {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)}
          style={{ background: CARD_BG, border: `1px solid ${BORDER}`, color: "#f0f0f0", borderRadius: 10, padding: "9px 12px", fontSize: 13, cursor: "pointer", outline: "none" }}>
          <option value="all">Todos os meses</option>
          {availableMonths.map(m => {
            const [y, mo] = m.split("-");
            const names = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
            return <option key={m} value={m}>{names[Number(mo) - 1]} {y}</option>;
          })}
        </select>
      </div>

      {!sd && (
        <div className="card" style={{ textAlign: "center", padding: 40, color: MUTED }}>
          <TrendingUp size={32} style={{ margin: "0 auto 12px" }} />
          <div>Selecione um aluno para ver relatórios</div>
        </div>
      )}

      {sd && (
        <>
          {viewMode === "overview" && (
            <div>
              <div className="kpi-grid" style={{ marginBottom: 16 }}>
                <KpiCard icon={Dumbbell}   label="Sessões no período" value={filteredSessions.length} delta={`${totalCompleted} completas, ${totalIncomplete} incompletas`} />
                <KpiCard icon={Check}      label="Metas Batidas"      value={totalMetasBatidas}        delta={`${totalMetasNao} não atingidas`} color={TEAL} />
                <KpiCard icon={Activity}   label="Energia Média"      value={avgEnergy}                delta="escala 1–10"         color={AMBER} />
                <KpiCard icon={Trophy}     label="Streak Atual"       value={`${sd.streak}d`}          delta={`${sd.monthlyWorkouts} treinos/mês`} color={PURPLE} />
              </div>
              <div className="chart-grid" style={{ marginBottom: 14 }}>
                <div className="card">
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Evolução de Peso</div>
                  <div style={{ fontSize: 11, color: MUTED, marginBottom: 12 }}>Histórico semanal — kg</div>
                  {(sd.weightHistory || []).length > 0 ? (
                    <div style={{ height: 180 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sd.weightHistory}>
                          <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
                          <XAxis dataKey="d" stroke="transparent" tick={{ fill: MUTED, fontSize: 10 }} />
                          <YAxis stroke="transparent" tick={{ fill: MUTED, fontSize: 10 }} domain={["auto", "auto"]} />
                          <Tooltip {...CHART_TOOLTIP} formatter={v => [`${v} kg`, "Peso"]} />
                          <Line type="monotone" dataKey="v" stroke={N} strokeWidth={2} dot={{ fill: N, r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: MUTED, fontSize: 12 }}>Sem histórico de peso</div>
                  )}
                </div>
                <div className="card">
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Energia × Fadiga</div>
                  <div style={{ fontSize: 11, color: MUTED, marginBottom: 12 }}>Por sessão de treino</div>
                  {energyChartData.length > 0 ? (
                    <div style={{ height: 180 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={energyChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
                          <XAxis dataKey="date" stroke="transparent" tick={{ fill: MUTED, fontSize: 9 }} />
                          <YAxis stroke="transparent" tick={{ fill: MUTED, fontSize: 10 }} domain={[0, 10]} />
                          <Tooltip {...CHART_TOOLTIP} />
                          <Line type="monotone" dataKey="energia" stroke={N}      strokeWidth={2} dot={{ fill: N,      r: 3 }} name="Energia" />
                          <Line type="monotone" dataKey="fadiga"  stroke={DANGER} strokeWidth={2} dot={{ fill: DANGER, r: 3 }} name="Fadiga"  />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: MUTED, fontSize: 12 }}>Sem sessões no período</div>
                  )}
                </div>
              </div>
              <div className="card" style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Exercícios Mais Realizados</div>
                {exerciseList.length === 0 && <div style={{ color: MUTED, fontSize: 12, textAlign: "center", padding: 16 }}>Sem dados</div>}
                {exerciseList.slice(0, 8).map((ex, i) => (
                  <div key={ex.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: i < exerciseList.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: `${N}18`, color: N, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{ex.name}</div>
                      <div style={{ fontSize: 11, color: MUTED }}>{ex.count}× realizado · {ex.totalSets} séries totais{ex.maxWeight > 0 && ` · Máx: ${ex.maxWeight}kg`}</div>
                    </div>
                    <ProgressBar value={ex.count} max={Math.max(...exerciseList.map(e => e.count), 1)} />
                  </div>
                ))}
              </div>
              <div className="card">
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Desempenho Detalhado — Todos os Alunos</div>
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Aluno</th><th>Objetivo</th><th>Semanas</th><th>Streak</th><th>Treinos</th><th>Variação</th><th>Sessões</th><th>Status</th></tr></thead>
                    <tbody>
                      {students.map(s => {
                        const ssd = studentsData[s.id];
                        if (!ssd) return null;
                        const diff = (ssd.currentWeight - ssd.startWeight).toFixed(1);
                        const sessions = ssd.workoutSessions?.length || 0;
                        return (
                          <tr key={s.id}>
                            <td><div style={{ display: "flex", alignItems: "center", gap: 8 }}><Avatar initials={s.avatar} size={26} /><span style={{ whiteSpace: "nowrap" }}>{s.name}</span></div></td>
                            <td style={{ whiteSpace: "nowrap" }}>{ssd.goal}</td>
                            <td style={{ textAlign: "center" }}>{ssd.weeks}s.</td>
                            <td style={{ textAlign: "center", color: N, fontWeight: 700 }}>{ssd.streak}d</td>
                            <td style={{ textAlign: "center" }}>{ssd.monthlyWorkouts}</td>
                            <td style={{ textAlign: "center", color: Number(diff) < 0 ? DANGER : TEAL, fontWeight: 600, whiteSpace: "nowrap" }}>{Number(diff) > 0 ? "+" : ""}{diff} kg</td>
                            <td style={{ textAlign: "center" }}>{sessions}</td>
                            <td><Badge variant="green"><Check size={11} /> Ativo</Badge></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {viewMode === "sessions" && (
            <div>
              <div style={{ marginBottom: 12, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ fontSize: 12, color: MUTED }}>{filteredSessions.length} sessão(ões)</div>
                {student && <Badge variant="green">{student.name}</Badge>}
              </div>
              {filteredSessions.length === 0 && (
                <div className="card" style={{ textAlign: "center", padding: 40, color: MUTED }}>
                  <Dumbbell size={28} style={{ margin: "0 auto 12px" }} />
                  <div>Nenhuma sessão no período selecionado</div>
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {filteredSessions.map(session => {
                  const exs = session.exercises || [];
                  return (
                    <div key={session.id} className="card" style={{ borderLeft: `4px solid ${session.completed ? N : DANGER}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                        <div>
                          <div style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>{parseLocalDate(session.date).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</div>
                          <div className="display" style={{ fontSize: 14, marginBottom: 2 }}>{session.workoutName}</div>
                          <div style={{ fontSize: 11, color: MUTED }}>Duração: {session.duration} min · {exs.length} exercícios</div>
                        </div>
                        <Badge variant={session.completed ? "green" : "red"}>{session.completed ? <><Check size={10} /> Concluído</> : "Incompleto"}</Badge>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 12 }}>
                        {[
                          { label: "Exercícios",     value: exs.length,               color: MUTED2 },
                          { label: "Metas batidas",  value: session.metasBatidas || 0, color: N      },
                          { label: "Não atingidas",  value: session.metasNaoAtingidas || 0, color: DANGER },
                          { label: "Energia",        value: `${session.energyLevel}/10`, color: AMBER },
                        ].map(s => (
                          <div key={s.label} style={{ padding: "8px 10px", background: CARD_BG2, borderRadius: 10, textAlign: "center" }}>
                            <div style={{ fontSize: 9, color: MUTED, textTransform: "uppercase", marginBottom: 3 }}>{s.label}</div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.value}</div>
                          </div>
                        ))}
                      </div>
                      {exs.length > 0 && (
                        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 10, marginBottom: 10 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: "uppercase", marginBottom: 8 }}>Exercícios realizados</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            {exs.map((ex, i) => (
                              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 10px", background: CARD_BG2, borderRadius: 8 }}>
                                <CheckCircle2 size={13} style={{ color: ex.actualSets > 0 ? N : DANGER, flexShrink: 0 }} />
                                <div style={{ flex: 1, minWidth: 0 }}><span style={{ fontSize: 12, fontWeight: 600 }}>{ex.exerciseName}</span></div>
                                <div style={{ fontSize: 11, color: MUTED2, flexShrink: 0 }}>{ex.actualSets}× {ex.actualReps} reps{ex.actualWeight > 0 && ` @ ${ex.actualWeight}kg`}</div>
                                <div style={{ fontSize: 10, color: AMBER, flexShrink: 0 }}>RPE {ex.rpe}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {session.generalNotes && (
                        <div style={{ padding: "8px 10px", background: `${N}08`, border: `1px solid ${N}22`, borderRadius: 8, marginBottom: 10, fontSize: 12, color: MUTED2 }}>{session.generalNotes}</div>
                      )}
                      <button onClick={() => setSelectedSession(session)}
                        style={{ background: CARD_BG2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "8px 14px", color: MUTED2, fontSize: 12, cursor: "pointer", width: "100%", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        <Eye size={13} /> Ver relatório completo
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {viewMode === "attendance" && (
            <div>
              <div className="kpi-grid" style={{ marginBottom: 16 }}>
                <KpiCard icon={Calendar}    label="Total de Treinos" value={allSessions.length}  delta="em todo o histórico" />
                <KpiCard icon={CheckCircle2}label="Completos"        value={allSessions.filter(s => s.completed).length} delta="sessões finalizadas" color={N} />
                <KpiCard icon={AlertCircle} label="Incompletos"      value={allSessions.filter(s => !s.completed).length} delta="sessões interrompidas" color={DANGER} />
                <KpiCard icon={Activity}    label="Última Sessão"
                  value={allSessions[0]?.date ? parseLocalDate(allSessions[0].date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }) : "—"}
                  delta="data mais recente" color={AMBER} />
              </div>
              <div className="card" style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Calendário de Presença — {student?.name}</div>
                <AttendanceCalendar sessions={allSessions} accent={N} />
              </div>
              <div className="card" style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Dias Treinados <span style={{ fontSize: 11, color: MUTED, fontWeight: 400 }}>({presentDates.length})</span></div>
                {presentDates.length === 0 && <div style={{ color: MUTED, fontSize: 12, textAlign: "center", padding: 16 }}>Nenhum treino registrado</div>}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {[...presentDates].sort().reverse().map(d => (
                    <div key={d} style={{ padding: "5px 12px", background: `${N}12`, border: `1px solid ${N}33`, borderRadius: 20, fontSize: 12, color: N, fontWeight: 600 }}>
                      {parseLocalDate(d).toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" })}
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Frequência Semanal</div>
                {(sd.weekFreq || []).length > 0 ? (
                  <div>
                    <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                      {["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"].map((day, i) => {
                        const freq = sd.weekFreq || [];
                        const entry = freq[i];
                        const present = entry?.v === 1;
                        return (
                          <div key={day} style={{ flex: 1, minWidth: 36 }}>
                            <div style={{ textAlign: "center", fontSize: 10, color: MUTED, marginBottom: 4 }}>{day}</div>
                            <div style={{ height: 40, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: present ? `${N}22` : CARD_BG2, border: `1px solid ${present ? N + "44" : BORDER}` }}>
                              {present ? <Check size={14} style={{ color: N }} /> : <X size={12} style={{ color: MUTED }} />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ fontSize: 11, color: MUTED, marginTop: 8 }}>Padrão de treino da última semana registrada</div>
                  </div>
                ) : (
                  <div style={{ color: MUTED, fontSize: 12, textAlign: "center", padding: 16 }}>Sem dados de frequência semanal</div>
                )}
              </div>
            </div>
          )}
        </>
      )}
      <SessionDetailModal session={selectedSession} onClose={() => setSelectedSession(null)} accent={N} />
    </div>
  );
}

// ─── TAB: NOTIFICAÇÕES ────────────────────────────────────────────────────
function TabNotificacoes({ notifications, onNotificationsChange, toast }) {
  const [msg, setMsg] = useState("");
  const unread = notifications.filter(n => !n.read).length;

  function markAllRead() { onNotificationsChange(notifications.map(n => ({ ...n, read: true }))); toast("Todas marcadas como lidas."); }

  function sendNotification() {
    if (!msg.trim()) { toast("Digite uma mensagem.", "info"); return; }
    onNotificationsChange([{ id: Date.now(), title: msg.trim(), time: "Agora", read: false, type: "info" }, ...notifications]);
    setMsg(""); toast("Notificação enviada!");
  }

  const iconMap  = { achievement: Trophy, streak: Activity, photo: Camera, message: MessageCircle };
  const colorMap = { achievement: AMBER, streak: N, photo: BLUE, message: TEAL };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, gap: 10, flexWrap: "wrap" }}>
        <div style={{ fontSize: 12, color: MUTED }}>{unread} não lida(s)</div>
        <Btn variant="secondary" size="sm" icon={CheckCircle2} onClick={markAllRead}>Marcar lidas</Btn>
      </div>
      <div className="card" style={{ marginBottom: 14 }}>
        {notifications.map(n => {
          const Icon  = iconMap[n.type]  || Bell;
          const color = colorMap[n.type] || MUTED;
          return (
            <div key={n.id}
              onClick={() => onNotificationsChange(notifications.map(x => x.id === n.id ? { ...x, read: true } : x))}
              role="button" tabIndex={0}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: `1px solid ${BORDER}`, cursor: "pointer", opacity: n.read ? 0.55 : 1 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={17} style={{ color }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: n.read ? 400 : 600 }}>{n.title}</div>
                <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{n.time}</div>
              </div>
              {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: N, flexShrink: 0 }} />}
            </div>
          );
        })}
        {notifications.length === 0 && <div style={{ textAlign: "center", padding: 24, color: MUTED }}>Nenhuma notificação</div>}
      </div>
      <div className="card">
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Enviar Notificação Manual</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input type="text" placeholder="Mensagem para todos os alunos..." value={msg}
            onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && sendNotification()} style={{ flex: 1 }} />
          <button onClick={sendNotification}
            style={{ background: N, border: "none", borderRadius: 10, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", color: "#000", cursor: "pointer", flexShrink: 0 }}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── TAB: PERMISSÕES ──────────────────────────────────────────────────────
function TabPermissoes({ permissions, onPermissionsChange, toast }) {
  const [role, setRole] = useState("student");
  const permLabels = {
    manageStudents: "Gerenciar alunos", manageWorkouts: "Gerenciar treinos",
    viewReports: "Ver relatórios", sendMessages: "Enviar mensagens",
    manageSettings: "Gerenciar configurações", viewLogs: "Ver logs", exportData: "Exportar dados",
  };
  function handleToggle(key) {
    if (role === "admin") { toast("Permissões de admin são fixas.", "info"); return; }
    onPermissionsChange({ ...permissions, [role]: { ...permissions[role], [key]: !permissions[role][key] } });
    toast("Permissão atualizada!");
  }
  return (
    <div>
      <div style={{ display: "flex", gap: 4, background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 4, width: "fit-content", marginBottom: 20 }}>
        {["admin", "student"].map(r => (
          <button key={r} onClick={() => setRole(r)} className={`tab-btn${role === r ? " active" : ""}`}>{r === "admin" ? "Admin" : "Aluno"}</button>
        ))}
      </div>
      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, paddingBottom: 14, borderBottom: `1px solid ${BORDER}` }}>
          <Avatar initials={role === "admin" ? "A" : "S"} size={38} color={role === "admin" ? N : BLUE} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{role === "admin" ? "Administrador" : "Aluno"}</div>
            <div style={{ fontSize: 12, color: MUTED }}>{role === "admin" ? "Acesso total" : "Acesso limitado"}</div>
          </div>
        </div>
        <div className="perm-grid">
          {Object.entries(permLabels).map(([key, label]) => {
            const active = permissions[role]?.[key];
            return (
              <div key={key} className="perm-item">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{label}</div>
                  <div style={{ fontSize: 10, color: active ? N : MUTED, marginTop: 2 }}>{active ? "Habilitado" : "Desabilitado"}</div>
                </div>
                <Toggle checked={!!active} onChange={() => handleToggle(key)} label={label} />
              </div>
            );
          })}
        </div>
      </div>
      <div className="card" style={{ background: `${AMBER}08`, borderColor: `${AMBER}33` }}>
        <div style={{ display: "flex", gap: 10 }}>
          <AlertTriangle size={17} style={{ color: AMBER, flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: AMBER, marginBottom: 4 }}>Atenção</div>
            <div style={{ fontSize: 12, color: `${AMBER}bb`, lineHeight: 1.6 }}>Alterações têm efeito imediato. Permissões de admin são fixas e protegidas.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TAB: AUDITORIA ───────────────────────────────────────────────────────
function TabAuditoria({ auditLogs, onAuditLogsChange, toast, confirm }) {
  const logColors = { info: MUTED2, success: N, warning: AMBER, error: DANGER };
  const logIcons  = { info: Activity, success: CheckCircle2, warning: AlertTriangle, error: AlertCircle };
  function exportLog() {
    const csv  = "usuario,acao,alvo,horario\n" + auditLogs.map(l => [l.user, l.action, l.target, l.time].join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a    = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "auditoria-gc.csv"; a.click();
    toast("Log exportado!");
  }
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, gap: 10, flexWrap: "wrap" }}>
        <div style={{ fontSize: 12, color: MUTED }}>{auditLogs.length} eventos</div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="secondary" size="sm" icon={Download} onClick={exportLog}>Exportar</Btn>
          <Btn variant="danger" size="sm" icon={Trash2}
            onClick={async () => { const ok = await confirm("Limpar todos os logs?", { title: "Limpar auditoria" }); if (ok) { onAuditLogsChange([]); toast("Logs apagados.", "info"); } }}>
            Limpar
          </Btn>
        </div>
      </div>
      <div className="card">
        {auditLogs.map((log, idx) => {
          const Icon  = logIcons[log.level]  || Activity;
          const color = logColors[log.level] || MUTED;
          return (
            <div key={log.id ?? idx} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 0", borderBottom: `1px solid ${BORDER}` }}>
              <Icon size={16} style={{ color, marginTop: 1, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{log.action}</div>
                <div style={{ fontSize: 11, color: MUTED, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{log.user} · {log.target}</div>
              </div>
              <div style={{ fontSize: 11, color: MUTED, flexShrink: 0, whiteSpace: "nowrap" }}>{log.time}</div>
            </div>
          );
        })}
        {auditLogs.length === 0 && <div style={{ textAlign: "center", padding: 24, color: MUTED }}>Nenhum log registrado</div>}
      </div>
    </div>
  );
}

// ─── TAB: CONFIGURAÇÕES ───────────────────────────────────────────────────
function TabConfiguracoes({ config, onConfigChange, auditLogs, onAuditLogsChange, toast, confirm, addAuditLog }) {
  const [section, setSection] = useState("geral");
  function update(key, val) { onConfigChange({ ...config, [key]: val }); }
  function saveConfig() { toast("Configurações salvas!"); addAuditLog("Configurações do sistema atualizadas", "Sistema"); }
  const inputStyle = { background: CARD_BG2, border: `1px solid ${BORDER}`, color: "#f0f0f0", borderRadius: 8, padding: "8px 12px", fontSize: 13, outline: "none" };
  return (
    <div>
      <div style={{ display: "flex", gap: 4, background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 4, width: "fit-content", marginBottom: 20, overflowX: "auto" }}>
        {[{ id: "geral", label: "Geral", icon: Sliders }, { id: "notificacoes", label: "Notificações", icon: Bell }, { id: "seguranca", label: "Segurança", icon: Shield }].map(s => (
          <button key={s.id} onClick={() => setSection(s.id)} className={`tab-btn${section === s.id ? " active" : ""}`} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <s.icon size={13} /> {s.label}
          </button>
        ))}
      </div>
      {section === "geral" && (
        <div>
          <div className="card" style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Configurações do Sistema</div>
            <ConfigRow label="Nome do aplicativo" description="Exibido na interface" control={<input type="text" value={config.appName || ""} onChange={e => update("appName", e.target.value)} style={{ ...inputStyle, width: 160 }} />} />
            <ConfigRow label="Máx. de alunos" control={<input type="number" value={config.maxStudents || 50} min={1} onChange={e => update("maxStudents", Number(e.target.value))} style={{ ...inputStyle, width: 80 }} />} />
            <ConfigRow label="Timeout de sessão (min)" control={<input type="number" value={config.sessionTimeout || 60} min={5} onChange={e => update("sessionTimeout", Number(e.target.value))} style={{ ...inputStyle, width: 80 }} />} />
            <ConfigRow label="Fuso horário" control={<select value={config.timezone || "America/Sao_Paulo"} onChange={e => update("timezone", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}><option value="America/Sao_Paulo">Brasília (UTC-3)</option><option value="America/Manaus">Manaus (UTC-4)</option><option value="America/Fortaleza">Fortaleza (UTC-3)</option></select>} />
          </div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Recursos</div>
            <ConfigRow label="Notificações push" control={<Toggle checked={!!config.enableNotifications} onChange={v => update("enableNotifications", v)} label="Notificações" />} />
            <ConfigRow label="Modo manutenção" description="Bloqueia acesso de alunos" control={<Toggle checked={!!config.maintenanceMode} onChange={v => update("maintenanceMode", v)} label="Modo manutenção" />} />
            <ConfigRow label="Backup automático" control={<Toggle checked={!!config.autoBackup} onChange={v => update("autoBackup", v)} label="Backup" />} />
          </div>
          <Btn onClick={saveConfig} icon={Save} style={{ width: "100%", justifyContent: "center" }}>Salvar Configurações</Btn>
        </div>
      )}
      {section === "notificacoes" && (
        <div className="card">
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Preferências de Notificação</div>
          <ConfigRow label="Alertas de streak" description="Quando aluno bate recordes" control={<Toggle checked={true} onChange={() => toast("Atualizado!")} label="Alertas de streak" />} />
          <ConfigRow label="Alertas de inatividade" description="+3 dias sem treinar" control={<Toggle checked={true} onChange={() => toast("Atualizado!")} label="Inatividade" />} />
          <ConfigRow label="Resumo semanal" description="Todo domingo às 20h" control={<Toggle checked={false} onChange={() => toast("Atualizado!")} label="Resumo" />} />
          <ConfigRow label="Fotos pendentes" description="Quando aluno envia foto" control={<Toggle checked={true} onChange={() => toast("Atualizado!")} label="Fotos" />} />
          <div style={{ marginTop: 16 }}><Btn size="sm" onClick={() => toast("Preferências salvas!")} style={{ width: "100%", justifyContent: "center" }}>Salvar</Btn></div>
        </div>
      )}
      {section === "seguranca" && (
        <div>
          <div className="card" style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Status de Segurança</div>
            <ConfigRow label="2FA" control={<Badge variant="amber">Em breve</Badge>} />
            <ConfigRow label="Log de acessos" control={<Badge variant="green">Ativo</Badge>} />
            <ConfigRow label="Timeout de sessão" control={<span style={{ fontSize: 12, color: MUTED }}>{config.sessionTimeout || 60}min</span>} />
            <ConfigRow label="Proteção CSRF" control={<Badge variant="green">Ativo</Badge>} />
            <ConfigRow label="Validação de dados" control={<Badge variant="green">Ativo</Badge>} />
          </div>
          <div className="card" style={{ background: `${DANGER}06`, borderColor: `${DANGER}28` }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: DANGER, marginBottom: 4 }}>Zona de Perigo</div>
            <div style={{ fontSize: 12, color: `${DANGER}99`, marginBottom: 14 }}>Ações irreversíveis — use com cuidado</div>
            <Btn variant="danger" size="sm" icon={Trash2}
              onClick={async () => { const ok = await confirm("Limpar todos os logs de auditoria?", { title: "Limpar auditoria" }); if (ok) { onAuditLogsChange([]); toast("Logs apagados.", "info"); } }}
              style={{ width: "100%", justifyContent: "center" }}>
              Limpar logs de auditoria
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ADMIN DASHBOARD (ROOT) ───────────────────────────────────────────────
export function AdminDashboard({ user, onLogout }) {
  const [tab,             setTab]             = useState("dashboard");
  const [sidebarOpen,     setSidebarOpen]     = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isMobile,        setIsMobile]        = useState(typeof window !== "undefined" ? window.innerWidth < 768 : false);

  const { toast, ToastContainer } = useToast();
  const { confirm, ConfirmDialog } = useConfirm();

  const {
    users, studentsData, notifications, auditLogs, permissions, config,
    pendingPhotosCount,
    // ── NOVO ──
    exerciseLibrary,
    workoutTemplates,
    onUsersChange, onStudentsDataChange,
    onNotificationsChange, onAuditLogsChange, onPermissionsChange, onConfigChange,
    updateStudentWorkouts, updateCoachNote,
    adminApprovePhoto, adminRequestResubmit,
    addAuditLog,
    // ── NOVO ──
    addExerciseTemplate, updateExerciseTemplate, deleteExerciseTemplate,
    addWorkoutTemplate, updateWorkoutTemplate, deleteWorkoutTemplate,
  } = useAdminProps();

  useEffect(() => {
    const onResize = () => { setIsMobile(window.innerWidth < 768); if (window.innerWidth >= 768) setSidebarOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  const unreadNotifs = notifications.filter(n => !n.read).length;

  function handleNavigate(tabId, studentId?) {
    setTab(tabId);
    if (studentId) setSelectedStudent(studentId);
  }

  const tabTitles = {
    dashboard: "Dashboard", alunos: "Alunos", treinos: "Treinos",
    "treinos-prontos": "Treinos Prontos",
    biblioteca: "Biblioteca de Exercícios",
    fotos: "Fotos de Progresso", relatorios: "Relatórios",
    notificacoes: "Notificações", permissoes: "Permissões",
    auditoria: "Auditoria", configuracoes: "Configurações",
  };

  return (
    <div className="adm" style={{ display: "flex", minHeight: "100vh", background: "#0d0d0d", color: "#f0f0f0" }}>
      <style>{GLOBAL_CSS}</style>

      {!isMobile && (
        <div style={{ width: 220, flexShrink: 0 }}>
          <Sidebar activeTab={tab} onTabChange={setTab} user={user} onLogout={onLogout}
            unreadNotifs={unreadNotifs} pendingPhotos={pendingPhotosCount} isMobile={false} />
        </div>
      )}

      {isMobile && sidebarOpen && (
        <Sidebar activeTab={tab} onTabChange={setTab} user={user} onLogout={onLogout}
          unreadNotifs={unreadNotifs} pendingPhotos={pendingPhotosCount}
          isMobile={true} onClose={() => setSidebarOpen(false)} />
      )}

      <main style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", minWidth: 0 }}>
        {/* Header */}
        <header style={{
          padding: "12px 16px", borderBottom: `1px solid ${BORDER}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "rgba(13,13,13,0.85)", backdropFilter: "blur(12px)",
          position: "sticky", top: 0, zIndex: 100, gap: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            {isMobile && (
              <button onClick={() => setSidebarOpen(true)}
                style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 10, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", color: MUTED2, cursor: "pointer", flexShrink: 0 }}>
                <Menu size={18} />
              </button>
            )}
            <div style={{ minWidth: 0 }}>
              <h2 className="display" style={{ fontSize: 16, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tabTitles[tab]}</h2>
              <div style={{ fontSize: 11, color: MUTED, marginTop: 1, display: isMobile ? "none" : "block" }}>
                {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
            {pendingPhotosCount > 0 && (
              <button onClick={() => setTab("fotos")}
                style={{ background: `${AMBER}15`, border: `1px solid ${AMBER}33`, borderRadius: 10, padding: "6px 12px", display: "flex", alignItems: "center", gap: 6, color: AMBER, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                <Camera size={14} /> {pendingPhotosCount} foto{pendingPhotosCount > 1 ? "s" : ""}
              </button>
            )}
            <div style={{ position: "relative" }}>
              <button onClick={() => setTab("notificacoes")}
                style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 10, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", color: MUTED2, cursor: "pointer" }}>
                <Bell size={16} />
              </button>
              {unreadNotifs > 0 && <span style={{ position: "absolute", top: 6, right: 6, width: 7, height: 7, borderRadius: "50%", background: DANGER }} />}
            </div>
            {!isMobile && <Btn variant="secondary" size="sm" onClick={onLogout} icon={LogOut}>Sair</Btn>}
          </div>
        </header>

        {/* Conteúdo */}
        <div style={{ padding: isMobile ? "14px 12px" : "20px 24px", flex: 1, overflowY: "auto" }}>
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: .18 }}>

              {tab === "dashboard" && <TabDashboard users={users} studentsData={studentsData} onNavigate={handleNavigate} />}

              {tab === "alunos" && (
                <TabAlunos users={users} studentsData={studentsData}
                  onUsersChange={onUsersChange} onStudentsDataChange={onStudentsDataChange}
                  onNavigate={handleNavigate} toast={toast} confirm={confirm} />
              )}

              {tab === "treinos" && (
                <TabTreinos
                  users={users} studentsData={studentsData}
                  updateStudentWorkouts={updateStudentWorkouts}
                  selectedStudent={selectedStudent} onSelectStudent={setSelectedStudent}
                  toast={toast} confirm={confirm}
                  exerciseLibrary={exerciseLibrary}
                  workoutTemplates={workoutTemplates}
                  addWorkoutTemplate={addWorkoutTemplate}
                />
              )}

              {tab === "treinos-prontos" && (
                <TabTreinosProntos
                  users={users} studentsData={studentsData}
                  updateStudentWorkouts={updateStudentWorkouts}
                  workoutTemplates={workoutTemplates}
                  addWorkoutTemplate={addWorkoutTemplate}
                  updateWorkoutTemplate={updateWorkoutTemplate}
                  deleteWorkoutTemplate={deleteWorkoutTemplate}
                  exerciseLibrary={exerciseLibrary}
                  toast={toast} confirm={confirm}
                />
              )}

              {tab === "biblioteca" && (
                <TabBiblioteca
                  exerciseLibrary={exerciseLibrary}
                  addExerciseTemplate={addExerciseTemplate}
                  updateExerciseTemplate={updateExerciseTemplate}
                  deleteExerciseTemplate={deleteExerciseTemplate}
                  toast={toast}
                  confirm={confirm}
                />
              )}

              {tab === "fotos" && (
                <AdminPhotosTab users={users} studentsData={studentsData}
                  onApprove={adminApprovePhoto} onRequestResubmit={adminRequestResubmit} />
              )}

              {tab === "relatorios" && <TabRelatorios users={users} studentsData={studentsData} toast={toast}  />}

              {tab === "notificacoes" && <TabNotificacoes notifications={notifications} onNotificationsChange={onNotificationsChange} toast={toast} />}

              {tab === "permissoes" && <TabPermissoes permissions={permissions} onPermissionsChange={onPermissionsChange} toast={toast} />}

              {tab === "auditoria" && <TabAuditoria auditLogs={auditLogs} onAuditLogsChange={onAuditLogsChange} toast={toast} confirm={confirm} />}

              {tab === "configuracoes" && (
                <TabConfiguracoes config={config} onConfigChange={onConfigChange}
                  auditLogs={auditLogs} onAuditLogsChange={onAuditLogsChange}
                  toast={toast} confirm={confirm} addAuditLog={addAuditLog} />
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {isMobile && (
          <nav style={{
            position: "sticky", bottom: 0,
            background: "rgba(13,13,13,0.95)", borderTop: `1px solid ${BORDER}`,
            backdropFilter: "blur(12px)", display: "flex",
            overflowX: "auto", padding: "6px 4px", gap: 2, zIndex: 100,
          }}>
            {SIDEBAR_ITEMS.flatMap(s => s.items).map(item => {
              const Icon     = item.icon;
              const isActive = tab === item.id;
              return (
                <button key={item.id} onClick={() => setTab(item.id)}
                  style={{
                    flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "center",
                    gap: 3, padding: "6px 10px",
                    background: isActive ? `${N}18` : "none", border: "none", borderRadius: 10,
                    color: isActive ? N : MUTED, cursor: "pointer",
                    fontSize: 9, fontWeight: isActive ? 600 : 400,
                    transition: "all .15s", minWidth: 52,
                  }}>
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        )}
      </main>

      <ToastContainer />
      <ConfirmDialog />
    </div>
  );
}

export default AdminDashboard;