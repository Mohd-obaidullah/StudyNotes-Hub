import React from "react";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="container py-5" style={{ maxWidth: 600 }}>
      <h1 className="fw-bold mb-4">My Profile</h1>
      <div className="card border-0 shadow-sm p-4">
        <div className="d-flex align-items-center gap-4 mb-4">
          {user.profile_picture ? (
            <img src={user.profile_picture} alt="" width={80} height={80} className="rounded-circle" />
          ) : (
            <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold"
              style={{ width: 80, height: 80, fontSize: 28 }}>
              {user.name?.[0]}
            </div>
          )}
          <div>
            <h4 className="fw-bold mb-0">{user.name}</h4>
            <p className="text-muted mb-1">{user.email}</p>
            <span className={`badge ${user.role === "admin" ? "bg-danger" : "bg-primary"}`}>
              {user.role === "admin" ? "Admin" : "Student"}
            </span>
          </div>
        </div>
        <table className="table mb-0">
          <tbody>
            <tr><th style={{ width: 140 }}>Name</th><td>{user.name}</td></tr>
            <tr><th>Email</th><td>{user.email}</td></tr>
            <tr><th>Role</th><td className="text-capitalize">{user.role}</td></tr>
            <tr><th>Login Method</th><td>Google OAuth</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
