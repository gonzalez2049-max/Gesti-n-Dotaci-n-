import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cerrarBrecha, enviarOferta, getBrechas, getCandidatos, type FiltroBrechas } from "@/api/api";
import { orbClass } from "@/components/ui";
import { PageHead, Segmented, Skeleton } from "@/components/kit";
import { Icon } from "@/components/icons";
import { GuiaNexBar } from "@/pages/home/parts";
import { useToast } from "@/components/Toast";
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

  const filtros: FiltroBrechas = { q: "", severidad: sev };
  const { data: brechas, isLoading } = useQuery({ queryKey: ["brechas", filtros], queryFn: () => getBrechas(filtros) });
  const candidatos = useQuery({ queryKey: ["cand", sel?.id], queryFn: () => getCandidatos(sel!.id), enabled: !!sel });

  // selecciona la primera brecha automáticamente para llenar el panel de detalle
  useEffect(() => {
    if (!sel && brechas && brechas.length > 0) setSel(brechas[0]);
    if (sel && brechas && !brechas.find((b) => b.id === sel.id)) setSel(brechas[0] ?? null);
  }, [brechas]); // eslint-disable-line react-hooks/exhaustive-deps

  const ofertar = useMutation({
    mutationFn: (id: string) => enviarOferta(id),
    onSuccess: () => {
      toast("Oferta enviada · la cobertura quedó en gestión");
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

  const guia = {
    ocurre: criticas > 0 ? `${criticas} brecha${criticas > 1 ? "s" : ""} crítica${criticas > 1 ? "s" : ""} abierta${criticas > 1 ? "s" : ""} ahora.` : "Sin brechas críticas en este momento.",
    hacer: "Seleccioná la más crítica y enviá la oferta al recomendado.",
    recomienda: "El Índice NEX ya priorizó reemplazos habilitados y con menor carga.",
    riesgo: "Si no se cubre, el turno abre bajo dotación crítica.",
    siguiente: "La oferta pasa a Coberturas y la brecha queda en gestión.",
    cta: "Ir a Coberturas",
    ruta: "/coberturas",
  };

  return (
    <div className="page">
      <PageHead
        eyebrow="Brechas · consola de triage"
        title={<>Dónde falta dotación <span className="thin">— por riesgo</span></>}
      />
      <GuiaNexBar g={guia} />

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

        {/* ---- detalle + NEX ---- */}
        <aside className="panel triage-detail">
          {!sel && <div className="empty" style={{ padding: 30 }}><div className="empty-w">Seleccioná una brecha para ver los reemplazos NEX.</div></div>}
          {sel && (
            <>
              <div className="panel-h">
                <Icon name="sparkles" size={15} /> Resolver brecha
                <span className="ops-tag tn-crit" style={toneStyle("crit")}>{EST_LABEL[sel.estado]}</span>
              </div>
              <div className="td-title">{sel.unidad} · {sel.turno}</div>
              <div className="td-meta">{sel.fecha} · {sel.rol} · falta {sel.deficit}{sel.minutosAbierta > 0 ? ` · ${sel.minutosAbierta} min abierta` : ""}</div>
              <div className="td-causa"><Icon name="pulse" size={13} /> {sel.causa}</div>

              <div className="foco-recolab" style={{ marginTop: 14 }}>Índice NEX · mejores reemplazos</div>
              <div className="foco-recos" style={{ margin: "9px 0 0" }}>
                {candidatos.isLoading && [0, 1, 2].map((i) => <Skeleton key={i} h={52} />)}
                {candidatos.data?.slice(0, 3).map((c, i) => {
                  const t: Tone = c.score >= 80 ? "good" : "warn";
                  return (
                    <div className={`cand ${i === 0 ? "best" : ""}`} key={c.id} style={toneStyle(t)}>
                      <span className="cand-rank">{i + 1}</span>
                      <div className="cand-info">
                        <div className="cand-name">
                          {c.nombre}
                          {c.recomendado && <span className="cand-badge">NEX recomienda</span>}
                        </div>
                        <div className="cand-det">{c.tipoCobertura} · {c.costo}</div>
                      </div>
                      <div className="cand-score">
                        <div className="cand-bar"><span style={{ width: `${c.score}%` }} /></div>
                        <b>{c.score}</b>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="td-actions">
                <button className="btn prim" onClick={() => ofertar.mutate(sel.id)} disabled={ofertar.isPending} type="button">
                  <Icon name="send" size={14} /> {ofertar.isPending ? "Enviando…" : `Enviar oferta a ${candidatos.data?.[0]?.nombre?.split(" ")[0] ?? "#1"}`}
                </button>
                <button className="btn ghost" onClick={() => navigate("/coberturas")} type="button">Ranking completo</button>
                <button className="btn ghost" onClick={() => cerrar.mutate(sel.id)} type="button">Marcar resuelta</button>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
