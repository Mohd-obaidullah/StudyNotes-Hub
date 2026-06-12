// import React from "react";
// import { Link } from "react-router-dom";
// import { RiBookOpenLine, RiSecurePaymentLine, RiShieldCheckLine } from "react-icons/ri";
// import { useNotes } from "../../hooks/useNotes";
// import NoteCard from "../../components/common/NoteCard";
// import SkeletonCard from "../../components/common/SkeletonCard";

// const features = [
//   { icon: <RiBookOpenLine size={28} />, title: "Quality Notes", desc: "Hand-picked, well-structured notes covering major subjects." },
//   { icon: <RiSecurePaymentLine size={28} />, title: "Secure Checkout", desc: "Pay with Razorpay — cards, UPI, net banking all supported." },
//   { icon: <RiShieldCheckLine size={28} />, title: "Instant Access", desc: "Download your notes the moment payment is confirmed." },
// ];

// export default function Home() {
//   // const { notes, loading } = useNotes({ page: 1 });
//   const { notes, loading, error } = useNotes({ page: 1 });
//   const featured = notes.slice(0, 3);

//   return (
//     <>
//       {/* Hero */}
//       <section
//         style={{
//           background: "linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)",
//           padding: "80px 0",
//           color: "#fff",
//         }}
//       >
//         <div className="container text-center">
//           <h1 className="fw-bold mb-3" style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)" }}>
//             Study Smarter, Not Harder
//           </h1>
//           <p className="lead mb-4 opacity-90" style={{ maxWidth: 560, margin: "0 auto 24px" }}>
//             Access premium study notes crafted by toppers. Browse, buy, and learn at your own pace.
//           </p>
//           <div className="d-flex gap-3 justify-content-center flex-wrap">
//             <Link to="/notes" className="btn btn-light btn-lg fw-semibold" style={{ color: "#4f46e5" }}>
//               Browse Notes
//             </Link>
//             <a href="/auth/login" className="btn btn-outline-light btn-lg fw-semibold">
//               Get Started Free
//             </a>
//           </div>
//         </div>
//       </section>

//       {/* Features */}
//       <section className="py-5">
//         <div className="container">
//           <h2 className="text-center fw-bold mb-4">Why StudyNotes Hub?</h2>
//           <div className="row g-4">
//             {features.map(f => (
//               <div key={f.title} className="col-md-4">
//                 <div className="card h-100 border-0 shadow-sm text-center p-4 card-hover">
//                   <div className="mb-3" style={{ color: "var(--primary)" }}>{f.icon}</div>
//                   <h5 className="fw-semibold">{f.title}</h5>
//                   <p className="text-muted small mb-0">{f.desc}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Featured Notes */}
//       <section className="py-5" style={{ background: "rgba(79,70,229,.03)" }}>
//         <div className="container">
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <h2 className="fw-bold mb-0">Featured Notes</h2>
//             <Link to="/notes" className="btn btn-outline-primary btn-sm">View All</Link>
//           </div>
//           <div className="row g-4">
//             {loading
//               ? [1, 2, 3].map(i => <div key={i} className="col-md-4"><SkeletonCard /></div>)
//               : featured.map(n => (
//                   <div key={n._id} className="col-md-4">
//                     <NoteCard note={n} />
//                   </div>
//                 ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="py-5 text-center">
//         <div className="container">
//           <h2 className="fw-bold mb-3">Ready to ace your exams?</h2>
//           <p className="text-muted mb-4">Join thousands of students already using StudyNotes Hub.</p>
//           <a href="/auth/login" className="btn btn-primary btn-lg px-5">Sign in with Google</a>
//         </div>
//       </section>
//     </>
//   );
// }
import React from "react";
import { Link } from "react-router-dom";
import {
  RiBookOpenLine,
  RiSecurePaymentLine,
  RiShieldCheckLine,
} from "react-icons/ri";

import { useNotes } from "../../hooks/useNotes";
import NoteCard from "../../components/common/NoteCard";
import SkeletonCard from "../../components/common/SkeletonCard";

const features = [
  {
    icon: <RiBookOpenLine size={28} />,
    title: "Quality Notes",
    desc: "Hand-picked, well-structured notes covering major subjects.",
  },
  {
    icon: <RiSecurePaymentLine size={28} />,
    title: "Secure Checkout",
    desc: "Pay with Razorpay — cards, UPI, net banking all supported.",
  },
  {
    icon: <RiShieldCheckLine size={28} />,
    title: "Instant Access",
    desc: "Download your notes the moment payment is confirmed.",
  },
];

export default function Home() {
  const { notes, loading, error } = useNotes({ page: 1 });

  const featuredNotes = notes.slice(0, 3);

  const googleLoginURL = `${import.meta.env.VITE_API_URL}/auth/login`;

  return (
    <>
      {/* Hero Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)",
          padding: "80px 0",
          color: "#ffffff",
        }}
      >
        <div className="container text-center">
          <h1
            className="fw-bold mb-3"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
            }}
          >
            Study Smarter, Not Harder
          </h1>

          <p
            className="lead mb-4 opacity-90"
            style={{
              maxWidth: "560px",
              margin: "0 auto 24px",
            }}
          >
            Access premium study notes crafted by toppers.
            Browse, buy, and learn at your own pace.
          </p>

          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link
              to="/notes"
              className="btn btn-light btn-lg fw-semibold"
              style={{ color: "#4f46e5" }}
            >
              Browse Notes
            </Link>

            <a
              href={googleLoginURL}
              className="btn btn-outline-light btn-lg fw-semibold"
            >
              Get Started Free
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-4">
            Why StudyNotes Hub?
          </h2>

          <div className="row g-4">
            {features.map((feature) => (
              <div key={feature.title} className="col-md-4">
                <div className="card h-100 border-0 shadow-sm text-center p-4 card-hover">
                  <div
                    className="mb-3"
                    style={{ color: "var(--primary)" }}
                  >
                    {feature.icon}
                  </div>

                  <h5 className="fw-semibold">
                    {feature.title}
                  </h5>

                  <p className="text-muted small mb-0">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Notes */}
      <section
        className="py-5"
        style={{
          background: "rgba(79, 70, 229, 0.03)",
        }}
      >
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0">
              Featured Notes
            </h2>

            <Link
              to="/notes"
              className="btn btn-outline-primary btn-sm"
            >
              View All
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger mb-4" role="alert">
              {error}
            </div>
          )}

          <div className="row g-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="col-md-4">
                  <SkeletonCard />
                </div>
              ))
            ) : featuredNotes.length === 0 ? (
              <div className="col-12 text-center text-muted py-5">
                No featured notes available at the moment.
              </div>
            ) : (
              featuredNotes.map((note) => (
                <div key={note._id} className="col-md-4">
                  <NoteCard note={note} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-5 text-center">
        <div className="container">
          <h2 className="fw-bold mb-3">
            Ready to ace your exams?
          </h2>

          <p className="text-muted mb-4">
            Join thousands of students already using StudyNotes Hub.
          </p>

          <a
            href={googleLoginURL}
            className="btn btn-primary btn-lg px-5"
          >
            Sign in with Google
          </a>
        </div>
      </section>
    </>
  );
}
