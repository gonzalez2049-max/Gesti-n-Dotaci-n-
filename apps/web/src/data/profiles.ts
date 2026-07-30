import type { Perfil } from "@nexshift/contracts";

export interface ProfileInfo {
  key: Perfil;
  nombre: string;
  avatar: string;
  quien: string;
  rol: string;
  color: string;
}

/** Perfiles operativos disponibles en esta fase (Inicio). */
export const PROFILES: ProfileInfo[] = [
  {
    key: "supervisor",
    nombre: "Supervisor",
    avatar: "JM",
    quien: "José M.",
    rol: "SUPERVISOR",
    color: "#0e9e96",
  },
  {
    key: "coordinador",
    nombre: "Coordinador",
    avatar: "ML",
    quien: "Marta L.",
    rol: "COORDINADORA",
    color: "#2c8fd6",
  },
];

export const profileByKey = (k: Perfil): ProfileInfo =>
  PROFILES.find((p) => p.key === k) ?? PROFILES[0];
