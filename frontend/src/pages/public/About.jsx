import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="container py-5" style={{ maxWidth: 760 }}>
      <h1 className="fw-bold mb-3">About StudyNotes Hub</h1>
      <p className="text-muted lead mb-4">
        StudyNotes Hub is a student-first platform where academic notes meet simplicity.
      </p>
      <p className="mb-3">
        We built this because finding quality, well-organized notes is genuinely hard. Most study material
        online is either scattered, incomplete, or behind paywalls with no preview. We wanted something
        different — a clean place to browse, see a preview, pay once, and own the notes.
      </p>
      <p className="mb-3">
        Every note on the platform is reviewed before listing. We focus on clarity, accuracy, and usefulness.
        No filler pages, no vague summaries.
      </p>
      <p className="mb-4">
        Payment is handled securely by Razorpay. Once you purchase a note, it's yours — no subscriptions,
        no recurring charges, no expiry.
      </p>
      <Link to="/notes" className="btn btn-primary">Browse Notes</Link>
    </div>
  );
}
