import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMalla, publicarMalla, rotarCelda } from "@/api/api";
import { GuideStrip, Orb } from "@/components/ui";
import { PageHead, Skeleton } from "@/components/kit";
import { useToast } from "@/components/Toast";
import type { MallaSemana } from "@nexshift/contracts";

const SHORT: Record<string, string> = { largo: "D", noche: "N", libre: "L" };

function coberturaPorDia(m: MallaSemana) {
  return m.dias.map((_, d) => {
    const largo = m.personas.filter((p) => p.celdas[d] === "largo").length;
    const noche = m.personas.filter((p) => p.celdas[d] === "noche").length;
    return { ok: largo >= m.requerido.largo && noche >= m.requerido.noche, largo, noche };
  });
}

export function Programacion() {
  const toast = useToast();
  const qc = useQueryClient();
  const { data: m, isLoading } = useQuery({ queryKey: ["malla"], queryFn: getMalla });

  const rotar = useMutation({
    mutationFn: ({ p, d }: { p: string; d: number }) => rotarCelda(p, d),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["malla"] }),
  });
  const publicar = useMutation({
    mutationFn: publicarMalla,
    onSuccess: () => {
      toast("Malla publicada · ahora es fuente de verdad");
      qc.invalidateQueries({ queryKey: ["malla"] });
    },
  });

  const cov = m ? coberturaPorDia(m) : [];
  const huecos = cov.filter((c) => !c.ok).length;

  return (
    <div className="page">
      <PageHead
        eyebrow="Programación"
        title={<>La malla del mes <span className="thin">· cuarto turno</span></>}
        actions={
          <button className="btn prim" onClick={() => publicar.mutate()} disabled={publicar.isPending || m?.estado === "publicada"} type="button">
            {m?.estado === "publicada" ? "Publicada ✓" : publicar.isPending ? "Publicando…" : "Publicar malla"}
          </button>
        }
      />
      <GuideStrip
        ocurre={huecos > 0 ? `${huecos} turno${huecos > 1 ? "s" : ""} bajo el mínimo` : "Todos los turnos cubiertos"}
        hacer="Toca una celda para reasignar (rota D→N→L)"
        siguiente="Publicar congela la malla como verdad"
      />

      {isLoading && <Skeleton h={220} style={{ marginTop: 14 }} />}
      {m && (
        <div className="card" style={{ marginTop: 14 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12, alignItems: "center" }}>
            <span className="chip acc">{m.unidad}</span>
            <span className="chip">Largo 08–20</span>
            <span className="chip">Noche 20–08</span>
            <span className="chip">Libre</span>
            <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 11, color: m.estado === "publicada" ? "var(--good)" : "var(--warn)" }}>
              {m.estado === "publicada" ? "● Publicada" : "○ Borrador"}
            </span>
          </div>
          <div className="scrollx">
            <div className="malla">
              <div />
              {m.dias.map((d) => <div key={d} className="mh">{d}</div>)}
              {m.personas.map((p) => (
                <ContentsRow key={p.id}>
                  <div className="mn">{p.nombre}</div>
                  {p.celdas.map((c, d) => (
                    <button key={d} className={`cell ${c}`} onClick={() => rotar.mutate({ p: p.id, d })} title={`${p.nombre} · ${m.dias[d]}`} type="button">
                      {SHORT[c]}
                    </button>
                  ))}
                </ContentsRow>
              ))}
              <div className="mn" style={{ fontSize: 10, color: "var(--ink3)" }}>Cobertura</div>
              {cov.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Orb tone={c.ok ? "good" : "crit"} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Helper: fragmenta hijos directamente en el grid. */
function ContentsRow({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "contents" }}>{children}</div>;
}
