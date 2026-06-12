import React from "react";

export default function StatCard({ label, value, icon, color = "var(--primary)" }) {
  return (
    <div className="stat-card bg-white dark-mode:bg-slate-800">
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <p className="text-muted small mb-1">{label}</p>
          <h3 className="fw-bold mb-0" style={{ color }}>{value}</h3>
        </div>
        <span style={{ fontSize: 32, color, opacity: 0.8 }}>{icon}</span>
      </div>
    </div>
  );
}
