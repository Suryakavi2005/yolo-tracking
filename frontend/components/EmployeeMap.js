'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Per-employee colors for "show all" mode
const EMP_COLORS = {
  1: '#e53e3e',
  2: '#38a169',
  3: '#3182ce',
  4: '#d69e2e',
  5: '#805ad5',
};

// Productivity colors for individual visit markers
const PROD_COLOR = {
  'Productive':     '#38a169',
  'Non-Productive': '#e53e3e',
};

function makeIcon(color, label, size = 22) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:${size}px;height:${size}px;
      background:${color};
      border:2.5px solid #fff;
      border-radius:50%;
      box-shadow:0 2px 6px rgba(0,0,0,0.4);
      display:flex;align-items:center;justify-content:center;
      font-size:${Math.max(8, Math.floor(size * 0.4))}px;
      font-weight:700;color:#fff;line-height:1;
    ">${label !== undefined ? label : ''}</div>`,
    iconSize:   [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor:[0, -(size / 2) - 3],
  });
}

function MapFit({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points && points.length > 0) {
      try { map.fitBounds(points, { padding: [40, 40] }); } catch (_) {}
    }
  }, [points, map]);
  return null;
}

export default function EmployeeMap({
  latestLocations,
  routesByEmployee,
  selectedEmployee,
  userHistory,
}) {
  const CENTER = [11.0168, 76.9558];

  function fmt(ts) {
    if (!ts) return '';
    return new Date(ts).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  }

  /* ── SINGLE EMPLOYEE VIEW ── */
  if (selectedEmployee) {
    const fullRoute = (routesByEmployee[selectedEmployee.employee_id] || [])
      .map(p => [p.lat, p.lng]);
    const fitPoints = userHistory.length > 0
      ? userHistory.map(h => [parseFloat(h.latitude), parseFloat(h.longitude)])
      : fullRoute;

    return (
      <MapContainer center={CENTER} zoom={13} style={{ width: '100%', height: '100%' }} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapFit points={fitPoints.length > 0 ? fitPoints : null} />

        {/* Faint full-route dashed line for context */}
        {fullRoute.length > 1 && (
          <Polyline
            positions={fullRoute}
            pathOptions={{ color: '#3182ce', weight: 2, opacity: 0.25, dashArray: '5 5' }}
          />
        )}

        {/* Filtered visit markers — colored by productivity */}
        {userHistory.map((loc, idx) => {
          const color = PROD_COLOR[loc.productivity] || '#718096';
          return (
            <Marker
              key={loc.location_id}
              position={[parseFloat(loc.latitude), parseFloat(loc.longitude)]}
              icon={makeIcon(color, idx + 1, 22)}
            >
              <Popup>
                <strong style={{ fontSize: '13px' }}>{loc.place_name}</strong><br />
                <span style={{
                  display: 'inline-block', marginTop: '3px', padding: '1px 8px',
                  borderRadius: '20px', fontSize: '11px', fontWeight: 700,
                  background: loc.productivity === 'Productive' ? '#c6f6d5' : '#fed7d7',
                  color:      loc.productivity === 'Productive' ? '#22543d' : '#742a2a',
                }}>
                  {loc.productivity}
                </span><br />
                <small>Lat: {parseFloat(loc.latitude).toFixed(6)}</small><br />
                <small>Lng: {parseFloat(loc.longitude).toFixed(6)}</small><br />
                <small style={{ color: '#718096' }}>{fmt(loc.recorded_at)}</small>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    );
  }

  /* ── ALL EMPLOYEES VIEW ── */
  const latestPts = latestLocations.map(e => [
    parseFloat(e.latitude), parseFloat(e.longitude),
  ]);

  return (
    <MapContainer center={CENTER} zoom={13} style={{ width: '100%', height: '100%' }} scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapFit points={latestPts.length > 0 ? latestPts : null} />

      {/* Route polylines for all employees */}
      {latestLocations.map(emp => {
        const route = (routesByEmployee[emp.employee_id] || []).map(p => [p.lat, p.lng]);
        if (route.length < 2) return null;
        return (
          <Polyline
            key={`route-${emp.employee_id}`}
            positions={route}
            pathOptions={{ color: EMP_COLORS[emp.employee_id] || '#999', weight: 3, opacity: 0.65 }}
          />
        );
      })}

      {/* Latest location markers with employee number */}
      {latestLocations.map(emp => (
        <Marker
          key={`m-${emp.employee_id}`}
          position={[parseFloat(emp.latitude), parseFloat(emp.longitude)]}
          icon={makeIcon(EMP_COLORS[emp.employee_id] || '#999', emp.employee_id, 22)}
        >
          <Popup>
            <strong>#{emp.employee_id} — {emp.employee_name}</strong><br />
            <em style={{ fontSize: '12px', color: '#4a5568' }}>{emp.place_name}</em><br />
            <span style={{
              display: 'inline-block', marginTop: '3px', padding: '1px 8px',
              borderRadius: '20px', fontSize: '11px', fontWeight: 700,
              background: emp.productivity === 'Productive' ? '#c6f6d5' : '#fed7d7',
              color:      emp.productivity === 'Productive' ? '#22543d' : '#742a2a',
            }}>
              {emp.productivity}
            </span><br />
            <small>Lat: {parseFloat(emp.latitude).toFixed(6)}</small><br />
            <small>Lng: {parseFloat(emp.longitude).toFixed(6)}</small><br />
            <small style={{ color: '#718096' }}>{fmt(emp.recorded_at)}</small>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
