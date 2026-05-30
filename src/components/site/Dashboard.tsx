/* eslint-disable prettier/prettier */
import { motion } from "framer-motion";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Calendar, Flame, Target, TrendingUp } from "lucide-react";

const weight = [
  { d: "Sem 1", v: 88 }, { d: "Sem 2", v: 87.2 }, { d: "Sem 3", v: 86.5 },
  { d: "Sem 4", v: 85.8 }, { d: "Sem 5", v: 85.1 }, { d: "Sem 6", v: 84.3 },
  { d: "Sem 7", v: 83.6 }, { d: "Sem 8", v: 82.9 },
];
const freq = [
  { d: "Seg", v: 1 }, { d: "Ter", v: 1 }, { d: "Qua", v: 0 },
  { d: "Qui", v: 1 }, { d: "Sex", v: 1 }, { d: "Sáb", v: 1 }, { d: "Dom", v: 0 },
];

export function Dashboard() {
  return (
    <section id="app" className="relative py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl mb-16">
          <p className="text-xs uppercase tracking-widest text-neon mb-4">Área do Aluno</p>
          <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight">
            Sua plataforma.<br /> Sua evolução em tempo real.
          </h2>
        </div>

        {/* Mockup app frame */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-[2rem] glass p-3 md:p-5 shadow-2xl"
        >
          <div className="absolute -inset-px rounded-[2rem] bg-gradient-to-b from-neon/20 via-transparent to-transparent pointer-events-none" />

          <div className="rounded-3xl bg-background/80 p-6 md:p-8">
            {/* top bar */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-neon/20 grid place-items-center text-neon font-bold">R</div>
                <div>
                  <div className="text-sm text-muted-foreground">Bom dia,</div>
                  <div className="font-display font-semibold">Rafael</div>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 glass rounded-full px-4 py-2 text-xs">
                <Calendar className="h-3.5 w-3.5 text-neon" />
                Semana 8 · Mesociclo 2
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-5">
              {/* KPI cards */}
              <div className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-4">
                {[
                  { icon: TrendingUp, l: "Peso atual", v: "82.9 kg", d: "-5.1 kg" },
                  { icon: Target, l: "Meta", v: "78 kg", d: "61% concluído" },
                  { icon: Flame, l: "Streak", v: "23 dias", d: "Recorde pessoal" },
                  { icon: Calendar, l: "Treinos / mês", v: "21", d: "+3 vs anterior" },
                ].map((k) => (
                  <div key={k.l} className="rounded-2xl bg-card border border-border p-4">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="text-xs">{k.l}</span>
                      <k.icon className="h-4 w-4 text-neon" />
                    </div>
                    <div className="font-display text-2xl font-bold mt-2">{k.v}</div>
                    <div className="text-xs text-neon mt-1">{k.d}</div>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="lg:col-span-2 rounded-2xl bg-card border border-border p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs text-muted-foreground">Evolução de peso</div>
                    <div className="font-display text-xl font-semibold">8 semanas</div>
                  </div>
                  <div className="text-xs text-neon font-semibold">↓ 5.1 kg</div>
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weight} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <XAxis dataKey="d" stroke="#8B8B8B" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                      <YAxis stroke="#8B8B8B" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} domain={["dataMin - 1", "dataMax + 1"]} />
                      <Line type="monotone" dataKey="v" stroke="#00FF88" strokeWidth={2.5} dot={{ fill: "#00FF88", r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <div className="text-xs text-muted-foreground mb-3">Frequência semanal</div>
                  <div className="h-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={freq} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                        <XAxis dataKey="d" stroke="#8B8B8B" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                        <YAxis hide />
                        <Bar dataKey="v" fill="#00FF88" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Coach note */}
            <div className="mt-5 rounded-2xl bg-neon/5 border border-neon/20 p-5 flex gap-4">
              <div className="h-10 w-10 rounded-full bg-neon/20 grid place-items-center text-neon font-bold shrink-0">GC</div>
              <div>
                <div className="text-xs text-neon font-semibold uppercase tracking-wider">Observação do treinador</div>
                <p className="text-sm mt-1 text-foreground/90">
                  Excelente semana, Rafael. Aumentamos a carga no agachamento em 5kg
                  e adicionamos um dia de mobilidade. Mantém a constância — você
                  está no caminho exato.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}