import { useEffect, useState } from "react";
import "./App.css";
import { API_URL, DEPARTMENTS, DOCTORS, WARDS } from "./constants";
import PatientForm from "./PatientForm";
import PatientList from "./PatientList";

// Convert DRF error object like { name: ["..."] } into simple strings per field
function formatBackendErrors(data) {
  if (!data || typeof data !== "object") {
    return { general: "Something went wrong. Please check your input." };
  }
  const formatted = {};
  for (const [key, val] of Object.entries(data)) {
    formatted[key] = Array.isArray(val) ? val.join(" ") : String(val);
  }
  if (formatted.detail && !formatted.general) {
    formatted.general = formatted.detail;
  }
  return formatted;
}

export default function App() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  // Search + Filter states
  const [search, setSearch] = useState("");
  const [ward, setWard] = useState("");
  const [department, setDepartment] = useState("");
  const [doctor, setDoctor] = useState("");

  // Form states (showForm=true when adding, editingPatient=object when editing)
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadPatients() {
      try {
        const params = new URLSearchParams();
        if (search.trim()) params.set("search", search.trim());
        if (ward) params.set("ward", ward);
        if (department) params.set("department", department);
        if (doctor) params.set("doctor", doctor);

        const query = params.toString();
        const url = `${API_URL}/patients/${query ? `?${query}` : ""}`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Failed to load patients from server.");
        }
        const data = await res.json();
        if (!ignore) {
          setPatients(data);
          setError("");
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Unable to connect to the backend API.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadPatients();
    return () => {
      ignore = true;
    };
  }, [search, ward, department, doctor, reloadKey]);

  function refreshList() {
    setLoading(true);
    setReloadKey((n) => n + 1);
  }

  async function handleSavePatient(payload) {
    setSaving(true);
    setNotice("");
    try {
      const isEdit = Boolean(editingPatient);
      const url = isEdit
        ? `${API_URL}/patients/${editingPatient.id}/`
        : `${API_URL}/patients/`;

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        return formatBackendErrors(data);
      }

      setShowForm(false);
      setEditingPatient(null);
      setNotice(
        isEdit
          ? `Updated ${data.name} successfully.`
          : `Admitted ${data.name} successfully.`
      );
      refreshList();
      return null;
    } catch {
      return {
        general: "Network error. Please make sure the backend is running.",
      };
    } finally {
      setSaving(false);
    }
  }

  function handleStartAdd() {
    setEditingPatient(null);
    setShowForm(true);
    setNotice("");
  }

  function handleStartEdit(patient) {
    setEditingPatient(patient);
    setShowForm(true);
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelForm() {
    setShowForm(false);
    setEditingPatient(null);
  }

  async function handleDelete(patient) {
    const confirmed = window.confirm(
      `Are you sure you want to delete patient "${patient.name}"?`
    );
    if (!confirmed) return;

    setNotice("");
    setError("");
    try {
      const res = await fetch(`${API_URL}/patients/${patient.id}/`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Could not delete patient.");
      }
      if (editingPatient?.id === patient.id) {
        handleCancelForm();
      }
      setNotice(`Deleted ${patient.name}.`);
      refreshList();
    } catch (err) {
      setError(err.message || "Delete failed.");
    }
  }

  async function handleDischarge(patient) {
    setNotice("");
    setError("");
    try {
      const res = await fetch(`${API_URL}/patients/${patient.id}/discharge/`, {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error("Could not mark patient as discharged.");
      }
      setNotice(`${patient.name} marked as Discharged.`);
      refreshList();
    } catch (err) {
      setError(err.message || "Discharge failed.");
    }
  }

  function handleClearFilters() {
    setSearch("");
    setWard("");
    setDepartment("");
    setDoctor("");
  }

  const hasFilters = Boolean(search || ward || department || doctor);
  const admittedCount = patients.filter((p) => p.status === "Admitted").length;
  const dischargedCount = patients.length - admittedCount;

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <span className="eyebrow">Hospital Ward Desk</span>
          <h1>Patient Admission Management</h1>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleStartAdd}
        >
          + Admit Patient
        </button>
      </header>

      <section className="stats-bar">
        <div className="stat-pill">
          <span>Showing</span>
          <strong>{patients.length}</strong>
        </div>
        <div className="stat-pill stat-admitted">
          <span>Admitted</span>
          <strong>{admittedCount}</strong>
        </div>
        <div className="stat-pill stat-discharged">
          <span>Discharged</span>
          <strong>{dischargedCount}</strong>
        </div>
      </section>

      {notice && <div className="alert alert-success">{notice}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <PatientForm
          key={editingPatient ? editingPatient.id : "new"}
          initialData={editingPatient}
          onSubmit={handleSavePatient}
          onCancel={handleCancelForm}
          saving={saving}
        />
      )}

      <section className="card filter-card">
        <div className="filter-grid">
          <div className="field">
            <label htmlFor="search">Search by Name</label>
            <input
              id="search"
              type="search"
              placeholder="Search patient name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="filter-ward">Ward</label>
            <select
              id="filter-ward"
              value={ward}
              onChange={(e) => setWard(e.target.value)}
            >
              <option value="">All Wards</option>
              {WARDS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="filter-department">Department</label>
            <select
              id="filter-department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="filter-doctor">Doctor</label>
            <select
              id="filter-doctor"
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
            >
              <option value="">All Doctors</option>
              {DOCTORS.map((doc) => (
                <option key={doc} value={doc}>
                  {doc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {hasFilters && (
          <div className="filter-footer">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleClearFilters}
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {loading ? (
        <div className="card empty-state">
          <p>Loading patients...</p>
        </div>
      ) : (
        <PatientList
          patients={patients}
          onEdit={handleStartEdit}
          onDelete={handleDelete}
          onDischarge={handleDischarge}
        />
      )}
    </div>
  );
}