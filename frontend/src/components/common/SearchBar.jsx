import React, { useState } from "react";
import { RiSearchLine } from "react-icons/ri";

export default function SearchBar({ onSearch, placeholder = "Search notes..." }) {
  const [q, setQ] = useState("");
  const handleSubmit = e => {
    e.preventDefault();
    onSearch(q.trim());
  };
  return (
    <form onSubmit={handleSubmit} className="d-flex gap-2">
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        value={q}
        onChange={e => setQ(e.target.value)}
      />
      <button type="submit" className="btn btn-primary d-flex align-items-center gap-1">
        <RiSearchLine /> Search
      </button>
    </form>
  );
}
