import { useState } from "react";
import { DEPARTMENTS, DOCTORS, GENDERS, STATUSES, WARDS } from "./constants";

// Today's date in YYYY-MM-DD (India Standard Time)
function getTodayIST() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

const EMPTY_FORM = {
  name: "",
  age: "",
  gender: "",
  ward: "",
  department: "",
  doctor: "",
  admission_date: getTodayIST(),
  status: "Admitted",
};

export default function PatientForm({ initialData, onSubmit, onCancel, saving }) {
  const today = getTodayIST();

  const [form, setForm] = useState(() =>
    initialData
      ? {
          name: initialData.name,
          age: String(initialData.age),
          gender: initialData.gender,
          ward: initialData.ward,
          department: initialData.department,
          doctor: initialData.doctor,
          admission_date: initialData.admission_date,
          status: initialData.status,
        }
      : EMPTY_FORM
  );

  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function validate() {
    const newErrors = {};
    const cleanedName = form.name.trim().replace(/\s+/g, " ");

    if (!cleanedName) {
      newErrors.name = "Name is required.";
    } else if (!/^[A-Za-z ]+$/.test(cleanedName)) {
      newErrors.name = "Name must contain letters only.";
    }

    const ageText = String(form.age).trim();
    if (ageText === "") {
      newErrors.age = "Age is required.";
    } else if (!/^\d+$/.test(ageText)) {
      newErrors.age = "Age must be a whole number between 0 and 120.";
    } else {
      const ageNum = Number(ageText);
      if (ageNum < 0 || ageNum > 120) {
        newErrors.age = "Age must be between 0 and 120.";
      }
    }

    if (!GENDERS.includes(form.gender)) {
      newErrors.gender = "Please select a gender from the list.";
    }
    if (!WARDS.includes(form.ward)) {
      newErrors.ward = "Please select a ward from the list.";
    }
    if (!DEPARTMENTS.includes(form.department)) {
      newErrors.department = "Please select a department from the list.";
    }
    if (!DOCTORS.includes(form.doctor)) {
      newErrors.doctor = "Please select a doctor from the list.";
    }

    if (!form.admission_date) {
      newErrors.admission_date = "Admission date is required.";
    } else if (form.admission_date > today) {
      newErrors.admission_date = "Admission date cannot be a future date.";
    }

    if (initialData && !STATUSES.includes(form.status)) {
      newErrors.status = "Please select a valid status.";
    }

    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      name: form.name.trim().replace(/\s+/g, " "),
      age: Number(String(form.age).trim()),
      gender: form.gender,
      ward: form.ward,
      department: form.department,
      doctor: form.doctor,
      admission_date: form.admission_date,
      status: initialData ? form.status : "Admitted",
    };

    const backendErrors = await onSubmit(payload);
    if (backendErrors) {
      setErrors(backendErrors);
    }
  }

  return (
    <section className="card form-card">
      <div className="form-header">
        <h2>{initialData ? "Edit Patient Details" : "Admit New Patient"}</h2>
      </div>

      {errors.general && <div className="alert alert-error">{errors.general}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="name">Patient Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Aarav Sharma"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="field">
            <label htmlFor="age">Age (0 - 120) *</label>
            <input
              id="age"
              name="age"
              type="number"
              min="0"
              max="120"
              placeholder="e.g. 34"
              value={form.age}
              onChange={handleChange}
            />
            {errors.age && <span className="field-error">{errors.age}</span>}
          </div>

          <div className="field">
            <label htmlFor="gender">Gender *</label>
            <select id="gender" name="gender" value={form.gender} onChange={handleChange}>
              <option value="">Select Gender</option>
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            {errors.gender && <span className="field-error">{errors.gender}</span>}
          </div>

          <div className="field">
            <label htmlFor="admission_date">Admission Date *</label>
            <input
              id="admission_date"
              name="admission_date"
              type="date"
              max={today}
              value={form.admission_date}
              onChange={handleChange}
            />
            {errors.admission_date && (
              <span className="field-error">{errors.admission_date}</span>
            )}
          </div>

          <div className="field">
            <label htmlFor="ward">Ward *</label>
            <select id="ward" name="ward" value={form.ward} onChange={handleChange}>
              <option value="">Select Ward</option>
              {WARDS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
            {errors.ward && <span className="field-error">{errors.ward}</span>}
          </div>

          <div className="field">
            <label htmlFor="department">Department *</label>
            <select
              id="department"
              name="department"
              value={form.department}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {errors.department && (
              <span className="field-error">{errors.department}</span>
            )}
          </div>

          <div className="field">
            <label htmlFor="doctor">Assigned Doctor *</label>
            <select id="doctor" name="doctor" value={form.doctor} onChange={handleChange}>
              <option value="">Select Doctor</option>
              {DOCTORS.map((doc) => (
                <option key={doc} value={doc}>
                  {doc}
                </option>
              ))}
            </select>
            {errors.doctor && <span className="field-error">{errors.doctor}</span>}
          </div>

          {initialData && (
            <div className="field">
              <label htmlFor="status">Status *</label>
              <select id="status" name="status" value={form.status} onChange={handleChange}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.status && <span className="field-error">{errors.status}</span>}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving
              ? "Saving..."
              : initialData
                ? "Update Patient"
                : "Admit Patient"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}