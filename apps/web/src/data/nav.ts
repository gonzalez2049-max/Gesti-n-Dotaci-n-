import type { Perfil } from "@nexshift/contracts";
import type { IconName } from "@/components/icons";

export interface NavItem {
  key: string;
  path: string;
  icon: IconName;
  label: string;
}

/**
 * Navegación tipo centro de comando, distinta por perfil.
 * Flujo operativo: Funcionario → Jefatura → Subdirección.
 * Administrador queda fuera de la operación: solo gobernanza
 * (usuarios, permisos, configuración, auditoría, integraciones).
 */
const NAV_BY_PROFILE: Record<Perfil, NavItem[]> = {
  jefatura: [
    { key: "inicio", path: "/", icon: "home", label: "Inicio" },
    { key: "prog", path: "/programacion", icon: "calendar", label: "Programación" },
    { key: "brechas", path: "/brechas", icon: "gap", label: "Brechas" },
    { key: "cob", path: "/coberturas", icon: "swap", label: "Coberturas" },
    { key: "ausencias", path: "/ausencias", icon: "plane", label: "Ausencias" },
    { key: "talento", path: "/talento", icon: "graduation", label: "Talento" },
    { key: "analitica", path: "/analitica", icon: "chart", label: "Analítica" },
  ],
  subdireccion: [
    { key: "inicio", path: "/", icon: "home", label: "Inicio" },
    { key: "analitica", path: "/analitica", icon: "chart", label: "Analítica" },
    { key: "prog", path: "/programacion", icon: "calendar", label: "Programación" },
    { key: "talento", path: "/talento", icon: "graduation", label: "Talento" },
    { key: "ausencias", path: "/ausencias", icon: "plane", label: "Ausencias" },
  ],
  funcionario: [
    { key: "inicio", path: "/", icon: "home", label: "Inicio" },
    { key: "prog", path: "/programacion", icon: "calendar", label: "Mi programación" },
    { key: "cob", path: "/coberturas", icon: "swap", label: "Ofertas" },
    { key: "talento", path: "/talento", icon: "graduation", label: "Mi desarrollo" },
    { key: "ausencias", path: "/ausencias", icon: "plane", label: "Permisos" },
  ],
  administrador: [
    { key: "inicio", path: "/", icon: "home", label: "Inicio" },
    { key: "usuarios", path: "/administracion", icon: "users", label: "Usuarios" },
    { key: "permisos", path: "/administracion/permisos", icon: "shield", label: "Permisos" },
    { key: "config", path: "/administracion/config", icon: "settings", label: "Configuración" },
    { key: "auditoria", path: "/administracion/auditoria", icon: "list", label: "Auditoría" },
    { key: "integraciones", path: "/administracion/integraciones", icon: "link", label: "Integraciones" },
  ],
};

export function navFor(p: Perfil): NavItem[] {
  return NAV_BY_PROFILE[p] ?? NAV_BY_PROFILE.jefatura;
}

/** Barra inferior móvil: los primeros 4 espacios del perfil. */
export function navMobileFor(p: Perfil): NavItem[] {
  return navFor(p).slice(0, 4);
}
