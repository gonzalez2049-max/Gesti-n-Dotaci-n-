import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getConfig, setRegla } from "@/api/api";
import { PageHead, Skeleton } from "@/components/kit";
import { Icon, type IconName } from "@/components/icons";
import { useToast } from "@/components/Toast";

const SEC_TITLE: Record<string, { eyebrow: string; title: string; icon: IconName }> = {
  usuarios: { eyebrow: "Administración · Usuarios", title: "Usuarios y acceso", icon: "users" },
  permisos: { eyebrow: "Administración · Permisos", title: "Permisos por rol", icon: "shield" },
  config: { eyebrow: "Administración · Configuración", title: "Reglas de dotación", icon: "settings" },
  auditoria: { eyebrow: "Administración · Auditoría", title: "Registro de actividad", icon: "list" },
  integraciones: { eyebrow: "Administración · Integraciones", title: "Servicios conectados", icon: "link" },
};

const CAPS = ["Ver malla", "Editar malla", "Contactar coberturas", "Aprobar permisos", "Ver reportes", "Configurar"];
const PERMISOS: { rol: string; caps: boolean[] }[] = [
  { rol: "Jefatura", caps: [true, true, false, true, true, false] },
  { rol: "Gestión Central", caps: [true, false, true, false, false, false] },
  { rol: "Subdirección · BPC", caps: [true, false, false, false, true, false] },
  { rol: "Funcionario", caps: [true, false, false, false, false, false] },
  { rol: "Administrador", caps: [false, false, false, false, false, true] },
];
const INTEGRACIONES: { icon: IconName; nombre: string; estado: string; nota: string; tono: string }[] = [
  { icon: "users", nombre: "RRHH · dotación", estado: "En línea", nota: "última sync 08:00", tono: "good" },
  { icon: "shield", nombre: "Firma digital", estado: "Activa", nota: "reportes BPC", tono: "good" },
  { icon: "bell", nombre: "Notificaciones", estado: "Activa", nota: "push + correo", tono: "good" },
  { icon: "link", nombre: "Directorio clínico", estado: "Degradado", nota: "reintenta en 10 min", tono: "warn" },
];

export function Administracion() {
  const { sec } = useParams();
  const key = sec && SEC_TITLE[sec] ? sec : "usuarios";
  const meta = SEC_TITLE[key];
  const toast = useToast();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["config"], queryFn: getConfig });

  const regla = useMutation({
    mutationFn: ({ clave, valor }: { clave: string; valor: number }) => setRegla(clave, valor),
    onSuccess: () => { toast("Cambio auditado y propagado"); qc.invalidateQueries({ queryKey: ["config"] }); },
  });
  return (
    <div className="page">
      <PageHead eyebrow={meta.eyebrow} title={<>{meta.title}</>} actions={<span className="chip acc">Sesión: Administrador</span>} />

      {isLoading && <Skeleton h={200} style={{ marginTop: 14 }} />}
      {data && (
        <section className="panel" style={{ marginTop: 14 }}>
          <div className="panel-h"><Icon name={meta.icon} size={15} /> {meta.title}</div>

          {key === "usuarios" && (
            <div className="tablewrap">
              <table className="tbl">
                <thead><tr><th>Usuario</th><th>Rol</th><th>Alcance</th><th>Estado</th></tr></thead>
                <tbody>
                  {data.usuarios.map((u) => (
                    <tr key={u.usuario}><td>{u.usuario}</td><td><span className="chip">{u.rol}</span></td><td>{u.alcance}</td><td><span className="chip good">{u.estado}</span></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {key === "permisos" && (
            <div className="tablewrap">
              <table className="matriz">
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>Rol</th>
                    {CAPS.map((c) => <th key={c} title={c}>{c.split(" ").map((w) => w[0]).join("").toUpperCase()}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {PERMISOS.map((r) => (
                    <tr key={r.rol}>
                      <td className="nm">{r.rol}</td>
                      {r.caps.map((ok, i) => <td key={i}><span className={`cc ${ok ? "vigente" : "noHabilitado"}`}>{ok ? "✓" : "—"}</span></td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="matriz-leg" style={{ marginTop: 12 }}>{CAPS.map((c, i) => <span key={c}><b className="mono">{c.split(" ").map((w) => w[0]).join("").toUpperCase()}</b> {c}{i < CAPS.length - 1 ? "" : ""}</span>)}</div>
            </div>
          )}

          {key === "config" && (
            <>
              <div className="foco-recolab">Reglas</div>
              <div style={{ marginTop: 8 }}>
                {data.reglas.map((r) => (
                  <div key={r.clave} className="adm-rule">
                    <div>
                      <div style={{ fontSize: 13 }}>{r.etiqueta}</div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--accent-ink)" }}>→ {r.propaga}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <input type="number" defaultValue={r.valor} className="adm-input"
                        onBlur={(e) => { const v = Number(e.target.value); if (v !== r.valor) regla.mutate({ clave: r.clave, valor: v }); }} />
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink3)" }}>{r.unidad}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {key === "auditoria" && (
            <>
              <div style={{ fontSize: 12, color: "var(--ink3)", marginBottom: 12 }}>Registro append-only. Subdirección puede leerlo; no configurar.</div>
              <ol className="trace">
                {data.auditoria.map((a, i) => (
                  <li className="trace-i" key={i} style={{ ["--tn" as string]: "var(--good)" }}>
                    <span className="trace-node" />
                    <div className="trace-body">
                      <div className="trace-top"><span className="trace-hora">hoy {a.hora}</span><span className="trace-actor">{a.area}</span></div>
                      <div className="trace-titulo">{a.accion}</div>
                      <div className="trace-det">{a.detalle}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </>
          )}

          {key === "integraciones" && (
            <div className="salud-grid">
              {INTEGRACIONES.map((s, i) => (
                <div className="sh" key={i} style={{ ["--tn" as string]: `var(--${s.tono})` }}>
                  <span className="sh-ic"><Icon name={s.icon} size={16} /></span>
                  <div className="sh-main">
                    <div className="sh-lab">{s.nombre}</div>
                    <div className="sh-val">{s.estado}</div>
                    <div className="sh-note">{s.nota}</div>
                  </div>
                  <span className="sh-led" />
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
