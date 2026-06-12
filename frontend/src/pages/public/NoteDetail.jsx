import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchNote } from "../../services/notes";
import { createOrder, verifyPayment } from "../../services/payment";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/common/Spinner";

export default function NoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    fetchNote(id)
      .then((res) => {
        setNote(res.data);
      })
      .catch(() => {
        navigate("/404");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, navigate]);

  const handleBuy = async () => {
    if (!user) {
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/login`;  //"http://localhost:5000/auth/login";
      return;
    }

    try {
      setPaying(true);

      const { data } = await createOrder(id);

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        order_id: data.order_id,
        name: "StudyNotes Hub",
        description: data.note_title,

        handler: async function (response) {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              note_id: id,
            });

            toast.success("Payment successful!");

            setNote((prev) => ({
              ...prev,
              purchased: true,
            }));
          } catch {
            toast.error("Payment verification failed");
          }
        },

        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },

        theme: {
          color: "#2563eb",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      toast.error(
        err?.response?.data?.error ||
          "Unable to start payment"
      );
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return <Spinner fullPage />;
  }

  if (!note) {
    return null;
  }

  return (
    <div className="container py-5">
      <div className="row g-5 align-items-start">

        {/* Thumbnail */}
        <div className="col-lg-5">
          <img
            src={`${import.meta.env.VITE_API_URL}/uploads/${note.thumbnail}`} // src={`http://localhost:5000/uploads/${note.thumbnail}`}
            alt={note.title}
            className="img-fluid rounded shadow"
            style={{
              width: "100%",
              maxHeight: "650px",
              objectFit: "contain",
              padding: "10px",// extra 
            }}
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/600x800?text=No+Preview";
            }}
          />
        </div>

        {/* Details */}
        <div className="col-lg-7">
          <span className="badge bg-primary mb-3">
            {note.category}
          </span>

          <h1 className="fw-bold mb-3">
            {note.title}
          </h1>

          <p
            className="text-muted"
            style={{
              whiteSpace: "pre-line",
              lineHeight: "1.8",
            }}
          >
            {note.description}
          </p>

          <div className="mt-4">
            <p className="mb-2">
              <strong>Preview Pages:</strong>{" "}
              {note.preview_pages}
            </p>

            <h2
              className="fw-bold"
              style={{
                color: "#2563eb",
                fontSize: "2.5rem",
              }}
            >
              ₹{note.price}
            </h2>
          </div>

          <div className="mt-4">
            {note.purchased ? (
              <a
                href={`${import.meta.env.VITE_API_URL}/api/notes/${id}/access`}  //href={`http://localhost:5000/api/notes/${id}/access`} // api add extra for production
                target="_blank"
                rel="noreferrer"
                className="btn btn-success btn-lg"
              >
                Open PDF
              </a>
            ) : (
              <button
                onClick={handleBuy}
                disabled={paying}
                className="btn btn-primary btn-lg"
              >
                {paying ? "Processing..." : "Buy Now"}
              </button>
            )}
          </div>

          <div className="mt-4">
            <small className="text-muted">
              Secure checkout via Razorpay.
              One-time payment with lifetime access.
            </small>
          </div>
        </div>

      </div>
    </div>
  );
}