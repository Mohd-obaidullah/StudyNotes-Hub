import React from "react";
import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";

const devs = [
  {
    name: "Mohd Obaidullah",
    role: "Full Stack Developer",
    bio: "Designed and developed StudyNotes Hub using React, Flask, MongoDB, Rozorpay, Google Oauth, and mordern web technologies.",
    skills: ["Python", "Flask","Javascript","React","MongoDB", "REST APIs", "Authentication", "Deployment"],
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    portfolio: "https://example.com",
    initials: "MO",
    color: "#4f46e5",
  },
  // {
  //   name: "Frontend Developer",
  //   role: "Frontend Developer",
  //   bio: "Crafts fast, accessible, and beautiful interfaces that students actually enjoy using.",
  //   skills: ["React.js", "Bootstrap", "JavaScript", "UI/UX"],
  //   github: "https://github.com",
  //   linkedin: "https://linkedin.com",
  //   portfolio: "https://example.com",
  //   initials: "FD",
  //   color: "#0ea5e9",
  // },
];

export default function Developers() {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold">Meet the Developer</h1>
        <p className="text-muted">The person who built StudyNotes Hub</p>
      </div>
      <div className="row g-4 justify-content-center">
        {devs.map(dev => (
          <div key={dev.name} className="col-md-5">
            <div className="card border-0 shadow-sm h-100 p-4 card-hover text-center">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 fw-bold"
                style={{ width: 80, height: 80, background: dev.color, color: "#fff", fontSize: 28 }}
              >
                {dev.initials}
              </div>
              <h4 className="fw-bold mb-0">{dev.name}</h4>
              <p className="text-muted small mb-3" style={{ color: dev.color }}>{dev.role}</p>
              <p className="text-muted small mb-4">{dev.bio}</p>
              <div className="d-flex flex-wrap gap-2 justify-content-center mb-4">
                {dev.skills.map(s => (
                  <span key={s} className="badge rounded-pill" style={{ background: `${dev.color}20`, color: dev.color, fontSize: 12 }}>
                    {s}
                  </span>
                ))}
              </div>
              <div className="d-flex justify-content-center gap-3">
                <a href={dev.github} target="_blank" rel="noreferrer" className="text-muted fs-5"><FaGithub /></a>
                <a href={dev.linkedin} target="_blank" rel="noreferrer" className="text-muted fs-5"><FaLinkedin /></a>
                <a href={dev.portfolio} target="_blank" rel="noreferrer" className="text-muted fs-5"><FaGlobe /></a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
