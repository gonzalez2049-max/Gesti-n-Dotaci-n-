import { Routes, Route } from "react-router-dom";
import { AppShell } from "@/app/AppShell";
import { Inicio } from "@/pages/Inicio";
import { Programacion } from "@/pages/Programacion";
import { Brechas } from "@/pages/Brechas";
import { Coberturas } from "@/pages/Coberturas";
import { Ausencias } from "@/pages/Ausencias";
import { Talento } from "@/pages/Talento";
import { Analitica } from "@/pages/Analitica";
import { Administracion } from "@/pages/Administracion";
import { Funcionario } from "@/pages/Funcionario";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Inicio />} />
        <Route path="programacion" element={<Programacion />} />
        <Route path="brechas" element={<Brechas />} />
        <Route path="coberturas" element={<Coberturas />} />
        <Route path="ausencias" element={<Ausencias />} />
        <Route path="talento" element={<Talento />} />
        <Route path="analitica" element={<Analitica />} />
        <Route path="administracion" element={<Administracion />} />
        <Route path="administracion/:sec" element={<Administracion />} />
        <Route path="mi-espacio" element={<Funcionario />} />
      </Route>
    </Routes>
  );
}
