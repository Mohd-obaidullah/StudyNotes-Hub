import React from "react";

export default function Spinner({ fullPage = false, size = 40 }) {
  const spinner = (
    <div
      className="spinner-border"
      role="status"
      style={{ width: size, height: size, color: "var(--primary)" }}
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  );
  if (!fullPage) return spinner;
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
      {spinner}
    </div>
  );
}
