import React from "react";
import { Link } from "react-router-dom";

export default function Forbidden() {
  return (
    <div className="container py-5 text-center" style={{ minHeight: "70vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <h1 style={{ fontSize: 96, fontWeight: 800, color: "#ef4444", lineHeight: 1 }}>403</h1>
      <h2 className="fw-bold mt-2 mb-3">Access Denied</h2>
      <p className="text-muted mb-4">You don't have permission to view this page.</p>
      <div className="d-flex gap-3">
        <Link to="/" className="btn btn-primary">Go Home</Link>
        <Link to="/notes" className="btn btn-outline-primary">Browse Notes</Link>
      </div>
    </div>
  );
}
