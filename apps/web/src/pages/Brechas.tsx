import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cerrarBrecha, enviarOferta, getBrechas, type FiltroBrechas } from "@/api/api";
import { orbClass } from "@/components/ui";
import { PageHead, Segmented, Skeleton } from "@/components/kit";
import { Icon } from "@/components/icons";
import { useToast } from "@/components/Toast";
import { useApp } from "@/app/store";
import type { Brecha } from "@nexshift/contracts";

const SEV_LABEL: Record<string, string> = { critica: "Crítica", alta: "Alta", media: "Media", baja: "Baja" };
const EST_LABEL: Record<string, string> = { detectada: "Detectada", enGestion: "En gestión", escalada: "Escalada", resuelta: "Resuelta", cerrada: "Cerrada" };
type Tone = "good" | "warn" | "crit" | "info";
const toneStyle = (t: Tone) => ({ ["--tn" as string]: `var(--${t === "good" ? "good" : t === "warn" ? "warn" : t === "crit" ? "crit" : "info"})` });

export function Brechas() {
  const [sev, setSev] = useState<FiltroBrechas["severidad"]>("todas");
  const [sel, setSel] = useState<Brecha | null>(null);
  const toast = useToast();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { profile } = useApp();
  const esGestion = profile === "gestion";
  const soloLectura = profile === "subdireccion";

  const filtros: FiltroBrechas = { q: "", severidad: sev };
  const { data: brechas, isLoading } = useQuery({ queryKey: ["brechas", filtros], queryFn: () => getBrechas(filtros) });

  // selecciona la primera brecha automáticamente para llenar el panel de detalle
  useEffect(() => {
    if (!sel && brechas && brechas.length > 0) setSel(brechas[0]);
    if (sel && brechas && !brechas.find((b) => b.id === sel.id)) setSel(brechas[0] ?? null);
  }, [brechas]); // eslint-disable-line react-hooks/exhaustive-deps

  const ofertar = useMutation({
    mutationFn: (id: string) => enviarOferta(id),
    onSuccess: () => {
      toast("Solicitud enviada a Gestión Central · la brecha quedó en gestión");
      qc.invalidateQueries({ queryKey: ["brechas"] });
    },
  });
  const cerrar = useMutation({
    mutationFn: (id: string) => cerrarBrecha(id),
    onSuccess: () => {
      toast("Brecha cerrada · dotación restaurada");
      qc.invalidateQueries({ queryKey: ["brechas"] });
    },
  });

  const total = brechas?.length ?? 0;
  const criticas = brechas?.filter((b) => b.severidad === "critica").length ?? 0;
  const enGestion = brechas?.filter((b) => b.estado === "enGestion" || b.estado === "escalada").length ?? 0;


  return (
    <div className="page">
      <PageHead
        eyebrow="Brechas · consola de triage"
        title={<>Dónde falta dotación <span className="thin">— por riesgo</span></>}
      />

      <div className="pl-stats" style={{ marginTop: 12 }}>
        <span className="plstat"><b>{total}</b> abiertas</span>
        <span className="plstat crit"><b>{criticas}</b> críticas</span>
        <span className="plstat warn"><b>{enGestion}</b> en gestión</span>
        <span style={{ flex: 1 }} />
        <Segmented
          value={sev ?? "todas"}
          onChange={(v) => setSev(v)}
          ariaLabel="Severidad"
          options={[
            { value: "todas", label: "Todas" },
            { value: "critica", label: "Críticas" },
            { value: "alta", label: "Altas" },
            { value: "media", label: "Medias" },
          ]}
        />
      </div>

      <div className="triage">
        {/* ---- lista por riesgo ---- */}
        <section className="panel triage-list">
          <div className="panel-h">
            <Icon name="gap" size={15} /> Brechas por riesgo
          </div>
          {isLoading && <div style={{ display: "grid", gap: 8 }}>{[0, 1, 2, 3].map((i) => <Skeleton key={i} h={62} />)}</div>}
          {!isLoading && total === 0 && (
            <div className="empty" style={{ padding: 30 }}>
              <span className="empty-ic"><Icon name="check" size={24} /></span>
              <div className="empty-t">Todo cubierto</div>
              <div className="empty-w">No hay brechas con estos filtros.</div>
            </div>
          )}
          <div className="brlist">
            {brechas?.map((b) => {
              const tone = orbClass(b.semaforo) as Tone;
              return (
                <button
                  key={b.id}
                  className={`brow rail-${tone}${sel?.id === b.id ? " on" : ""}`}
                  onClick={() => setSel(b)}
                  type="button"
                >
                  <span className={`brow-orb tn-${tone}`} style={toneStyle(tone)}>
                    {b.deficit}
                  </span>
                  <span className="brow-body">
                    <span className="brow-top">
                      <span className={`chip ${tone}`}>{SEV_LABEL[b.severidad]}</span>
                      <span className="brow-t">{b.unidad} · {b.turno}</span>
                      {b.estado === "enGestion" && <span className="chip acc">en gestión</span>}
                      {b.estado === "escalada" && <span className="chip warn">escalada</span>}
                    </span>
                    <span className="brow-w">{b.fecha} · {b.rol}{b.minutosAbierta > 0 ? ` · ${b.minutosAbierta} min` : ""}</span>
                  </span>
                  <Icon name="chevron-right" size={16} />
                </button>
              );
            })}
          </div>
        </section>

        {/* ---- detalle de la brecha ---- */}
        <aside className="panel triage-detail">
          {!sel && <div className="empty" style={{ padding: 30 }}><div className="empty-w">Seleccioná una brecha para ver el detalle.</div></div>}
          {sel && (
            <>
              <div className="panel-h">
                <Icon name="gap" size={15} /> Resolver brecha
                <span className="ops-tag tn-crit" style={toneStyle("crit")}>{EST_LABEL[sel.estado]}</span>
              </div>
              <div className="td-title">{sel.unidad} · {sel.turno}</div>
              <div className="td-meta">{sel.fecha} · {sel.rol} · falta {sel.deficit}{sel.minutosAbierta > 0 ? ` · ${sel.minutosAbierta} min abierta` : ""}</div>
              <div className="td-causa"><Icon name="pulse" size={13} /> {sel.causa}</div>

              <p className="foco-desc" style={{ marginTop: 14 }}>
                {esGestion
                  ? "Gestioná la cobertura contactando al personal de la unidad de forma secuencial en Coberturas."
                  : "Solicitá la cobertura a Gestión Central: ellos contactan al personal de la unidad y te devuelven la respuesta para que confirmes."}
              </p>

              {soloLectura ? (
                <div className="firma-hint" style={{ marginTop: 16 }}><Icon name="shield" size={13} /> Vista de solo lectura · la resuelven la Jefatura y Gestión Central.</div>
              ) : esGestion ? (
                <div className="td-actions">
                  <button className="btn prim" onClick={() => navigate("/coberturas")} type="button"><Icon name="send" size={14} /> Contactar en Coberturas</button>
                  <button className="btn ghost" onClick={() => cerrar.mutate(sel.id)} type="button">Marcar resuelta</button>
                </div>
              ) : (
                <div className="td-actions">
                  <button className="btn prim" onClick={() => ofertar.mutate(sel.id)} disabled={ofertar.isPending || sel.estado === "enGestion"} type="button">
                    <Icon name="send" size={14} /> {sel.estado === "enGestion" ? "En Gestión Central" : ofertar.isPending ? "Enviando…" : "Solicitar cobertura a Gestión Central"}
                  </button>
                  <button className="btn ghost" onClick={() => cerrar.mutate(sel.id)} type="button">Marcar resuelta</button>
                </div>
              )}
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
