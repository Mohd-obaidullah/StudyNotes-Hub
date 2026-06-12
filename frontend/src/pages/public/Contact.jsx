// import React, { useState } from "react";
// import toast from "react-hot-toast";
// import api from "../../services/api";

// export default function Contact() {
//   const [form, setForm] = useState({ name: "", email: "", message: "" });
//   const [loading, setLoading] = useState(false);

//   const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

//   // const handleSubmit = async e => {
//   //   e.preventDefault();
//   //   setLoading(true);
//     // await new Promise(r => setTimeout(r, 800));
//     // toast.success("Message sent! We'll get back to you within 24 hours.");
//     const handleSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     setLoading(true);

//     await api.post("/api/contact/", form);

//     toast.success("Message sent! We'll get back to you within 24 hours.");

//     setForm({
//       name: "",
//       email: "",
//       message: ""
//     });

//   } catch (error) {
//     toast.error("Failed to send message");
//   } finally {
//     setLoading(false);
//   }
// };
//     setForm({ name: "", email: "", message: "" });
//     setLoading(false);
//   };

//   return (
//     <div className="container py-5" style={{ maxWidth: 620 }}>
//       <h1 className="fw-bold mb-1">Contact Us</h1>
//       <p className="text-muted mb-4">Questions, feedback, or just want to say hi? We read every message.</p>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-3">
//           <label className="form-label fw-medium">Name</label>
//           <input name="name" className="form-control" value={form.name} onChange={handleChange} required />
//         </div>
//         <div className="mb-3">
//           <label className="form-label fw-medium">Email</label>
//           <input name="email" type="email" className="form-control" value={form.email} onChange={handleChange} required />
//         </div>
//         <div className="mb-4">
//           <label className="form-label fw-medium">Message</label>
//           <textarea name="message" rows={5} className="form-control" value={form.message} onChange={handleChange} required />
//         </div>
//         <button type="submit" className="btn btn-primary w-100" disabled={loading}>
//           {loading ? "Sending..." : "Send Message"}
//         </button>
//       </form>
//     </div>
//   );
// }
// import React, { useState } from "react";
// import toast from "react-hot-toast";
// import api from "../../services/api";

// export default function Contact() {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     message: ""
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm((f) => ({
//       ...f,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       setLoading(true);

//       await api.post("/api/contact/", form);

//       toast.success(
//         "Message sent! We'll get back to you within 24 hours."
//       );

//       setForm({
//         name: "",
//         email: "",
//         message: ""
//       });

//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to send message");

//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container py-5" style={{ maxWidth: 620 }}>
//       <h1 className="fw-bold mb-1">Contact Us</h1>

//       <p className="text-muted mb-4">
//         Questions, feedback, or just want to say hi? We read every message.
//       </p>

//       <form onSubmit={handleSubmit}>
//         <div className="mb-3">
//           <label className="form-label fw-medium">
//             Name
//           </label>

//           <input
//             name="name"
//             className="form-control"
//             value={form.name}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="mb-3">
//           <label className="form-label fw-medium">
//             Email
//           </label>

//           <input
//             name="email"
//             type="email"
//             className="form-control"
//             value={form.email}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label className="form-label fw-medium">
//             Message
//           </label>

//           <textarea
//             name="message"
//             rows={5}
//             className="form-control"
//             value={form.message}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           className="btn btn-primary w-100"
//           disabled={loading}
//         >
//           {loading ? "Sending..." : "Send Message"}
//         </button>
//       </form>
//     </div>
//   );
// }
import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { getErrorMessage } from "../../utils/errorHandler";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (name.length < 2 || name.length > 50) {
      toast.error("Name must be between 2 and 50 characters");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (message.length < 10 || message.length > 1000) {
      toast.error("Message must be between 10 and 1000 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const cleanedForm = {
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim()
    };

    try {
      setLoading(true);

      await api.post("/api/contact/", cleanedForm);

      toast.success(
        "Message sent! We'll get back to you within 24 hours."
      );

      setForm({
        name: "",
        email: "",
        message: ""
      });

    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error));

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 620 }}>
      <h1 className="fw-bold mb-1">
        Contact Us
      </h1>

      <p className="text-muted mb-4">
        Questions, feedback, or just want to say hi?
        We read every message.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-medium">
            Name
          </label>

          <input
            name="name"
            className="form-control"
            value={form.name}
            onChange={handleChange}
            required
            maxLength={50}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-medium">
            Email
          </label>

          <input
            name="email"
            type="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label fw-medium">
            Message
          </label>

          <textarea
            name="message"
            rows={5}
            className="form-control"
            value={form.message}
            onChange={handleChange}
            required
            maxLength={1000}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}