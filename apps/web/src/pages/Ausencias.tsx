import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSolicitudes, responderSolicitud } from "@/api/api";
import { PageHead, Segmented, Skeleton } from "@/components/kit";
import { Icon } from "@/components/icons";
import { GuiaNexBar } from "@/pages/home/parts";
import { useToast } from "@/components/Toast";
import { useApp } from "@/app/store";
import type { Tono } from "@/data/home";

const TIPO_TONO: Record<string, Tono> = {
  Vacaciones: "info",
  "Permiso administrativo": "acc",
  Capacitación: "warn",
  "Licencia médica": "crit",
  "Descanso compensatorio": "good",
  "Feriado legal": "warn",
};
const toneStyle = (t: Tono) => ({ ["--tn" as string]: `var(--${t === "acc" ? "accent" : t})` });

export function Ausencias() {
  const toast = useToast();
  const qc = useQueryClient();
  const { profile } = useApp();
  const soloLectura = profile === "subdireccion";
  const [tab, setTab] = useState<"pendientes" | "todas">("pendientes");
  const [selId, setSelId] = useState<string | null>(null);
  const { data, isLoading } = useQuery({ queryKey: ["solicitudes"], queryFn: getSolicitudes });

  const responder = useMutation({
    mutationFn: ({ id, ok }: { id: string; ok: boolean }) => responderSolicitud(id, ok),
    onSuccess: (_r, v) => {
      toast(v.ok ? "Permiso aprobado" : "Permiso rechazado · se informa al funcionario");
      qc.invalidateQueries({ queryKey: ["solicitudes"] });
    },
  });

  const list = (data ?? []).filter((s) => (tab === "pendientes" ? s.estado === "pendiente" : true));
  const sel = (data ?? []).find((s) => s.id === selId) ?? list[0] ?? null;

  useEffect(() => {
    if (data && (!selId || !data.find((s) => s.id === selId))) setSelId(list[0]?.id ?? null);
  }, [data, tab]); // eslint-disable-line react-hooks/exhaustive-deps

  const pendientes = (data ?? []).filter((s) => s.estado === "pendiente").length;
  const conImpacto = (data ?? []).filter((s) => s.estado === "pendiente" && s.generaBrechas > 0).length;

  const guia = {
    ocurre: `${pendientes} solicitud${pendientes === 1 ? "" : "es"} de permiso pendiente${pendientes === 1 ? "" : "s"}; ${conImpacto} generaría${conImpacto === 1 ? "" : "n"} brecha.`,
    hacer: soloLectura ? "Revisá el impacto de cada permiso en la dotación." : "Aprobá o rechazá viendo antes el impacto en la dotación.",
    recomienda: "NEX marca en rojo los permisos que dejan un turno bajo dotación.",
    riesgo: "Si aprobás uno con impacto, se abre una cobertura automáticamente.",
    siguiente: "La brecha pasa a Gestión Central para contactar reemplazo.",
  };

  return (
    <div className="page">
      <PageHead
        eyebrow={soloLectura ? "Ausencias · solo lectura" : "Ausencias"}
        title={<>Permisos con <span className="thin">impacto en la dotación</span></>}
        actions={soloLectura ? undefined : <button className="btn ghost" onClick={() => toast("Licencia médica registrada · impacto inmediato")} type="button"><Icon name="plane" size={13} /> Registrar licencia</button>}
      />
      <GuiaNexBar g={guia} />

      <div className="pl-stats" style={{ marginTop: 12 }}>
        <span className="plstat warn"><b>{pendientes}</b> pendientes</span>
        <span className="plstat crit"><b>{conImpacto}</b> con impacto</span>
        <span style={{ flex: 1 }} />
        <Segmented value={tab} onChange={setTab} ariaLabel="Filtro" options={[{ value: "pendientes", label: "Pendientes" }, { value: "todas", label: "Todas" }]} />
      </div>

      {isLoading && <Skeleton h={140} style={{ marginTop: 12 }} />}

      {!isLoading && (
        <div className="triage">
          <section className="panel">
            <div className="panel-h"><Icon name="plane" size={15} /> Solicitudes</div>
            {list.length === 0 && <div className="empty" style={{ padding: 26 }}><div className="empty-w">No hay solicitudes {tab === "pendientes" ? "pendientes" : ""}.</div></div>}
            <div className="brlist">
              {list.map((s) => {
                const tone = TIPO_TONO[s.tipo] ?? "info";
                const impacto = s.estado === "pendiente" && s.generaBrechas > 0;
                return (
                  <button key={s.id} className={`brow rail-${tone === "acc" ? "info" : tone}${sel?.id === s.id ? " on" : ""}`} style={toneStyle(tone)} onClick={() => setSelId(s.id)} type="button">
                    <span className="brow-orb" style={toneStyle(tone)}><Icon name="user" size={16} /></span>
                    <span className="brow-body">
                      <span className="brow-top">
                        <span className="brow-t">{s.funcionario}</span>
                        <span className={`chip ${tone}`}>{s.tipo}</span>
                        {impacto && <span className="chip crit">genera brecha</span>}
                        {s.estado === "aprobada" && <span className="chip good">aprobada</span>}
                        {s.estado === "rechazada" && <span className="chip">rechazada</span>}
                      </span>
                      <span className="brow-w">{s.rango} · {s.saldo}</span>
                    </span>
                    <Icon name="chevron-right" size={16} />
                  </button>
                );
              })}
            </div>
          </section>

          <aside className="panel triage-detail">
            {sel && (
              <>
                <div className="panel-h">
                  <Icon name="pulse" size={15} /> Impacto en la dotación
                  <span className={`ops-tag tn-${(TIPO_TONO[sel.tipo] ?? "info") === "acc" ? "info" : TIPO_TONO[sel.tipo] ?? "info"}`} style={toneStyle(TIPO_TONO[sel.tipo] ?? "info")}>{sel.tipo}</span>
                </div>
                <div className="td-title">{sel.funcionario}</div>
                <div className="td-meta">{sel.rango} · {sel.saldo}</div>

                <div className="aus-impacto">
                  <div className="foco-recolab" style={{ marginBottom: 8 }}>Si se aprueba</div>
                  {sel.impacto.map((i, k) => (
                    <div className="irow" key={k}>
                      <span style={{ color: "var(--ink2)" }}>{i.turno}</span>
                      <span className={`idot ${i.tono}`}>{i.resultado}</span>
                    </div>
                  ))}
                </div>

                <div className={`aus-verdict ${sel.generaBrechas > 0 ? "warn" : "good"}`}>
                  <Icon name={sel.generaBrechas > 0 ? "gap" : "check"} size={15} />
                  {sel.generaBrechas > 0 ? `Aprobar dejará ${sel.generaBrechas} brecha (Jue Noche) → se abre una cobertura` : "Sin impacto en la dotación"}
                </div>

                {sel.estado !== "pendiente" ? (
                  <div className={`rep-sent ${sel.estado === "rechazada" ? "" : ""}`} style={{ marginTop: 14, color: sel.estado === "aprobada" ? "var(--good)" : "var(--ink2)", background: sel.estado === "aprobada" ? "var(--good-s)" : "var(--surface-2)" }}>
                    <Icon name={sel.estado === "aprobada" ? "check" : "arrow-right"} size={15} />
                    {sel.estado === "aprobada" ? "Aprobada" : "Rechazada"}{sel.generaBrechas > 0 && sel.estado === "aprobada" ? " · generó 1 cobertura" : ""}
                  </div>
                ) : soloLectura ? (
                  <div className="firma-hint" style={{ marginTop: 14 }}><Icon name="shield" size={13} /> Vista de solo lectura · la aprobación la hace la Jefatura.</div>
                ) : (
                  <div className="td-actions" style={{ flexDirection: "row" }}>
                    <button className="btn prim" onClick={() => responder.mutate({ id: sel.id, ok: true })} disabled={responder.isPending} type="button"><Icon name="check" size={14} /> Aprobar</button>
                    <button className="btn ghost" onClick={() => responder.mutate({ id: sel.id, ok: false })} disabled={responder.isPending} type="button">Rechazar</button>
                  </div>
                )}
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
