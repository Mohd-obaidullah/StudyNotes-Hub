// import React, { useEffect, useState } from "react";
// import { RiUserLine, RiFileList3Line, RiShoppingBagLine, RiMoneyDollarCircleLine } from "react-icons/ri";
// import StatCard from "../../components/common/StatCard";
// import { getDashboard } from "../../services/admin";
// import Spinner from "../../components/common/Spinner";

// export default function AdminDashboard() {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     getDashboard()
//       .then(r => setData(r.data))
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return <Spinner fullPage />;

//   return (
//     <div>
//       <div className="row g-3 mb-4">
//         <div className="col-sm-6 col-xl-3">
//           <StatCard label="Total Users" value={data?.total_users ?? 0} icon={<RiUserLine />} />
//         </div>
//         <div className="col-sm-6 col-xl-3">
//           <StatCard label="Total Notes" value={data?.total_notes ?? 0} icon={<RiFileList3Line />} color="#06b6d4" />
//         </div>
//         <div className="col-sm-6 col-xl-3">
//           <StatCard label="Total Orders" value={data?.total_orders ?? 0} icon={<RiShoppingBagLine />} color="#f59e0b" />
//         </div>
//         <div className="col-sm-6 col-xl-3">
//           <StatCard label="Total Revenue" value={`₹${(data?.total_revenue ?? 0).toLocaleString("en-IN")}`} icon={<RiMoneyDollarCircleLine />} color="#10b981" />
//         </div>
//       </div>

//       <div className="row g-4">
//         <div className="col-lg-7">
//           <div className="card border-0 shadow-sm p-4">
//             <h5 className="fw-semibold mb-3">Top Selling Notes</h5>
//             {!data?.top_notes?.length ? (
//               <p className="text-muted small">No sales yet.</p>
//             ) : (
//               <table className="table table-sm table-hover mb-0">
//                 <thead><tr><th>#</th><th>Title</th><th>Category</th><th>Sales</th></tr></thead>
//                 <tbody>
//                   {data.top_notes.map((n, i) => (
//                     <tr key={n._id}>
//                       <td className="text-muted">{i + 1}</td>
//                       <td className="fw-medium">{n.title}</td>
//                       <td><span className="badge-category">{n.category}</span></td>
//                       <td>{n.purchases_count}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         </div>
//         <div className="col-lg-5">
//           <div className="card border-0 shadow-sm p-4 h-100">
//             <h5 className="fw-semibold mb-3">Recent Activity</h5>
//             {!data?.recent_logs?.length ? (
//               <p className="text-muted small">No recent activity.</p>
//             ) : (
//               <ul className="list-unstyled mb-0">
//                 {data.recent_logs.map(log => (
//                   <li key={log._id} className="py-2 border-bottom small">
//                     <span className="text-muted">{log.action}</span>
//                     <br />
//                     <span className="text-muted" style={{ fontSize: 11 }}>
//                       {new Date(log.timestamp).toLocaleString("en-IN")}
//                     </span>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import {
  RiUserLine,
  RiFileList3Line,
  RiShoppingBagLine,
  RiMoneyDollarCircleLine
} from "react-icons/ri";

import StatCard from "../../components/common/StatCard";
import { getDashboard } from "../../services/admin";
import { getErrorMessage } from "../../utils/errorHandler";
import Spinner from "../../components/common/Spinner";


export default function AdminDashboard() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {

    getDashboard()

      .then((response) => {

        setData(response.data);

      })

      .catch((error) => {

        console.error("Admin dashboard loading failed:", error);

        setError(getErrorMessage(error));

      })

      .finally(() => {

        setLoading(false);

      });

  }, []);


  if (loading) {
    return <Spinner fullPage />;
  }


  return (

    <div>

      {error && (
        <div className="alert alert-danger mb-4">
          {error}
        </div>
      )}


      {/* Statistics Cards */}

      <div className="row g-3 mb-4">

        <div className="col-sm-6 col-xl-3">

          <StatCard
            label="Total Users"
            value={data?.total_users ?? 0}
            icon={<RiUserLine />}
          />

        </div>


        <div className="col-sm-6 col-xl-3">

          <StatCard
            label="Total Notes"
            value={data?.total_notes ?? 0}
            icon={<RiFileList3Line />}
            color="#06b6d4"
          />

        </div>


        <div className="col-sm-6 col-xl-3">

          <StatCard
            label="Total Orders"
            value={data?.total_orders ?? 0}
            icon={<RiShoppingBagLine />}
            color="#f59e0b"
          />

        </div>


        <div className="col-sm-6 col-xl-3">

          <StatCard
            label="Total Revenue"
            value={`₹${(data?.total_revenue ?? 0)
              .toLocaleString("en-IN")}`}
            icon={<RiMoneyDollarCircleLine />}
            color="#10b981"
          />

        </div>

      </div>


      {/* Dashboard Content */}

      <div className="row g-4">


        {/* Top Selling Notes */}

        <div className="col-lg-7">

          <div className="card border-0 shadow-sm p-4">

            <h5 className="fw-semibold mb-3">
              Top Selling Notes
            </h5>


            {!data?.top_notes?.length ? (

              <p className="text-muted small">
                No sales yet.
              </p>

            ) : (

              <table className="table table-sm table-hover mb-0">

                <thead>

                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Sales</th>
                  </tr>

                </thead>


                <tbody>

                  {data.top_notes.map((note, index) => (

                    <tr key={note._id}>

                      <td className="text-muted">
                        {index + 1}
                      </td>


                      <td className="fw-medium">
                        {note.title || "—"}
                      </td>


                      <td>
                        <span className="badge-category">
                          {note.category || "—"}
                        </span>
                      </td>


                      <td>
                        {note.purchases_count ?? 0}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            )}

          </div>

        </div>



        {/* Recent Activity */}

        <div className="col-lg-5">

          <div className="card border-0 shadow-sm p-4 h-100">

            <h5 className="fw-semibold mb-3">
              Recent Activity
            </h5>


            {!data?.recent_logs?.length ? (

              <p className="text-muted small">
                No recent activity.
              </p>

            ) : (

              <ul className="list-unstyled mb-0">

                {data.recent_logs.map((log) => (

                  <li
                    key={log._id}
                    className="py-2 border-bottom small"
                  >

                    <span className="text-muted">

                      {log.action || "Unknown activity"}

                    </span>

                    <br />


                    <span
                      className="text-muted"
                      style={{ fontSize: 11 }}
                    >

                      {log.timestamp
                        ? new Date(log.timestamp)
                            .toLocaleString("en-IN")
                        : "—"}

                    </span>

                  </li>

                ))}

              </ul>

            )}

          </div>

        </div>


      </div>

    </div>

  );

}