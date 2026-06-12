import React from "react";
import { Link, NavLink } from "react-router-dom";
import { RiSunLine, RiMoonLine, RiUserLine } from "react-icons/ri";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();

  return (
    <nav className="navbar navbar-expand-lg sticky-top shadow-sm" style={{ backdropFilter: "blur(8px)" }}>
      <div className="container">
        <Link to="/" className="navbar-brand navbar-brand-logo">
          📚 StudyNotes Hub
        </Link>
        <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {[["Notes", "/notes"], ["About", "/about"], ["Developers", "/developers"], ["Contact", "/contact"]].map(([label, path]) => (
              <li key={path} className="nav-item">
                <NavLink to={path} className={({ isActive }) => `nav-link${isActive ? " fw-semibold" : ""}`}>
                  {label}
                </NavLink>
              </li>
            ))}
            {user?.role === "admin" && (
              <li className="nav-item">
                <NavLink to="/admin" className={({ isActive }) => `nav-link${isActive ? " fw-semibold" : ""}`}>
                  Admin
                </NavLink>
              </li>
            )}
          </ul>
          <div className="d-flex align-items-center gap-3">
            <button onClick={toggle} className="btn btn-sm btn-outline-secondary rounded-circle p-1" title="Toggle theme">
              {dark ? <RiSunLine size={18} /> : <RiMoonLine size={18} />}
            </button>
            {user ? (
              <div className="dropdown">
                <button className="btn btn-sm btn-outline-primary dropdown-toggle d-flex align-items-center gap-2" data-bs-toggle="dropdown">
                  {user.profile_picture ? (
                    <img src={user.profile_picture} alt="" width={24} height={24} className="rounded-circle" />
                  ) : (
                    <RiUserLine />
                  )}
                  <span className="d-none d-md-inline">{user.name.split(" ")[0]}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><Link className="dropdown-item" to="/dashboard">Dashboard</Link></li>
                  <li><Link className="dropdown-item" to="/my-notes">My Notes</Link></li>
                  <li><Link className="dropdown-item" to="/purchase-history">Purchase History</Link></li>
                  <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item text-danger" onClick={logout}>Logout</button></li>
                </ul>
              </div>
            ) : (
              <a 
  href={`${import.meta.env.VITE_API_URL}/auth/login`}
  className="btn btn-primary btn-sm"
>
  Sign in with Google
</a>//<a href="/auth/login" className="btn btn-primary btn-sm">Sign in with Google</a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
