"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiRequest, getUser, statuses } from "../../../lib/api";

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setUser(getUser());
    setError("");
    apiRequest(`/api/jobs/${id}`)
      .then(setJob)
      .catch((err) => setError(err.message));
  }, [id]);

  async function updateStatus(event) {
    const nextStatus = event.target.value;
    setBusy(true);
    setError("");

    try {
      const updated = await apiRequest(`/api/jobs/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus })
      });
      setJob(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function deleteJob() {
    if (!window.confirm("Delete this request?")) return;

    setBusy(true);
    setError("");

    try {
      await apiRequest(`/api/jobs/${id}`, { method: "DELETE" });
      router.push("/");
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand">
          <h1>Request Details</h1>
          <p>Review the job and update its progress.</p>
        </div>
        <Link className="button secondary" href="/">
          Back
        </Link>
      </header>

      {error && <div className="error">{error}</div>}
      {!job && !error && <div className="empty">Loading request...</div>}

      {job && (
        <section className="detail">
          <div className="detail-head">
            <span className={badgeClass(job.status)}>{job.status}</span>
            <span className="date">Created {new Date(job.createdAt).toLocaleDateString()}</span>
          </div>
          <h2>{job.title}</h2>
          <p className="description">{job.description}</p>

          <div className="info-grid">
            <div>
              <span>Category</span>
              <strong>{job.category || "Uncategorised"}</strong>
            </div>
            <div>
              <span>Location</span>
              <strong>{job.location || "No location"}</strong>
            </div>
            <div>
              <span>Contact</span>
              <strong>{job.contactName || "No name provided"}</strong>
            </div>
            <div>
              <span>Email</span>
              {job.contactEmail ? <a href={`mailto:${job.contactEmail}`}>{job.contactEmail}</a> : <strong>No email provided</strong>}
            </div>
          </div>

          <div className="field">
            <label htmlFor="status">Status</label>
            <select id="status" className="input" value={job.status} onChange={updateStatus} disabled={busy}>
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="status-actions" aria-label="Quick status actions">
            {statuses.map((item) => (
              <button
                className={item === job.status ? "status-pill active" : "status-pill"}
                disabled={busy || item === job.status}
                key={item}
                onClick={() => updateStatus({ target: { value: item } })}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>

          <div className="actions">
            {job.contactEmail && (
              <a className="button secondary" href={`mailto:${job.contactEmail}?subject=${encodeURIComponent(job.title)}`}>
                Email homeowner
              </a>
            )}
            {user ? (
              <button className="button danger" onClick={deleteJob} disabled={busy} type="button">
                Delete request
              </button>
            ) : (
              <Link className="button secondary" href="/login">
                Login to delete
              </Link>
            )}
          </div>
        </section>
      )}
    </main>
  );
}

function badgeClass(status) {
  if (status === "In Progress") return "badge progress";
  if (status === "Closed") return "badge closed";
  return "badge open";
}
