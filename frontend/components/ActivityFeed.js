const PROD_COLOR = {
  'Productive':     '#38a169',
  'Non-Productive': '#e53e3e',
};

export default function ActivityFeed({ employee, history, productivityFilter }) {
  const filtered = productivityFilter === 'All'
    ? history
    : history.filter(h => h.productivity === productivityFilter);

  function fmtTime(ts) {
    if (!ts) return '';
    return new Date(ts).toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour:   '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div className="activity-feed-card">
      <div className="card-header">
        📋 Activity Feed
        <span style={{ marginLeft: 'auto', fontWeight: 400, fontSize: '0.78rem', color: '#718096' }}>
          {filtered.length} visits
        </span>
      </div>
      <div className="activity-list">
        {filtered.length === 0 && (
          <div className="loading" style={{ padding: '1.5rem' }}>
            No {productivityFilter !== 'All' ? productivityFilter + ' ' : ''}visits found.
          </div>
        )}
        {filtered.map((loc, idx) => (
          <div key={loc.location_id} className="activity-item">
            <div
              className="activity-number"
              style={{ background: PROD_COLOR[loc.productivity] || '#718096' }}
            >
              {idx + 1}
            </div>
            <div className="activity-info">
              <div className="activity-place">{loc.place_name}</div>
              <div className="activity-meta">
                <span className={`badge badge-${loc.productivity === 'Productive' ? 'productive' : 'non-productive'}`}>
                  {loc.productivity === 'Productive' ? '✓ Productive' : '✗ Non-Productive'}
                </span>
                <span className="activity-time">{fmtTime(loc.recorded_at)}</span>
                <span className="activity-coords">
                  {parseFloat(loc.latitude).toFixed(4)}, {parseFloat(loc.longitude).toFixed(4)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
