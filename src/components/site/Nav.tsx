/* eslint-disable prettier/prettier */
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface User {
  id: number;
  email: string;
  password: string;
  role: "admin" | "student";
  name: string;
}

interface NavProps {
  onAccessLogin: () => void;
  currentUser?: User | null;
  onLogout?: () => void;
}

const navLinks = [
  { href: "#metodo", label: "Método" },
  { href: "#quiz", label: "Quiz" },
  { href: "#antes-depois", label: "Resultados" },
  { href: "#about", label: "Sobre" },
];

export function Nav({ onAccessLogin, currentUser, onLogout }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Outfit:wght@500;600;700&display=swap');
      `}</style>

      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: "flex",
          justifyContent: "center",
          padding: scrolled ? "10px 20px" : "18px 20px",
          transition: "padding 0.35s ease",
          pointerEvents: "none",
        }}
      >
        <motion.div
          animate={{
            background: scrolled ? "rgba(10,10,10,0.70)" : "rgba(0,0,0,0)",
            borderColor: scrolled ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0)",
            backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
          }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: 999,
            width: "100%",
            maxWidth: 1280,
            padding: "6px 8px",
            gap: 8,
            pointerEvents: "auto",
            border: "1px solid transparent",
            WebkitBackdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
          }}
        >
          <a href="#top"
            onClick={() => setMenuOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              flexShrink: 0,
              padding: "2px 4px",
            }}
          >
            <img
              src="/logo_red_512.png"
              alt="GC Logo"
              style={{
                width: 45,
                height: 30,
                borderRadius: 10,
                objectFit: "cover",
                flexShrink: 0,
              }}
            />
            <span
              className="hidden sm:block"
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 600,
                fontSize: 15,
                letterSpacing: "0.01em",
                color: "#fff",
                whiteSpace: "nowrap",
              }}
            >
              Guilherme Couto
            </span>
          </a>

          <nav
            className="hidden md:flex"
            style={{ alignItems: "center", flex: 1, justifyContent: "center", gap: 2 }}
          >
            {navLinks.map((link, i) => (
              <div key={link.label} style={{ display: "flex", alignItems: "center" }}>
                <a
                  href={link.href}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                    fontSize: 14,
                    color: "rgba(255,255,255,0.5)",
                    textDecoration: "none",
                    padding: "6px 16px",
                    borderRadius: 999,
                    transition: "color 0.2s, background 0.2s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#E10600";
                    e.currentTarget.style.background = "rgba(225,6,0,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {link.label}
                </a>
                {i < navLinks.length - 1 && (
                  <span
                    style={{
                      width: 1,
                      height: 14,
                      background: "rgba(255,255,255,0.12)",
                      flexShrink: 0,
                    }}
                  />
                )}
              </div>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <div className="hidden md:block">
              {currentUser ? (
                <button
                  onClick={onLogout}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                    fontSize: 14,
                    color: "rgba(255,100,100,0.8)",
                    background: "transparent",
                    border: "1px solid rgba(255,100,100,0.25)",
                    borderRadius: 999,
                    padding: "7px 18px",
                    cursor: "pointer",
                    transition: "border-color 0.2s, color 0.2s, background 0.2s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,80,80,0.5)";
                    e.currentTarget.style.color = "#ff6060";
                    e.currentTarget.style.background = "rgba(255,80,80,0.07)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,100,100,0.25)";
                    e.currentTarget.style.color = "rgba(255,100,100,0.8)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  Sair
                </button>
              ) : (
                <button
                  onClick={onAccessLogin}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                    fontSize: 14,
                    color: "rgba(255,255,255,0.65)",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 999,
                    padding: "7px 18px",
                    cursor: "pointer",
                    transition: "border-color 0.2s, color 0.2s, background 0.2s",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(225,6,0,0.4)";
                    e.currentTarget.style.color = "#E10600";
                    e.currentTarget.style.background = "rgba(225,6,0,0.07)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.65)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  Acessar
                </button>
              )}
            </div>

            <a
              href="#cta"
              className="hidden md:inline-block"
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: 14,
                color: "#fff",
                background: "#E10600",
                border: "none",
                borderRadius: 999,
                padding: "8px 22px",
                cursor: "pointer",
                boxShadow: "0 0 18px rgba(225,6,0,0.4)",
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition: "opacity 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.88";
                e.currentTarget.style.boxShadow = "0 0 28px rgba(225,6,0,0.65)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.boxShadow = "0 0 18px rgba(225,6,0,0.4)";
              }}
            >
              Começar
            </a>

            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex md:hidden"
              style={{
                width: 36,
                height: 36,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 999,
                cursor: "pointer",
                padding: 0,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 4,
              }}
              aria-label="Abrir menu"
            >
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 5.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.22 }}
                style={{ display: "block", width: 14, height: 1.5, background: "#fff", borderRadius: 2 }}
              />
              <motion.span
                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.15 }}
                style={{ display: "block", width: 14, height: 1.5, background: "#fff", borderRadius: 2 }}
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -5.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.22 }}
                style={{ display: "block", width: 14, height: 1.5, background: "#fff", borderRadius: 2 }}
              />
            </button>
          </div>
        </motion.div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 40,
                background: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(6px)",
              }}
              className="md:hidden"
              onClick={() => setMenuOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="md:hidden"
              style={{
                position: "fixed",
                top: 68,
                left: 12,
                right: 12,
                zIndex: 50,
                background: "rgba(8,8,8,0.92)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(225,6,0,0.1)",
                borderRadius: 20,
                overflow: "hidden",
                padding: "8px 0",
              }}
            >
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px 20px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                    fontSize: 14,
                    color: "rgba(255,255,255,0.5)",
                    textDecoration: "none",
                    transition: "background 0.15s, color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(225,6,0,0.06)";
                    e.currentTarget.style.color = "#E10600";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                  }}
                >
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#E10600", flexShrink: 0 }} />
                  {link.label}
                </a>
              ))}

              <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "6px 20px" }} />

              <div style={{ display: "flex", gap: 8, padding: "8px 20px 12px" }}>
                {currentUser ? (
                  <button
                    onClick={() => { setMenuOpen(false); onLogout?.(); }}
                    style={{
                      flex: 1,
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 500,
                      fontSize: 14,
                      color: "rgba(255,100,100,0.8)",
                      background: "transparent",
                      border: "1px solid rgba(255,100,100,0.25)",
                      borderRadius: 999,
                      padding: "9px 0",
                      cursor: "pointer",
                    }}
                  >
                    Sair
                  </button>
                ) : (
                  <button
                    onClick={() => { setMenuOpen(false); onAccessLogin(); }}
                    style={{
                      flex: 1,
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 500,
                      fontSize: 14,
                      color: "rgba(255,255,255,0.65)",
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: 999,
                      padding: "9px 0",
                      cursor: "pointer",
                    }}
                  >
                    Acessar
                  </button>
                )}
                <a
                  href="#cta"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    flex: 1,
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: 14,
                    color: "#fff",
                    background: "#E10600",
                    border: "none",
                    borderRadius: 999,
                    padding: "9px 0",
                    cursor: "pointer",
                    boxShadow: "0 0 14px rgba(225,6,0,0.4)",
                    textDecoration: "none",
                    textAlign: "center",
                    display: "block",
                  }}
                >
                  Começar
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}