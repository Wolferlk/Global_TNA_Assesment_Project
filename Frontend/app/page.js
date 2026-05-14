"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiRequest, categories } from "../lib/api";

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (status) params.set("status", status);
    return params.toString();
  }, [category, status]);

  useEffect(() => {
    setLoading(true);
    setError("");

    apiRequest(`/api/jobs${query ? `?${query}` : ""}`)
      .then(setJobs)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand">
          <h1>Service Request Board</h1>
          <p>Browse open homeowner jobs and update progress.</p>
        </div>
        <Link className="button" href="/jobs/new">
          New request
        </Link>
      </header>

      <section className="toolbar">
        <div className="field">
          <label htmlFor="category">Category</label>
          <select id="category" className="input" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="status">Status</label>
          <select id="status" className="input" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">All statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </section>

      {error && <div className="error">{error}</div>}
      {loading && <div className="empty">Loading requests...</div>}
      {!loading && !jobs.length && <div className="empty">No requests found.</div>}

      <section className="grid">
        {jobs.map((job) => (
          <Link className="card" key={job._id} href={`/jobs/${job._id}`}>
            <span className={badgeClass(job.status)}>{job.status}</span>
            <h2>{job.title}</h2>
            <p>{job.description}</p>
            <div className="meta">
              <span>{job.category || "Uncategorised"}</span>
              <span>|</span>
              <span>{job.location || "No location"}</span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}

function badgeClass(status) {
  if (status === "In Progress") return "badge progress";
  if (status === "Closed") return "badge closed";
  return "badge open";
}
