import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="py-4 mt-auto" style={{ borderTop: "1px solid rgba(128,128,128,.15)" }}>
      <div className="container">
        <div className="row gy-3 align-items-center">
          <div className="col-md-4">
            <span className="fw-bold" style={{ color: "var(--primary)" }}>📚 StudyNotes Hub</span>
            <p className="small text-muted mt-1 mb-0">Premium study notes for serious students.</p>
          </div>
          <div className="col-md-4 text-center">
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              {[["Notes", "/notes"], ["About", "/about"], ["Developers", "/developers"], ["Contact", "/contact"]].map(([l, p]) => (
                <Link key={p} to={p} className="small text-muted">{l}</Link>
              ))}
            </div>
          </div>
          <div className="col-md-4 text-md-end">
            <small className="text-muted">© {new Date().getFullYear()} StudyNotes Hub</small>
          </div>
        </div>
      </div>
    </footer>
  );
}
