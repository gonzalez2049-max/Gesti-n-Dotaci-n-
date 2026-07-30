import type { ReactNode } from "react";
import type { Semaforo } from "@nexshift/contracts";

/** Mapea el semáforo de dotación al orbe visual (doc 11 §11.7). */
export const orbClass = (s?: Semaforo): string =>
  s === "critico" ? "crit" : s === "riesgo" ? "warn" : s === "exceso" ? "info" : "good";

export function Orb({ tone, lg }: { tone: string; lg?: boolean }) {
  return <span className={`orb ${tone}${lg ? " lg" : ""}`} aria-hidden="true" />;
}

export function Chip({ tone, children }: { tone?: string; children: ReactNode }) {
  return <span className={`chip${tone ? " " + tone : ""}`}>{children}</span>;
}

export function GuideStrip({
  ocurre,
  hacer,
  siguiente,
  cta,
  onCta,
}: {
  ocurre: string;
  hacer: string;
  siguiente: string;
  cta?: string;
  onCta?: () => void;
}) {
  return (
    <div className="guide">
      <div className="s2">
        <span className="gk q">▸ Ocurre</span>
        <span className="gv">{ocurre}</span>
      </div>
      <div className="s2">
        <span className="gk a">◉ Hacé</span>
        <span className="gv">
          <b>{hacer}</b>
        </span>
      </div>
      <div className="s2">
        <span className="gk n">→ Sigue</span>
        <span className="gv">{siguiente}</span>
      </div>
      {cta && (
        <button className="gbtn" onClick={onCta} type="button">
          {cta}
        </button>
      )}
    </div>
  );
}

export function PriorityBar({ text, onResolve }: { text: string; onResolve?: () => void }) {
  return (
    <div className="prio" role="region" aria-label="Acción prioritaria">
      <span className="pl">◉ Prioritario</span>
      <span className="pt">{text}</span>
      <button className="btn prim" onClick={onResolve} type="button">
        Resolver
      </button>
    </div>
  );
}
