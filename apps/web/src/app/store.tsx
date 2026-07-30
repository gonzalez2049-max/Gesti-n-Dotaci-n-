import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Perfil } from "@nexshift/contracts";

type Theme = "light" | "dark";

interface AppState {
  profile: Perfil;
  setProfile: (p: Perfil) => void;
  theme: Theme | null; // null = seguir al sistema
  toggleTheme: () => void;
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Perfil>("supervisor");
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-profile", profile);
  }, [profile]);

  useEffect(() => {
    const el = document.documentElement;
    if (theme) el.setAttribute("data-theme", theme);
    else el.removeAttribute("data-theme");
  }, [theme]);

  const value = useMemo<AppState>(
    () => ({
      profile,
      setProfile,
      theme,
      toggleTheme: () =>
        setTheme((t) => {
          const current =
            t ??
            (window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "dark"
              : "light");
          return current === "dark" ? "light" : "dark";
        }),
    }),
    [profile, theme],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp debe usarse dentro de <AppProvider>");
  return ctx;
}
