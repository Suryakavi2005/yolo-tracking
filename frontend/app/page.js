'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import DashboardStats  from '../components/DashboardStats';
import EmployeeList    from '../components/EmployeeList';
import LocationHistory from '../components/LocationHistory';
import ActivityFeed    from '../components/ActivityFeed';

const EmployeeMap = dynamic(() => import('../components/EmployeeMap'), {
  ssr: false,
  loading: () => <div className="loading">Loading map…</div>,
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function HomePage() {
  const [stats,              setStats]              = useState(null);
  const [latestLocations,    setLatestLocations]    = useState([]);
  const [allLocations,       setAllLocations]       = useState([]);
  const [selectedEmployee,   setSelectedEmployee]   = useState(null);
  const [userHistory,        setUserHistory]        = useState([]);
  const [employeeStats,      setEmployeeStats]      = useState(null);
  const [productivityFilter, setProductivityFilter] = useState('All');
  const [loading,            setLoading]            = useState(true);
  const [error,              setError]              = useState('');

  /* ── Initial load ── */
  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const [sRes, lRes, aRes] = await Promise.all([
          fetch(`${API_URL}/dashboard/stats`),
          fetch(`${API_URL}/locations/latest`),
          fetch(`${API_URL}/locations`),
        ]);
        if (!sRes.ok || !lRes.ok || !aRes.ok)
          throw new Error('API request failed — is the backend running on port 5000?');
        const [s, l, a] = await Promise.all([sRes.json(), lRes.json(), aRes.json()]);
        setStats(s);
        setLatestLocations(l);
        setAllLocations(a);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  /* ── Load selected employee data ── */
  useEffect(() => {
    if (!selectedEmployee) {
      setUserHistory([]);
      setEmployeeStats(null);
      setProductivityFilter('All');
      return;
    }
    async function loadEmployee() {
      try {
        const id = selectedEmployee.employee_id;
        const [hRes, sRes] = await Promise.all([
          fetch(`${API_URL}/locations/${id}`),
          fetch(`${API_URL}/locations/stats/${id}`),
        ]);
        const [hData, sData] = await Promise.all([hRes.json(), sRes.json()]);
        setUserHistory(hData.locations || []);
        setEmployeeStats(sData);
        setProductivityFilter('All');
      } catch (e) { console.error(e); }
    }
    loadEmployee();
  }, [selectedEmployee]);

  /* ── Build route data for map ── */
  const routesByEmployee = allLocations.reduce((acc, loc) => {
    const id = loc.employee_id;
    if (!acc[id]) acc[id] = [];
    acc[id].push({
      lat: parseFloat(loc.latitude),
      lng: parseFloat(loc.longitude),
      productivity: loc.productivity,
      place_name:   loc.place_name,
    });
    return acc;
  }, {});

  /* ── Filtered history ── */
  const filteredHistory = productivityFilter === 'All'
    ? userHistory
    : userHistory.filter(h => h.productivity === productivityFilter);

  const productive    = employeeStats?.productive    ?? 0;
  const nonProductive = employeeStats?.non_productive ?? 0;
  const total         = employeeStats?.total          ?? 0;

  if (loading) return (
    <div className="loading" style={{ height: '100vh', fontSize: '1rem' }}>Loading dashboard…</div>
  );

  if (error) return (
    <div className="app-container" style={{ paddingTop: '2rem' }}>
      <div className="error-msg">⚠️ {error}<br/>Make sure the backend is running on port 5000.</div>
    </div>
  );

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div>
          <h1>📍 Employee Location &amp; Productivity Tracking</h1>
          <p>Coimbatore, Tamil Nadu — Field Force Dashboard</p>
        </div>
      </header>

      {/* Stats cards */}
      {stats && <DashboardStats stats={stats} />}

      {/* Main layout */}
      <div className="main-grid">
        {/* Left sidebar */}
        <aside className="sidebar">
          <EmployeeList
            latestLocations={latestLocations}
            selectedEmployee={selectedEmployee}
            onSelect={setSelectedEmployee}
            allLocations={allLocations}
          />
          {selectedEmployee && (
            <ActivityFeed
              employee={selectedEmployee}
              history={userHistory}
              productivityFilter={productivityFilter}
            />
          )}
        </aside>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Map card */}
          <div className="map-card">
            <div className="card-header">🗺️ Interactive Map — Coimbatore</div>

            {/* Filter bar (only when employee selected) */}
            {selectedEmployee && employeeStats && (
              <>
                <div className="filter-bar">
                  <button
                    className={`filter-btn ${productivityFilter === 'All' ? 'active' : ''}`}
                    onClick={() => setProductivityFilter('All')}
                  >
                    All <span className="filter-count">{total}</span>
                  </button>
                  <button
                    className={`filter-btn productive ${productivityFilter === 'Productive' ? 'active' : ''}`}
                    onClick={() => setProductivityFilter('Productive')}
                  >
                    ● Productive <span className="filter-count">{productive}</span>
                  </button>
                  <button
                    className={`filter-btn non-productive ${productivityFilter === 'Non-Productive' ? 'active' : ''}`}
                    onClick={() => setProductivityFilter('Non-Productive')}
                  >
                    ● Non-Productive <span className="filter-count">{nonProductive}</span>
                  </button>
                </div>
                <div className="productivity-stats">
                  <span className="prod-stat">
                    <span className="prod-dot" style={{ background: '#38a169' }} />
                    Productive: <strong>{productive}</strong>
                  </span>
                  <span className="prod-stat">
                    <span className="prod-dot" style={{ background: '#e53e3e' }} />
                    Non-Productive: <strong>{nonProductive}</strong>
                  </span>
                  <span className="prod-stat" style={{ color: '#718096' }}>
                    Total Visited: <strong>{total}</strong>
                  </span>
                </div>
              </>
            )}

            <div className="map-wrapper">
              <EmployeeMap
                latestLocations={latestLocations}
                routesByEmployee={routesByEmployee}
                selectedEmployee={selectedEmployee}
                userHistory={filteredHistory}
              />
            </div>
          </div>

          {/* Location history table */}
          {selectedEmployee && (
            <div className="history-card">
              <LocationHistory
                employee={selectedEmployee}
                history={filteredHistory}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
