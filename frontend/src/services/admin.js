import api from "./api";

export const getDashboard = () => api.get("/api/admin/dashboard");
export const getUsers = (page = 1) => api.get("/api/admin/users", { params: { page } });
export const updateUserRole = (id, role) => api.put('/api/admin/users/${id}/role', { role });       // extra api for production
export const getOrders = (page = 1) => api.get("/api/admin/orders", { params: { page } });
export const getMonthlyRevenue = () => api.get("/api/admin/revenue/monthly");
//=================================
export const getContacts = () =>
  api.get("/api/admin/contacts");


export const deleteContact = (id) =>
  api.delete(`/api/admin/contacts/${id}`);