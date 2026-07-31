import { useApp } from "@/app/store";
import { getHome } from "@/data/home";
import { HomeJefatura } from "./home/HomeJefatura";
import { HomeSubdireccion } from "./home/HomeSubdireccion";
import { HomeFuncionario } from "./home/HomeFuncionario";
import { HomeAdmin } from "./home/HomeAdmin";

/**
 * El Home es un Centro de Comando distinto por perfil: cada uno tiene su
 * propia narrativa, jerarquía y objetivo (no comparten layout).
 */
export function Inicio() {
  const { profile } = useApp();
  const d = getHome(profile);
  switch (d.tipo) {
    case "subdireccion":
      return <HomeSubdireccion d={d} />;
    case "funcionario":
      return <HomeFuncionario d={d} />;
    case "administrador":
      return <HomeAdmin d={d} />;
    default:
      return <HomeJefatura d={d} />;
  }
}
