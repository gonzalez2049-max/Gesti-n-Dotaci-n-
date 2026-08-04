import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { avanzarPlan, getMatriz, getPlan } from "@/api/api";
import { PageHead, Segmented, Skeleton } from "@/components/kit";
import { DonutGrad } from "@/components/Charts";
import { Icon } from "@/components/icons";
import { GuiaNexBar } from "@/pages/home/parts";
import { useToast } from "@/components/Toast";
import { useApp } from "@/app/store";
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
  const { profile } = useApp();
  const soloMiPlan = profile === "funcionario";
  const [tab, setTab] = useState<"matriz" | "plan">(soloMiPlan ? "plan" : "matriz");
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

  const flat = matriz.data?.personas.flatMap((p) => matriz.data!.lista.map((c) => p.estados[c])) ?? [];
  const vigentes = flat.filter((s) => s === "vigente").length;
  const porVencer = flat.filter((s) => s === "porVencer" || s === "reevaluacionRequerida").length;
  const enProceso = flat.filter((s) => s === "enProceso").length;

  const guia = soloMiPlan
    ? {
        ocurre: "Estás a 1 evaluación de habilitarte en UCI.",
        hacer: "Completá las acciones de tu plan de desarrollo.",
        recomienda: "Priorizá RCP y ventilación mecánica: son las que faltan.",
        riesgo: "Sin la habilitación no podés tomar turnos en UCI.",
        siguiente: "Al completar, tu Jefatura valida y quedás habilitada.",
      }
    : {
        ocurre: `UCI tiene capacidad frágil: pool de 5 y ${porVencer} habilitaciones por vencer.`,
        hacer: "Avanzá el plan de Paula para habilitarla en UCI.",
        recomienda: "Priorizar RCP y ventilación mecánica cierra la brecha de competencias.",
        riesgo: "Sin habilitar, el pool sigue frágil y suben las horas extra.",
        siguiente: "Al completar, la Jefatura valida y el pool de UCI sube a 6.",
      };

  return (
    <div className="page">
      <PageHead
        eyebrow={soloMiPlan ? "Mi desarrollo" : "Calidad clínica · competencias y habilitación"}
        title={soloMiPlan ? <>Mi habilitación <span className="thin">en curso</span></> : <>Formar hoy <span className="thin">para cubrir mañana</span></>}
      />
      <GuiaNexBar g={guia} />

      {!soloMiPlan && (
        <div className="pl-stats" style={{ marginTop: 12 }}>
          <span className="plstat good"><b>{vigentes}</b> vigentes</span>
          <span className="plstat warn"><b>{porVencer}</b> por vencer</span>
          <span className="plstat"><b>{enProceso}</b> en proceso</span>
          <span style={{ flex: 1 }} />
          <Segmented value={tab} onChange={setTab} ariaLabel="Vista" options={[{ value: "matriz", label: "Matriz" }, { value: "plan", label: "Plan individual" }]} />
        </div>
      )}

      {tab === "matriz" && (
        <section className="panel" style={{ marginTop: 14 }}>
          <div className="panel-h"><Icon name="grid" size={15} /> Matriz de competencias · UCI</div>
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
          <div className="matriz-leg">
            <span><span className="cc vigente">✓</span> Vigente</span>
            <span><span className="cc porVencer">◐</span> Por vencer</span>
            <span><span className="cc enProceso">…</span> En proceso</span>
            <span><span className="cc reevaluacionRequerida">!</span> Reevaluación</span>
            <span><span className="cc noHabilitado">—</span> No tiene</span>
          </div>
        </section>
      )}

      {tab === "plan" && plan.data && (
        <div className="strat" style={{ marginTop: 14 }}>
          <section className="panel">
            <div className="panel-h"><Icon name="graduation" size={15} /> Plan de {plan.data.funcionario}</div>
            <div className="td-title" style={{ marginBottom: 12 }}>{plan.data.objetivo}</div>
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
                <Icon name="check" size={14} /> Completar siguiente acción
              </button>
            ) : (
              <div className="aus-verdict good" style={{ marginTop: 14 }}><Icon name="check" size={15} /> Plan completo · falta la validación final de la Jefatura para habilitar en UCI.</div>
            )}
          </section>
          <aside className="panel" style={{ textAlign: "center" }}>
            <div className="panel-h" style={{ justifyContent: "center" }}><Icon name="pulse" size={15} /> Progreso</div>
            <div style={{ display: "flex", justifyContent: "center", margin: "10px 0" }}>
              <DonutGrad pct={plan.data.progreso} size={116} label={`${plan.data.progreso}%`} />
            </div>
            <div style={{ fontSize: 12.5, color: "var(--ink2)" }}>{done} de {total} acciones completadas</div>
          </aside>
        </div>
      )}
    </div>
  );
}
