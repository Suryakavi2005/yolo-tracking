export default function DashboardStats({ stats }) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-value">{stats.total_employees}</div>
        <div className="stat-label">Total Employees</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">{stats.total_locations}</div>
        <div className="stat-label">Total Visits</div>
      </div>
      <div className="stat-card">
        <div className="stat-value" style={{ color: '#38a169' }}>
          {stats.total_productive ?? '—'}
        </div>
        <div className="stat-label">Productive Visits</div>
      </div>
      <div className="stat-card">
        <div className="stat-value" style={{ color: '#e53e3e' }}>
          {stats.total_non_productive ?? '—'}
        </div>
        <div className="stat-label">Non-Productive Visits</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">{stats.employees_with_locations}</div>
        <div className="stat-label">Active Employees</div>
      </div>
    </div>
  );
}
