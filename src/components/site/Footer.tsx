/* eslint-disable prettier/prettier */
import { Instagram } from "lucide-react";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.004 2c-5.514 0-9.997 4.483-9.997 9.997 0 1.763.463 3.483 1.343 5.001L2 22l5.126-1.334a9.958 9.958 0 0 0 4.878 1.243h.004c5.514 0 9.997-4.483 9.997-9.997C21.998 6.483 17.518 2 12.004 2zm5.878 15.874c-.845.845-1.994 1.323-3.202 1.323h-.003a8.302 8.302 0 0 1-4.244-1.19l-.305-.181-3.043.792.812-2.968-.198-.304a8.293 8.293 0 0 1-1.267-4.396c0-4.61 3.752-8.362 8.362-8.362 2.233 0 4.331.87 5.911 2.451a8.304 8.304 0 0 1 2.45 5.912c0 2.234-.87 4.332-2.273 5.923z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img
            src="/logo_red_512.png"
            alt="GC Logo"
            style={{
              width: 48,
              height: 48,
              borderRadius: 8,   
              objectFit: "cover",
              flexShrink: 0,
              border: "1px solid rgba(225,6,0,0.2)"
            }}
          />
          <div>
            <div className="font-display font-semibold" style={{ letterSpacing: '0.01em' }}>Guilherme Couto</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {[
            { icon: Instagram, href: "https://www.instagram.com/gui_coutoo/" },
            { icon: WhatsAppIcon, href: "https://wa.me/5511959222489" },
          ].map((s, i) => (
            <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
              className="h-10 w-10 rounded-full glass grid place-items-center hover:bg-neon hover:text-white transition-colors duration-200 hover:ring-1 hover:ring-neon/30">
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