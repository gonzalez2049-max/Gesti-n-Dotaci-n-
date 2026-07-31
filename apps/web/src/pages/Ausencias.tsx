import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSolicitudes, responderSolicitud } from "@/api/api";
import { GuideStrip } from "@/components/ui";
import { PageHead, Skeleton, Tabs, EmptyState } from "@/components/kit";
import { useToast } from "@/components/Toast";
import type { SolicitudAusencia } from "@nexshift/contracts";

const TIPO_CHIP: Record<string, string> = {
  Vacaciones: "info",
  "Permiso administrativo": "acc",
  Capacitación: "warn",
  "Licencia médica": "crit",
};

export function Ausencias() {
  const toast = useToast();
  const qc = useQueryClient();
  const [tab, setTab] = useState<"pendientes" | "todas">("pendientes");
  const { data, isLoading } = useQuery({ queryKey: ["solicitudes"], queryFn: getSolicitudes });

  const responder = useMutation({
    mutationFn: ({ id, ok }: { id: string; ok: boolean }) => responderSolicitud(id, ok),
    onSuccess: (_r, v) => {
      toast(v.ok ? "Permiso aprobado" : "Permiso rechazado · se informa al funcionario");
      qc.invalidateQueries({ queryKey: ["solicitudes"] });
    },
  });

  const list = (data ?? []).filter((s) => (tab === "pendientes" ? s.estado === "pendiente" : true));

  return (
    <div className="page">
      <PageHead
        eyebrow="Ausencias"
        title={<>Aprobar con <span className="thin">impacto en la dotación</span></>}
        actions={<button className="btn ghost" onClick={() => toast("Licencia médica registrada · impacto inmediato")} type="button">＋ Registrar licencia médica</button>}
      />
      <GuideStrip ocurre="Cada solicitud muestra qué pasaría con la dotación" hacer="Aprobá o rechazá; verás el impacto antes de decidir" siguiente="Si genera brecha, se abre una cobertura" />

      <Tabs value={tab} onChange={setTab} tabs={[{ value: "pendientes", label: "Pendientes" }, { value: "todas", label: "Todas" }]} />

      {isLoading && <Skeleton h={140} />}
      {!isLoading && list.length === 0 && <EmptyState>No hay solicitudes {tab === "pendientes" ? "pendientes" : ""}.</EmptyState>}

      <div style={{ display: "grid", gap: 10 }}>
        {list.map((s) => (
          <SolicitudCard key={s.id} s={s} onResp={(ok) => responder.mutate({ id: s.id, ok })} pending={responder.isPending} />
        ))}
      </div>
    </div>
  );
}

function SolicitudCard({ s, onResp, pending }: { s: SolicitudAusencia; onResp: (ok: boolean) => void; pending: boolean }) {
  const resolved = s.estado !== "pendiente";
  return (
    <div className="card">
      <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
        <span className={`chip ${TIPO_CHIP[s.tipo] ?? ""}`}>{s.tipo}</span>
        <span style={{ fontWeight: 640, fontSize: 15 }}>{s.funcionario}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--ink2)" }}>{s.rango}</span>
        <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink3)" }}>{s.saldo}</span>
      </div>

      <div style={{ background: "var(--surface-2)", border: "1px solid var(--hairline)", borderRadius: 9, padding: "10px 12px", margin: "11px 0" }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>Si apruebas · impacto en la dotación</div>
        {s.impacto.map((i, k) => (
          <div className="irow" key={k}>
            <span style={{ color: "var(--ink2)" }}>{i.turno}</span>
            <span className={`idot ${i.tono}`}>{i.resultado}</span>
          </div>
        ))}
      </div>

      {resolved ? (
        <div className={`chip ${s.estado === "aprobada" ? "good" : "crit"}`}>{s.estado === "aprobada" ? "✓ Aprobada" : "✕ Rechazada"}{s.generaBrechas > 0 && s.estado === "aprobada" ? " · generó 1 cobertura" : ""}</div>
      ) : (
        <>
          <div style={{ fontSize: 12.5, fontWeight: 560, marginBottom: 10, color: s.generaBrechas > 0 ? "var(--crit)" : "var(--good)" }}>
            {s.generaBrechas > 0 ? `⚠️ Aprobar dejará ${s.generaBrechas} brecha (Jue Noche) → cobertura` : "✓ Sin impacto en la dotación"}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn prim" onClick={() => onResp(true)} disabled={pending} type="button">Aprobar</button>
            <button className="btn ghost" onClick={() => onResp(false)} disabled={pending} type="button">Rechazar</button>
          </div>
        </>
      )}
    </div>
  );
}
