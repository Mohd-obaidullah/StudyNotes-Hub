import api from "./api";

export const fetchNotes = (params = {}) => api.get("/api/notes/", { params });
export const fetchNote = id => api.get(`/api/notes/${id}`);  //api add extra for production
export const fetchCategories = () => api.get("/categories");
export const uploadNote = formData =>
  api.post("/api/notes/admin/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const updateNote = (id, data) => api.put(`/api/notes/admin/${id}`, data);
export const deleteNote = id => api.delete(`/api/notes/admin/${id}`);
export const accessNote = id => `/api/notes/${id}/access`;
