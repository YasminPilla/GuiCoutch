/* eslint-disable prettier/prettier */
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Search, Map, Dumbbell, LineChart,
  BarChart2, Video,
  ChevronLeft, ChevronRight,
} from "lucide-react";

// ─── MOCKUPS ──────────────────────────────────────────────────────────────

const mc: React.CSSProperties = {
  width: "100%", maxWidth: 340,
  background: "rgba(13,13,13,0.95)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: 20, padding: 20,
  display: "flex", flexDirection: "column", gap: 12,
  boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
};
const mlabel: React.CSSProperties = {
  fontSize: 10, fontWeight: 700,
  textTransform: "uppercase", letterSpacing: ".08em",
  color: "rgba(255,255,255,0.3)",
};

function MockupDiagnostico() {
  return (
    <div style={mc}>
      {[
        { label: "Histórico de treino", done: true },
        { label: "Limitações físicas", done: true },
        { label: "Rotina real e disponibilidade", done: false },
        { label: "Objetivos e expectativas", done: false },
      ].map((item) => (
        <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 20, height: 20, borderRadius: 6, border: item.done ? "none" : "1.5px solid rgba(255,255,255,0.12)", background: item.done ? "#00FF88" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#000", flexShrink: 0 }}>
            {item.done && "✓"}
          </div>
          <span style={{ fontSize: 13, color: item.done ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.45)", textDecoration: item.done ? "line-through" : "none", textDecorationColor: "rgba(0,255,136,0.4)" }}>
            {item.label}
          </span>
        </div>
      ))}
      <div style={{ height: 1, background: "rgba(255,255,255,0.07)" }} />
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", display: "flex", alignItems: "flex-start", gap: 8, lineHeight: 1.5 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#000", background: "#00FF88", padding: "2px 8px", borderRadius: 20, flexShrink: 0 }}>Coach</span>
        Avaliação postural agendada para Seg.
      </div>
    </div>
  );
}

