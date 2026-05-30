/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable prettier/prettier */
 
/* eslint-disable prettier/prettier */
import { useState, useMemo, useRef, useEffect, ReactNode, CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell
} from "recharts";
import {
  LogIn, Eye, EyeOff, Users, Dumbbell, TrendingUp,
  Calendar, Flame, Target, MessageCircle, Bell, Settings,
  ChevronRight, Plus, Check, Trophy, BarChart2, LogOut,
  Star, Activity, ArrowLeft, Send, Pencil, X, CheckCircle2,
  Clock, Lock, LucideIcon, Edit2, Trash2, Save, AlertCircle,
  Download, Filter, Search, TrendingDown, Award
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
  danger?: boolean;
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

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

interface admin_dashboardProps {
  onBackToHome?: () => void;
}

interface TabItem {
  id: "dashboard" | "alunos" | "treinos" | "mensagens" | "relatorios";
  label: string;
  icon: LucideIcon;
}

// ─── Design tokens ─────────────────────────────────────────────────────────
const N = "#00FF88"; // neon
const CARD = "rgba(255,255,255,0.04)";
const BORDER = "rgba(255,255,255,0.08)";
const MUTED = "rgba(255,255,255,0.45)";
const DANGER = "#FF4444";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
  .admin-area * {box-sizing:border-box}
  .admin-area .display{font-family:'Syne',sans-serif}
  .admin-area .neon{color:${N}}
  .admin-area .muted{color:${MUTED}}
  .admin-area input,.admin-area textarea{background:${CARD};border:1px solid ${BORDER};color:#f5f5f5;font-family:'DM Sans',sans-serif;border-radius:12px;padding:12px 16px;width:100%;font-size:14px;outline:none;transition:border .2s}
  .admin-area input:focus,.admin-area textarea:focus{border-color:${N}44}
  .admin-area button{cursor:pointer;font-family:'DM Sans',sans-serif}
  .admin-area .card{background:${CARD};border:1px solid ${BORDER};border-radius:20px;padding:20px}
  .admin-area .glass{background:rgba(255,255,255,0.05);backdrop-filter:blur(12px);border:1px solid ${BORDER};border-radius:16px}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
  .admin-area .pulse{animation:pulse 2s infinite}
  .admin-area .tab-btn{background:none;border:none;padding:8px 16px;border-radius:10px;font-size:13px;font-weight:500;color:${MUTED};transition:all .2s}
  .admin-area .tab-btn.active{background:${N}18;color:${N}}
  .admin-area .badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600}
  .admin-area .student-row{display:flex;align-items:center;padding:12px;border-radius:12px;background:${CARD};border:1px solid ${BORDER};margin-bottom:8px;transition:all .2s}
  .admin-area .student-row:hover{background:rgba(0,255,136,0.06);border-color:${N}44}
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

function NeonBtn({ children, onClick, secondary, small, danger, style = {} }: NeonBtnProps) {
  const base: CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 8,
    borderRadius: 100, fontWeight: 600, cursor: "pointer", transition: "all .2s",
    fontSize: small ? 13 : 15, padding: small ? "8px 18px" : "14px 28px",
    border: "none",
  };
  let variant: CSSProperties;
  if (danger) {
    variant = { background: DANGER, color: "#fff" };
  } else if (secondary) {
    variant = { background: "rgba(255,255,255,0.06)", color: "#f5f5f5", border: `1px solid ${BORDER}` };
  } else {
    variant = { background: N, color: "#000" };
  }
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
        const user = USERS.find(u => u.email === email && u.password === password && u.role === "admin");
        if (user) {
          onLogin(user);
        } else {
          setError("E-mail ou senha incorretos. (Use: guilherme@gc.com / admin123)");
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
          <h1 className="display" style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Área do Admin</h1>
          <p className="muted" style={{ fontSize: 14 }}>Gerenciamento de alunos e treinos</p>
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
              />
              <button
                onClick={() => setShow(!show)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: MUTED, cursor: "pointer" }}
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {error && (
            <div style={{ background: `${DANGER}15`, border: `1px solid ${DANGER}44`, borderRadius: 12, padding: 12, marginBottom: 16, fontSize: 13, color: DANGER, display: "flex", alignItems: "center", gap: 8 }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}
          <NeonBtn onClick={handleSubmit} style={{ justifyContent: "center", width: "100%" }}>
            {loading ? "Entrando..." : "Entrar"}
          </NeonBtn>
        </div>
      </motion.div>
    </div>
  );
}

// ─── ADMIN DASHBOARD ───────────────────────────────────────────────────────
function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [tab, setTab] = useState<"dashboard" | "alunos" | "treinos" | "mensagens" | "relatorios">("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [editingNote, setEditingNote] = useState<string>("");
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const students = USERS.filter(u => u.role === "student");
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentStudent = selectedStudent ? students.find(s => s.id === selectedStudent) : null;
  const currentStudentData = currentStudent ? STUDENTS_DATA[currentStudent.id] : null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentStudentData?.messages]);

  function sendMsg() {
    if (!chatInput.trim() || !currentStudentData) return;
    const newMsg: Message = {
      from: "coach",
      text: chatInput,
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    };
    currentStudentData.messages.push(newMsg);
    setChatInput("");
  }

  function saveNote() {
    if (currentStudentData) {
      currentStudentData.coachNote = editingNote;
      setIsEditingNote(false);
    }
  }

  const tabs: TabItem[] = [
    { id: "dashboard", label: "Dashboard", icon: BarChart2 },
    { id: "alunos", label: "Alunos", icon: Users },
    { id: "treinos", label: "Treinos", icon: Dumbbell },
    { id: "mensagens", label: "Mensagens", icon: MessageCircle },
    { id: "relatorios", label: "Relatórios", icon: TrendingUp },
  ];

  const totalStudents = students.length;
  const activeStudents = students.filter(s => STUDENTS_DATA[s.id]?.streak > 0).length;
  const avgStreak = Math.round(students.reduce((sum, s) => sum + (STUDENTS_DATA[s.id]?.streak || 0), 0) / students.length);
  const totalWorkouts = students.reduce((sum, s) => sum + (STUDENTS_DATA[s.id]?.monthlyWorkouts || 0), 0);

  return (
    <div className="admin-area" style={{ minHeight: "100vh", background: "#0a0a0a", color: "#f5f5f5", paddingBottom: 40 }}>
      <style>{css}</style>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${BORDER}`, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(10,10,10,0.8)", backdropFilter: "blur(12px)", zIndex: 100 }}>
        <div>
          <h1 className="display" style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Admin</h1>
          <p style={{ fontSize: 12, color: MUTED, margin: "4px 0 0 0" }}>Bem-vindo, {user.name}</p>
        </div>
        <NeonBtn secondary small onClick={onLogout}>
          <LogOut size={14} /> Sair
        </NeonBtn>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: `1px solid ${BORDER}`, padding: "0 24px", display: "flex", gap: 8, overflowX: "auto" }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`tab-btn ${tab === t.id ? "active" : ""}`}
          >
            <t.icon size={14} style={{ marginRight: 4 }} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "24px", maxWidth: 1400, margin: "0 auto" }}>
        <AnimatePresence mode="wait">

          {/* DASHBOARD TAB */}
          {tab === "dashboard" && (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="display" style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>Dashboard</h2>

              {/* KPI Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
                <KpiCard icon={Users} label="Total de Alunos" value={totalStudents} delta={`${activeStudents} ativos`} />
                <KpiCard icon={Activity} label="Streaks Médio" value={avgStreak} delta="dias consecutivos" />
                <KpiCard icon={Dumbbell} label="Treinos/Mês" value={totalWorkouts} delta="total de sessões" color="#FF6B6B" />
                <KpiCard icon={TrendingUp} label="Taxa Ativa" value={`${Math.round((activeStudents/totalStudents)*100)}%`} delta="alunos em progresso" color="#4ECDC4" />
              </div>

              {/* Charts */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
                <div className="card">
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Frequência de Treinos (Últimas 8 semanas)</div>
                  <div style={{ height: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        {w:"S1",v:12},{w:"S2",v:14},{w:"S3",v:13},{w:"S4",v:16},
                        {w:"S5",v:15},{w:"S6",v:17},{w:"S7",v:18},{w:"S8",v:21}
                      ]}>
                        <XAxis dataKey="w" stroke="#555" tick={{ fontSize: 10 }} />
                        <YAxis stroke="#555" tick={{ fontSize: 10 }} />
                        <Tooltip contentStyle={{ background: "#161616", border: `1px solid ${BORDER}`, borderRadius: 10 }} />
                        <Line type="monotone" dataKey="v" stroke={N} strokeWidth={2.5} dot={{ fill: N, r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="card">
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Distribuição de Objetivos</div>
                  <div style={{ height: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={[
                          {name:"Perder gordura",value:1},{name:"Ganhar massa",value:1},{name:"Performance",value:1}
                        ]} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                          <Cell fill={N} />
                          <Cell fill="#FF6B6B" />
                          <Cell fill="#4ECDC4" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ALUNOS TAB */}
          {tab === "alunos" && (
            <motion.div key="alunos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 className="display" style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Gerenciar Alunos</h2>
                <NeonBtn small>
                  <Plus size={14} /> Novo Aluno
                </NeonBtn>
              </div>

              {/* Search */}
              <div style={{ marginBottom: 20, position: "relative" }}>
                <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: MUTED }} />
                <input
                  type="text"
                  placeholder="Buscar aluno por nome ou e-mail..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: 40 }}
                />
              </div>

              {/* Students List */}
              <div>
                {filteredStudents.map(student => {
                  const sd = STUDENTS_DATA[student.id];
                  const isSelected = selectedStudent === student.id;
                  return (
                    <motion.div key={student.id} layout>
                      <div
                        onClick={() => setSelectedStudent(isSelected ? null : student.id)}
                        className="student-row"
                        style={{ cursor: "pointer" }}
                      >
                        <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${N}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: N, flexShrink: 0 }}>
                          {student.avatar}
                        </div>
                        <div style={{ flex: 1, marginLeft: 12 }}>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>{student.name}</div>
                          <div style={{ fontSize: 11, color: MUTED }}>{student.email}</div>
                        </div>
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: N }}>{sd?.goal}</div>
                            <div style={{ fontSize: 11, color: MUTED }}>Streak: {sd?.streak}d</div>
                          </div>
                          <ChevronRight size={16} style={{ color: MUTED }} />
                        </div>
                      </div>

                      {isSelected && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden" }}>
                          <div className="card" style={{ marginBottom: 16, marginTop: 8, background: `${N}06`, borderColor: `${N}22` }}>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 16 }}>
                              <div>
                                <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase" }}>Peso Inicial</div>
                                <div style={{ fontSize: 18, fontWeight: 700, color: N }}>{sd?.startWeight} kg</div>
                              </div>
                              <div>
                                <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase" }}>Peso Atual</div>
                                <div style={{ fontSize: 18, fontWeight: 700 }}>{sd?.currentWeight} kg</div>
                              </div>
                              <div>
                                <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase" }}>Variação</div>
                                <div style={{ fontSize: 18, fontWeight: 700, color: (sd?.currentWeight || 0) < (sd?.startWeight || 0) ? "#FF6B6B" : "#4ECDC4" }}>
                                  {((sd?.currentWeight || 0) - (sd?.startWeight || 0)).toFixed(1)} kg
                                </div>
                              </div>
                              <div>
                                <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase" }}>Treinos/Mês</div>
                                <div style={{ fontSize: 18, fontWeight: 700 }}>{sd?.monthlyWorkouts}</div>
                              </div>
                            </div>

                            <div style={{ display: "flex", gap: 8 }}>
                              <NeonBtn small secondary style={{ flex: 1, justifyContent: "center" }}>
                                <Edit2 size={14} /> Editar Treino
                              </NeonBtn>
                              <NeonBtn small secondary style={{ flex: 1, justifyContent: "center" }}>
                                <MessageCircle size={14} /> Mensagem
                              </NeonBtn>
                              <NeonBtn small danger style={{ flex: 1, justifyContent: "center" }}>
                                <Trash2 size={14} /> Remover
                              </NeonBtn>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* TREINOS TAB */}
          {tab === "treinos" && (
            <motion.div key="treinos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 className="display" style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Gerenciar Treinos</h2>
                <NeonBtn small>
                  <Plus size={14} /> Novo Treino
                </NeonBtn>
              </div>

              {currentStudent && currentStudentData ? (
                <div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ fontSize: 12, color: MUTED, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Selecione um aluno:</label>
                    <select
                      value={selectedStudent || ""}
                      onChange={e => setSelectedStudent(Number(e.target.value))}
                      style={{
                        background: CARD,
                        border: `1px solid ${BORDER}`,
                        color: "#f5f5f5",
                        borderRadius: 12,
                        padding: "12px 16px",
                        width: "100%",
                        fontSize: 14,
                        fontFamily: "'DM Sans', sans-serif",
                        cursor: "pointer"
                      }}
                    >
                      {students.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  {currentStudentData.workouts.map(w => (
                    <div key={w.id} className="card" style={{ marginBottom: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 16 }}>
                        <div>
                          <div className="display" style={{ fontSize: 16, fontWeight: 700 }}>{w.name}</div>
                          <div style={{ fontSize: 12, color: N, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                            <Clock size={11} /> {w.day}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <NeonBtn small secondary>
                            <Edit2 size={14} />
                          </NeonBtn>
                          <NeonBtn small danger>
                            <Trash2 size={14} />
                          </NeonBtn>
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
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card" style={{ textAlign: "center", padding: 40 }}>
                  <Dumbbell size={32} style={{ color: MUTED, margin: "0 auto 12px" }} />
                  <p style={{ color: MUTED }}>Selecione um aluno para visualizar seus treinos</p>
                </div>
              )}
            </motion.div>
          )}

          {/* MENSAGENS TAB */}
          {tab === "mensagens" && (
            <motion.div key="mensagens" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="display" style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>Mensagens</h2>

              <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: 16, height: 600 }}>
                {/* Students List */}
                <div className="card" style={{ overflowY: "auto", padding: 0 }}>
                  {students.map(s => {
                    const isSelected = selectedStudent === s.id;
                    return (
                      <div
                        key={s.id}
                        onClick={() => setSelectedStudent(s.id)}
                        style={{
                          padding: 12,
                          borderBottom: `1px solid ${BORDER}`,
                          cursor: "pointer",
                          background: isSelected ? `${N}15` : "transparent",
                          transition: "all .2s"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${N}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: N, flexShrink: 0 }}>
                            {s.avatar}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
                            <div style={{ fontSize: 10, color: MUTED, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Clique para conversar</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Chat */}
                {currentStudent && currentStudentData ? (
                  <div className="card" style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${BORDER}` }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${N}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: N }}>
                        {currentStudent.avatar}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{currentStudent.name}</div>
                        <div style={{ fontSize: 11, color: N, display: "flex", alignItems: "center", gap: 4 }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: N, display: "inline-block" }} /> online
                        </div>
                      </div>
                    </div>

                    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, paddingBottom: 4 }}>
                      {currentStudentData.messages.map((m, i) => (
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
                      <button onClick={sendMsg} style={{ background: N, border: "none", borderRadius: 12, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", color: "#000", cursor: "pointer" }}>
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ textAlign: "center", color: MUTED }}>
                      <MessageCircle size={32} style={{ margin: "0 auto 12px" }} />
                      <p>Selecione um aluno para conversar</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* RELATÓRIOS TAB */}
          {tab === "relatorios" && (
            <motion.div key="relatorios" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 className="display" style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Relatórios</h2>
                <NeonBtn small secondary>
                  <Download size={14} /> Exportar
                </NeonBtn>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
                {/* Alunos por Objetivo */}
                <div className="card">
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Alunos por Objetivo</div>
                  <div style={{ height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        {objetivo:"Perder Gordura",qtd:1},{objetivo:"Ganhar Massa",qtd:1},{objetivo:"Performance",qtd:1}
                      ]}>
                        <XAxis dataKey="objetivo" stroke="#555" tick={{ fontSize: 10 }} />
                        <YAxis stroke="#555" tick={{ fontSize: 10 }} />
                        <Tooltip contentStyle={{ background: "#161616", border: `1px solid ${BORDER}`, borderRadius: 10 }} />
                        <Bar dataKey="qtd" fill={N} radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Progresso de Peso */}
                <div className="card">
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Progresso de Peso (Alunos)</div>
                  <div style={{ height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        {semana:"S1",rafael:88,camila:58,bruno:82},
                        {semana:"S2",rafael:87.2,camila:58.5,bruno:81.5},
                        {semana:"S3",rafael:86.5,camila:59,bruno:81},
                        {semana:"S4",rafael:85.8,camila:59.6,bruno:80.8},
                        {semana:"S5",rafael:85.1,camila:60.2,bruno:80.6},
                        {semana:"S6",rafael:84.3,camila:60.9,bruno:80.5},
                      ]}>
                        <XAxis dataKey="semana" stroke="#555" tick={{ fontSize: 10 }} />
                        <YAxis stroke="#555" tick={{ fontSize: 10 }} />
                        <Tooltip contentStyle={{ background: "#161616", border: `1px solid ${BORDER}`, borderRadius: 10 }} />
                        <Legend />
                        <Line type="monotone" dataKey="rafael" stroke={N} strokeWidth={2} />
                        <Line type="monotone" dataKey="camila" stroke="#FF6B6B" strokeWidth={2} />
                        <Line type="monotone" dataKey="bruno" stroke="#4ECDC4" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Tabela de Desempenho */}
              <div className="card" style={{ marginTop: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Desempenho Geral dos Alunos</div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                        <th style={{ textAlign: "left", padding: 12, color: MUTED, fontWeight: 600 }}>Aluno</th>
                        <th style={{ textAlign: "left", padding: 12, color: MUTED, fontWeight: 600 }}>Objetivo</th>
                        <th style={{ textAlign: "center", padding: 12, color: MUTED, fontWeight: 600 }}>Streak</th>
                        <th style={{ textAlign: "center", padding: 12, color: MUTED, fontWeight: 600 }}>Treinos/Mês</th>
                        <th style={{ textAlign: "center", padding: 12, color: MUTED, fontWeight: 600 }}>Progresso</th>
                        <th style={{ textAlign: "center", padding: 12, color: MUTED, fontWeight: 600 }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(s => {
                        const sd = STUDENTS_DATA[s.id];
                        const progress = ((sd.currentWeight - sd.startWeight) / sd.startWeight * 100).toFixed(1);
                        return (
                          <tr key={s.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                            <td style={{ padding: 12 }}>{s.name}</td>
                            <td style={{ padding: 12 }}>{sd.goal}</td>
                            <td style={{ padding: 12, textAlign: "center", color: N, fontWeight: 600 }}>{sd.streak}d</td>
                            <td style={{ padding: 12, textAlign: "center" }}>{sd.monthlyWorkouts}</td>
                            <td style={{ padding: 12, textAlign: "center", color: Number(progress) < 0 ? "#FF6B6B" : "#4ECDC4", fontWeight: 600 }}>{progress}%</td>
                            <td style={{ padding: 12, textAlign: "center" }}>
                              <span className="badge" style={{ background: `${N}15`, color: N, justifyContent: "center" }}>
                                <Check size={12} /> Ativo
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── MAIN EXPORT ───────────────────────────────────────────────────────────
export function admin_dashboard({ onBackToHome }: admin_dashboardProps) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AnimatePresence mode="wait">
      {!user ? (
        <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <LoginPage onLogin={setUser} onBackToHome={onBackToHome} />
        </motion.div>
      ) : (
        <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <AdminDashboard user={user} onLogout={() => setUser(null)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}