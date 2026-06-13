// import React, { useEffect, useState } from "react";
// import api from "../../services/api";
// import Spinner from "../../components/common/Spinner";

// export default function MyNotes() {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // useEffect(() => {
//   //   api.get("/purchases/mine")
//   //     .then(r => setItems(r.data.purchases || []))
//   //     .catch(() => setItems([]))
//   //     .finally(() => setLoading(false));
//   // }, []);
//   useEffect(() => {
//   api.get("/purchases/mine")
//     .then(r => {
//       console.log("PURCHASES:", r.data);
//       setItems(r.data.purchases || []);
//     })
//     .catch(err => {
//       console.log("ERROR:", err);
//       setItems([]);
//     })
//     .finally(() => setLoading(false));
// }, []);

//   if (loading) return <Spinner fullPage />;

//   return (
//     <div className="container py-5">
//       <h1 className="fw-bold mb-1">My Notes</h1>
//       <p className="text-muted mb-4">All notes you've purchased</p>
//       {items.length === 0 ? (
//         <div className="text-center py-5">
//           <p className="text-muted mb-3">You haven't purchased any notes yet.</p>
//           <a href="/notes" className="btn btn-primary">Browse Notes</a>
//         </div>
//       ) : (
//         <div className="row g-4">
//           {items.map(({ purchase, note }) => note && (
//             <div key={purchase._id} className="col-md-4">
//               <div className="card border-0 shadow-sm h-100 card-hover">
//                 <div style={{ height: 140, overflow: "hidden", borderRadius: "10px 10px 0 0" }}>
//                   <img
//                     src={`http://localhost:5000/uploads/${note.thumbnail}`}
//                     alt={note.title}
//                     className="w-100 h-100"
//                     style={{ objectFit: "cover" }}
//                     onError={e => { e.target.src = "https://via.placeholder.com/300x140?text=Notes"; }}
//                   />
//                 </div>
//                 <div className="card-body">
//                   <span className="badge-category mb-2 d-inline-block">{note.category}</span>
//                   <h6 className="fw-semibold mb-3">{note.title}</h6>
//                   <a
//                     href={`http://localhost:5000/notes/${note._id}/access`}
//                     target="_blank"
//                     rel="noreferrer"
//                     className="btn btn-sm btn-success w-100"
//                   >
//                     Open PDF
//                   </a>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import api from "../../services/api";
import Spinner from "../../components/common/Spinner";

export default function MyNotes() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/purchases/mine")
      .then((res) => {
        // console.log("PURCHASES:", res.data);
        setItems(res.data.purchases || []);
      })
      .catch((err) => {
        console.error("ERROR:", err);
        setItems([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Spinner fullPage />;
  }

  return (
    <div className="container py-5">
      <h1 className="fw-bold mb-1">My Notes</h1>
      <p className="text-muted mb-4">
        All notes you've purchased
      </p>

      {items.length === 0 ? (
        <div className="text-center py-5">
          <h5 className="text-muted">
            You haven't purchased any notes yet.
          </h5>

          <a href="/notes" className="btn btn-primary mt-3">
            Browse Notes
          </a>
        </div>
      ) : (
        <div className="row g-4">
          {(items || []).map((item) => {
            const note = item.note;
            // const purchase = item.purchase;

            if (!note) return null;

            return (
              <div
                key={item.purchase_id}
                className="col-md-4 col-lg-3"
              >
                <div className="card shadow-sm h-100">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/${note.thumbnail}`}    //src={`http://localhost:5000/uploads/${note.thumbnail}`}
                    alt={note.title}
                    className="card-img-top"
                    style={{
                      height: "220px",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300x220?text=Notes";
                    }}
                  />

                  <div className="card-body d-flex flex-column">
                    <span className="badge bg-primary mb-2">
                      {note.category}
                    </span>

                    <h5 className="card-title">
                      {note.title}
                    </h5>

                    <p
                      className="card-text text-muted small"
                      style={{
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {note.description}
                    </p>

                    <div className="mt-auto">
                      <a
                        href={`${import.meta.env.VITE_API_URL}/api/notes/${notes._id}/access`} //href={`http://localhost:5000/api/notes/${note._id}/access`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-success w-100"
                      >
                        Open PDF
                      </a>
                    </div>
                  </div>

                  <div className="card-footer bg-white">
                    <small className="text-muted">
                      Purchased on{" "}
                      {new Date(
                        item.purchase_date
                      ).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}