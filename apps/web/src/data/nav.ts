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
  // Jefatura: mando operativo de la unidad. Programa, detecta brechas (y las
  // solicita a Gestión Central), aprueba permisos y pide reportes a BPC.
  jefatura: [
    { key: "inicio", path: "/", icon: "home", label: "Inicio" },
    { key: "prog", path: "/programacion", icon: "calendar", label: "Programación" },
    { key: "brechas", path: "/brechas", icon: "gap", label: "Brechas" },
    { key: "ausencias", path: "/ausencias", icon: "plane", label: "Ausencias" },
    { key: "reportes", path: "/reportes", icon: "list", label: "Reportes" },
  ],
  // Gestión Central: secretaría de dotación (depende de Subdirección) — recibe
  // las brechas y ejecuta el contacto de coberturas. Nada más.
  gestion: [
    { key: "inicio", path: "/", icon: "home", label: "Inicio" },
    { key: "cob", path: "/coberturas", icon: "swap", label: "Coberturas" },
    { key: "brechas", path: "/brechas", icon: "gap", label: "Brechas" },
  ],
  // Subdirección incluye a Buenas Prácticas Clínicas (BPC): observatorio de
  // solo-datos para decidir dónde intervenir. Ve analítica, reportes y la
  // programación (solo lectura). Sin acciones operativas.
  subdireccion: [
    { key: "inicio", path: "/", icon: "home", label: "Inicio" },
    { key: "analitica", path: "/analitica", icon: "chart", label: "Analítica" },
    { key: "reportes", path: "/reportes", icon: "list", label: "Reportes" },
    { key: "prog", path: "/programacion", icon: "calendar", label: "Programación" },
    { key: "ausencias", path: "/ausencias", icon: "plane", label: "Ausencias" },
  ],
  // Funcionario: su espacio. Ve su malla (solo lectura), su desarrollo y pide
  // permisos. Las ofertas de cobertura las responde desde Inicio.
  funcionario: [
    { key: "inicio", path: "/", icon: "home", label: "Inicio" },
    { key: "prog", path: "/programacion", icon: "calendar", label: "Mi programación" },
    { key: "miespacio", path: "/mi-espacio", icon: "user", label: "Mi espacio" },
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
