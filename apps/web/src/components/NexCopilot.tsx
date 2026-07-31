import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/app/store";
import { getCopiloto } from "@/data/home";
import { Icon } from "@/components/icons";
import { toneStyle } from "@/pages/home/parts";

/**
 * NEX como copiloto permanente: dock flotante presente en toda la app.
 * Colapsado muestra el foco actual; expandido, la recomendación y la acción.
 */
export function NexCopilot() {
  const { profile } = useApp();
  const navigate = useNavigate();
  const c = getCopiloto(profile);
  const [open, setOpen] = useState(false);

  return (
    <div className={`copilot ${open ? "open" : ""}`} style={toneStyle(c.tono)}>
      {open ? (
        <div className="cop-panel" role="dialog" aria-label="Copiloto NEX">
          <div className="cop-head">
            <span className="cop-orb">
              <Icon name="sparkles" size={15} />
            </span>
            <div className="cop-id">
              NEX · Copiloto
              <span className="cop-live">
                <i /> vigilando en vivo
              </span>
            </div>
            <button className="cop-x" onClick={() => setOpen(false)} aria-label="Cerrar" type="button">
              ✕
            </button>
          </div>
          <div className="cop-estado">
            <span className="cop-dot" /> {c.estado}
          </div>
          <div className="cop-msg">{c.mensaje}</div>
          <div className="cop-sug">
            <Icon name="sparkles" size={13} /> {c.sugerencia}
          </div>
          <div className="cop-actions">
            <button
              className="btn prim"
              type="button"
              onClick={() => {
                navigate(c.ruta);
                setOpen(false);
              }}
            >
              <Icon name="bolt" size={14} /> {c.cta}
            </button>
          </div>
        </div>
      ) : (
        <button className="cop-fab" onClick={() => setOpen(true)} type="button" aria-label={`NEX Copiloto: ${c.estado}`}>
          <span className="cop-fab-orb">
            <Icon name="sparkles" size={17} />
            <span className="cop-fab-ping" />
          </span>
          <span className="cop-fab-txt">
            <b>NEX</b>
            <small>{c.estado}</small>
          </span>
        </button>
      )}
    </div>
  );
}
