/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import { useState, useMemo, useRef, useEffect, ReactNode, CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  ResponsiveContainer, XAxis, YAxis, Tooltip
} from "recharts";
import {
  LogIn, Eye, EyeOff, Users, Dumbbell, TrendingUp,
  Calendar, Flame, Target, MessageCircle, Bell, Settings,
  ChevronRight, Plus, Check, Trophy, BarChart2, LogOut,
  Star, Activity, ArrowLeft, Send, Pencil, X, CheckCircle2,
  Clock, Lock, LucideIcon
} from "lucide-react";

// ─── TYPES & INTERFACES ───────────────────────────────────────────────────

interface User {
  id: number;
  email: string;
  password: string;
  role: "admin" | "student";
  name: string;
  avatar?: string;
}

interface Exercise {
  name: string;
  sets: string;
  load: string;
  note: string;
}

interface Workout {
  id: number;
  name: string;
  day: string;
  exercises: Exercise[];
}

interface Goal {
  t: string;
  p: number;
}

interface Message {
  from: "coach" | "student";
  text: string;
  time: string;
}

interface WeightEntry {
  d: string;
  v: number;
}

interface WeekFreqEntry {
  d: string;
  v: number;
}

interface StudentData {
  goal: string;
  weeks: number;
  startWeight: number;
  currentWeight: number;
  streak: number;
  monthlyWorkouts: number;
  weightHistory: WeightEntry[];
  weekFreq: WeekFreqEntry[];
  workouts: Workout[];
  coachNote: string;
  goals: Goal[];
  messages: Message[];
}

interface StudentRecord extends User {
  data: StudentData;
}

interface NeonBtnProps {
  children: ReactNode;
  onClick?: () => void;
  secondary?: boolean;
  small?: boolean;
  style?: CSSProperties;
}

interface KpiCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  delta: string;
  color?: string;
}

interface LoginPageProps {
  onLogin: (user: User) => void;
  onBackToHome?: () => void;
}

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
}

interface StudentareaProps {
  onBackToHome?: () => void;
}

interface TabItem {
  id: "home" | "treino" | "evolucao" | "mensagens";
  label: string;
  icon: LucideIcon;
}

// ─── Design tokens ─────────────────────────────────────────────────────────
const N = "#00FF88"; // neon
const CARD = "rgba(255,255,255,0.04)";
const BORDER = "rgba(255,255,255,0.08)";
const MUTED = "rgba(255,255,255,0.45)";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
  .student-area * {box-sizing:border-box}
  .student-area .display{font-family:'Syne',sans-serif}
  .student-area .neon{color:${N}}
  .student-area .muted{color:${MUTED}}
  .student-area input,.student-area textarea{background:${CARD};border:1px solid ${BORDER};color:#f5f5f5;font-family:'DM Sans',sans-serif;border-radius:12px;padding:12px 16px;width:100%;font-size:14px;outline:none;transition:border .2s}
  .student-area input:focus,.student-area textarea:focus{border-color:${N}44}
  .student-area button{cursor:pointer;font-family:'DM Sans',sans-serif}
  .student-area .card{background:${CARD};border:1px solid ${BORDER};border-radius:20px;padding:20px}
  .student-area .glass{background:rgba(255,255,255,0.05);backdrop-filter:blur(12px);border:1px solid ${BORDER};border-radius:16px}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
  .student-area .pulse{animation:pulse 2s infinite}
  .student-area .tab-btn{background:none;border:none;padding:8px 16px;border-radius:10px;font-size:13px;font-weight:500;color:${MUTED};transition:all .2s}
  .student-area .tab-btn.active{background:${N}18;color:${N}}
  .student-area .badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600}
