import type { Perfil } from "@nexshift/contracts";

export interface ProfileInfo {
  key: Perfil;
  nombre: string;
  avatar: string;
  quien: string;
  rol: string;
  color: string;
}

export const PROFILES: ProfileInfo[] = [
  { key: "jefatura", nombre: "Jefatura", avatar: "JM", quien: "José M.", rol: "JEFATURA · UCI", color: "#0e9e96" },
  { key: "subdireccion", nombre: "Subdirección", avatar: "DR", quien: "Dra. Rivas", rol: "SUBDIRECCIÓN", color: "#6f68e6" },
  { key: "administrador", nombre: "Admin", avatar: "AD", quien: "Admin", rol: "ADMINISTRADOR", color: "#3fa6b8" },
  { key: "funcionario", nombre: "Funcionario", avatar: "PR", quien: "Paula R.", rol: "ENFERMERA", color: "#1fb58a" },
];

export const profileByKey = (k: Perfil): ProfileInfo =>
  PROFILES.find((p) => p.key === k) ?? PROFILES[0];
