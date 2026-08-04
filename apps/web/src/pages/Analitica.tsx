import { useQuery } from "@tanstack/react-query";
import { getAnalitica } from "@/api/api";
import { PageHead, Skeleton } from "@/components/kit";
import { Icon } from "@/components/icons";
import { LineChart, Sparkline, StackedBars } from "@/components/Charts";
import { GuiaNexBar, NexPanel, toneStyle } from "@/pages/home/parts";
import type { Tono } from "@/data/home";

const toneVar: Record<string, string> = { crit: "--crit", warn: "--warn", good: "--good", neutro: "--info" };
const asTone = (t: string): Tono => (t === "crit" ? "crit" : t === "warn" ? "warn" : t === "good" ? "good" : "info");

const ACCION: Record<string, string> = {
  UCI: "Reforzar pool jul–ago · +1 cupo estable",
  Urgencias: "Revisar malla nocturna · sumar apoyo",
  Pabellón: "Renovar certificaciones por vencer",
  "Med. Interna": "Monitorear carga · sin acción inmediata",
};

export function Analitica() {
  const { data, isLoading } = useQuery({ queryKey: ["analitica"], queryFn: getAnalitica });

  const guia = {
    ocurre: "El ausentismo sube (9,1%) y el costo de cobertura casi se duplicó.",
    hacer: "Concentrá recursos donde el riesgo es mayor: UCI y Urgencias.",
    recomienda: "Reforzar el pool estable en UCI reduce hora extra y tiempo de respuesta.",
    riesgo: "Sin intervención, las brechas crónicas y el costo siguen creciendo.",
    siguiente: "Se simula el ajuste y se valida con las jefaturas. La analítica apoya, no ejecuta.",
  };

  const nex = {
    titulo: "Intervení primero en UCI",
    razon:
      "UCI concentra el mayor riesgo de la red: brecha crónica, ausentismo del 11% y un pool frágil (5). Un refuerzo de pool en jul–ago bajaría el costo de cobertura y el tiempo de respuesta.",
    confianza: 84,
    accion: "Pedir reporte de UCI",
    ruta: "/reportes",
    impacto: ["−40% hora extra proyectada", "Cobertura nocturna estable", "Menos brechas crónicas"],
  };

  return (
    <div className="page">
      <PageHead eyebrow="Analítica · Subdirección — observatorio" title={<>Cómo vamos, por qué <span className="thin">y dónde intervenir</span></>} />
      <GuiaNexBar g={guia} />

      {isLoading && <Skeleton h={90} style={{ marginTop: 14 }} />}

      {data && (
        <>
          <section className="panel" style={{ marginTop: 14 }}>
            <div className="panel-h"><Icon name="chart" size={15} /> Indicadores clave · últimos 6 meses</div>
            <div className="trends" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
              {data.kpis.map((k) => (
                <div className="trend" key={k.clave} style={toneStyle(asTone(k.tono))}>
                  <div className="trend-lab">{k.etiqueta}</div>
                  <div className="trend-val">
                    {k.valor}
                    <span className="trend-u">{k.unidad}</span>
                  </div>
                  <div className="trend-foot">
                    <span className="trend-delta" style={{ color: "var(--tn)", background: "color-mix(in srgb, var(--tn) 14%, transparent)" }}>{k.delta}</span>
                    <Sparkline vals={k.spark} colorVar={toneVar[k.tono]} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="strat">
            <section className="panel">
              <div className="panel-h"><Icon name="pulse" size={15} /> Tendencias</div>
              <div className="ana-charts">
                <div className="ana-chart">
                  <div className="ana-ct">Ausentismo · 6 meses <span className="tn-crit">9,1%</span></div>
                  <LineChart serie={data.ausentismo} yMax={12} />
                  <div className="ana-note"><b>Causa:</b> licencias de invierno · <b>Acción:</b> reforzar pool jul–ago.</div>
                </div>
                <div className="ana-chart">
                  <div className="ana-ct">Costo de cobertura · por tipo</div>
                  <div className="legend" style={{ margin: "4px 0 2px" }}>
                    <span><span className="lgsw" style={{ background: "var(--c1)" }} /> Hora extra</span>
                    <span><span className="lgsw" style={{ background: "var(--c2)" }} /> Adicional</span>
                    <span><span className="lgsw" style={{ background: "var(--c3)" }} /> Externo</span>
                  </div>
                  <StackedBars serie={data.costos} yMax={110} />
                  <div className="ana-note"><b>Tendencia:</b> el costo casi se duplicó · invertir en pool lo reduce.</div>
                </div>
              </div>
            </section>

            <NexPanel nex={nex} />
          </div>

          <section className="panel" style={{ marginTop: 14 }}>
            <div className="panel-h"><Icon name="grid" size={15} /> Dónde intervenir · unidades por riesgo</div>
            <div className="interv-list">
              {data.unidadesCriticas.map((u, i) => {
                const tone = asTone(u.tono);
                return (
                  <div className={`interv rail-${tone}`} key={u.unidad} style={toneStyle(tone)}>
                    <span className="interv-rank">{i + 1}</span>
                    <div className="interv-main">
                      <div className="interv-top">
                        <span className="interv-unit">{u.unidad}</span>
                        <span className="interv-factores">
                          {u.factores.map((f) => (
                            <span className="chip" key={f}>{f}</span>
                          ))}
                        </span>
                      </div>
                      <div className="interv-accion"><Icon name="sparkles" size={12} /> {ACCION[u.unidad] ?? "Monitorear"}</div>
                    </div>
                    <div className="interv-risk">
                      <div className="interv-bar"><span style={{ width: `${u.valor}%` }} /></div>
                      <b>{u.valor}</b>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
