/* eslint-disable prettier/prettier */
import { motion } from "framer-motion";

/**
 * Divisor visual entre seções (exceto Hero→LandingCarousel que tem o próprio).
 * Uso: <SectionDivider />
 */
export function SectionDivider() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative px-6 py-2"
      aria-hidden
    >
      <div className="mx-auto max-w-5xl relative flex items-center justify-center" style={{ height: 32 }}>

        {/* linha completa de fundo */}
        <div style={{
          position: "absolute", inset: "50% 0 auto",
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.07) 20%, rgba(255,255,255,0.07) 80%, transparent)",
        }} />

        {/* bloco central com três traços e dois pontos */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--background, #0a0a0a)", padding: "0 16px", position: "relative" }}>
          <div style={{ width: 20, height: 1, background: "rgba(0,255,136,0.25)" }} />
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(0,255,136,0.4)" }} />
          <div style={{ width: 32, height: 1, background: "linear-gradient(90deg, rgba(0,255,136,0.4), rgba(0,255,136,0.8))" }} />
          {/* pulso central */}
          <div style={{ position: "relative", width: 6, height: 6 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#00FF88", opacity: 0.15, animation: "sd-ping 2s cubic-bezier(0,0,0.2,1) infinite" }} />
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00FF88", opacity: 0.7 }} />
          </div>
          <div style={{ width: 32, height: 1, background: "linear-gradient(270deg, rgba(0,255,136,0.4), rgba(0,255,136,0.8))" }} />
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(0,255,136,0.4)" }} />
          <div style={{ width: 20, height: 1, background: "rgba(0,255,136,0.25)" }} />
        </div>

      </div>

      <style>{`
        @keyframes sd-ping {
          0%   { transform: scale(1);   opacity: .3; }
          75%  { transform: scale(2.4); opacity: 0;  }
          100% { transform: scale(2.4); opacity: 0;  }
        }
      `}</style>
    </motion.div>
  );
}