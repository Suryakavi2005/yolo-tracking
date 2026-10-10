export default function LocationHistory({ employee, history }) {
  function fmt(ts) {
    if (!ts) return '';
    return new Date(ts).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  }

  return (
    <>
      <div className="card-header">
        📋 Location History — {employee.employee_name}
        <span style={{ marginLeft: 'auto', fontWeight: 400, color: '#718096' }}>
          {history.length} records
        </span>
      </div>
      <div className="history-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Place Name</th>
              <th>Productivity</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Recorded At</th>
            </tr>
          </thead>
          <tbody>
            {history.map((row, idx) => (
              <tr key={row.location_id}>
                <td>{idx + 1}</td>
                <td style={{ fontWeight: 500 }}>{row.place_name}</td>
                <td>
                  <span className={`badge badge-${row.productivity === 'Productive' ? 'productive' : 'non-productive'}`}>
                    {row.productivity === 'Productive' ? '✓ Productive' : '✗ Non-Productive'}
                  </span>
                </td>
                <td>{parseFloat(row.latitude).toFixed(6)}</td>
                <td>{parseFloat(row.longitude).toFixed(6)}</td>
                <td>{fmt(row.recorded_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
