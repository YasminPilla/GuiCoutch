/* eslint-disable prettier/prettier */
import { motion } from "framer-motion";
import { CheckCircle2, Target } from "lucide-react";

const credentials = [
  "Bacharel em Educação Física — UNESP",
];

const specialities = [
  "Emagrecimento Acelerado",
  "Hipertrofia & Ganho de Massa",
  "Treinamento de Força",
  "Correção Postural",
];

const stats = [
  { value: "200+", label: "alunos" },
  { value: "8 anos", label: "experiência" },
  { value: "94%", label: "retenção" },
];

export function About() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;800&family=Inter:wght@400;500&display=swap');

        /* ── Container principal ── */
        .ab {
          padding: 80px 24px;
          background: linear-gradient(135deg, rgba(0,255,136,0.02) 0%, rgba(0,0,0,0) 100%);
          font-family: 'Inter', sans-serif;
        }
        .ab-inner {
          max-width: 1000px;
          margin: 0 auto;
        }

        /* ── Seção superior: foto + texto ── */
        .ab-row {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 60px;
          align-items: center;
          margin-bottom: 80px;
        }
        @media (max-width: 768px) {
          .ab-row {
            grid-template-columns: 1fr;
            gap: 40px;
            margin-bottom: 60px;
            text-align: center;
          }
        }

        /* ── Foto do personal ── */
        .ab-photo {
          aspect-ratio: 3/4;
          border-radius: 24px;
          background: linear-gradient(135deg, rgba(0,255,136,0.08) 0%, rgba(0,255,136,0.02) 100%);
          border: 1.5px solid rgba(0,255,136,0.25);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,255,136,0.08);
          transition: all 0.3s ease;
        }
        @media (max-width: 768px) {
          .ab-photo {
            max-width: 280px;
            margin: 0 auto;
          }
        }
        .ab-photo:hover {
          border-color: rgba(0,255,136,0.4);
          box-shadow: 0 12px 48px rgba(0,255,136,0.15);
        }
        .ab-photo-logo {
          width: 90px;
          height: 90px;
          object-fit: contain;
          opacity: 0.9;
        }
        .ab-photo-hint {
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          font-weight: 400;
          font-family: 'Inter', sans-serif;
        }
        .ab-photo-badge {
          position: absolute;
          bottom: 16px;
          left: 16px;
          right: 16px;
          background: rgba(10,10,10,0.92);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(0,255,136,0.2);
          border-radius: 14px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          text-align: left;
        }
        .ab-badge-logo {
          width: 32px;
          height: 32px;
          object-fit: contain;
          flex-shrink: 0;
        }
        .ab-badge-name {
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          font-family: 'Manrope', sans-serif;
        }
        .ab-badge-role {
          font-size: 11px;
          color: #00FF88;
          margin-top: 2px;
          font-weight: 400;
          font-family: 'Inter', sans-serif;
        }

        /* ── Seção de texto ── */
        .ab-eyebrow {
          display: inline-block;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #00FF88;
          margin-bottom: 16px;
          border-bottom: 2px solid rgba(0,255,136,0.4);
          padding-bottom: 6px;
          font-family: 'Manrope', sans-serif;
        }
        .ab-title {
          font-size: clamp(36px, 6vw, 52px);
          font-weight: 800;
          line-height: 1.08;
          letter-spacing: -0.01em;
          margin-bottom: 20px;
          color: #fff;
          font-family: 'Manrope', sans-serif;
        }
        .ab-title-secondary {
          color: rgba(255,255,255,0.32);
          font-weight: 600;
          font-family: 'Manrope', sans-serif;
        }
        .ab-bio {
          font-size: 15px;
          line-height: 1.8;
          color: rgba(255,255,255,0.52);
          margin-bottom: 32px;
          max-width: 520px;
          font-family: 'Inter', sans-serif;
          font-weight: 400;
        }
        @media (max-width: 768px) {
          .ab-bio {
            margin: 0 auto 32px auto;
          }
        }

        /* ── Stats ── */
        .ab-stats {
          display: flex;
          justify-content: space-around;
          gap: 24px;
          flex-wrap: wrap;
          padding: 24px 28px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(0,255,136,0.15);
          border-radius: 16px;
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
        }
        .ab-stats:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(0,255,136,0.25);
        }
        .ab-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 100px;
        }
        .ab-stat-value {
          font-size: 28px;
          font-weight: 800;
          color: #00FF88;
          line-height: 1;
          margin-bottom: 6px;
          font-family: 'Manrope', sans-serif;
        }
        .ab-stat-label {
          font-size: 11px;
          color: rgba(255,255,255,0.42);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-family: 'Inter', sans-serif;
        }

        /* ── Seção inferior ── */
        .ab-bottom {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        @media (max-width: 768px) {
          .ab-bottom {
            grid-template-columns: 1fr;
          }
        }

        /* ── Card Formação ── */
        .ab-creds-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
          border: 1px solid rgba(0,255,136,0.15);
          border-radius: 18px;
          padding: 28px;
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
        }
        .ab-creds-card:hover {
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%);
          border-color: rgba(0,255,136,0.3);
          box-shadow: 0 8px 32px rgba(0,255,136,0.1);
        }
        .ab-card-title {
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.55);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Manrope', sans-serif;
        }
        .ab-card-title::before {
          content: '';
          width: 3px;
          height: 12px;
          background: #00FF88;
          border-radius: 2px;
        }
        .ab-cred {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
          color: rgba(255,255,255,0.65);
          line-height: 1.6;
          margin-bottom: 14px;
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          transition: color 0.3s ease;
        }
        .ab-cred:last-child {
          margin-bottom: 0;
        }
        .ab-cred svg {
          color: #00FF88;
          flex-shrink: 0;
        }
        .ab-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin: 20px 0;
        }

        /* ── Card Depoimento ── */
        .ab-quote-card {
          background: linear-gradient(135deg, rgba(0,255,136,0.06) 0%, rgba(0,255,136,0.02) 100%);
          border: 1.5px solid rgba(0,255,136,0.2);
          border-radius: 18px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
        }
        .ab-quote-card:hover {
          background: linear-gradient(135deg, rgba(0,255,136,0.08) 0%, rgba(0,255,136,0.03) 100%);
          border-color: rgba(0,255,136,0.35);
          box-shadow: 0 8px 32px rgba(0,255,136,0.12);
        }
        .ab-quote-text {
          font-size: 15px;
          font-weight: 400;
          line-height: 1.8;
          color: rgba(255,255,255,0.88);
          margin-bottom: 20px;
          font-style: italic;
          font-family: 'Inter', sans-serif;
        }
        .ab-quote-text::before {
          content: '"';
          font-size: 32px;
          color: #00FF88;
          margin-right: 4px;
          line-height: 0.5;
          font-family: 'Manrope', sans-serif;
          font-weight: 800;
        }
        .ab-quote-author {
          display: flex;
          align-items: center;
          gap: 12px;
          text-align: left;
        }
        .ab-quote-logo {
          width: 36px;
          height: 36px;
          object-fit: contain;
          flex-shrink: 0;
        }
        .ab-quote-name {
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          font-family: 'Manrope', sans-serif;
        }
        .ab-quote-role {
          font-size: 11px;
          color: #00FF88;
          margin-top: 2px;
          font-weight: 400;
          font-family: 'Inter', sans-serif;
        }
      `}</style>

      <section id="about" className="ab">
        <div className="ab-inner">

          {/* ── Top: photo + text ── */}
          <div className="ab-row">

            {/* Photo */}
            <motion.div
              className="ab-photo"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <img src="/logo.png" alt="GC Fitness" className="ab-photo-logo" />
              <span className="ab-photo-hint">Sua foto aqui</span>
              <div className="ab-photo-badge">
                <img src="/logo.png" alt="GC" className="ab-badge-logo" />
                <div>
                  <div className="ab-badge-name">Guilherme Couto</div>
                  <div className="ab-badge-role">Personal · CREF ativo</div>
                </div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <p className="ab-eyebrow">Sobre o Personal</p>
              <h2 className="ab-title">
                Guilherme Couto.
              </h2>
              <p className="ab-bio">
                Comecei na academia aos 17 anos tentando entender por que os mesmos treinos
                funcionavam para uns e não para outros. Oito anos depois, a resposta continua
                sendo a mesma: <strong>individualização, consistência e dados</strong>.
              </p>

              <div className="ab-stats">
                {stats.map((s) => (
                  <div key={s.label} className="ab-stat">
                    <div className="ab-stat-value">{s.value}</div>
                    <div className="ab-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* ── Bottom: credentials + quote ── */}
          <motion.div
            className="ab-bottom"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className="ab-creds-card">
              <p className="ab-card-title">Formação</p>
              {credentials.map((c) => (
                <div key={c} className="ab-cred">
                  <CheckCircle2 size={16} />
                  {c}
                </div>
              ))}

              <div className="ab-divider" />

              <p className="ab-card-title">Foco de Atuação</p>
              {specialities.map((s) => (
                <div key={s} className="ab-cred">
                  <Target size={16} />
                  {s}
                </div>
              ))}
            </div>

            <div className="ab-quote-card">
              <p className="ab-quote-text">
                Treino bom não é o mais pesado, nem o mais complexo. É o que você consegue executar bem, semana após semana.
                <p className="ab-quote-text"></p></p>

              <div  className="ab-quote-author">
                <img src="/logo.png" alt="GC" className="ab-quote-logo" />
                <div>
                  <div className="ab-quote-name">Guilherme Couto</div>
                  <div className="ab-quote-role">Coach GC Fitness</div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>
    </>
  );
}