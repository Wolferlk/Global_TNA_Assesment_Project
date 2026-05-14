"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiRequest, categories } from "../../../lib/api";

const initialForm = {
  title: "",
  description: "",
  category: "Plumbing",
  location: "",
  contactName: "",
  contactEmail: ""
};

export default function NewJobPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  }

  async function submitJob(event) {
    event.preventDefault();
    setError("");

    if (!form.title.trim() || !form.description.trim()) {
      setError("Title and description are required.");
      return;
    }

    if (form.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSaving(true);
    try {
      const job = await apiRequest("/api/jobs", {
        method: "POST",
        body: JSON.stringify(form)
      });
      router.push(`/jobs/${job._id}`);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand">
          <h1>New Service Request</h1>
          <p>Post a clear request so tradespeople can respond quickly.</p>
        </div>
        <Link className="button secondary" href="/">
          Back
        </Link>
      </header>

      <form className="form" onSubmit={submitJob}>
        {error && <div className="error">{error}</div>}

        <div className="form-grid">
          <div className="field span-2">
            <label htmlFor="title">Title</label>
            <input id="title" className="input" name="title" value={form.title} onChange={updateField} required />
          </div>

          <div className="field span-2">
            <label htmlFor="description">Description</label>
            <textarea id="description" className="input" name="description" value={form.description} onChange={updateField} required />
          </div>

          <div className="field">
            <label htmlFor="category">Category</label>
            <select id="category" className="input" name="category" value={form.category} onChange={updateField}>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="location">Location</label>
            <input id="location" className="input" name="location" value={form.location} onChange={updateField} />
          </div>

          <div className="field">
            <label htmlFor="contactName">Contact name</label>
            <input id="contactName" className="input" name="contactName" value={form.contactName} onChange={updateField} />
          </div>

          <div className="field">
            <label htmlFor="contactEmail">Contact email</label>
            <input id="contactEmail" className="input" name="contactEmail" value={form.contactEmail} onChange={updateField} />
          </div>
        </div>

        <div className="actions">
          <button className="button" disabled={saving} type="submit">
            {saving ? "Saving..." : "Create request"}
          </button>
        </div>
      </form>
    </main>
  );
}
