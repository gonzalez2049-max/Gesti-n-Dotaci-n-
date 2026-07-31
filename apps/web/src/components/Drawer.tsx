import { useEffect, type ReactNode } from "react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  eyebrow?: string;
  children: ReactNode;
}

/** Panel lateral (doc 23): detalle/resolución sin cambiar de pantalla. */
export function Drawer({ open, onClose, title, eyebrow, children }: DrawerProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <div className={`scrim${open ? " open" : ""}`} onClick={onClose} />
      <aside className={`drawer${open ? " open" : ""}`} role="dialog" aria-hidden={!open}>
        <div className="dhead">
          <div>
            {eyebrow && <div className="eyebrow">{eyebrow}</div>}
            {title && <div style={{ fontSize: 16, fontWeight: 660, marginTop: 3 }}>{title}</div>}
          </div>
          <button className="dclose" onClick={onClose} aria-label="Cerrar" type="button">
            ✕
          </button>
        </div>
        <div className="dbody">{open && children}</div>
      </aside>
    </>
  );
}
