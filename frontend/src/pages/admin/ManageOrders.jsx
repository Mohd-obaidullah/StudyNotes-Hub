// import React, { useEffect, useState } from "react";
// import { getOrders } from "../../services/admin";
// import Spinner from "../../components/common/Spinner";
// import Pagination from "../../components/common/Pagination";

// export default function ManageOrders() {
//   const [orders, setOrders] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setLoading(true);
//     getOrders(page).then(r => { setOrders(r.data.orders); setTotal(r.data.total); }).finally(() => setLoading(false));
//   }, [page]);

//   if (loading) return <Spinner fullPage />;

//   return (
//     <div>
//       <h4 className="fw-bold mb-4">Orders ({total})</h4>
//       <div className="table-responsive">
//         <table className="table table-hover align-middle">
//           <thead><tr><th>Order ID</th><th>User</th><th>Note</th><th>Payment ID</th><th>Date</th></tr></thead>
//           <tbody>
//             {orders.map(o => (
//               <tr key={o._id}>
//                 <td><code className="small">{o._id.slice(-8)}</code></td>
//                 <td className="small">{o.user_id}</td>
//                 <td className="small">{o.note_id}</td>
//                 <td><code className="small">{o.payment_id?.slice(0, 16) || "—"}…</code></td>
//                 <td className="small text-muted">
//                   {o.purchase_date ? new Date(o.purchase_date).toLocaleDateString("en-IN") : "—"}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <Pagination page={page} total={total} perPage={20} onChange={setPage} />
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { getOrders } from "../../services/admin";
import { getErrorMessage } from "../../utils/errorHandler";
import Spinner from "../../components/common/Spinner";
import Pagination from "../../components/common/Pagination";

export default function ManageOrders() {

  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const loadOrders = (currentPage) => {

    setLoading(true);
    setError(null);


    getOrders(currentPage)

      .then((res) => {

        setOrders(res.data.orders || []);
        setTotal(res.data.total || 0);

      })

      .catch((error) => {

        console.error("Failed to load orders:", error);

        setError(getErrorMessage(error));

      })

      .finally(() => {

        setLoading(false);

      });

  };


  useEffect(() => {

    loadOrders(page);

  }, [page]);


  if (loading) {
    return <Spinner fullPage />;
  }


  return (

    <div>

      <h4 className="fw-bold mb-4">
        Orders ({total})
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
              <th>Order ID</th>
              <th>User</th>
              <th>Note</th>
              <th>Payment ID</th>
              <th>Date</th>
            </tr>

          </thead>


          <tbody>

            {orders.length === 0 ? (

              <tr>

                <td
                  colSpan="5"
                  className="text-center text-muted py-4"
                >
                  No orders found.
                </td>

              </tr>

            ) : (

              orders.map((order) => (

                <tr key={order._id}>

                  <td>

                    <code className="small">
                      {order._id
                        ? order._id.slice(-8)
                        : "—"}
                    </code>

                  </td>


                  <td className="small">

                    {order.user_id || "—"}

                  </td>


                  <td className="small">

                    {order.note_id || "—"}

                  </td>


                  <td>

                    <code className="small">

                      {order.payment_id
                        ? `${order.payment_id.slice(0, 16)}...`
                        : "—"}

                    </code>

                  </td>


                  <td className="small text-muted">

                    {order.purchase_date
                      ? new Date(order.purchase_date)
                          .toLocaleDateString("en-IN")
                      : "—"}

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
        perPage={20}
        onChange={setPage}
      />

    </div>

  );

}