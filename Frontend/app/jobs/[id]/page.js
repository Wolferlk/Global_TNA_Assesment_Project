"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiRequest, statuses } from "../../../lib/api";

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
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
          <span className={badgeClass(job.status)}>{job.status}</span>
          <h2>{job.title}</h2>
          <p>{job.description}</p>

          <div className="meta">
            <span>{job.category || "Uncategorised"}</span>
            <span>|</span>
            <span>{job.location || "No location"}</span>
            <span>|</span>
            <span>{new Date(job.createdAt).toLocaleDateString()}</span>
          </div>

          <div>
            <strong>Contact</strong>
            <p>
              {job.contactName || "No name provided"}
              {job.contactEmail ? ` · ${job.contactEmail}` : ""}
            </p>
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

          <div className="actions">
            <button className="button danger" onClick={deleteJob} disabled={busy} type="button">
              Delete request
            </button>
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
