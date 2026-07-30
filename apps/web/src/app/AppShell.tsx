import { useEffect, useLayoutEffect, useRef } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { NAV, NAV_MOBILE } from "@/data/nav";
import { PROFILES, profileByKey } from "@/data/profiles";
import { useApp } from "@/app/store";

export function AppShell() {
  const { profile, setProfile, toggleTheme } = useApp();
  const p = profileByKey(profile);
  const navRef = useRef<HTMLDivElement>(null);
  const indRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const positionIndicator = () => {
    const nav = navRef.current;
    const ind = indRef.current;
    if (!nav || !ind) return;
    const active = nav.querySelector<HTMLElement>('a[aria-current="page"]');
    if (active) {
      ind.style.top = `${active.offsetTop}px`;
      ind.style.height = `${active.offsetHeight}px`;
      ind.style.opacity = "1";
    } else {
      ind.style.opacity = "0";
    }
  };

  useLayoutEffect(positionIndicator, [location.pathname]);
  useEffect(() => {
    window.addEventListener("resize", positionIndicator);
    return () => window.removeEventListener("resize", positionIndicator);
  }, []);

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <span className="logo" />
          NEX&nbsp;Shift
        </div>
        <span className="ctx">
          <span className="d" />
          {p.rol === "COORDINADORA" ? "Sede Central" : "Sede Central · UCI"}
        </span>
        <span className="spacer" />
        <div className="seg" role="group" aria-label="Perfil">
          {PROFILES.map((pf) => (
            <button
              key={pf.key}
              aria-pressed={pf.key === profile}
              onClick={() => setProfile(pf.key)}
              type="button"
            >
              <span className="pd" style={{ background: pf.color }} />
              {pf.nombre}
            </button>
          ))}
        </div>
        <button className="iconbtn" onClick={toggleTheme} title="Cambiar tema" type="button">
          ◐
        </button>
      </header>

      <aside className="side">
        <nav className="nav" ref={navRef} aria-label="Navegación principal">
          <div className="navind" ref={indRef} />
          {NAV.map((n) => (
            <NavLink key={n.key} to={n.path} end={n.path === "/"} className="navbtn">
              <span className="ic">{n.icon}</span>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidefoot">
          <span className="av">{p.avatar}</span>
          <div>
            <div className="nm">{p.quien}</div>
            <div className="rl">{p.rol}</div>
          </div>
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>

      <nav className="botnav" aria-label="Navegación">
        {NAV_MOBILE.map((n) => (
          <NavLink key={n.key} to={n.path} end={n.path === "/"}>
            <span className="ic">{n.icon}</span>
            {n.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
