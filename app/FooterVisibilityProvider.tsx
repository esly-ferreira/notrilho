"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type FooterVisibilityContextValue = {
  hideFooter: boolean;
  setHideFooter: (hide: boolean) => void;
};

const FooterVisibilityContext = createContext<FooterVisibilityContextValue | null>(null);

export function useFooterVisibility() {
  const ctx = useContext(FooterVisibilityContext);
  if (!ctx) return { hideFooter: false, setHideFooter: () => {} };
  return ctx;
}

export function FooterVisibilityProvider({ children }: { children: ReactNode }) {
  const [hideFooter, setHideFooter] = useState(false);
  return (
    <FooterVisibilityContext.Provider value={{ hideFooter, setHideFooter }}>
      {children}
    </FooterVisibilityContext.Provider>
  );
}
