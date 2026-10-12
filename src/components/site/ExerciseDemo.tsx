/* eslint-disable prettier/prettier */
/**
 * Modal "Exemplo": desenho vetorial animado mostrando como executar o
 * exercício (posição inicial ↔ execução) com o músculo trabalhado em
 * destaque. Tudo gerado em SVG a partir de dados (src/lib/exercise-figure.ts)
 * — sem vídeo, sem imagem para baixar e funcionando offline.
 */
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { X, Pause, Play } from "lucide-react";
import type { ExerciseDemo } from "@/lib/exercise-demos";
import { figureMarkup, VIEWBOX, type FigureColors } from "@/lib/exercise-figure";
import { FIGURES } from "@/lib/exercise-figures-data";

const FRAME_LABELS = ["Início", "Execução"];
// ciclo: segura no início → move → segura na execução → volta
const HOLD_MS = 450;
const MOVE_MS = 1000;
const CYCLE_MS = 2 * (HOLD_MS + MOVE_MS);

const MUSCLE_NAMES: Record<string, string> = {
  chest: "Peitoral", back: "Dorsais", traps: "Trapézio", delts: "Ombros", rearDelts: "Ombro posterior",
  biceps: "Bíceps", triceps: "Tríceps", forearms: "Antebraço", abs: "Abdômen", obliques: "Oblíquos",
  lowerBack: "Lombar", glutes: "Glúteos", abductors: "Abdutores", adductors: "Adutores",
  quads: "Quadríceps", hamstrings: "Posteriores", calves: "Panturrilha",
};

function prefersReducedMotion() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

const ease = (x: number) => 0.5 - Math.cos(Math.PI * x) / 2;

/** posição 0..1 entre as poses em um instante do ciclo */
function phaseAt(ms: number) {
  const t = ms % CYCLE_MS;
  if (t < HOLD_MS) return 0;
  if (t < HOLD_MS + MOVE_MS) return ease((t - HOLD_MS) / MOVE_MS);
  if (t < 2 * HOLD_MS + MOVE_MS) return 1;
  return 1 - ease((t - 2 * HOLD_MS - MOVE_MS) / MOVE_MS);
}

function figureColors(isDark: boolean, accent: string): FigureColors {
  return isDark
    ? { body: "#d7dde5", bodyFar: "#7d8691", prop: "#8a939e", propDark: "#3a4049", floor: "rgba(255,255,255,0.12)", muscle: accent }
    : { body: "#6b7683", bodyFar: "#aeb6c0", prop: "#7d8691", propDark: "#c3cad2", floor: "rgba(0,0,0,0.12)", muscle: accent };
}

