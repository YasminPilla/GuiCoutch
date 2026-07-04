/* eslint-disable prettier/prettier */
import { useState } from "react";
import { motion } from "framer-motion";
import { LogIn, Eye, EyeOff, ArrowLeft, AlertCircle } from "lucide-react";
import { useAppContext, type User } from "@/components/site/SharedAppState";

interface LoginPageProps {
  onLogin: (user: User) => void;
  onBackToHome?: () => void;
}

const A = "#000";
const N = "#00C96B";
const DANGER = "#E83B45";
const BORDER = "rgba(255,255,255,0.09)";
const MUTED = "rgba(240,240,240,0.45)";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  .lp * { box-sizing: border-box; }
  .lp {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #0d0d0d;
    color: #f0f0f0;
    display: flex;
    flex-direction: column;
  }

  .lp-topbar {
    padding: 16px 24px;
    position: relative;
    z-index: 1;
  }

  .lp-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    color: ${MUTED};
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    padding: 8px 0;
    min-height: 44px;
    transition: color .2s;
  }
  .lp-back:hover { color: #f0f0f0; }

  .lp-body {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px 20px 48px;
    position: relative;
    z-index: 1;
  }

  .lp-card {
    width: 100%;
    max-width: 420px;
    background: rgba(255,255,255,0.04);
    border: 1px solid ${BORDER};
    border-radius: 24px;
    padding: 36px 32px;
  }

  @media (max-width: 480px) {
    .lp-card { padding: 28px 20px; border-radius: 20px; }
    .lp-topbar { padding: 12px 16px; }
  }

  .lp-logo {
    width: 55px;
    height: 55px;
    border-radius: 14px;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 18px;
  }

  .lp-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 24px;
    color: #f0f0f0;
    text-align: center;
    margin: 0 0 6px;
  }

  .lp-subtitle {
    font-size: 13px;
    color: ${MUTED};
    text-align: center;
    margin: 0 0 30px;
    line-height: 1.5;
  }

  .lp-label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    color: ${MUTED};
    text-transform: uppercase;
    letter-spacing: .07em;
    margin-bottom: 7px;
  }

  .lp-field { margin-bottom: 16px; }

  .lp-input-wrap { position: relative; }

  .lp-input {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid ${BORDER};
    border-radius: 12px;
    padding: 13px 16px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: #f0f0f0;
    outline: none;
    transition: border .2s, box-shadow .2s;
  }
  .lp-input:focus {
    border-color: ${N}55;
    box-shadow: 0 0 0 3px ${N}10;
  }
  .lp-input::placeholder { color: rgba(240,240,240,0.2); }
  .lp-input-pw { padding-right: 48px; }

  .lp-eye {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 48px;
    background: none;
    border: none;
    color: ${MUTED};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color .2s;
  }
  .lp-eye:hover { color: #f0f0f0; }

  .lp-error {
    display: flex;
    align-items: center;
    gap: 8px;
    background: ${DANGER}12;
    border: 1px solid ${DANGER}33;
    border-radius: 10px;
    padding: 11px 14px;
    font-size: 13px;
    color: ${DANGER};
    margin-bottom: 16px;
  }

  .lp-submit {
    width: 100%;
    background: ${N};
    border: none;
    border-radius: 100px;
    padding: 14px;
    font-size: 15px;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    color: #000;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: opacity .2s, transform .15s;
    margin-top: 6px;
  }
  .lp-submit:hover { opacity: .9; }
  .lp-submit:active { transform: scale(.98); }
  .lp-submit:disabled { opacity: .5; cursor: not-allowed; }

  .lp-divider {
    height: 1px;
    background: ${BORDER};
    margin: 24px 0;
  }

  .lp-hint {
    font-size: 12px;
    color: ${MUTED};
    text-align: center;
    line-height: 1.7;
    margin: 0;
  }
`;

export function LoginPage({ onLogin, onBackToHome }: LoginPageProps) {
  const { users } = useAppContext();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  function handleSubmit() {
    if (!email.trim() || !password.trim()) {
      setError("Usuário e senha são obrigatórios.");
      return;
    }

    try {
      setLoading(true);
      setTimeout(() => {
        const user = users.find(
          u =>
            u.email.trim().toLowerCase() === email.trim().toLowerCase() &&
            u.password === password
        );
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
    <div className="lp">
      <style>{css}</style>

      {/* Glow de fundo */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse at 70% 15%, ${N}09, transparent 50%),
                     radial-gradient(ellipse at 20% 85%, ${N}06, transparent 50%)`,
      }} />

      {/* Botão voltar */}
      {onBackToHome && (
        <div className="lp-topbar">
          <button className="lp-back" onClick={onBackToHome}>
            <ArrowLeft size={14} />
            Voltar
          </button>
        </div>
      )}

      {/* Conteúdo central */}
      <div className="lp-body">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <div className="lp-card">
            {/* Logo */}
            <div className="lp-logo">
              <img
                src="/logo.png"
                alt="GC Logo"
                style={{
                  width: 55,
                  height: 55,
                  borderRadius: 14,
                  objectFit: "cover",
                }}
              />
            </div>

            {/* Cabeçalho */}
            <p className="lp-subtitle">Acesse sua conta para continuar</p>

            {/* E-mail */}
            <div className="lp-field">
              <label className="lp-label">Login</label>
              <input
                className="lp-input"
                type=""
                placeholder="Seu usuário"
                value={email}
                autoComplete="email"
                onChange={e => { setEmail(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
              />
            </div>

            {/* Senha */}
            <div className="lp-field" style={{ marginBottom: 22 }}>
              <label className="lp-label">Senha</label>
              <div className="lp-input-wrap">
                <input
                  className="lp-input lp-input-pw"
                  type={show ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  autoComplete="current-password"
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                />
                <button
                  className="lp-eye"
                  type="button"
                  onClick={() => setShow(v => !v)}
                  aria-label={show ? "Ocultar senha" : "Mostrar senha"}
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Erro */}
            {error && (
              <div className="lp-error" role="alert">
                <AlertCircle size={14} style={{ flexShrink: 0 }} />
                {error}
              </div>
            )}

            {/* Botão entrar */}
            <button
              className="lp-submit"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Entrando..." : <><LogIn size={16} /> Entrar</>}
            </button>

            {/* Divisor */}
            <div className="lp-divider" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default LoginPage;