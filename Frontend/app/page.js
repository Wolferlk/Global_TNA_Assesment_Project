"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiRequest, categories, clearAuth, getUser } from "../lib/api";

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (status) params.set("status", status);
    if (search.trim()) params.set("search", search.trim());
    return params.toString();
  }, [category, search, status]);

  useEffect(() => {
    setUser(getUser());
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");

    apiRequest(`/api/jobs${query ? `?${query}` : ""}`)
      .then(setJobs)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [query]);

  const sortedJobs = useMemo(() => {
    return [...jobs].sort((first, second) => {
      if (sort === "oldest") return new Date(first.createdAt) - new Date(second.createdAt);
      if (sort === "category") return (first.category || "").localeCompare(second.category || "");
      if (sort === "status") return statusRank(first.status) - statusRank(second.status);
      return new Date(second.createdAt) - new Date(first.createdAt);
    });
  }, [jobs, sort]);

  const stats = useMemo(() => {
    return {
      total: jobs.length,
      open: jobs.filter((job) => job.status === "Open").length,
      progress: jobs.filter((job) => job.status === "In Progress").length,
      closed: jobs.filter((job) => job.status === "Closed").length
    };
  }, [jobs]);

  function clearFilters() {
    setCategory("");
    setStatus("");
    setSearch("");
    setSort("newest");
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand">
          <h1>Service Request Board</h1>
          <p>Browse open homeowner jobs and update progress.</p>
        </div>
        <div className="actions">
          {user ? (
            <>
              <span className="user-chip">{user.name || user.email}</span>
              <button
                className="button secondary"
                onClick={() => {
                  clearAuth();
                  setUser(null);
                }}
                type="button"
              >
                Logout
              </button>
              <Link className="button" href="/jobs/new">
                New request
              </Link>
            </>
          ) : (
            <Link className="button" href="/login">
              Login to post
            </Link>
          )}
        </div>
      </header>

      <section className="stats-grid" aria-label="Request summary">
        <button className="stat-card" onClick={() => setStatus("")} type="button">
          <span>Total</span>
          <strong>{stats.total}</strong>
        </button>
        <button className="stat-card open" onClick={() => setStatus("Open")} type="button">
          <span>Open</span>
          <strong>{stats.open}</strong>
        </button>
        <button className="stat-card progress" onClick={() => setStatus("In Progress")} type="button">
          <span>In progress</span>
          <strong>{stats.progress}</strong>
        </button>
        <button className="stat-card closed" onClick={() => setStatus("Closed")} type="button">
          <span>Closed</span>
          <strong>{stats.closed}</strong>
        </button>
      </section>

      <section className="toolbar panel">
        <div className="field search-field">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            className="input"
            placeholder="Search title or description"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

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

        <div className="field">
          <label htmlFor="sort">Sort</label>
          <select id="sort" className="input" value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="status">Status</option>
            <option value="category">Category</option>
          </select>
        </div>

        <button className="button secondary filter-clear" onClick={clearFilters} type="button">
          Clear
        </button>
      </section>

      {error && <div className="error">{error}</div>}
      {loading && (
        <section className="grid">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div className="card skeleton" key={item}>
              <span />
              <strong />
              <p />
              <p />
            </div>
          ))}
        </section>
      )}
      {!loading && !jobs.length && (
        <div className="empty">
          <strong>No requests found.</strong>
          <p>Try a different search term or clear the filters.</p>
          <button className="button secondary" onClick={clearFilters} type="button">
            Clear filters
          </button>
        </div>
      )}

      <section className="grid">
        {!loading && sortedJobs.map((job) => (
          <Link className="card" key={job._id} href={`/jobs/${job._id}`}>
            <div className="card-head">
              <span className={badgeClass(job.status)}>{job.status}</span>
              <span className="date">{new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
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

function statusRank(status) {
  if (status === "Open") return 1;
  if (status === "In Progress") return 2;
  return 3;
}
