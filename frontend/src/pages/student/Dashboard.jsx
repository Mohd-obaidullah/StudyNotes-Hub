// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { RiBookOpenLine, RiShoppingBagLine, RiUserLine } from "react-icons/ri";
// import { useAuth } from "../../context/AuthContext";
// import api from "../../services/api";
// import StatCard from "../../components/common/StatCard";

// export default function Dashboard() {
//   const { user } = useAuth();
//   const [purchases, setPurchases] = useState([]);

//   useEffect(() => {
//     api.get("/notes/").then(r => {}).catch(() => {});
//     // Reuse purchase history for stats
//     api.get("/purchases/mine").catch(() => {});
//   }, []);

//   return (
//     <div className="container py-5">
//       <div className="mb-4 d-flex align-items-center gap-3">
//         {user?.profile_picture && (
//           <img src={user.profile_picture} alt="" width={52} height={52} className="rounded-circle" />
//         )}
//         <div>
//           <h1 className="fw-bold mb-0">Welcome back, {user?.name?.split(" ")[0]}!</h1>
//           <p className="text-muted mb-0 small">{user?.email}</p>
//         </div>
//       </div>

//       <div className="row g-3 mb-5">
//         <div className="col-md-4">
//           <StatCard label="My Notes" value="—" icon={<RiBookOpenLine />} />
//         </div>
//         <div className="col-md-4">
//           <StatCard label="Purchases" value="—" icon={<RiShoppingBagLine />} color="#06b6d4" />
//         </div>
//         <div className="col-md-4">
//           <StatCard label="Account Type" value={user?.role === "admin" ? "Admin" : "Student"} icon={<RiUserLine />} color="#10b981" />
//         </div>
//       </div>

//       <div className="row g-4">
//         <div className="col-md-6">
//           <div className="card border-0 shadow-sm p-4">
//             <h5 className="fw-semibold mb-3">Quick Links</h5>
//             <div className="d-flex flex-column gap-2">
//               <Link to="/my-notes" className="btn btn-outline-primary text-start">📖 My Notes</Link>
//               <Link to="/purchase-history" className="btn btn-outline-primary text-start">🧾 Purchase History</Link>
//               <Link to="/notes" className="btn btn-outline-primary text-start">🔍 Browse More Notes</Link>
//               <Link to="/profile" className="btn btn-outline-secondary text-start">👤 View Profile</Link>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-6">
//           <div className="card border-0 shadow-sm p-4 h-100">
//             <h5 className="fw-semibold mb-3">Tips</h5>
//             <ul className="list-unstyled text-muted small mb-0">
//               <li className="mb-2">✅ Go to <strong>My Notes</strong> to access purchased PDFs.</li>
//               <li className="mb-2">✅ Use the search bar in <strong>Notes</strong> to find topics quickly.</li>
//               <li className="mb-2">✅ Each PDF is watermarked with your email for security.</li>
//               <li>✅ Purchases are permanent — no expiry, no renewals.</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  RiBookOpenLine,
  RiShoppingBagLine,
  RiUserLine,
} from "react-icons/ri";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import StatCard from "../../components/common/StatCard";

export default function Dashboard() {
  const { user } = useAuth();

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/purchases/mine")
      .then((res) => {
        setPurchases(res.data.purchases || []);
      })
      .catch((err) => {
        console.error("Failed to load purchases:", err);
        setPurchases([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const notesCount = purchases.length;

  return (
    <div className="container py-5">
      {/* User Header */}
      <div className="mb-4 d-flex align-items-center gap-3">
        {user?.profile_picture && (
          <img
            src={user.profile_picture}
            alt={user.name}
            width={60}
            height={60}
            className="rounded-circle border"
          />
        )}

        <div>
          <h1 className="fw-bold mb-0">
            Welcome back, {user?.name?.split(" ")[0] || "Student"}!
          </h1>

          <p className="text-muted mb-0 small">
            {user?.email || ""}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-5">
        <div className="col-md-4">
          <StatCard
            label="My Notes"
            value={loading ? "..." : notesCount}
            icon={<RiBookOpenLine />}
          />
        </div>

        <div className="col-md-4">
          <StatCard
            label="Purchases"
            value={loading ? "..." : purchases.length}
            icon={<RiShoppingBagLine />}
            color="#06b6d4"
          />
        </div>

        <div className="col-md-4">
          <StatCard
            label="Account Type"
            value={user?.role === "admin" ? "Admin" : "Student"}
            icon={<RiUserLine />}
            color="#10b981"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="row g-4">
        {/* Quick Links */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm p-4 h-100">
            <h5 className="fw-semibold mb-3">
              Quick Links
            </h5>

            <div className="d-flex flex-column gap-2">
              <Link
                to="/my-notes"
                className="btn btn-outline-primary text-start"
              >
                📖 My Notes
              </Link>

              <Link
                to="/purchase-history"
                className="btn btn-outline-primary text-start"
              >
                🧾 Purchase History
              </Link>

              <Link
                to="/notes"
                className="btn btn-outline-primary text-start"
              >
                🔍 Browse More Notes
              </Link>

              <Link
                to="/profile"
                className="btn btn-outline-secondary text-start"
              >
                👤 View Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm p-4 h-100">
            <h5 className="fw-semibold mb-3">
              Tips
            </h5>

            <ul className="list-unstyled text-muted small mb-0">
              <li className="mb-2">
                ✅ Go to <strong>My Notes</strong> to access
                purchased PDFs.
              </li>

              <li className="mb-2">
                ✅ Use the search bar in <strong>Notes</strong>
                to find topics quickly.
              </li>

              <li className="mb-2">
                ✅ Each PDF is watermarked with your email
                for security.
              </li>

              <li className="mb-2">
                ✅ Purchased notes remain available
                permanently.
              </li>

              <li>
                ✅ Download and study anytime.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}