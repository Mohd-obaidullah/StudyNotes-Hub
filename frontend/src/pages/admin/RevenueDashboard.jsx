// import React, { useEffect, useState } from "react";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
// import { getMonthlyRevenue, getDashboard } from "../../services/admin";
// import StatCard from "../../components/common/StatCard";
// import { RiMoneyDollarCircleLine, RiShoppingBagLine } from "react-icons/ri";
// import Spinner from "../../components/common/Spinner";

// const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// export default function RevenueDashboard() {
//   const [monthly, setMonthly] = useState([]);
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     Promise.all([getMonthlyRevenue(), getDashboard()])
//       .then(([r1, r2]) => {
//         const chart = r1.data.monthly.map(m => ({
//           name: `${MONTHS[m._id.month - 1]} ${m._id.year}`,
//           revenue: m.revenue,
//           orders: m.count,
//         })).reverse();
//         setMonthly(chart);
//         setStats(r2.data);
//       })
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return <Spinner fullPage />;

//   return (
//     <div>
//       <h4 className="fw-bold mb-4">Revenue Dashboard</h4>
//       <div className="row g-3 mb-4">
//         <div className="col-md-6">
//           <StatCard label="Total Revenue" value={`₹${(stats?.total_revenue ?? 0).toLocaleString("en-IN")}`} icon={<RiMoneyDollarCircleLine />} color="#10b981" />
//         </div>
//         <div className="col-md-6">
//           <StatCard label="Total Orders" value={stats?.total_orders ?? 0} icon={<RiShoppingBagLine />} color="#f59e0b" />
//         </div>
//       </div>
//       <div className="card border-0 shadow-sm p-4">
//         <h5 className="fw-semibold mb-4">Monthly Revenue (Last 12 Months)</h5>
//         {monthly.length === 0 ? (
//           <p className="text-muted">No revenue data yet.</p>
//         ) : (
//           <ResponsiveContainer width="100%" height={320}>
//             <BarChart data={monthly}>
//               <CartesianGrid strokeDasharray="3 3" vertical={false} />
//               <XAxis dataKey="name" tick={{ fontSize: 12 }} />
//               <YAxis tickFormatter={v => `₹${v}`} tick={{ fontSize: 12 }} />
//               <Tooltip formatter={v => `₹${v}`} />
//               <Bar dataKey="revenue" fill="#4f46e5" radius={[4,4,0,0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

import {
  getMonthlyRevenue,
  getDashboard
} from "../../services/admin";

import { getErrorMessage } from "../../utils/errorHandler";

import StatCard from "../../components/common/StatCard";
import {
  RiMoneyDollarCircleLine,
  RiShoppingBagLine
} from "react-icons/ri";

import Spinner from "../../components/common/Spinner";


const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];


export default function RevenueDashboard() {

  const [monthly, setMonthly] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {

    Promise.all([
      getMonthlyRevenue(),
      getDashboard()
    ])

      .then(([r1, r2]) => {

        const chart = (r1.data.monthly || [])
          .map((m) => ({
            name: `${MONTHS[m._id.month - 1]} ${m._id.year}`,
            revenue: m.revenue,
            orders: m.count
          }))
          .reverse();


        setMonthly(chart);
        setStats(r2.data);
      })


      .catch((error) => {

        console.error("Revenue dashboard error:", error);

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

      <h4 className="fw-bold mb-4">
        Revenue Dashboard
      </h4>


      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}


      <div className="row g-3 mb-4">

        <div className="col-md-6">

          <StatCard
            label="Total Revenue"
            value={`₹${(stats?.total_revenue ?? 0)
              .toLocaleString("en-IN")}`}
            icon={<RiMoneyDollarCircleLine />}
            color="#10b981"
          />

        </div>


        <div className="col-md-6">

          <StatCard
            label="Total Orders"
            value={stats?.total_orders ?? 0}
            icon={<RiShoppingBagLine />}
            color="#f59e0b"
          />

        </div>

      </div>


      <div className="card border-0 shadow-sm p-4">

        <h5 className="fw-semibold mb-4">
          Monthly Revenue (Last 12 Months)
        </h5>


        {monthly.length === 0 ? (

          <p className="text-muted">
            No revenue data yet.
          </p>

        ) : (

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <BarChart data={monthly}>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
              />

              <YAxis
                tickFormatter={(value) => `₹${value}`}
                tick={{ fontSize: 12 }}
              />


              <Tooltip
                formatter={(value) => `₹${value}`}
              />


              <Bar
                dataKey="revenue"
                fill="#4f46e5"
                radius={[4, 4, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        )}

      </div>

    </div>

  );

}