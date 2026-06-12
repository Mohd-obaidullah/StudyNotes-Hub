// import React, { useState } from "react";
// import toast from "react-hot-toast";
// import { RiDeleteBin6Line, RiEditLine } from "react-icons/ri";
// import { useNotes } from "../../hooks/useNotes";
// import { deleteNote, updateNote } from "../../services/notes";
// import Spinner from "../../components/common/Spinner";
// import Pagination from "../../components/common/Pagination";

// export default function ManageNotes() {
//   const [page, setPage] = useState(1);
//   const { notes, total, loading, setParams } = useNotes({ page });
//   const [editing, setEditing] = useState(null);
//   const PER_PAGE = 12;

//   const handleDelete = async id => {
//     if (!confirm("Delete this note? This cannot be undone.")) return;
//     try {
//       await deleteNote(id);
//       toast.success("Note deleted");
//       setParams(p => ({ ...p }));
//     } catch { toast.error("Delete failed"); }
//   };

//   const handleUpdate = async e => {
//     e.preventDefault();
//     try {
//       await updateNote(editing._id, { title: editing.title, description: editing.description, price: editing.price });
//       toast.success("Note updated");
//       setEditing(null);
//       setParams(p => ({ ...p }));
//     } catch { toast.error("Update failed"); }
//   };

//   if (loading) return <Spinner fullPage />;

//   return (
//     <div>
//       <h4 className="fw-bold mb-4">Manage Notes ({total})</h4>
//       <div className="table-responsive">
//         <table className="table table-hover align-middle">
//           <thead><tr><th>Title</th><th>Category</th><th>Price</th><th>Sales</th><th>Actions</th></tr></thead>
//           <tbody>
//             {notes.map(n => (
//               <tr key={n._id}>
//                 <td className="fw-medium">{n.title}</td>
//                 <td><span className="badge-category">{n.category}</span></td>
//                 <td>₹{n.price}</td>
//                 <td>{n.purchases_count || 0}</td>
//                 <td>
//                   <button className="btn btn-sm btn-outline-primary me-2" onClick={() => setEditing(n)}><RiEditLine /></button>
//                   <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(n._id)}><RiDeleteBin6Line /></button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <Pagination page={page} total={total} perPage={PER_PAGE} onChange={p => { setPage(p); setParams(prev => ({ ...prev, page: p })); }} />

//       {editing && (
//         <div className="modal d-block" style={{ background: "rgba(0,0,0,.5)" }}>
//           <div className="modal-dialog">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">Edit Note</h5>
//                 <button className="btn-close" onClick={() => setEditing(null)} />
//               </div>
//               <form onSubmit={handleUpdate}>
//                 <div className="modal-body">
//                   <div className="mb-3">
//                     <label className="form-label">Title</label>
//                     <input className="form-control" value={editing.title} onChange={e => setEditing(ed => ({ ...ed, title: e.target.value }))} required />
//                   </div>
//                   <div className="mb-3">
//                     <label className="form-label">Description</label>
//                     <textarea className="form-control" rows={3} value={editing.description} onChange={e => setEditing(ed => ({ ...ed, description: e.target.value }))} />
//                   </div>
//                   <div className="mb-3">
//                     <label className="form-label">Price (₹)</label>
//                     <input type="number" className="form-control" value={editing.price} onChange={e => setEditing(ed => ({ ...ed, price: e.target.value }))} />
//                   </div>
//                 </div>
//                 <div className="modal-footer">
//                   <button type="button" className="btn btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
//                   <button type="submit" className="btn btn-primary">Save</button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState } from "react";
import toast from "react-hot-toast";
import { RiDeleteBin6Line, RiEditLine } from "react-icons/ri";
import { useNotes } from "../../hooks/useNotes";
import { deleteNote, updateNote } from "../../services/notes";
import { getErrorMessage } from "../../utils/errorHandler";
import Spinner from "../../components/common/Spinner";
import Pagination from "../../components/common/Pagination";

