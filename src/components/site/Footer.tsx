/* eslint-disable prettier/prettier */
import { Instagram, Youtube, MessageCircle, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="GC Logo"
            style={{
              width: 48,
              height: 48,
              borderRadius: 8,   
              objectFit: "cover",
              flexShrink: 0,
              border: "1px solid rgba(0,255,136,0.2)"
            }}
          />
          <div>
            <div className="font-display font-semibold" style={{ letterSpacing: '0.01em' }}>Guilherme Couto</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {[
            { icon: Instagram, href: "#" },
            { icon: Youtube, href: "#" },
            { icon: MessageCircle, href: "https://wa.me/5511959222489" },
            { icon: Mail, href: "mailto:contato@guilhermecouto.com" },
          ].map((s, i) => (
            <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
              className="h-10 w-10 rounded-full glass grid place-items-center hover:bg-neon hover:text-black transition-colors duration-200 hover:ring-1 hover:ring-neon/30">
              <s.icon className="h-4 w-4" />
            </a>
          ))}
        </div>
        <div className="text-xs text-muted-foreground text-center md:text-right">
          © 2026 Guilherme Couto · CREF 098765-G/SP<br />
          Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}