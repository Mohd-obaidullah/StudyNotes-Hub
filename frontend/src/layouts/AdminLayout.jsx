// import React, { useState } from "react";
// import { Outlet, NavLink } from "react-router-dom";
// import {
//   RiDashboardLine, RiUploadLine, RiFileList3Line,
//   RiUserLine, RiShoppingBagLine, RiLineChartLine, RiMenuLine,
// } from "react-icons/ri";
// import { useAuth } from "../context/AuthContext";

// const links = [
//   { to: "/admin", icon: <RiDashboardLine />, label: "Dashboard", end: true },
//   { to: "/admin/upload", icon: <RiUploadLine />, label: "Upload Note" },
//   { to: "/admin/notes", icon: <RiFileList3Line />, label: "Manage Notes" },
//   { to: "/admin/users", icon: <RiUserLine />, label: "Users" },
//   { to: "/admin/orders", icon: <RiShoppingBagLine />, label: "Orders" },
//   { to: "/admin/revenue", icon: <RiLineChartLine />, label: "Revenue" },
// ];

// export default function AdminLayout() {
//   const [open, setOpen] = useState(false);
//   const { user } = useAuth();

//   return (
//     <div className="d-flex" style={{ minHeight: "100vh" }}>
//       {/* Sidebar */}
//       <aside
//         style={{
//           width: open ? 240 : 64,
//           transition: "width .2s",
//           background: "var(--primary)",
//           minHeight: "100vh",
//           display: "flex",
//           flexDirection: "column",
//           overflow: "hidden",
//           whiteSpace: "nowrap",
//         }}
//       >
//         <button
//           onClick={() => setOpen(o => !o)}
//           style={{ background: "none", border: "none", color: "#fff", padding: "16px", fontSize: 20 }}
//         >
//           <RiMenuLine />
//         </button>
//         <nav className="mt-2">
//           {links.map(l => (
//             <NavLink
//               key={l.to}
//               to={l.to}
//               end={l.end}
//               style={({ isActive }) => ({
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 12,
//                 padding: "12px 18px",
//                 color: isActive ? "#fff" : "rgba(255,255,255,.7)",
//                 background: isActive ? "rgba(255,255,255,.15)" : "transparent",
//                 textDecoration: "none",
//                 fontSize: 14,
//                 fontWeight: 500,
//                 transition: "background .15s",
//               })}
//             >
//               <span style={{ fontSize: 18, flexShrink: 0 }}>{l.icon}</span>
//               {open && l.label}
//             </NavLink>
//           ))}
//         </nav>
//       </aside>

//       {/* Main */}
//       <div className="flex-grow-1 p-4 page-fade">
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <h5 className="fw-bold mb-0">Admin Panel</h5>
//           <small className="text-muted">{user?.email}</small>
//         </div>
//         <Outlet />
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  RiDashboardLine,
  RiUploadLine,
  RiFileList3Line,
  RiUserLine,
  RiShoppingBagLine,
  RiLineChartLine,
  RiMenuLine,
  RiMessage2Line,
} from "react-icons/ri";
import { useAuth } from "../context/AuthContext";

const links = [
  {
    to: "/admin",
    icon: <RiDashboardLine />,
    label: "Dashboard",
    end: true,
  },
  {
    to: "/admin/upload",
    icon: <RiUploadLine />,
    label: "Upload Note",
  },
  {
    to: "/admin/notes",
    icon: <RiFileList3Line />,
    label: "Manage Notes",
  },
  {
    to: "/admin/users",
    icon: <RiUserLine />,
    label: "Users",
  },
  {
    to: "/admin/orders",
    icon: <RiShoppingBagLine />,
    label: "Orders",
  },
  {
    to: "/admin/contacts",
    icon: <RiMessage2Line />,
    label: "Contact Messages",
  },
  {
    to: "/admin/revenue",
    icon: <RiLineChartLine />,
    label: "Revenue",
  },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      
      {/* Sidebar */}
      <aside
        style={{
          width: open ? 240 : 64,
          transition: "width 0.2s",
          background: "var(--primary)",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        {/* Menu Button */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            padding: "16px",
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          <RiMenuLine />
        </button>

        {/* Navigation */}
        <nav className="mt-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 18px",
                color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
                background: isActive
                  ? "rgba(255,255,255,0.15)"
                  : "transparent",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "500",
                transition: "background 0.15s",
              })}
            >
              <span
                style={{
                  fontSize: "18px",
                  flexShrink: 0,
                }}
              >
                {link.icon}
              </span>

              {open && link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow-1 p-4 page-fade">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-bold mb-0">
            Admin Panel
          </h5>

          <small className="text-muted">
            {user?.email}
          </small>
        </div>

        <Outlet />
      </main>
    </div>
  );
}