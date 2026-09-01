/* eslint-disable prettier/prettier */
import { motion } from "framer-motion";
import { Home, Dumbbell, Flame } from "lucide-react";

const products = [
  {
    icon: Home,
    name: "Planilha de Treino — Casa",
    desc: "4 semanas de treino funcional sem equipamentos. Exercícios com vídeo demonstrativo. Ideal para iniciantes e intermediários.",
    price: "R$ 27–47",
  },
  {
    icon: Dumbbell,
    name: "Planilha de Treino — Academia",
    desc: "Programa de 4 a 8 semanas focado em hipertrofia ou emagrecimento. Séries, repetições e carga orientativa.",
    price: "R$ 37–57",
  },
  {
    icon: Flame,
    name: "Desafio 21 Dias",
    desc: "PDF com treino diário por 3 semanas + dicas de hábitos e hidratação. Para criar a rotina de uma vez por todas.",
    price: "R$ 47–67",
  },
];

const WHATSAPP = "5511959222489";

function buildProductMessage(name: string, price: string): string {
  return encodeURIComponent(
    `Olá, Guilherme! Tenho interesse em adquirir o produto:\n\n*${name}*\nPreço: ${price}\n\nPoderia me passar mais informações?`
  );
}

export function MicroProducts() {
  return (
    <section id="produtos" className="relative py-28 px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(225,6,0,0.05),transparent_55%)]" />

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
            color: "#E10600", marginBottom: 16,
            borderBottom: "1.5px solid rgba(225,6,0,0.35)",
            paddingBottom: 4,
          }}>
            Produtos digitais
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight">
            Sem mensalidade.<br />Resultado direto.
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-base leading-relaxed">
            Compra única. Sem assinatura. Perfeito para quem quer começar com investimento mínimo.
          </p>
        </motion.div>

        {/* Individual products */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 20,
                  padding: "24px 22px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <div style={{
                  width: 44, height: 44,
                  background: "rgba(225,6,0,0.1)",
                  borderRadius: 12,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={20} color="#E10600" strokeWidth={1.5} />
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 6, lineHeight: 1.3 }}>{p.name}</h3>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}>{p.desc}</p>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 4 }}>
                  <span style={{ fontWeight: 800, fontSize: 18, color: "#E10600" }}>{p.price}</span>
                  <a
                    href={`https://wa.me/${WHATSAPP}?text=${buildProductMessage(p.name, p.price)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: "rgba(225,6,0,0.12)",
                      color: "#E10600",
                      border: "1px solid rgba(225,6,0,0.3)",
                      borderRadius: 10,
                      padding: "8px 16px",
                      fontSize: 13, fontWeight: 700,
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                      transition: "all 0.2s",
                    }}
                  >
                    Quero esse
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Todos os produtos são entregues digitalmente via WhatsApp após confirmação do pagamento.
        </p>
      </div>
    </section>
  );
}