import { Routes, Route } from "react-router-dom";
import { AppShell } from "@/app/AppShell";
import { Inicio } from "@/pages/Inicio";
import { Placeholder } from "@/pages/Placeholder";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Inicio />} />
        <Route
          path="programacion"
          element={<Placeholder title="Programación" doc="docs/architecture/15-programacion-malla.md" />}
        />
        <Route
          path="brechas"
          element={<Placeholder title="Brechas" doc="docs/architecture/13-inicio-supervisor-coordinador.md" />}
        />
        <Route
          path="coberturas"
          element={<Placeholder title="Coberturas" doc="docs/architecture/14-flujo-resolucion-cobertura.md" />}
        />
        <Route
          path="talento"
          element={<Placeholder title="Talento" doc="docs/architecture/20-desarrollo-profesional.md" />}
        />
        <Route
          path="analitica"
          element={<Placeholder title="Analítica" doc="docs/architecture/19-analitica-inteligencia.md" />}
        />
        <Route
          path="administracion"
          element={<Placeholder title="Administración" doc="docs/architecture/21-administracion-configuracion.md" />}
        />
      </Route>
    </Routes>
  );
}
