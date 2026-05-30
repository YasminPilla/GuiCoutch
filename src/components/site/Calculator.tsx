import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function Calculator() {
  const [weight, setWeight] = useState(85);
  const [goal, setGoal] = useState<"cut" | "bulk">("cut");
  const [freq, setFreq] = useState(4);
  const [exp, setExp] = useState<"beg" | "int" | "adv">("int");

  const data = useMemo(() => {
    const weeks = 16;
    const rate = (goal === "cut" ? -0.55 : 0.35) * (freq / 4) * (exp === "beg" ? 1.15 : exp === "adv" ? 0.85 : 1);
    return Array.from({ length: weeks + 1 }, (_, i) => ({
      week: `S${i}`,
      kg: +(weight + rate * i).toFixed(1),
    }));
  }, [weight, goal, freq, exp]);

  const final = data[data.length - 1].kg;
  const delta = +(final - weight).toFixed(1);

  return (
    <section className="relative py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl mb-16">
          <p className="text-xs uppercase tracking-widest text-neon mb-4">Simulador</p>
          <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight">
            Sua evolução,<br /> projetada em números.
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Inputs */}
          <div className="lg:col-span-2 rounded-3xl bg-card border border-border p-7 space-y-6">
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Peso atual: <span className="text-neon font-bold">{weight} kg</span></label>
              <input type="range" min={45} max={150} value={weight} onChange={(e) => setWeight(+e.target.value)}
                className="w-full mt-3 accent-[color:var(--neon)]" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-3 block">Objetivo</label>
              <div className="grid grid-cols-2 gap-2">
                {[["cut", "Perder gordura"], ["bulk", "Ganhar massa"]].map(([v, l]) => (
                  <button key={v} onClick={() => setGoal(v as "cut" | "bulk")}
                    className={`rounded-xl px-3 py-3 text-sm font-medium border transition ${goal === v ? "bg-neon text-black border-neon" : "border-border hover:border-neon/40"}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Frequência: <span className="text-neon font-bold">{freq}x/semana</span></label>
              <input type="range" min={2} max={6} value={freq} onChange={(e) => setFreq(+e.target.value)}
                className="w-full mt-3 accent-[color:var(--neon)]" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground mb-3 block">Experiência</label>
              <div className="grid grid-cols-3 gap-2">
                {[["beg", "Iniciante"], ["int", "Intermediário"], ["adv", "Avançado"]].map(([v, l]) => (
                  <button key={v} onClick={() => setExp(v as "beg" | "int" | "adv")}
                    className={`rounded-xl px-2 py-3 text-xs font-medium border transition ${exp === v ? "bg-neon text-black border-neon" : "border-border hover:border-neon/40"}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Result */}
          <motion.div
            key={`${weight}-${goal}-${freq}-${exp}`}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-3 rounded-3xl bg-card border border-border p-7 relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-neon/10 blur-3xl" />
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6 relative">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Projeção 16 semanas</div>
                <div className="font-display text-5xl font-bold mt-2">
                  {final} <span className="text-muted-foreground text-2xl">kg</span>
                </div>
                <div className={`text-sm mt-1 ${delta < 0 ? "text-neon" : "text-neon"}`}>
                  {delta > 0 ? "+" : ""}{delta} kg em 4 meses
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Mensagem</div>
                <div className="text-sm max-w-[16rem] mt-2 text-foreground/90">
                  {goal === "cut"
                    ? "Foco em déficit moderado, força preservada."
                    : "Hipertrofia controlada, sem inchaço."}
                </div>
              </div>
            </div>

            <div className="h-64 relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00FF88" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#00FF88" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="week" stroke="#8B8B8B" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis stroke="#8B8B8B" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={["dataMin - 2", "dataMax + 2"]} />
                  <Tooltip contentStyle={{ background: "#161616", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#F5F5F5" }} />
                  <Area type="monotone" dataKey="kg" stroke="#00FF88" strokeWidth={2.5} fill="url(#g)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}