import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cerrarBrecha, enviarOferta, getBrechas, getCandidatos, type FiltroBrechas } from "@/api/api";
import { GuideStrip, Orb, orbClass } from "@/components/ui";
import { PageHead, SearchInput, Segmented, Skeleton, EmptyState } from "@/components/kit";
import { Drawer } from "@/components/Drawer";
import { useToast } from "@/components/Toast";
import type { Brecha } from "@nexshift/contracts";

const SEV_LABEL: Record<string, string> = { critica: "Crítica", alta: "Alta", media: "Media", baja: "Baja" };
const EST_LABEL: Record<string, string> = { detectada: "Detectada", enGestion: "En gestión", escalada: "Escalada", resuelta: "Resuelta", cerrada: "Cerrada" };

export function Brechas() {
  const [q, setQ] = useState("");
  const [sev, setSev] = useState<FiltroBrechas["severidad"]>("todas");
  const [sel, setSel] = useState<Brecha | null>(null);
  const toast = useToast();
  const qc = useQueryClient();
  const navigate = useNavigate();

  const filtros: FiltroBrechas = { q, severidad: sev };
  const { data: brechas, isLoading } = useQuery({ queryKey: ["brechas", filtros], queryFn: () => getBrechas(filtros) });
  const candidatos = useQuery({ queryKey: ["cand", sel?.id], queryFn: () => getCandidatos(sel!.id), enabled: !!sel });

  const ofertar = useMutation({
    mutationFn: (id: string) => enviarOferta(id),
    onSuccess: () => {
      toast("Oferta enviada · la cobertura quedó en gestión");
      qc.invalidateQueries({ queryKey: ["brechas"] });
      setSel(null);
    },
  });
  const cerrar = useMutation({
    mutationFn: (id: string) => cerrarBrecha(id),
    onSuccess: () => {
      toast("Brecha cerrada · dotación restaurada");
      qc.invalidateQueries({ queryKey: ["brechas"] });
      setSel(null);
    },
  });

  const criticas = brechas?.filter((b) => b.severidad === "critica").length ?? 0;

  return (
    <div className="page">
      <PageHead
        eyebrow="Brechas"
        title={<>Dónde falta dotación <span className="thin">— por riesgo</span></>}
        actions={
          <>
            <SearchInput value={q} onChange={setQ} placeholder="Buscar unidad, rol…" />
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
          </>
        }
      />

      <GuideStrip
        ocurre={criticas > 0 ? `${criticas} brecha${criticas > 1 ? "s" : ""} crítica${criticas > 1 ? "s" : ""} abierta${criticas > 1 ? "s" : ""}` : "Sin brechas críticas"}
        hacer="Abrí la más crítica y enviá la oferta"
        siguiente="El Índice NEX ya tiene candidatos"
        cta="Ir a Coberturas"
        onCta={() => navigate("/coberturas")}
      />

      <div style={{ marginTop: 14, display: "grid", gap: 9 }}>
        {isLoading && [0, 1, 2].map((i) => <Skeleton key={i} h={64} />)}
        {!isLoading && brechas?.length === 0 && <EmptyState>No hay brechas con estos filtros. ¡Todo cubierto!</EmptyState>}
        {brechas?.map((b) => (
          <button key={b.id} className="card hoverable" style={{ textAlign: "left", cursor: "pointer", width: "100%" }} onClick={() => setSel(b)} type="button">
            <div className="acard">
              <Orb tone={orbClass(b.semaforo)} lg={b.severidad === "critica"} />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span className={`chip ${orbClass(b.semaforo)}`}>{SEV_LABEL[b.severidad]}</span>
                  <span className="t" style={{ fontWeight: 600, fontSize: 13.5 }}>
                    {b.unidad} · {b.turno} · {b.fecha}
                  </span>
                  {b.estado === "enGestion" && <span className="chip acc">en gestión</span>}
                  {b.estado === "escalada" && <span className="chip warn">escalada</span>}
                </div>
                <div className="w">
                  Falta {b.deficit} · {b.rol}
                  {b.minutosAbierta > 0 && ` · ${b.minutosAbierta} min abierta`}
                </div>
              </div>
              <span className="btn ghost">Ver</span>
            </div>
          </button>
        ))}
      </div>

      <Drawer
        open={!!sel}
        onClose={() => setSel(null)}
        eyebrow={sel ? `${SEV_LABEL[sel.severidad]} · ${EST_LABEL[sel.estado]}` : ""}
        title={sel ? "Turno con dotación insuficiente" : ""}
      >
        {sel && (
          <>
            <div className="p-meta" style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--ink2)" }}>
              {sel.unidad} · {sel.turno} · {sel.fecha} · {sel.rol}
            </div>
            <div className="banner" style={{ marginTop: 12 }}>⚠️ <span>{sel.causa}</span></div>

            <div className="sect" style={{ marginTop: 6 }}>Reemplazos recomendados (Índice NEX)</div>
            {candidatos.isLoading && <Skeleton h={54} />}
            {candidatos.data?.slice(0, 3).map((c, i) => (
              <div key={c.id} className="card" style={{ marginBottom: 8, padding: "11px 12px" }}>
                <div className="candrow">
                  <span className={`score${i > 0 ? " dim" : ""}`}>{c.score}</span>
                  <div>
                    <div style={{ fontWeight: 640, fontSize: 13.5 }}>
                      {c.nombre} {c.recomendado && <span className="chip acc" style={{ marginLeft: 4 }}>⭐</span>}
                    </div>
                    <div style={{ fontSize: 11.5, color: "var(--ink2)" }}>{c.tipoCobertura} · {c.costo}</div>
                  </div>
                </div>
              </div>
            ))}

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
              <button className="btn prim" onClick={() => ofertar.mutate(sel.id)} disabled={ofertar.isPending} type="button">
                {ofertar.isPending ? "Enviando…" : `Enviar oferta a ${candidatos.data?.[0]?.nombre ?? "#1"}`}
              </button>
              <button className="btn ghost" onClick={() => navigate("/coberturas")} type="button">
                Abrir en Coberturas (ranking completo)
              </button>
              <button className="btn ghost" onClick={() => cerrar.mutate(sel.id)} type="button">
                Marcar resuelta (demo)
              </button>
            </div>
          </>
        )}
      </Drawer>
    </div>
  );
}
