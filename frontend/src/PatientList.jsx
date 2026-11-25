export default function PatientList({
  patients,
  onEdit,
  onDelete,
  onDischarge,
}) {
  if (patients.length === 0) {
    return (
      <div className="card empty-state">
        <p>No patients found. Admit a new patient or adjust your filters.</p>
      </div>
    );
  }

  return (
    <div className="patient-grid">
      {patients.map((patient) => {
        const isAdmitted = patient.status === "Admitted";

        return (
          <article key={patient.id} className="card patient-card">
            <div className="patient-card-top">
              <div>
                <h3 className="patient-name">{patient.name}</h3>
                <p className="patient-meta">
                  {patient.age} yrs &bull; {patient.gender}
                </p>
              </div>
              <span
                className={`status-badge ${
                  isAdmitted ? "status-admitted" : "status-discharged"
                }`}
              >
                {patient.status}
              </span>
            </div>

            <dl className="patient-details">
              <div>
                <dt>Ward</dt>
                <dd>{patient.ward}</dd>
              </div>
              <div>
                <dt>Department</dt>
                <dd>{patient.department}</dd>
              </div>
              <div>
                <dt>Doctor</dt>
                <dd>{patient.doctor}</dd>
              </div>
              <div>
                <dt>Admission Date</dt>
                <dd>{patient.admission_date}</dd>
              </div>
            </dl>

            <div className="patient-actions">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => onEdit(patient)}
              >
                Edit
              </button>

              {isAdmitted && (
                <button
                  type="button"
                  className="btn btn-success btn-sm"
                  onClick={() => onDischarge(patient)}
                >
                  Mark Discharged
                </button>
              )}

              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => onDelete(patient)}
              >
                Delete
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}