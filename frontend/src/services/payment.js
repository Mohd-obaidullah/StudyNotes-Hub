import api from "./api";

export const createOrder = noteId => api.post("/api/payments/create-order", { note_id: noteId });
export const verifyPayment = data => api.post("/api/payments/verify", data);
