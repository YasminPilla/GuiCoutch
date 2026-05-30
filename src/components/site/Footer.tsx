import { Instagram, Youtube, MessageCircle, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-neon text-black grid place-items-center font-display font-black">GC</div>
          <div>
            <div className="font-display font-semibold">Guilherme Couto</div>
            <div className="text-xs text-muted-foreground">Performance Coaching</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {[
            { icon: Instagram, href: "#" },
            { icon: Youtube, href: "#" },
            { icon: MessageCircle, href: "https://wa.me/5511999999999" },
            { icon: Mail, href: "mailto:contato@guilhermecouto.com" },
          ].map((s, i) => (
            <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
              className="h-10 w-10 rounded-full glass grid place-items-center hover:bg-neon hover:text-black transition-all">
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