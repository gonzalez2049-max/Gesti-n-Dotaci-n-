export interface NavItem {
  key: string;
  path: string;
  icon: string;
  label: string;
}

/** Espacios de trabajo (doc 11 §11.3). */
export const NAV: NavItem[] = [
  { key: "inicio", path: "/", icon: "⌂", label: "Inicio" },
  { key: "prog", path: "/programacion", icon: "▦", label: "Programación" },
  { key: "brechas", path: "/brechas", icon: "◹", label: "Brechas" },
  { key: "cob", path: "/coberturas", icon: "⇄", label: "Coberturas" },
  { key: "ausencias", path: "/ausencias", icon: "◷", label: "Ausencias" },
  { key: "talento", path: "/talento", icon: "✦", label: "Talento" },
  { key: "analitica", path: "/analitica", icon: "◔", label: "Analítica" },
  { key: "admin", path: "/administracion", icon: "⚙", label: "Administración" },
  { key: "func", path: "/mi-espacio", icon: "♁", label: "Mi espacio" },
];

/** Navegación reducida para la barra inferior móvil. */
export const NAV_MOBILE = [NAV[0], NAV[2], NAV[3], NAV[8]];
