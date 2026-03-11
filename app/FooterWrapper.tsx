"use client";

import { CONTACT_EMAIL } from "@/lib/contact";
import { useFooterVisibility } from "./FooterVisibilityProvider";

export function FooterWrapper() {
  const { hideFooter } = useFooterVisibility();
  if (hideFooter) return null;
  return (
    <footer className="w-full border-t border-zinc-200 bg-zinc-50 py-6 px-4 mt-auto">
      <div className="max-w-3xl mx-auto text-center space-y-2 text-sm text-zinc-600">
        <p className="font-semibold text-zinc-800">© 2026 Notrilho</p>
        <p>Projeto independente de informações colaborativas sobre trens.</p>
        <p className="text-xs">Informações enviadas por usuários. Podem conter imprecisões.</p>
        <nav className="pt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
          <a href="/termos" className="underline hover:text-zinc-900">Termos de Uso</a>
          <a href="/privacidade" className="underline hover:text-zinc-900">Política de Privacidade</a>
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline hover:text-zinc-900">Contato</a>
        </nav>
      </div>
    </footer>
  );
}
