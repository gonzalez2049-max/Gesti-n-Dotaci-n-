import { useEffect, useLayoutEffect, useRef } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { navFor, navMobileFor } from "@/data/nav";
import { PROFILES, profileByKey } from "@/data/profiles";
import { Icon } from "@/components/icons";
import { useApp } from "@/app/store";

export function AppShell() {
  const { profile, setProfile, toggleTheme } = useApp();
  const p = profileByKey(profile);
  const nav = navFor(profile);
  const navMobile = navMobileFor(profile);
  const navRef = useRef<HTMLDivElement>(null);
  const indRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const positionIndicator = () => {
    const el = navRef.current;
    const ind = indRef.current;
    if (!el || !ind) return;
    const active = el.querySelector<HTMLElement>('a[aria-current="page"]');
    if (active) {
      ind.style.top = `${active.offsetTop}px`;
      ind.style.height = `${active.offsetHeight}px`;
      ind.style.opacity = "1";
    } else {
      ind.style.opacity = "0";
    }
  };

  useLayoutEffect(positionIndicator, [location.pathname, profile]);
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
          {p.ctx}
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
          {nav.map((n) => (
            <NavLink key={n.key} to={n.path} end className="navbtn">
              <span className="ic">
                <Icon name={n.icon} size={17} />
              </span>
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
        {navMobile.map((n) => (
          <NavLink key={n.key} to={n.path} end>
            <span className="ic">
              <Icon name={n.icon} size={18} />
            </span>
            {n.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
