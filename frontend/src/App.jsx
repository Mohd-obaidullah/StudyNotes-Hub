import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import Spinner from "./components/common/Spinner";

const Home = lazy(() => import("./pages/public/Home"));
const Notes = lazy(() => import("./pages/public/Notes"));
const NoteDetail = lazy(() => import("./pages/public/NoteDetail"));
const About = lazy(() => import("./pages/public/About"));
const Contact = lazy(() => import("./pages/public/Contact"));
const Developers = lazy(() => import("./pages/public/Developers"));
const NotFound = lazy(() => import("./pages/public/NotFound"));
const Forbidden = lazy(() => import("./pages/public/Forbidden"));
// new add 
const ManageContacts = lazy(() => import("./pages/admin/ManageContacts"));

const Dashboard = lazy(() => import("./pages/student/Dashboard"));
const MyNotes = lazy(() => import("./pages/student/MyNotes"));
const PurchaseHistory = lazy(() => import("./pages/student/PurchaseHistory"));
const Profile = lazy(() => import("./pages/student/Profile"));

const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const UploadNote = lazy(() => import("./pages/admin/UploadNote"));
const ManageNotes = lazy(() => import("./pages/admin/ManageNotes"));
const ManageUsers = lazy(() => import("./pages/admin/ManageUsers"));
const ManageOrders = lazy(() => import("./pages/admin/ManageOrders"));
const RevenueDashboard = lazy(() => import("./pages/admin/RevenueDashboard"));

export default function App() {
  return (
    <Suspense fallback={<Spinner fullPage />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/notes/:id" element={<NoteDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/403" element={<Forbidden />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-notes" element={<MyNotes />} />
            <Route path="/purchase-history" element={<PurchaseHistory />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/upload" element={<UploadNote />} />
            <Route path="/admin/notes" element={<ManageNotes />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/orders" element={<ManageOrders />} />
            <Route path="/admin/revenue" element={<RevenueDashboard />} />
            <Route
 path="/admin/contacts"
 element={<ManageContacts />}
/>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
