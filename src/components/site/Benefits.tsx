import { motion } from "framer-motion";
import { Activity, Target, MessagesSquare, Sparkles, TrendingUp, ShieldCheck } from "lucide-react";

const items = [
  { icon: Target, title: "Acompanhamento personalizado", text: "Plano construído sob medida para seu corpo, rotina e objetivo." },
  { icon: Activity, title: "Evolução monitorada", text: "Métricas semanais, ajuste de carga e progressão controlada." },
  { icon: MessagesSquare, title: "Suporte contínuo", text: "Canal direto comigo, tira-dúvidas e ajustes em tempo real." },
  { icon: Sparkles, title: "Método exclusivo", text: "Sistema GC de transformação, validado em centenas de alunos." },
  { icon: TrendingUp, title: "Resultados reais", text: "Sem promessas mágicas. Consistência e estratégia movem o ponteiro." },
  { icon: ShieldCheck, title: "Treino seguro", text: "Execução, mobilidade e saúde antes de qualquer extremo." },
];

export function Benefits() {
  return (
    <section className="relative py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl mb-16">
          <p className="text-xs uppercase tracking-widest text-neon mb-4">Por que GC</p>
          <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight">
            Não é treino solto.<br />
            <span className="text-muted-foreground">É um sistema profissional.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              className="group relative rounded-3xl bg-card border border-border p-7 overflow-hidden hover:border-neon/40 transition-all duration-500"
            >
              <div className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_top_right,rgba(0,255,136,0.12),transparent_50%)]" />
              <div className="relative">
                <div className="h-12 w-12 rounded-2xl bg-neon/10 grid place-items-center text-neon group-hover:bg-neon group-hover:text-black transition-all duration-500">
                  <it.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-xl font-semibold mt-6">{it.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{it.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}