`;

// ─── Mock data ────────────────────────────────────────────────────────────
const USERS: User[] = [
  { id: 1, email: "guilherme@gc.com", password: "admin123", role: "admin", name: "Guilherme Couto" },
  { id: 2, email: "rafael@email.com", password: "rafael123", role: "student", name: "Rafael Mendes", avatar: "RM" },
  { id: 3, email: "camila@email.com", password: "camila123", role: "student", name: "Camila Santos", avatar: "CS" },
  { id: 4, email: "bruno@email.com", password: "bruno123", role: "student", name: "Bruno Alves", avatar: "BA" },
];

const STUDENTS_DATA: Record<number, StudentData> = {
  2: {
    goal: "Perder gordura", weeks: 8, startWeight: 88, currentWeight: 82.9,
    streak: 23, monthlyWorkouts: 21,
    weightHistory: [
      {d:"S1",v:88},{d:"S2",v:87.2},{d:"S3",v:86.5},{d:"S4",v:85.8},
      {d:"S5",v:85.1},{d:"S6",v:84.3},{d:"S7",v:83.6},{d:"S8",v:82.9},
    ],
    weekFreq: [{d:"Seg",v:1},{d:"Ter",v:1},{d:"Qua",v:0},{d:"Qui",v:1},{d:"Sex",v:1},{d:"Sáb",v:1},{d:"Dom",v:0}],
    workouts: [
      { id:1, name:"Treino A · Superior", day:"Segunda", exercises:[
        {name:"Supino Inclinado",sets:"4x10",load:"70kg",note:"Foco na eccêntrica"},
        {name:"Remada Curvada",sets:"4x8",load:"80kg",note:"Cotovelo próximo ao corpo"},
        {name:"Desenvolvimento Halter",sets:"3x12",load:"22kg",note:""},
        {name:"Tríceps Corda",sets:"3x15",load:"30kg",note:""},
        {name:"Rosca Direta",sets:"3x12",load:"35kg",note:""},
      ]},
      { id:2, name:"Treino B · Inferior", day:"Terça", exercises:[
        {name:"Agachamento Livre",sets:"4x8",load:"100kg",note:"+5kg esta semana"},
        {name:"Leg Press 45°",sets:"3x12",load:"200kg",note:""},
        {name:"Cadeira Extensora",sets:"3x15",load:"60kg",note:""},
        {name:"Mesa Flexora",sets:"3x12",load:"55kg",note:""},
        {name:"Panturrilha em Pé",sets:"4x20",load:"80kg",note:""},
      ]},
      { id:3, name:"Treino C · Pull", day:"Quinta", exercises:[
        {name:"Barra Fixa",sets:"4x6",load:"Peso corporal",note:"Adicionar carga em breve"},
        {name:"Serrote",sets:"4x10",load:"32kg",note:""},
        {name:"Pulldown Neutro",sets:"3x12",load:"70kg",note:""},
        {name:"Rosca Martelo",sets:"3x12",load:"16kg",note:""},
      ]},
    ],
    coachNote: "Excelente semana, Rafael. Aumentamos a carga no agachamento em 5kg e adicionamos um dia de mobilidade. Mantém a constância — você está no caminho exato.",
    goals: [{t:"5 treinos completos",p:100},{t:"Hidratação 3L/dia",p:86},{t:"Sono 7h+",p:71}],
    messages: [
      {from:"coach",text:"Oi Rafael! Semana excelente. Próxima semana vamos aumentar volume no superior.",time:"10:32"},
      {from:"student",text:"Obrigado! Me sinto muito mais forte. Agachamento ficou mais fácil hoje.",time:"11:05"},
      {from:"coach",text:"Perfeito! Isso é a progressão de carga funcionando. Continua assim 💪",time:"11:20"},
    ]
  },
  3: {
    goal: "Ganhar massa magra", weeks: 12, startWeight: 58, currentWeight: 62.4,
    streak: 18, monthlyWorkouts: 19,
    weightHistory: [
      {d:"S1",v:58},{d:"S2",v:58.5},{d:"S3",v:59},{d:"S4",v:59.6},
      {d:"S5",v:60.2},{d:"S6",v:60.9},{d:"S7",v:61.5},{d:"S8",v:62.4},
    ],
    weekFreq: [{d:"Seg",v:1},{d:"Ter",v:0},{d:"Qua",v:1},{d:"Qui",v:1},{d:"Sex",v:0},{d:"Sáb",v:1},{d:"Dom",v:0}],
    workouts: [
      { id:1, name:"Treino A · Full Body", day:"Segunda", exercises:[
        {name:"Agachamento",sets:"3x10",load:"50kg",note:""},
        {name:"Supino Plano",sets:"3x10",load:"40kg",note:""},
        {name:"Remada Máquina",sets:"3x12",load:"50kg",note:""},
        {name:"Tríceps Francês",sets:"3x12",load:"15kg",note:""},
      ]},
    ],
    coachNote: "Camila, sua evolução em força está impressionante. Continuamos o foco em hipertrofia controlada.",
    goals: [{t:"4 treinos completos",p:100},{t:"Proteína 120g/dia",p:78},{t:"Sono 8h+",p:64}],
    messages: [
      {from:"coach",text:"Camila, seus números de força estão subindo muito bem!",time:"09:15"},
      {from:"student",text:"Estou adorando! Primeira vez que vejo resultado tão consistente.",time:"10:00"},
    ]
  },
  4: {
    goal: "Performance", weeks: 6, startWeight: 82, currentWeight: 80.5,
    streak: 31, monthlyWorkouts: 24,
    weightHistory: [
      {d:"S1",v:82},{d:"S2",v:81.5},{d:"S3",v:81},{d:"S4",v:80.8},
      {d:"S5",v:80.6},{d:"S6",v:80.5},
    ],
    weekFreq: [{d:"Seg",v:1},{d:"Ter",v:1},{d:"Qua",v:1},{d:"Qui",v:1},{d:"Sex",v:1},{d:"Sáb",v:0},{d:"Dom",v:0}],
    workouts: [
      { id:1, name:"Treino A · Força", day:"Segunda", exercises:[
        {name:"Deadlift",sets:"5x5",load:"140kg",note:"RPE 8"},
        {name:"Agachamento High Bar",sets:"5x5",load:"110kg",note:"RPE 8"},
        {name:"Press Overhead",sets:"4x6",load:"70kg",note:""},
      ]},
    ],
    coachNote: "Bruno, você quebrou seu recorde no deadlift essa semana. 140kg está impecável. Próximo ciclo foco em speed work.",
    goals: [{t:"5 treinos força",p:100},{t:"RPE controlado",p:92},{t:"Mobilidade 15min",p:60}],
    messages: [
      {from:"coach",text:"Bruno! 140kg no deadlift essa semana. Fantástico!",time:"18:00"},
      {from:"student",text:"Mal acreditei. Obrigado pelo ciclo que montou!",time:"18:30"},
    ]
  },
};

// ─── Components ───────────────────────────────────────────────────────────

function NeonBtn({ children, onClick, secondary, small, style = {} }: NeonBtnProps) {
  const base: CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 8,
    borderRadius: 100, fontWeight: 600, cursor: "pointer", transition: "all .2s",
    fontSize: small ? 13 : 15, padding: small ? "8px 18px" : "14px 28px",
    border: "none",
  };
  const variant: CSSProperties = secondary
    ? { background: "rgba(255,255,255,0.06)", color: "#f5f5f5", border: `1px solid ${BORDER}` }
    : { background: N, color: "#000" };
  return (
    <button style={{ ...base, ...variant, ...style }} onClick={onClick}>
      {children}
    </button>
  );
}

function KpiCard({ icon: Icon, label, value, delta, color = N }: KpiCardProps) {
  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
        <Icon size={16} style={{ color }} />
      </div>
      <div className="display" style={{ fontSize: 26, fontWeight: 800 }}>{value}</div>
      <div style={{ fontSize: 12, color }}>{delta}</div>
    </div>
  );
}

// ─── LOGIN PAGE ────────────────────────────────────────────────────────────
function LoginPage({ onLogin, onBackToHome }: LoginPageProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  function handleSubmit() {
    if (!email.trim() || !password.trim()) {
      setError("E-mail e senha são obrigatórios.");
      return;
    }

    try {
      setLoading(true);
      setTimeout(() => {
        const user = USERS.find(u => u.email === email && u.password === password);
        if (user) {
          onLogin(user);
        } else {
          setError("E-mail ou senha incorretos.");
        }
        setLoading(false);
      }, 600);
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at top right, rgba(0,255,136,0.08), transparent 50%), radial-gradient(ellipse at bottom left, rgba(0,255,136,0.04), transparent 50%)" }} />
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}
      >
        {/* Botão Voltar */}
        {onBackToHome && (
          <button
            onClick={onBackToHome}
            style={{
              position: "absolute",
              top: -40,
              left: 0,
              background: "none",
              border: "none",
              color: MUTED,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 12,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = N)}
            onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
          >
            <ArrowLeft size={14} /> Voltar
          </button>
        )}

        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 52, height: 52, borderRadius: 16, background: N, marginBottom: 20 }}>
            <span className="display" style={{ fontWeight: 800, color: "#000", fontSize: 18 }}>GC</span>
          </div>
          <h1 className="display" style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Área do Aluno</h1>
          <p className="muted" style={{ fontSize: 14 }}>Acesse sua plataforma de performance</p>
        </div>

        <div className="glass" style={{ padding: 32 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>E-mail</label>
            <input
              type="email" placeholder="seu@email.com" value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>Senha</label>
            <div style={{ position: "relative" }}>
              <input
                type={show ? "text" : "password"} placeholder="••••••••" value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                style={{ paddingRight: 48 }}
              />
              <button onClick={() => setShow(!show)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: MUTED }}>
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ background: "rgba(255,60,60,0.1)", border: "1px solid rgba(255,60,60,0.2)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#ff6b6b", marginBottom: 16 }}>
              {error}
            </div>
          )}

          <NeonBtn onClick={handleSubmit} style={{ width: "100%", justifyContent: "center" }}>
            {loading ? <span className="pulse">Entrando…</span> : <><LogIn size={16} /> Entrar</>}
          </NeonBtn>

          <div style={{ marginTop: 24, padding: 16, background: "rgba(0,255,136,0.05)", borderRadius: 12, border: `1px solid ${N}22` }}>
            <p style={{ fontSize: 11, color: MUTED, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>Demo · Credenciais de teste</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                { label: "Aluno Rafael", email: "rafael@email.com", pwd: "rafael123" },
                { label: "Aluna Camila", email: "camila@email.com", pwd: "camila123" },
                { label: "Aluno Bruno", email: "bruno@email.com", pwd: "bruno123" },
              ].map(d => (
                <button key={d.email} onClick={() => { setEmail(d.email); setPassword(d.pwd); setError(""); }}
                  style={{ background: "none", border: "none", textAlign: "left", padding: "4px 0", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: MUTED }}>{d.label}</span>
                  <span style={{ fontSize: 11, color: N + "99" }}>{d.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── STUDENT DASHBOARD ─────────────────────────────────────────────────────
function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
  const sd = STUDENTS_DATA[user.id];
  const [tab, setTab] = useState<"home" | "treino" | "evolucao" | "mensagens">("home");
  const [chatInput, setChatInput] = useState<string>("");
  const [localMsgs, setLocalMsgs] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const msgs = [...(sd?.messages || []), ...localMsgs];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  if (!sd) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div className="card" style={{ maxWidth: 400, textAlign: "center" }}>
          <p style={{ color: MUTED, marginBottom: 16 }}>Dados do aluno não encontrados.</p>
          <NeonBtn onClick={onLogout} secondary>
            <LogOut size={14} /> Voltar ao login
          </NeonBtn>
        </div>
      </div>
    );
  }

  function sendMsg() {
    if (!chatInput.trim()) return;
    setLocalMsgs(prev => [...prev, { from: "student", text: chatInput, time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) }]);
    setChatInput("");
  }

  const tabs: TabItem[] = [
    { id: "home", label: "Início", icon: Activity },
    { id: "treino", label: "Meu treino", icon: Dumbbell },
    { id: "evolucao", label: "Evolução", icon: TrendingUp },
    { id: "mensagens", label: "Mensagens", icon: MessageCircle },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d" }}>
      <style>{css}</style>
      <div className="student-area">
        {/* Header */}
        <div style={{ borderBottom: `1px solid ${BORDER}`, padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#0d0d0d", zIndex: 50 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: N, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="display" style={{ fontWeight: 800, color: "#000", fontSize: 12 }}>GC</span>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {tabs.map(t => (
                <button key={t.id} className={`tab-btn ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}
                  style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
                  <t.icon size={13} /> {t.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${N}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: N }}>
              {user.avatar}
            </div>
            <button onClick={onLogout} style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "6px 12px", color: MUTED, fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}>
              <LogOut size={13} /> Sair
            </button>
          </div>
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px" }}>
          <AnimatePresence mode="wait">
            {tab === "home" && (
              <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{ marginBottom: 24 }}>
                  <p style={{ fontSize: 12, color: MUTED }}>Bom dia,</p>
                  <h1 className="display" style={{ fontSize: 30, fontWeight: 800 }}>{user.name.split(" ")[0]} 👊</h1>
                  <p style={{ fontSize: 13, color: N, marginTop: 4 }}>Semana {sd.weeks} · {sd.goal}</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10, marginBottom: 20 }}>
                  <KpiCard icon={TrendingUp} label="Peso atual" value={`${sd.currentWeight} kg`} delta={`${(sd.currentWeight - sd.startWeight).toFixed(1)} kg total`} />
                  <KpiCard icon={Flame} label="Streak" value={`${sd.streak} dias`} delta="Recorde pessoal" />
                  <KpiCard icon={Target} label="Meta" value={`${sd.goal}`} delta={`Semana ${sd.weeks}`} />
                  <KpiCard icon={Calendar} label="Treinos/mês" value={sd.monthlyWorkouts} delta="+3 vs anterior" />
                </div>

                {/* Metas */}
                <div className="card" style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Metas da semana</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {sd.goals.map(g => (
                      <div key={g.t}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                          <span>{g.t}</span>
                          <span style={{ color: N, fontWeight: 600 }}>{g.p}%</span>
                        </div>
                        <div style={{ height: 6, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                          <motion.div
                            initial={{ width: 0 }} animate={{ width: `${g.p}%` }} transition={{ duration: 1 }}
                            style={{ height: "100%", background: N, borderRadius: 4 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Coach note */}
                <div className="card" style={{ background: `${N}06`, borderColor: `${N}22` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${N}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: N }}>GC</div>
                    <div>
                      <div style={{ fontSize: 11, color: N, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Observação do treinador</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.85)" }}>{sd.coachNote}</p>
                </div>
              </motion.div>
            )}

            {tab === "treino" && (
              <motion.div key="treino" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="display" style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>Meu treino</h2>
                {sd.workouts.map(w => (
                  <div key={w.id} className="card" style={{ marginBottom: 16 }}>
                    <div style={{ marginBottom: 16 }}>
                      <div className="display" style={{ fontSize: 16, fontWeight: 700 }}>{w.name}</div>
                      <div style={{ fontSize: 12, color: N, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                        <Clock size={11} /> {w.day}
                      </div>
                    </div>
                    <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
                      {w.exercises.map((ex, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          <div style={{ width: 26, height: 26, borderRadius: "50%", background: `${N}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: N, flexShrink: 0 }}>
                            {i + 1}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 500 }}>{ex.name}</div>
                            {ex.note && <div style={{ fontSize: 11, color: MUTED }}>{ex.note}</div>}
                          </div>
                          <div style={{ display: "flex", gap: 8 }}>
                            <span className="badge" style={{ background: `${N}15`, color: N }}>{ex.sets}</span>
                            <span style={{ fontSize: 12, color: MUTED }}>{ex.load}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${BORDER}` }}>
                      <NeonBtn small style={{ justifyContent: "center", width: "100%" }}>
                        <CheckCircle2 size={14} /> Marcar como concluído
                      </NeonBtn>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {tab === "evolucao" && (
              <motion.div key="evolucao" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="display" style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>Minha evolução</h2>

                <div className="card" style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <div>
                      <div style={{ fontSize: 12, color: MUTED }}>Peso — {sd.weeks} semanas</div>
                      <div className="display" style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }}>
                        {sd.currentWeight} <span style={{ fontSize: 14, color: MUTED }}>kg</span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 12, color: MUTED }}>Variação</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: N, marginTop: 4 }}>
                        {(sd.currentWeight - sd.startWeight).toFixed(1)} kg
                      </div>
                    </div>
                  </div>
                  <div style={{ height: 180 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sd.weightHistory} margin={{ top: 10, right: 8, left: -24, bottom: 0 }}>
                        <defs>
                          <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={N} stopOpacity={0.35} />
                            <stop offset="100%" stopColor={N} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="d" stroke="#555" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                        <YAxis stroke="#555" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} domain={["dataMin - 1", "dataMax + 1"]} />
                        <Tooltip contentStyle={{ background: "#161616", border: `1px solid ${BORDER}`, borderRadius: 10, color: "#f5f5f5", fontSize: 12 }} />
                        <Area type="monotone" dataKey="v" stroke={N} strokeWidth={2.5} fill="url(#wg)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="card">
                  <div style={{ fontSize: 12, color: MUTED, marginBottom: 12 }}>Frequência semanal</div>
                  <div style={{ height: 100 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sd.weekFreq} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                        <XAxis dataKey="d" stroke="#555" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                        <YAxis hide />
                        <Bar dataKey="v" fill={N} radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            )}

            {tab === "mensagens" && (
              <motion.div key="mensagens" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="card" style={{ display: "flex", flexDirection: "column", height: 480 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${BORDER}` }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${N}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: N }}>GC</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>Guilherme Couto</div>
                      <div style={{ fontSize: 11, color: N, display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: N, display: "inline-block" }} /> online
                      </div>
                    </div>
                  </div>
                  <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, paddingBottom: 4 }}>
                    {msgs.map((m, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: m.from === "student" ? "flex-end" : "flex-start" }}>
                        <div style={{
                          maxWidth: "72%", padding: "10px 14px",
                          borderRadius: m.from === "student" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                          background: m.from === "student" ? `${N}22` : CARD,
                          border: `1px solid ${m.from === "student" ? N + "33" : BORDER}`,
                          fontSize: 13, lineHeight: 1.6
                        }}>
                          <div>{m.text}</div>
                          <div style={{ fontSize: 10, color: MUTED, marginTop: 4, textAlign: "right" }}>{m.time}</div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 12, display: "flex", gap: 10, marginTop: 12 }}>
                    <input placeholder="Escreva uma mensagem…" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()} style={{ flex: 1 }} />
                    <button onClick={sendMsg} style={{ background: N, border: "none", borderRadius: 12, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", color: "#000" }}>
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN EXPORT ───────────────────────────────────────────────────────────
export function Studentarea({ onBackToHome }: StudentareaProps) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AnimatePresence mode="wait">
      {!user ? (
        <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <LoginPage onLogin={setUser} onBackToHome={onBackToHome} />
        </motion.div>
      ) : (
        <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <StudentDashboard user={user} onLogout={() => setUser(null)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}