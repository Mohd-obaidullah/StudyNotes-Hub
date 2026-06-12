// import React, { useState } from "react";
// import NoteCard from "../../components/common/NoteCard";
// import SkeletonCard from "../../components/common/SkeletonCard";
// import Pagination from "../../components/common/Pagination";
// import SearchBar from "../../components/common/SearchBar";
// import { useNotes, useCategories } from "../../hooks/useNotes";

// export default function Notes() {
//   const [page, setPage] = useState(1);
//   const { notes, total, loading, setParams } = useNotes({ page });
//   // console.log("NOTES DATA:", notes, "TOTAL:", total);  // extra
//   const categories = useCategories();
//   const PER_PAGE = 12;

//   const handleSearch = q => {
//     setPage(1);
//     setParams(p => ({ ...p, q, page: 1 }));
//   };

//   const handleCategory = cat => {
//     setPage(1);
//     setParams(p => ({ ...p, category: cat || undefined, page: 1 }));
//   };

//   const handlePageChange = p => {
//     setPage(p);
//     setParams(prev => ({ ...prev, page: p }));
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   return (
//     <div className="container py-5">
//       <h1 className="fw-bold mb-1">Browse Notes</h1>
//       <p className="text-muted mb-4">{total} note{total !== 1 ? "s" : ""} available</p>

//       <div className="row g-3 mb-4">
//         <div className="col-md-6">
//           <SearchBar onSearch={handleSearch} />
//         </div>
//         <div className="col-md-6 d-flex gap-2 flex-wrap align-items-start">
//           <button className="btn btn-sm btn-outline-secondary" onClick={() => handleCategory("")}>All</button>
//           {categories.map(c => (
//             <button key={c._id} className="btn btn-sm btn-outline-primary" onClick={() => handleCategory(c.slug)}>
//               {c.name}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="row g-4">
//         {loading
//           ? Array(PER_PAGE).fill(0).map((_, i) => (
//               <div key={i} className="col-sm-6 col-md-4 col-lg-3"><SkeletonCard /></div>
//             ))
//           : notes.length === 0
//           ? <div className="col-12 text-center py-5 text-muted">No notes found. Try a different search or category.</div>
//           : notes.map(n => (
//               <div key={n._id} className="col-sm-6 col-md-4 col-lg-3">
//                 <NoteCard note={n} />
//               </div>
//             ))}
//       </div>
//       <Pagination page={page} total={total} perPage={PER_PAGE} onChange={handlePageChange} />
//     </div>
//   );
// }

import React, { useState } from "react";
import NoteCard from "../../components/common/NoteCard";
import SkeletonCard from "../../components/common/SkeletonCard";
import Pagination from "../../components/common/Pagination";
import SearchBar from "../../components/common/SearchBar";
import { useNotes, useCategories } from "../../hooks/useNotes";

export default function Notes() {
  const [page, setPage] = useState(1);

  const {
    notes,
    total,
    loading,
    error,
    setParams,
  } = useNotes({ page });

  const categories = useCategories();
  const PER_PAGE = 12;

  const handleSearch = (q) => {
    setPage(1);
    setParams((prev) => ({
      ...prev,
      q,
      page: 1,
    }));
  };

  const handleCategory = (cat) => {
    setPage(1);
    setParams((prev) => ({
      ...prev,
      category: cat || undefined,
      page: 1,
    }));
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setParams((prev) => ({
      ...prev,
      page: newPage,
    }));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="container py-5">
      <h1 className="fw-bold mb-1">
        Browse Notes
      </h1>

      <p className="text-muted mb-4">
        {total} note{total !== 1 ? "s" : ""} available
      </p>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Search and Categories */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="col-md-6 d-flex gap-2 flex-wrap align-items-start">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => handleCategory("")}
          >
            All
          </button>

          {(categories || []).map((category) => (
            <button
              key={category._id}
              className="btn btn-sm btn-outline-primary"
              onClick={() => handleCategory(category.slug)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      <div className="row g-4">
        {loading ? (
          Array(PER_PAGE)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="col-sm-6 col-md-4 col-lg-3"
              >
                <SkeletonCard />
              </div>
            ))
        ) : notes.length === 0 ? (
          <div className="col-12 text-center py-5 text-muted">
            No notes found. Try a different search or category.
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note._id}
              className="col-sm-6 col-md-4 col-lg-3"
            >
              <NoteCard note={note} />
            </div>
          ))
        )}
      </div>

      <Pagination
        page={page}
        total={total}
        perPage={PER_PAGE}
        onChange={handlePageChange}
      />
    </div>
  );
}