import React, { useEffect, useState } from "react";
import api from "../../services/api";
import Spinner from "../../components/common/Spinner";

export default function PurchaseHistory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/purchases/mine")    // extra added api
      .then(r => setItems(r.data.purchases || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner fullPage />;

  return (
    <div className="container py-5">
      <h1 className="fw-bold mb-4">Purchase History</h1>
      {items.length === 0 ? (
        <p className="text-muted">No purchases yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Note</th>
                <th>Category</th>
                <th>Payment ID</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map(({ purchase, note }) => note && (
                <tr key={purchase._id}>
                  <td className="fw-medium">{note.title}</td>
                  <td><span className="badge-category">{note.category}</span></td>
                  <td><code className="small">{purchase.payment_id?.slice(0, 18)}…</code></td>
                  <td className="small text-muted">
                    {new Date(purchase.purchase_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td>
                    <a href={`/notes/${note._id}/access`} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-success">
                      Open PDF
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
