import React from "react";
import { Link } from "react-router-dom";

export default function NoteCard({ note }) {
  return (
    <div className="card h-100 card-hover border-0 shadow-sm">
      <div style={{ height: 180, overflow: "hidden", borderRadius: "10px 10px 0 0" }}>
        <img
          src={`${import.meta.env.VITE_API_URL}/uploads/${note.thumbnail}`}    //src={`http://localhost:5000/uploads/${note.thumbnail}`}
          alt={note.title}
          className="w-100 h-100"
          style={{ objectFit: "cover" }}
          onError={e => { e.target.src = "https://via.placeholder.com/300x180?text=Notes"; }}
        />
      </div>
      <div className="card-body d-flex flex-column">
        <span className="badge-category mb-2 align-self-start">{note.category}</span>
        <h6 className="card-title fw-semibold mb-1">{note.title}</h6>
        <p className="card-text small text-muted flex-grow-1" style={{ WebkitLineClamp: 2, display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {note.description}
        </p>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="fw-bold" style={{ color: "var(--primary)", fontSize: 18 }}>
            ₹{note.price}
          </span>
          <Link to={`/notes/${note._id}`} className="btn btn-sm btn-outline-primary">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
