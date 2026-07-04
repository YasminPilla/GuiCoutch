/* eslint-disable prettier/prettier */
import { motion } from "framer-motion";
import { Check, X, Star } from "lucide-react";

const plans = [
  {
    key: "starter",
    name: "Starter",
    price: "39,90",
    tagline: "Comece sem desculpa",
    color: "#4ade80",
    popular: false,
    items: [
      { label: "Acesso à plataforma", ok: true },
      { label: "Treino personalizado (casa ou academia)", ok: true },
      { label: "Suporte via plataforma (respostas em 72h)", ok: true },
      { label: "Acompanhamento semanal", ok: false },
      { label: "Sugestão de alimentos", ok: false },
      { label: "Sugestão de suplementos", ok: false },
      { label: "Fotos e registro de progresso", ok: false },
      { label: "Videochamada mensal", ok: false },
    ],
  },
  {
    key: "plus",
    name: "Plus",
    price: "89,90",
    tagline: "O mais escolhido",
    color: "#00FF88",
    popular: true,
    items: [
      { label: "Acesso à plataforma", ok: true },
      { label: "Treino personalizado com periodização", ok: true },
      { label: "Suporte prioritário (respostas em 24h)", ok: true },
      { label: "Acompanhamento semanal", ok: true },
      { label: "Sugestão de alimentos estratégicos", ok: true },
      { label: "Sugestão de suplementos", ok: true },
      { label: "Fotos e registro de progresso", ok: true },
      { label: "Videochamada mensal", ok: false },
    ],
  },
  {
    key: "premium",
    name: "Premium",
    price: "179,90",
    tagline: "Máxima atenção e resultado",
    color: "#facc15",
    popular: false,
    items: [
      { label: "Acesso à plataforma", ok: true },
      { label: "Treino personalizado com periodização", ok: true },
      { label: "Suporte VIP (respostas em 12h)", ok: true },
      { label: "Acompanhamento quinzenal (check-in)", ok: true },
      { label: "Sugestão de alimentos estratégicos", ok: true },
      { label: "Sugestão de suplementos", ok: true },
      { label: "Relatório mensal de progresso", ok: true },
      { label: "Videochamada mensal (30 min)", ok: true },
    ],
  },
];

const tableRows = [
  { label: "Preço/mês", starter: "R$ 39,90", plus: "R$ 89,90", premium: "R$ 179,90", type: "text" as const },
  { label: "Acesso à plataforma", starter: true, plus: true, premium: true, type: "bool" as const },
  { label: "Treino personalizado", starter: true, plus: true, premium: true, type: "bool" as const },
  { label: "Acompanhamento semanal", starter: false, plus: true, premium: true, type: "bool" as const },
  { label: "Sugestão de alimentos", starter: false, plus: true, premium: true, type: "bool" as const },
  { label: "Sugestão de suplementos", starter: false, plus: true, premium: true, type: "bool" as const },
  { label: "Fotos e progresso", starter: false, plus: true, premium: true, type: "bool" as const },
  { label: "Videochamada mensal", starter: false, plus: false, premium: "30 min", type: "mixed" as const },
  { label: "Prioridade no atendimento", starter: "72h", plus: "24h", premium: "12h", type: "text" as const },
  { label: "Presencial (Cotia/SP)", starter: false, plus: "+ valor", premium: "+ valor", type: "mixed" as const },
];

