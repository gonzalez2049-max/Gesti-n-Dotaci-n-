import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { avanzarPlan, getMatriz, getPlan } from "@/api/api";
import { GuideStrip } from "@/components/ui";
import { PageHead, Skeleton, Tabs } from "@/components/kit";
import { DonutGrad } from "@/components/Charts";
import { useToast } from "@/components/Toast";
import type { EstadoHabilitacion } from "@nexshift/contracts";

const GLYPH: Record<EstadoHabilitacion, string> = {
  vigente: "✓",
  porVencer: "◐",
  enProceso: "…",
  reevaluacionRequerida: "!",
  vencida: "✕",
  noHabilitado: "—",
};

export function Talento() {
  const [tab, setTab] = useState<"matriz" | "plan">("matriz");
  const toast = useToast();
  const qc = useQueryClient();
  const matriz = useQuery({ queryKey: ["matriz"], queryFn: getMatriz });
  const plan = useQuery({ queryKey: ["plan"], queryFn: getPlan });
  const avanzar = useMutation({
    mutationFn: avanzarPlan,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["plan"] });
      qc.invalidateQueries({ queryKey: ["matriz"] });
    },
  });

  const done = plan.data?.acciones.filter((a) => a.estado === "done").length ?? 0;
  const total = plan.data?.acciones.length ?? 4;
  const complete = plan.data ? done === total : false;

  return (
    <div className="page">
      <PageHead eyebrow="Talento" title={<>Formar hoy <span className="thin">para cubrir mañana</span></>} />
      <GuideStrip ocurre="UCI tiene capacidad frágil (pool de 5)" hacer="Avanzá el plan de Paula para habilitarla" siguiente="Al completar, el pool de UCI sube a 6" />

      <Tabs value={tab} onChange={setTab} tabs={[{ value: "matriz", label: "Matriz de competencias" }, { value: "plan", label: "Plan individual" }]} />

      {tab === "matriz" && (
        <>
          {matriz.isLoading && <Skeleton h={220} />}
          {matriz.data && (
            <div className="tablewrap">
              <table className="matriz">
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>Funcionario</th>
                    {matriz.data.lista.map((c) => (
                      <th key={c} title={c}>{c.split(" ").map((w) => w[0]).join("").slice(0, 3).toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matriz.data.personas.map((p) => (
                    <tr key={p.nombre}>
                      <td className="nm">{p.nombre}</td>
                      {matriz.data!.lista.map((c) => {
                        const st = p.estados[c] as EstadoHabilitacion;
                        return <td key={c}><span className={`cc ${st}`} title={st}>{GLYPH[st]}</span></td>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="tcr" style={{ marginTop: 12 }}>
            <b>Leyenda:</b> ✓ vigente · ◐ por vencer · … en proceso · ! reevaluación requerida · — no tiene.
          </div>
        </>
      )}

      {tab === "plan" && (
        <>
          {plan.isLoading && <Skeleton h={220} />}
          {plan.data && (
            <div className="grid g2" style={{ gridTemplateColumns: "1fr .7fr", alignItems: "start" }}>
              <div className="card">
                <div className="eyebrow">Plan de {plan.data.funcionario}</div>
                <div style={{ fontSize: 15, fontWeight: 640, margin: "3px 0 12px" }}>🎯 {plan.data.objetivo}</div>
                {plan.data.acciones.map((a) => (
                  <div className="pstep" key={a.id}>
                    <span className="chip acc">{a.tipo}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 560 }}>{a.nombre}</div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--ink3)" }}>Responsable: {a.responsable}</div>
                    </div>
                    <span className={`chip ${a.estado === "done" ? "good" : a.estado === "curso" ? "info" : ""}`}>
                      {a.estado === "done" ? "Completada" : a.estado === "curso" ? "En curso" : "Pendiente"}
                    </span>
                  </div>
                ))}
                {!complete ? (
                  <button className="btn prim" style={{ marginTop: 14 }} onClick={() => { avanzar.mutate(); toast("Acción completada"); }} disabled={avanzar.isPending} type="button">
                    Completar siguiente acción
                  </button>
                ) : (
                  <div className="banner" style={{ marginTop: 14 }}>✔ <span><b>Plan completo.</b> Falta la validación final de la Jefatura para habilitar en UCI.</span></div>
                )}
              </div>
              <aside className="card" style={{ textAlign: "center" }}>
                <div className="eyebrow">Progreso</div>
                <div style={{ display: "flex", justifyContent: "center", margin: "14px 0" }}>
                  <DonutGrad pct={plan.data.progreso} size={110} label={`${plan.data.progreso}%`} />
                </div>
                <div style={{ fontSize: 12.5, color: "var(--ink2)" }}>{done} de {total} acciones</div>
              </aside>
            </div>
          )}
        </>
      )}
    </div>
  );
}
