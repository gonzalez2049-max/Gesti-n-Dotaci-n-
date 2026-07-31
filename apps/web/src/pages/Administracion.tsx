import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getConfig, setPesoNex, setRegla } from "@/api/api";
import { GuideStrip } from "@/components/ui";
import { PageHead, Skeleton, Tabs } from "@/components/kit";
import { useToast } from "@/components/Toast";

type Tab = "reglas" | "nex" | "usuarios" | "auditoria";

export function Administracion() {
  const [tab, setTab] = useState<Tab>("reglas");
  const toast = useToast();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["config"], queryFn: getConfig });

  const regla = useMutation({
    mutationFn: ({ clave, valor }: { clave: string; valor: number }) => setRegla(clave, valor),
    onSuccess: () => { toast("Cambio auditado y propagado"); qc.invalidateQueries({ queryKey: ["config"] }); },
  });
  const peso = useMutation({
    mutationFn: ({ clave, valor }: { clave: string; valor: number }) => setPesoNex(clave, valor),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["config"] }); qc.invalidateQueries({ queryKey: ["cand"] }); },
  });

  return (
    <div className="page">
      <PageHead eyebrow="Administración" title={<>El panel de control <span className="thin">del sistema</span></>} actions={<span className="chip acc">Sesión: Administrador</span>} />
      <GuideStrip ocurre="Hay 2 configuraciones y 3 usuarios pendientes" hacer="Ajustá reglas y pesos; todo queda auditado" siguiente="Cada cambio se propaga a los módulos" />

      <Tabs value={tab} onChange={setTab} tabs={[{ value: "reglas", label: "Reglas" }, { value: "nex", label: "Pesos NEX" }, { value: "usuarios", label: "Usuarios" }, { value: "auditoria", label: "Auditoría" }]} />

      {isLoading && <Skeleton h={200} />}
      {data && (
        <>
          {tab === "reglas" && (
            <div className="card">
              {data.reglas.map((r) => (
                <div key={r.clave} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--hairline)" }}>
                  <div>
                    <div style={{ fontSize: 13 }}>{r.etiqueta}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--accent-ink)" }}>→ {r.propaga}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <input type="number" defaultValue={r.valor} style={{ width: 76, textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 13, padding: "7px 9px", border: "1px solid var(--hairline)", borderRadius: 8, background: "var(--surface)", color: "var(--ink)" }}
                      onBlur={(e) => { const v = Number(e.target.value); if (v !== r.valor) regla.mutate({ clave: r.clave, valor: v }); }} />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink3)" }}>{r.unidad}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "nex" && (
            <div className="card">
              <div style={{ fontSize: 12.5, color: "var(--ink2)", marginBottom: 12 }}>Cambiar los pesos re-ordena las recomendaciones de cobertura (no cambia la elegibilidad).</div>
              {data.pesosNex.map((p) => (
                <div key={p.clave} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 3 }}>
                    <span>{p.clave}</span>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent-ink)", fontWeight: 600 }}>{p.valor}</span>
                  </div>
                  <input className="range" type="range" min={0} max={40} defaultValue={p.valor}
                    onChange={(e) => peso.mutate({ clave: p.clave, valor: Number(e.target.value) })} />
                </div>
              ))}
            </div>
          )}

          {tab === "usuarios" && (
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

          {tab === "auditoria" && (
            <div className="card">
              <div style={{ fontSize: 12, color: "var(--ink3)", marginBottom: 12 }}>Registro append-only. Subdirección puede leerlo; no configurar.</div>
              {data.auditoria.map((a, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 11, padding: "10px 0", borderBottom: "1px solid var(--hairline)", alignItems: "start" }}>
                  <span className="orb good" style={{ width: 8, height: 8, marginTop: 5 }} />
                  <div><div style={{ fontSize: 12.5, fontWeight: 540 }}>{a.accion}</div><div style={{ fontSize: 11, color: "var(--ink3)" }}>{a.detalle} · <span className="chip acc" style={{ padding: "1px 6px" }}>{a.area}</span></div></div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink3)" }}>hoy {a.hora}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
