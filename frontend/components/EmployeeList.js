const COLORS = {
  1: '#e53e3e',
  2: '#38a169',
  3: '#3182ce',
  4: '#d69e2e',
  5: '#805ad5',
};

export default function EmployeeList({ latestLocations, selectedEmployee, onSelect, allLocations }) {
  // Build per-employee productivity counts from full location list
  const stats = allLocations.reduce((acc, loc) => {
    const id = loc.employee_id;
    if (!acc[id]) acc[id] = { p: 0, np: 0 };
    if (loc.productivity === 'Productive') acc[id].p++;
    else acc[id].np++;
    return acc;
  }, {});

  function fmtTime(ts) {
    if (!ts) return '';
    return new Date(ts).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  }

  return (
    <div className="employee-list-card">
      <div className="card-header">👥 Field Employees</div>
      <button
        className="all-employees-btn"
        onClick={() => onSelect(null)}
        style={{ background: !selectedEmployee ? '#1e429f' : '#1a56db' }}
      >
        Show All Employees
      </button>

      {latestLocations.map(emp => {
        const s = stats[emp.employee_id] || { p: 0, np: 0 };
        const isActive = selectedEmployee?.employee_id === emp.employee_id;
        return (
          <div
            key={emp.employee_id}
            className={`employee-item ${isActive ? 'active' : ''}`}
            onClick={() => onSelect(emp)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onSelect(emp)}
          >
            <span className="employee-dot" style={{ background: COLORS[emp.employee_id] || '#999' }} />
            <div className="employee-info">
              <div className="emp-name">#{emp.employee_id} — {emp.employee_name}</div>
              <div style={{ display: 'flex', gap: '0.3rem', margin: '0.25rem 0', flexWrap: 'wrap' }}>
                <span className="badge badge-productive">✓ {s.p}</span>
                <span className="badge badge-non-productive">✗ {s.np}</span>
              </div>
              <div className="emp-coords">
                📍 {emp.place_name || `${parseFloat(emp.latitude).toFixed(4)}, ${parseFloat(emp.longitude).toFixed(4)}`}
              </div>
              <div className="emp-time">{fmtTime(emp.recorded_at)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