export function ExerciseDemoModal({
  demo, title, note, accent, isDark, onClose,
}: {
  demo: ExerciseDemo;
  title?: string;
  note?: string;
  accent: string;
  isDark: boolean;
  onClose: () => void;
}) {
  const figure = FIGURES[demo.slug];
  const [playing, setPlaying] = useState(() => !prefersReducedMotion());
  const [frame, setFrame] = useState(0);
  const gRef = useRef<SVGGElement>(null);

  // desenha direto no <g> a cada quadro — evita re-render do React a 60fps
  useEffect(() => {
    const g = gRef.current;
    if (!g || !figure) return;
    const colors = figureColors(isDark, accent);
    if (!playing) {
      g.innerHTML = figureMarkup(figure, frame, colors);
      return;
    }
    let raf = 0;
    let shown = -1;
    const start = performance.now();
    const tick = (now: number) => {
      const p = phaseAt(now - start);
      g.innerHTML = figureMarkup(figure, p, colors);
      const f = p < 0.5 ? 0 : 1;
      if (f !== shown) { shown = f; setFrame(f); }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // `frame` só importa parado; animando, é o próprio loop que o atualiza
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [figure, playing, playing ? -1 : frame, isDark, accent]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const muscles = figure ? [...new Set(figure.muscles.map((m) => MUSCLE_NAMES[m]))] : [];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 150,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 12, backdropFilter: "blur(6px)" }}>
      <motion.div
        role="dialog" aria-modal="true" aria-label={`Exemplo: ${demo.name}`}
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 520, maxHeight: "92dvh",
          background: isDark ? "#141414" : "#f8f9fa", color: isDark ? "#f5f5f5" : "#1a1a1a",
          border: `1px solid ${border}`, borderRadius: 20, overflow: "hidden",
          display: "flex", flexDirection: "column" }}>

        <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
          borderBottom: `1px solid ${border}`, flexShrink: 0 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "0.71em", color: accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>
              Exemplo · {demo.group}
            </div>
            <h3 style={{ fontFamily: "system-ui,sans-serif", fontSize: "1.07em", fontWeight: 800, margin: "2px 0 0",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {title || demo.name}
            </h3>
          </div>
          <button onClick={onClose} aria-label="Fechar exemplo"
            style={{ background: "rgba(255,255,255,0.07)", border: "none", borderRadius: 10, padding: 8,
              color: isDark ? "#aaa" : "#666", cursor: "pointer", flexShrink: 0 }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ overflowY: "auto" }}>
          {figure && (
            // tocar no desenho alterna manualmente entre início e execução
            <button type="button" onClick={() => { setPlaying(false); setFrame((f) => (f ? 0 : 1)); }}
              aria-label="Alternar posição do exemplo"
              style={{ position: "relative", display: "block", width: "100%", padding: 0, border: "none",
                background: isDark ? "#0b0b0b" : "#eef1f4", cursor: "pointer" }}>
              <svg viewBox={VIEWBOX} role="img" aria-label={`Desenho animado: ${demo.name}`}
                style={{ display: "block", width: "100%", height: "auto", maxHeight: "52dvh" }}>
                <g ref={gRef} />
              </svg>
              <div style={{ position: "absolute", left: 10, bottom: 10, padding: "4px 10px", borderRadius: 999,
                background: "rgba(0,0,0,0.65)", color: "#fff", fontSize: "0.75em", fontWeight: 700 }}>
                {frame + 1}/2 · {FRAME_LABELS[frame]}
              </div>
            </button>
          )}

          <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
            {figure && (
              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" onClick={() => setPlaying((p) => !p)}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10,
                    border: `1px solid ${accent}55`, background: `${accent}14`, color: accent,
                    fontFamily: "inherit", fontWeight: 700, fontSize: "0.86em", cursor: "pointer" }}>
                  {playing ? <><Pause size={14} /> Pausar</> : <><Play size={14} /> Animar</>}
                </button>
                {FRAME_LABELS.map((label, i) => (
                  <button key={label} type="button"
                    onClick={() => { setPlaying(false); setFrame(i); }}
                    aria-pressed={frame === i}
                    style={{ flex: 1, minWidth: 0, padding: "8px 6px", borderRadius: 10, fontFamily: "inherit",
                      fontSize: "0.79em", fontWeight: 600, cursor: "pointer",
                      border: `1px solid ${frame === i ? accent : border}`,
                      background: frame === i ? `${accent}14` : "transparent",
                      color: frame === i ? accent : "inherit", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {label}
                  </button>
                ))}
              </div>
            )}

            {muscles.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", fontSize: "0.79em" }}>
                <span style={{ color: isDark ? "#999" : "#666" }}>Trabalha:</span>
                {muscles.map((m) => (
                  <span key={m} style={{ padding: "3px 9px", borderRadius: 999, fontWeight: 700,
                    color: accent, background: `${accent}14`, border: `1px solid ${accent}40` }}>{m}</span>
                ))}
              </div>
            )}

            <ol style={{ margin: 0, paddingLeft: 20, listStyle: "decimal", display: "flex", flexDirection: "column", gap: 6,
              fontSize: "0.93em", lineHeight: 1.5 }}>
              {demo.steps.map((s) => <li key={s}>{s}</li>)}
            </ol>

            {note && (
              <div style={{ padding: "10px 12px", borderRadius: 12, fontSize: "0.86em", lineHeight: 1.5,
                background: `${accent}10`, border: `1px solid ${accent}33` }}>
                <strong style={{ color: accent }}>Dica do coach:</strong> {note}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
