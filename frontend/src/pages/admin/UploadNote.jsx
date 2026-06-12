// import React, { useState, useEffect } from "react";
// import toast from "react-hot-toast";
// import { uploadNote } from "../../services/notes";
// import { fetchCategories } from "../../services/notes";

// export default function UploadNote() {
//   const [form, setForm] = useState({ title: "", description: "", category: "", price: "", preview_pages: 0 });
//   const [thumbnail, setThumbnail] = useState(null);
//   const [pdf, setPdf] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchCategories().then(r => setCategories(r.data.categories)).catch(() => {});
//   }, []);

//   const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

//   const handleSubmit = async e => {
//     e.preventDefault();
//     if (!thumbnail || !pdf) { toast.error("Thumbnail and PDF are required"); return; }
//     setLoading(true);
//     const fd = new FormData();
//     Object.entries(form).forEach(([k, v]) => fd.append(k, v));
//     fd.append("thumbnail", thumbnail);
//     fd.append("pdf", pdf);
//     try {
//       await uploadNote(fd);
//       toast.success("Note uploaded successfully!");
//       setForm({ title: "", description: "", category: "", price: "", preview_pages: 0 });
//       setThumbnail(null);
//       setPdf(null);
//       e.target.reset();
//     } catch (err) {
//       toast.error(err.response?.data?.error || "Upload failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: 680 }}>
//       <h4 className="fw-bold mb-4">Upload New Note</h4>
//       <div className="card border-0 shadow-sm p-4">
//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label className="form-label fw-medium">Title <span className="text-danger">*</span></label>
//             <input name="title" className="form-control" value={form.title} onChange={handleChange} required />
//           </div>
//           <div className="mb-3">
//             <label className="form-label fw-medium">Description <span className="text-danger">*</span></label>
//             <textarea name="description" rows={3} className="form-control" value={form.description} onChange={handleChange} required />
//           </div>
//           <div className="row g-3 mb-3">
//             <div className="col-md-6">
//               <label className="form-label fw-medium">Category <span className="text-danger">*</span></label>
//               <select name="category" className="form-select" value={form.category} onChange={handleChange} required>
//                 <option value="">Select category</option>
//                 {categories.map(c => <option key={c._id} value={c.slug}>{c.name}</option>)}
//               </select>
//             </div>
//             <div className="col-md-3">
//               <label className="form-label fw-medium">Price (₹) <span className="text-danger">*</span></label>
//               <input name="price" type="number" min="0" step="0.01" className="form-control" value={form.price} onChange={handleChange} required />
//             </div>
//             <div className="col-md-3">
//               <label className="form-label fw-medium">Preview Pages</label>
//               <input name="preview_pages" type="number" min="0" className="form-control" value={form.preview_pages} onChange={handleChange} />
//             </div>
//           </div>
//           <div className="mb-3">
//             <label className="form-label fw-medium">Thumbnail Image <span className="text-danger">*</span></label>
//             <input type="file" className="form-control" accept="image/*" onChange={e => setThumbnail(e.target.files[0])} required />
//           </div>
//           <div className="mb-4">
//             <label className="form-label fw-medium">PDF File <span className="text-danger">*</span></label>
//             <input type="file" className="form-control" accept=".pdf" onChange={e => setPdf(e.target.files[0])} required />
//           </div>
//           <button type="submit" className="btn btn-primary w-100" disabled={loading}>
//             {loading ? "Uploading..." : "Upload Note"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { uploadNote, fetchCategories } from "../../services/notes";
import { getErrorMessage } from "../../utils/errorHandler";

export default function UploadNote() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    preview_pages: 0
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories()
      .then((r) => setCategories(r.data.categories))
      .catch((error) => {
        console.error("Failed to load categories:", error);
      });
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value
    }));
  };

  const validateFiles = () => {
    if (!thumbnail || !pdf) {
      toast.error("Thumbnail and PDF are required");
      return false;
    }

    const allowedImages = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (!allowedImages.includes(thumbnail.type)) {
      toast.error("Thumbnail must be JPG, PNG or WEBP");
      return false;
    }

    if (thumbnail.size > 5 * 1024 * 1024) {
      toast.error("Thumbnail size must be less than 5 MB");
      return false;
    }

    if (pdf.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return false;
    }

    if (pdf.size > 20 * 1024 * 1024) {
      toast.error("PDF size must be less than 20 MB");
      return false;
    }

    return true;
  };

  const validateForm = () => {
    const title = form.title.trim();
    const description = form.description.trim();

    if (title.length < 3 || title.length > 100) {
      toast.error("Title must be between 3 and 100 characters");
      return false;
    }

    if (description.length < 10 || description.length > 2000) {
      toast.error("Description must be between 10 and 2000 characters");
      return false;
    }

    if (!form.category) {
      toast.error("Please select a category");
      return false;
    }

    if (Number(form.price) < 0) {
      toast.error("Price cannot be negative");
      return false;
    }

    if (Number(form.preview_pages) < 0) {
      toast.error("Preview pages cannot be negative");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || !validateFiles()) {
      return;
    }

    setLoading(true);

    const fd = new FormData();

    fd.append("title", form.title.trim());
    fd.append("description", form.description.trim());
    fd.append("category", form.category);
    fd.append("price", Number(form.price));
    fd.append("preview_pages", Number(form.preview_pages));

    fd.append("thumbnail", thumbnail);
    fd.append("pdf", pdf);

    try {
      await uploadNote(fd);

      toast.success("Note uploaded successfully!");

      setForm({
        title: "",
        description: "",
        category: "",
        price: "",
        preview_pages: 0
      });

      setThumbnail(null);
      setPdf(null);

      e.target.reset();

    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error));

    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 680 }}>
      <h4 className="fw-bold mb-4">
        Upload New Note
      </h4>

      <div className="card border-0 shadow-sm p-4">
        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label className="form-label fw-medium">
              Title <span className="text-danger">*</span>
            </label>

            <input
              name="title"
              className="form-control"
              value={form.title}
              onChange={handleChange}
              required
              maxLength={100}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-medium">
              Description <span className="text-danger">*</span>
            </label>

            <textarea
              name="description"
              rows={3}
              className="form-control"
              value={form.description}
              onChange={handleChange}
              required
              maxLength={2000}
            />
          </div>

          <div className="row g-3 mb-3">

            <div className="col-md-6">
              <label className="form-label fw-medium">
                Category <span className="text-danger">*</span>
              </label>

              <select
                name="category"
                className="form-select"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select category
                </option>

                {categories.map((c) => (
                  <option key={c._id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label fw-medium">
                Price (₹) <span className="text-danger">*</span>
              </label>

              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                className="form-control"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-medium">
                Preview Pages
              </label>

              <input
                name="preview_pages"
                type="number"
                min="0"
                className="form-control"
                value={form.preview_pages}
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="mb-3">
            <label className="form-label fw-medium">
              Thumbnail Image <span className="text-danger">*</span>
            </label>

            <input
              type="file"
              className="form-control"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => setThumbnail(e.target.files[0])}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-medium">
              PDF File <span className="text-danger">*</span>
            </label>

            <input
              type="file"
              className="form-control"
              accept="application/pdf"
              onChange={(e) => setPdf(e.target.files[0])}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Note"}
          </button>

        </form>
      </div>
    </div>
  );
}