import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { Button } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { titleizeEnum } from "@/utils/format";

function navClassName({ isActive }) {
  return `nav-link${isActive ? " nav-link--active" : ""}`;
}

export function AppHeader() {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const roleHomeMap = {
    CANDIDATE: "/candidate",
    EMPLOYER: "/employer",
    ADMIN: "/admin",
  };
  const roleHome = user?.role ? roleHomeMap[user.role] : null;

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.search]);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <NavLink className="brand" to="/">
          <span aria-label="FindJob" className="brand__name">
            <span className="brand__name-main">Find</span>
            <span className="brand__name-accent">Job</span>
          </span>
        </NavLink>

        <button
          aria-controls="public-navigation"
          aria-expanded={menuOpen}
          className="button button--ghost header-menu-toggle"
          onClick={() => setMenuOpen((current) => !current)}
          type="button"
        >
          Menu
        </button>

        <div className={`site-header__nav${menuOpen ? " site-header__nav--open" : ""}`} id="public-navigation">
          <nav aria-label="Điều hướng công khai" className="nav-links">
            <NavLink className={navClassName} to="/">
              Trang chủ
            </NavLink>
            <NavLink className={navClassName} to="/jobs">
              Việc làm
            </NavLink>
            <NavLink className={navClassName} to="/companies">
              Công ty
            </NavLink>
            {roleHome ? (
              <NavLink className={navClassName} to={roleHome}>
                Workspace
              </NavLink>
            ) : null}
          </nav>

          <div className="header-actions">
            {isAuthenticated ? (
              <>
                <span className="status-chip">
                  {user?.fullName || user?.email} • {titleizeEnum(user?.role)}
                </span>
                {roleHome ? (
                  <Button to={roleHome} variant="secondary">
                    Mở workspace
                  </Button>
                ) : null}
                <Button onClick={logout} variant="secondary">
                  Đăng xuất
                </Button>
              </>
            ) : (
              <>
                <NavLink className="header-actions__auth-link" to="/login">
                  Đăng nhập
                </NavLink>
                <span className="header-actions__divider">/</span>
                <NavLink className="header-actions__auth-link" to="/register">
                  Đăng ký
                </NavLink>
                <NavLink className="header-actions__employer-link" to="/employers">
                  Trang nhà tuyển dụng
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