function MockupEstrategia() {
  const weeks = [{ w: "S1-2", focus: "Base", pct: 55 }, { w: "S3-4", focus: "Volume", pct: 75 }, { w: "S5-6", focus: "Intensidade", pct: 90 }];
  return (
    <div style={mc}>
      <div style={mlabel}>Mesociclo 2 · 6 semanas</div>
      {weeks.map((w) => (
        <div key={w.w}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>{w.w} · {w.focus}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#00FF88" }}>{w.pct}%</span>
          </div>
          <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 3, overflow: "hidden" }}>
            <motion.div initial={{ width: 0 }} whileInView={{ width: `${w.pct}%` }} viewport={{ once: true }} transition={{ duration: 0.8 }} style={{ height: "100%", background: "#00FF88", borderRadius: 3 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function MockupExecucao() {
  return (
    <div style={mc}>
      <div style={mlabel}>Treino A · Superior</div>
      {[
        { name: "Supino Inclinado", load: "70kg", sets: "4×10", note: "Foco na excêntrica" },
        { name: "Remada Curvada", load: "80kg", sets: "4×8", note: "Cotovelo próximo" },
        { name: "Desenvolvimento Halter", load: "22kg", sets: "3×12", note: "" },
      ].map((ex, i) => (
        <div key={ex.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)", opacity: i === 0 ? 1 : 0.6 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{ex.name}</div>
            {ex.note && <div style={{ fontSize: 10, color: "#00FF88", marginTop: 2 }}>💡 {ex.note}</div>}
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#00FF88", background: "rgba(0,255,136,0.1)", padding: "3px 8px", borderRadius: 6 }}>{ex.load}</span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{ex.sets}</span>
        </div>
      ))}
    </div>
  );
}

function MockupAcompanhamento() {
  return (
    <div style={mc}>
      <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
        {[{ label: "Peso", value: "82.9 kg", delta: "↓ 5.1 kg" }, { label: "Streak", value: "23 dias", delta: "🔥 Recorde" }].map((k) => (
          <div key={k.label} style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "10px 12px" }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1 }}>{k.value}</div>
            <div style={{ fontSize: 10, color: "#00FF88", marginTop: 3 }}>{k.delta}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", display: "flex", alignItems: "flex-start", gap: 8, lineHeight: 1.5 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#000", background: "#00FF88", padding: "2px 8px", borderRadius: 20, flexShrink: 0 }}>Coach</span>
        Check-in: subimos carga no agachamento. Foca na execução.
      </div>
      <div style={{ fontSize: 12, color: "#00FF88", background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.2)", borderRadius: 8, padding: "8px 12px", textAlign: "center" }}>Responder ao coach →</div>
    </div>
  );
}

function MockupDashboard() {
  return (
    <div style={mc}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
        {[{ l: "Peso atual", v: "82.9 kg", d: "↓ 5.1 kg" }, { l: "Meta", v: "78 kg", d: "61% concluído" }, { l: "Streak", v: "23 dias", d: "Recorde 🔥" }, { l: "Treinos/mês", v: "21", d: "+3 vs anterior" }].map((k) => (
          <div key={k.l} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "10px 12px" }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: 4 }}>{k.l}</div>
            <div style={{ fontSize: 16, fontWeight: 800 }}>{k.v}</div>
            <div style={{ fontSize: 10, color: "#00FF88", marginTop: 3 }}>{k.d}</div>
          </div>
        ))}
      </div>
      {[{ t: "5 treinos completos", p: 100 }, { t: "Hidratação 3L/dia", p: 86 }].map((g) => (
        <div key={g.t} style={{ marginBottom: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
            <span style={{ color: "rgba(255,255,255,0.45)" }}>{g.t}</span>
            <span style={{ color: "#00D4FF", fontWeight: 700 }}>{g.p}%</span>
          </div>
          <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
            <motion.div initial={{ width: 0 }} whileInView={{ width: `${g.p}%` }} viewport={{ once: true }} transition={{ duration: 0.9 }} style={{ height: "100%", background: "#00D4FF", borderRadius: 2 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function MockupBiblioteca() {
  return (
    <div style={mc}>
      {[
        { name: "Agachamento Livre", tag: "Inferior", tip: "Joelhos alinhados com pés" },
        { name: "Supino Inclinado", tag: "Superior", tip: "Escápulas retraídas" },
        { name: "Barra Fixa", tag: "Pull", tip: "Cotovelos puxados para baixo" },
      ].map((ex) => (
        <div key={ex.name} style={{ display: "flex", flexDirection: "column", gap: 4, padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{ex.name}</span>
            <span style={{ fontSize: 10, color: "#00D4FF", background: "rgba(0,212,255,0.1)", padding: "2px 8px", borderRadius: 20, border: "1px solid rgba(0,212,255,0.2)" }}>{ex.tag}</span>
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>💡 {ex.tip}</div>
          <div style={{ fontSize: 10, color: "rgba(0,212,255,0.7)" }}>▶ Ver vídeo demonstrativo</div>
        </div>
      ))}
    </div>
  );
}

// ─── SLIDES DATA ──────────────────────────────────────────────────────────

const SLIDES = [
  { id: 1, icon: Search,   accent: "#00FF88", headline: "Nada de treino padrão.",           description: "Antes de qualquer estratégia, analisamos histórico, limitações, rotina e objetivos.", chips: ["Avaliação", "Objetivos", "Rotina"],     mockup: <MockupDiagnostico /> },
  { id: 2, icon: Map,      accent: "#00FF88", headline: "Você sempre sabe o próximo passo.", description: "Planejamento estruturado com metas claras e progressão inteligente.",               chips: ["Mesociclos", "Metas", "Progressão"],   mockup: <MockupEstrategia /> },
  { id: 3, icon: Dumbbell, accent: "#00FF88", headline: "Treinos feitos para você.",         description: "Cada sessão possui execução, carga, repetições e progressão definidas.",            chips: ["Carga", "Execução", "Cadência"],       mockup: <MockupExecucao /> },
  { id: 4, icon: LineChart, accent: "#00D4FF", headline: "Você não evolui sozinho.",         description: "Check-ins, ajustes e suporte contínuo para manter a evolução.",                    chips: ["Check-ins", "Suporte", "Ajustes"],     mockup: <MockupAcompanhamento /> },
  { id: 5, icon: Video,    accent: "#00D4FF", headline: "Nunca mais execute errado.",        description: "Vídeos demonstrativos e orientações técnicas para todos os exercícios.",            chips: ["Vídeos", "Técnica", "Execução"],       mockup: <MockupBiblioteca /> },
  { id: 6, icon: BarChart2, accent: "#00D4FF", headline: "Sua evolução em tempo real.",     description: "Peso, medidas, frequência, metas e progresso organizados em um único painel.",     chips: ["Peso", "Medidas", "Dashboard"],        mockup: <MockupDashboard /> },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────

export function LandingCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const total = SLIDES.length;
  const s = SLIDES[current];
  const containerRef = useRef<HTMLDivElement>(null);

  const go = useCallback((next: number, dir?: number) => {
    const d = dir !== undefined ? dir : next > current ? 1 : -1;
    setDirection(d);
    setCurrent((next + total) % total);
  }, [current, total]);

  const prev = useCallback(() => go(current - 1, -1), [current, go]);
  const next = useCallback(() => go(current + 1, 1), [current, go]);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => { next(); }, 6000);
    return () => clearInterval(timer);
  }, [next]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  // Drag
  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -60) next();
    else if (info.offset.x > 60) prev();
  }

  const accentColor = s.accent;

  return (
    <>
      <style>{`
        .lc-wrap { position: relative; padding: 96px 24px; }
        .lc-inner { max-width: 1100px; margin: 0 auto; }

        .lc-card {
          position: relative;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px;
          overflow: hidden;
          cursor: grab;
          user-select: none;
        }
        .lc-card:active { cursor: grabbing; }

        .lc-progress {
          height: 3px;
          width: 100%;
          background: rgba(255,255,255,0.05);
        }
        .lc-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #00FF88, #00D4FF);
        }

        /* ── GRID TRAVADO ── */
        .lc-slides-wrapper {
          position: relative;
          overflow: hidden;
        }

        .lc-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
          padding: 48px 56px;
          min-height: 480px;
        }
        @media(max-width: 900px) {
          .lc-grid {
            grid-template-columns: 1fr;
            padding: 32px 24px;
            gap: 32px;
            min-height: unset;
          }
        }

        /* Coluna do mockup com altura fixa para não esticar o grid */
        .lc-mockup-col {
          height: 380px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        @media(max-width: 900px) {
          .lc-mockup-col { height: auto; }
        }

        .lc-tag {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 11px; font-weight: 700; letter-spacing: .07em;
          text-transform: uppercase; margin-bottom: 12px;
        }
        .lc-tag-dot { width: 6px; height: 6px; border-radius: 50%; }

        .lc-headline {
          font-size: clamp(26px, 5vw, 40px);
          font-weight: 800; line-height: 1.1;
          margin: 0 0 16px; letter-spacing: -.025em;
        }
        .lc-text {
          font-size: 15px; line-height: 1.75;
          color: rgba(255,255,255,0.52);
        }
        .lc-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 22px; }
        .lc-chip {
          font-size: 12px; padding: 5px 14px; border-radius: 100px;
          font-weight: 500;
        }

        .lc-bar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 56px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        @media(max-width: 900px) { .lc-bar { padding: 16px 24px; } }

        .lc-nav-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 18px; border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.1);
          background: none; font-size: 13px; font-weight: 500;
          color: rgba(255,255,255,0.45); cursor: pointer;
          transition: all .2s;
        }
        .lc-nav-btn:hover { color: #fff; border-color: rgba(255,255,255,0.25); }

        .lc-dots { display: flex; align-items: center; gap: 5px; }
        .lc-dot {
          height: 6px; border-radius: 3px;
          transition: all .3s cubic-bezier(.4,0,.2,1);
          cursor: pointer; border: none; padding: 0;
        }
      `}</style>

      <section className="lc-wrap" id="metodo">
        <div className="lc-inner">

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <p style={{
              display: "inline-block",
              fontSize: 13, fontWeight: 800,
              letterSpacing: ".18em", textTransform: "uppercase",
              color: "#00FF88", marginBottom: 16,
              borderBottom: "1.5px solid rgba(0,255,136,0.35)",
              paddingBottom: 4,
            }}>
              Sistema GC
            </p>
            <h2 style={{ fontSize: "clamp(34px,7vw,60px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-.028em", marginBottom: 8 }}>
              Como funciona.<br />
              <span style={{ color: "rgba(255,255,255,0.28)" }}>O que você recebe.</span>
            </h2>
          </div>

          {/* Card */}
          <motion.div
            ref={containerRef}
            className="lc-card"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={onDragEnd}
            style={{ touchAction: "pan-y" }}
          >
            {/* Progress bar */}
            <div className="lc-progress">
              <motion.div
                key={current}
                className="lc-progress-fill"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 6, ease: "linear" }}
              />
            </div>

            {/* Accent glow */}
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at top left, ${accentColor}08, transparent 55%)`, pointerEvents: "none", transition: "background .5s" }} />

            {/* ── Wrapper que trava o tamanho durante a transição ── */}
            <div className="lc-slides-wrapper">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  variants={{
                    enter: (d: number) => ({ opacity: 0, y: 20, scale: 0.98, x: d * 50 }),
                    center: { opacity: 1, y: 0, scale: 1, x: 0 },
                    exit: (d: number) => ({ opacity: 0, y: -20, scale: 0.98, x: d * -50 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.32, ease: "easeOut" }}
                >
                  <div className="lc-grid">

                    {/* Left: text */}
                    <div>
                      <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 52, height: 52, borderRadius: 16, background: `${accentColor}18`, color: accentColor, marginBottom: 20, transition: "background .4s, color .4s" }}>
                        <s.icon size={24} />
                      </div>

                      <div className="lc-tag" style={{ color: accentColor }}>
                        <div className="lc-tag-dot" style={{ background: accentColor }} />
                        {s.id <= 3 ? "Método GC" : "Ao assinar"} · {String(s.id).padStart(2, "0")}
                      </div>

                      <h3 className="lc-headline">{s.headline}</h3>
                      <p className="lc-text">{s.description}</p>

                      <div className="lc-chips">
                        {s.chips.map((c) => (
                          <span key={c} className="lc-chip" style={{ background: `${accentColor}0D`, border: `1px solid ${accentColor}30`, color: accentColor }}>
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right: mockup — coluna com altura fixa */}
                    <div className="lc-mockup-col">
                      <motion.div
                        key={`mockup-${current}`}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        style={{ width: "100%", display: "flex", justifyContent: "center" }}
                      >
                        {s.mockup}
                      </motion.div>
                    </div>

                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom bar */}
            <div className="lc-bar">
              <button className="lc-nav-btn" onClick={prev}>
                <ChevronLeft size={15} /> Anterior
              </button>

              <div className="lc-dots">
                {SLIDES.map((_, i) => {
                  const isCurrent = i === current;
                  const dotColor = i < 3 ? "#00FF88" : "#00D4FF";
                  return (
                    <button
                      key={i}
                      className="lc-dot"
                      onClick={() => go(i)}
                      style={{
                        width: isCurrent ? 22 : 6,
                        background: isCurrent ? dotColor : "rgba(255,255,255,0.15)",
                      }}
                    />
                  );
                })}
              </div>

              <button className="lc-nav-btn" onClick={next}>
                Próximo <ChevronRight size={15} />
              </button>
            </div>
          </motion.div>

          <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 16 }}>
            ← → para navegar · arraste para deslizar
          </p>

        </div>
      </section>
    </>
  );
}