export default function ManageNotes() {
  const [page, setPage] = useState(1);

  const {
    notes,
    total,
    loading,
    error,
    setParams,
    refetch
  } = useNotes({ page });

  const [editing, setEditing] = useState(null);
  const [processing, setProcessing] = useState(false);

  const PER_PAGE = 12;

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note? This cannot be undone.")) {
      return;
    }

    try {
      setProcessing(true);

      await deleteNote(id);

      toast.success("Note deleted successfully");

      refetch();

    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error));

    } finally {
      setProcessing(false);
    }
  };


  const validateUpdate = () => {
    const title = editing.title.trim();
    const description = editing.description.trim();

    if (title.length < 3 || title.length > 100) {
      toast.error("Title must be between 3 and 100 characters");
      return false;
    }

    if (description.length < 10 || description.length > 2000) {
      toast.error("Description must be between 10 and 2000 characters");
      return false;
    }

    if (Number(editing.price) < 0) {
      toast.error("Price cannot be negative");
      return false;
    }

    return true;
  };


  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!validateUpdate()) {
      return;
    }

    try {
      setProcessing(true);

      await updateNote(editing._id, {
        title: editing.title.trim(),
        description: editing.description.trim(),
        price: Number(editing.price)
      });

      toast.success("Note updated successfully");

      setEditing(null);

      refetch();

    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error));

    } finally {
      setProcessing(false);
    }
  };


  if (loading) {
    return <Spinner fullPage />;
  }


  return (
    <div>
      <h4 className="fw-bold mb-4">
        Manage Notes ({total})
      </h4>


      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}


      <div className="table-responsive">
        <table className="table table-hover align-middle">

          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Sales</th>
              <th>Actions</th>
            </tr>
          </thead>


          <tbody>

            {notes.length === 0 ? (

              <tr>
                <td colSpan="5" className="text-center py-4 text-muted">
                  No notes found
                </td>
              </tr>

            ) : (

              notes.map((n) => (
                <tr key={n._id}>

                  <td className="fw-medium">
                    {n.title}
                  </td>


                  <td>
                    <span className="badge-category">
                      {n.category}
                    </span>
                  </td>


                  <td>
                    ₹{n.price}
                  </td>


                  <td>
                    {n.purchases_count || 0}
                  </td>


                  <td>

                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      disabled={processing}
                      onClick={() => setEditing({ ...n })}
                    >
                      <RiEditLine />
                    </button>


                    <button
                      className="btn btn-sm btn-outline-danger"
                      disabled={processing}
                      onClick={() => handleDelete(n._id)}
                    >
                      <RiDeleteBin6Line />
                    </button>

                  </td>

                </tr>
              ))

            )}

          </tbody>

        </table>
      </div>


      <Pagination
        page={page}
        total={total}
        perPage={PER_PAGE}
        onChange={(p) => {
          setPage(p);
          setParams((prev) => ({
            ...prev,
            page: p
          }));
        }}
      />


      {editing && (

        <div
          className="modal d-block"
          style={{ background: "rgba(0,0,0,.5)" }}
        >

          <div className="modal-dialog">

            <div className="modal-content">


              <div className="modal-header">

                <h5 className="modal-title">
                  Edit Note
                </h5>

                <button
                  className="btn-close"
                  disabled={processing}
                  onClick={() => setEditing(null)}
                />

              </div>


              <form onSubmit={handleUpdate}>

                <div className="modal-body">

                  <div className="mb-3">

                    <label className="form-label">
                      Title
                    </label>

                    <input
                      className="form-control"
                      value={editing.title}
                      maxLength={100}
                      onChange={(e) =>
                        setEditing((prev) => ({
                          ...prev,
                          title: e.target.value
                        }))
                      }
                      required
                    />

                  </div>


                  <div className="mb-3">

                    <label className="form-label">
                      Description
                    </label>

                    <textarea
                      rows={3}
                      className="form-control"
                      value={editing.description}
                      maxLength={2000}
                      onChange={(e) =>
                        setEditing((prev) => ({
                          ...prev,
                          description: e.target.value
                        }))
                      }
                    />

                  </div>


                  <div className="mb-3">

                    <label className="form-label">
                      Price (₹)
                    </label>

                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      value={editing.price}
                      onChange={(e) =>
                        setEditing((prev) => ({
                          ...prev,
                          price: e.target.value
                        }))
                      }
                    />

                  </div>

                </div>


                <div className="modal-footer">

                  <button
                    type="button"
                    className="btn btn-secondary"
                    disabled={processing}
                    onClick={() => setEditing(null)}
                  >
                    Cancel
                  </button>


                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={processing}
                  >
                    {processing ? "Saving..." : "Save"}
                  </button>

                </div>

              </form>


            </div>

          </div>

        </div>

      )}

    </div>
  );
}