export function Plans() {
  return (
    <section id="planos" className="relative py-28 px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_right,rgba(0,255,136,0.06),transparent_55%)]" />

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p style={{
            display: "inline-block",
            fontSize: 13, fontWeight: 800,
            letterSpacing: ".18em", textTransform: "uppercase",
            color: "#00FF88", marginBottom: 16,
            borderBottom: "1.5px solid rgba(0,255,136,0.35)",
            paddingBottom: 4,
          }}>
            Planos e preços
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight">
            Escolha o seu plano
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-base leading-relaxed">
            Todos os planos incluem acesso à plataforma e treino personalizado. Sem taxa de adesão.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-16">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              style={{
                position: "relative",
                background: plan.popular ? "rgba(0,255,136,0.06)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${plan.popular ? "rgba(0,255,136,0.4)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 24,
                padding: "32px 28px",
                display: "flex",
                flexDirection: "column",
                gap: 24,
                // Removido overflow: hidden para não cortar o badge e a linha de acento
              }}
            >
              {/* Popular line accent - Garantindo que não seja cortada */}
              {plan.popular && (
                <div style={{ 
                  position:'absolute', 
                  top: -1, // Ajustado para alinhar perfeitamente com a borda
                  left: 24, 
                  right: 24, 
                  height: 2, 
                  background:'linear-gradient(90deg,transparent,#00FF88,transparent)', 
                  zIndex: 20,
                  boxShadow: '0 0 10px rgba(0,255,136,0.5)' // Adicionado um leve brilho
                }} />
              )}

              {/* Popular badge */}
              {plan.popular && (
                <div style={{
                  position: "absolute", 
                  top: -14, 
                  left: "50%", 
                  transform: "translateX(-50%)",
                  background: "#00FF88", 
                  color: "#000",
                  fontSize: 11, 
                  fontWeight: 800, 
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  borderRadius: 99, 
                  padding: "5px 16px",
                  display: "flex", 
                  alignItems: "center", 
                  gap: 5,
                  whiteSpace: "nowrap",
                  zIndex: 30, // Garantindo que fique acima de tudo
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}>
                  <Star size={11} fill="#000" /> Mais popular
                </div>
              )}

              {/* Plan name + price */}
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: plan.color, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
                  {plan.name}
                </p>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", alignSelf: "flex-start", marginTop: 6 }}>R$</span>
                  <span className="font-display" style={{ fontSize: 52, fontWeight: 800, lineHeight: 1 }}>{plan.price}</span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>/mês</span>
                </div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>{plan.tagline}</p>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: "rgba(255,255,255,0.07)" }} />

              {/* Features */}
              <ul style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                {plan.items.map((item) => (
                  <li key={item.label} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13 }}>
                    <span style={{ marginTop: 1, flexShrink: 0 }}>
                      {item.ok
                        ? <Check size={15} color="#00FF88" strokeWidth={2.5} />
                        : <X size={15} color="rgba(255,255,255,0.2)" strokeWidth={2} />
                      }
                    </span>
                    <span style={{ color: item.ok ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)", lineHeight: 1.5 }}>
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="#quiz"
                style={{
                  display: "block", textAlign: "center",
                  background: plan.popular ? "#00FF88" : "transparent",
                  color: plan.popular ? "#000" : "rgba(255,255,255,0.7)",
                  border: plan.popular ? "none" : "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 12,
                  padding: "13px 0",
                  fontWeight: 700, fontSize: 14,
                  textDecoration: "none",
                  boxShadow: plan.popular ? "0 0 20px rgba(0,255,136,0.3)" : "none",
                  transition: "all 0.2s",
                }}
              >
                {plan.popular ? "Quero o Plus" : `Quero o ${plan.name}`}
              </a>
            </motion.div>
          ))}
        </div>

        {/* Comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 20,
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 480 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <th style={{ textAlign: "left", padding: "16px 20px", fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Recurso
                  </th>
                  {plans.map((p) => (
                    <th key={p.key} style={{ textAlign: "center", padding: "16px 12px", fontSize: 13, fontWeight: 700, color: p.popular ? "#00FF88" : "rgba(255,255,255,0.7)" }}>
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, i) => (
                  <tr key={row.label} style={{ borderBottom: i < tableRows.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)" }}>
                    <td style={{ textAlign: "left", padding: "13px 20px", fontSize: 13, color: "rgba(255,255,255,0.8)" }}>{row.label}</td>
                    {(["starter", "plus", "premium"] as const).map((key) => {
                      const val = row[key];
                      return (
                        <td key={key} style={{ textAlign: "center", padding: "13px 12px" }}>
                          {typeof val === "boolean"
                            ? val
                              ? <Check size={15} color="#00FF88" strokeWidth={2.5} style={{ margin: "0 auto" }} />
                              : <X size={15} color="rgba(255,255,255,0.2)" strokeWidth={2} style={{ margin: "0 auto" }} />
                            : <span style={{ fontSize: 12, color: val === "R$ 89,90" ? "#00FF88" : "rgba(255,255,255,0.6)", fontWeight: 600 }}>{val as string}</span>
                          }
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Sugestões de alimentos e suplementos são de caráter informativo e não substituem a consulta com um nutricionista.
        </p>
      </div>
    </section>
  );
}