/* eslint-disable prettier/prettier */
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface NavProps {
  onAccessStudentArea?: () => void;
  onAccessadmin_dashboard?: () => void;
}

export function Nav({ onAccessStudentArea, onAccessadmin_dashboard }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  
  const links = [
    { href: "#metodo", label: "Método" },
    { href: "#quiz", label: "Quiz" },
    { href: "#resultados", label: "Resultados" },
    { href: "#app", label: "Área do Aluno", action: onAccessStudentArea },
    { href: "#admin", label: "Admin", action: onAccessadmin_dashboard },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, action?: () => void) => {
    if (action) {
      e.preventDefault();
      action();
    }
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div
          className={`flex items-center justify-between rounded-full px-5 py-3 transition-all ${
            scrolled ? "glass" : "bg-transparent"
          }`}
        >
          <a href="#top" className="flex items-center gap-2">
            <div className="relative grid place-items-center h-9 w-9 rounded-xl bg-neon text-black font-black font-display">
              GC
              <span className="absolute inset-0 rounded-xl bg-neon opacity-40 blur-md -z-10" />
            </div>
            <span className="font-display font-bold tracking-tight hidden sm:block">
              Guilherme Couto
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={(e) => handleLinkClick(e, l.action)}
                className={`transition-colors ${
                  l.label === "Admin" 
                    ? "hover:text-neon text-muted-foreground/60 text-xs" 
                    : "hover:text-foreground"
                }`}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <a
            href="#cta"
            className="rounded-full bg-neon text-black px-4 py-2 text-sm font-semibold hover:opacity-90 transition"
          >
            Começar
          </a>
        </div>
      </div>
    </motion.header>
  );
}