interface PlaceholderProps {
  title: string;
  doc: string;
}

/** Marcador para los espacios de trabajo aún no construidos en código.
 *  Su diseño está definido en docs/architecture y en los prototipos. */
export function Placeholder({ title, doc }: PlaceholderProps) {
  return (
    <>
      <div className="eyebrow">{title}</div>
      <h1 className="title">
        {title} <span className="thin">· próximamente</span>
      </h1>
      <div className="card" style={{ marginTop: 14 }}>
        <p style={{ margin: 0, fontSize: 13.5, color: "var(--ink2)" }}>
          Esta pantalla ya está <b>diseñada y prototipada</b>. Se construirá sobre esta misma
          base visual en las próximas fases.
        </p>
        <p style={{ margin: "8px 0 0", fontSize: 12.5, color: "var(--ink3)" }}>
          Referencia: <code style={{ fontFamily: "var(--font-mono)" }}>{doc}</code>
        </p>
      </div>
    </>
  );
}
