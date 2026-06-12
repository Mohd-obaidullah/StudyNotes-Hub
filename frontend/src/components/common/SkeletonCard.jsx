import React from "react";

export default function SkeletonCard() {
  return (
    <div className="card h-100 border-0 shadow-sm">
      <div className="skeleton" style={{ height: 180 }} />
      <div className="card-body">
        <div className="skeleton mb-2" style={{ height: 18, width: "40%" }} />
        <div className="skeleton mb-1" style={{ height: 20, width: "80%" }} />
        <div className="skeleton mb-1" style={{ height: 14, width: "100%" }} />
        <div className="skeleton mb-3" style={{ height: 14, width: "70%" }} />
        <div className="d-flex justify-content-between">
          <div className="skeleton" style={{ height: 28, width: 60 }} />
          <div className="skeleton" style={{ height: 28, width: 90, borderRadius: 20 }} />
        </div>
      </div>
    </div>
  );
}
