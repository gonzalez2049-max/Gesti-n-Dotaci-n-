import { useQuery } from "@tanstack/react-query";
import { getAnalitica } from "@/api/api";
import { GuideStrip } from "@/components/ui";
import { PageHead, Skeleton } from "@/components/kit";
import { LineChart, Sparkline, StackedBars } from "@/components/Charts";

const tonoVar: Record<string, string> = { crit: "--crit", warn: "--warn", good: "--good", neutro: "--c1" };

export function Analitica() {
  const { data, isLoading } = useQuery({ queryKey: ["analitica"], queryFn: getAnalitica });

  return (
    <div className="page">
      <PageHead eyebrow="Analítica · Subdirección" title={<>Cómo vamos, por qué <span className="thin">y qué hacer</span></>} />
      <GuideStrip ocurre="El ausentismo sube y las brechas crónicas crecen" hacer="Prioridad de recursos en UCI y Urgencias" siguiente="Las predicciones apoyan; no ejecutan cambios" />
      <div className="banner" style={{ marginTop: 12 }}>◷ <span><b>Las predicciones apoyan decisiones; no ejecutan cambios.</b></span></div>

      {isLoading && <Skeleton h={90} />}

      {data && (
        <>
          <div className="grid g4" style={{ marginTop: 12 }}>
            {data.kpis.map((k) => (
              <div className="card hoverable kpi" key={k.clave}>
                <div className="lab">{k.etiqueta}</div>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 6 }}>
                  <div className={`big ${k.tono}`}>{k.valor}<span className="u">{k.unidad}</span></div>
                  <span className="chip" style={{ background: `var(${tonoVar[k.tono]}-s, var(--surface-2))`, color: `var(${tonoVar[k.tono]})`, borderColor: "transparent" }}>{k.delta}</span>
                </div>
                <div style={{ marginTop: 6 }}><Sparkline vals={k.spark} colorVar={tonoVar[k.tono]} /></div>
              </div>
            ))}
          </div>

          <div className="grid g2" style={{ marginTop: 14 }}>
            <div className="card">
              <div className="eyebrow">Ausentismo · 6 meses</div>
              <div style={{ marginTop: 8 }}><LineChart serie={data.ausentismo} yMax={12} /></div>
              <div className="tcr"><b>Tendencia:</b> al alza (6,2→9,1%). <b>Causa:</b> licencias de invierno. <b>Recom.:</b> reforzar pool jul–ago.</div>
            </div>
            <div className="card">
              <div className="eyebrow">Costos de cobertura · por tipo</div>
              <div className="legend" style={{ marginTop: 8 }}>
                <span><span className="lgsw" style={{ background: "var(--c1)" }} />Hora extra</span>
                <span><span className="lgsw" style={{ background: "var(--c2)" }} />Adicional</span>
                <span><span className="lgsw" style={{ background: "var(--c3)" }} />Externo</span>
              </div>
              <StackedBars serie={data.costos} yMax={110} />
              <div className="tcr"><b>Tendencia:</b> el costo casi se duplicó. <b>Recom.:</b> invertir en pool baja el costo.</div>
            </div>
          </div>

          <div className="sect">Unidades críticas</div>
          <div className="card">
            {data.unidadesCriticas.map((u) => (
              <div className="hb" key={u.unidad}>
                <span className="hl">{u.unidad}</span>
                <div className="htrack"><div className="hfill" style={{ width: `${u.valor}%`, background: `var(--${u.tono === "crit" ? "crit" : u.tono === "warn" ? "warn" : "good"})` }} /></div>
                <span className={`hv`} style={{ color: `var(--${u.tono === "crit" ? "crit" : "warn"})` }}>{u.valor}</span>
              </div>
            ))}
            <div className="tcr" style={{ marginTop: 6 }}><b>UCI</b> lidera el riesgo: {data.unidadesCriticas[0].factores.join(" · ")}.</div>
          </div>
        </>
      )}
    </div>
  );
}
