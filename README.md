# 📍 Employee Location Tracking System

A full-stack web application that displays five employees and their simulated location histories on an interactive map of **Coimbatore, Tamil Nadu, India**.

> **Scope:** This version uses simulated historical location data stored in MySQL. It is designed so real-time GPS integration can be added in a later phase.

---

## 🗂️ Project Structure

```
employee-tracking/
│
├── database/
│   └── employee_tracking.sql     ← Run this in MySQL Workbench first
│
├── backend/
│   ├── server.js                 ← Express entry point
│   ├── db.js                     ← MySQL connection pool
│   ├── package.json
│   ├── .env.example              ← Copy to .env and fill in credentials
│   ├── routes/
│   │   ├── users.js
│   │   ├── locations.js
│   │   └── dashboard.js
│   └── controllers/
│       ├── usersController.js
│       ├── locationsController.js
│       └── dashboardController.js
│
├── frontend/
│   ├── app/
│   │   ├── page.js               ← Main dashboard page
│   │   ├── layout.js
│   │   └── globals.css
│   ├── components/
│   │   ├── EmployeeMap.js        ← Leaflet map (dynamically loaded, SSR off)
│   │   ├── EmployeeList.js       ← Sidebar employee list
│   │   ├── DashboardStats.js     ← Summary cards
│   │   └── LocationHistory.js    ← Location history table
│   ├── package.json
│   └── .env.local.example        ← Copy to .env.local
│
└── README.md
```

---

## 🛠️ Technology Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | Next.js 14, React 18                |
| Map      | Leaflet.js + React-Leaflet          |
| Tiles    | OpenStreetMap                       |
| Backend  | Node.js + Express.js                |
| Database | MySQL 8.0+                          |
| DB Tool  | MySQL Workbench                     |
| Driver   | mysql2                              |

---

## 📊 Database Schema

### Table: `users`
| Column | Type         | Notes              |
|--------|--------------|--------------------|
| id     | INT          | PK, AUTO_INCREMENT |
| name   | VARCHAR(100) | NOT NULL           |

### Table: `locations`
| Column      | Type          | Notes                                 |
|-------------|---------------|---------------------------------------|
| id          | INT           | PK, AUTO_INCREMENT                    |
| user_id     | INT           | FK → users.id (named `fk_locations_users`) |
| latitude    | DECIMAL(10,7) | NOT NULL                              |
| longitude   | DECIMAL(10,7) | NOT NULL                              |
| recorded_at | DATETIME      | NOT NULL                              |

### Sample Data
| Employee | Route                       | Records |
|----------|-----------------------------|---------|
| Arun     | Gandhipuram → RS Puram      | 100     |
| Priya    | Peelamedu → Saravanampatti  | 100     |
| Karthik  | Singanallur → Ukkadam       | 100     |
| Divya    | Race Course → Saibaba Colony| 100     |
| Sanjay   | Town Hall → Avinashi Road   | 100     |
| **Total**|                             | **500** |

## ⚡ Quick Start (1-Click Run on Windows)

Once prerequisites and `.env` are configured, you can start both the backend and frontend at the same time:
- **Double click `start.bat`** in the project root directory.
- It will open two console windows (one for backend on port 5000, one for frontend on port 3000).
- Open **http://localhost:3000** in your browser!

> 💡 **Why did `localhost:300 Refused to connect` happen?**
> When you close Antigravity / your IDE or shut down your computer, the Node.js background processes terminate. Localhost is only accessible while the local servers (`node server.js` and `npm run dev`) are running on your machine. Simply run `start.bat` (or use the terminal commands below) whenever you want to reopen the site!

---

## ⚙️ Installation — Step-by-Step (Windows)

### Prerequisites
- [Node.js 18+](https://nodejs.org/) (includes npm)
- [MySQL 8.0+](https://dev.mysql.com/downloads/mysql/) + [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)
- A terminal — use **VS Code's integrated terminal** or PowerShell

---

### Step 1 — Create the Database

1. Open **MySQL Workbench** and connect to your local MySQL server.
2. Click **File → Open SQL Script** and open `database/employee_tracking.sql`.
3. Click the ⚡ **Execute** button (or press `Ctrl+Shift+Enter`).
4. Scroll to the bottom of the output pane and confirm:
   - **5 employees** in the `users` table.
   - **500 records** in the `locations` table.

> **To reset sample data** (safe rerun): The SQL script starts with `DROP TABLE IF EXISTS locations; DROP TABLE IF EXISTS users;` which only affects tables inside the `employee_tracking` database. You can safely rerun it any time during development without touching other databases.

---

### Step 2 — Configure and Start the Backend

Open a **new terminal** window in the `backend` folder:

```powershell
# In VS Code: right-click the backend folder → Open in Integrated Terminal

# 1. Install dependencies
npm install

# 2. Create the .env file from the example
copy .env.example .env
```

Open `.env` in a text editor and fill in your MySQL credentials:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_actual_mysql_password
DB_NAME=employee_tracking
PORT=5000
FRONTEND_URL=http://localhost:3000
```

Start the backend:

```powershell
npm start
# or for auto-restart on file changes:
npm run dev
```

You should see:
```
✅ MySQL connected successfully
🚀 Backend running at http://localhost:5000
```

Test endpoints in your browser or Postman:

| Endpoint | URL |
|----------|-----|
| Health | http://localhost:5000/api/health |
| All employees | http://localhost:5000/api/users |
| All locations | http://localhost:5000/api/locations |
| Latest location per employee | http://localhost:5000/api/locations/latest |
| Employee 1 history | http://localhost:5000/api/locations/1 |
| Dashboard stats | http://localhost:5000/api/dashboard/stats |

---

### Step 3 — Configure and Start the Frontend

Open a **second terminal** window in the `frontend` folder:

```powershell
# In VS Code: right-click the frontend folder → Open in Integrated Terminal

# 1. Install dependencies
npm install

# 2. Create the .env.local file from the example
copy .env.local.example .env.local
```

The `.env.local` file should contain:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend:

```powershell
npm run dev
```

You should see:
```
▲ Next.js 14.x.x
- Local: http://localhost:3000
```

Open your browser at **http://localhost:3000** — the dashboard will load.

---

## 🗺️ Using the Dashboard

- **Top cards** show total employees, total location records, and employees with locations.
- **Sidebar** lists all five employees with their latest coordinates and timestamp.
- **Map** shows each employee's route as a colored polyline and their latest position as a colored dot marker.
- Click a marker to see the employee's name, coordinates, and timestamp in a popup.
- Click an employee in the sidebar to **filter** the map to show only their route.
- A **Location History table** appears below the map showing all 100 records for the selected employee.
- Click **Show All Employees** to return to the full view.

---

## 🐛 Troubleshooting

### MySQL connection refused
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Fix:** MySQL server is not running. Open MySQL Workbench → Navigator → click the green ▶ button to start the server, or run:
```powershell
net start MySQL80
```

### Wrong MySQL credentials
```
Error: Access denied for user 'root'@'localhost'
```
**Fix:** Check `DB_USER` and `DB_PASSWORD` in `backend/.env`. Use the credentials you set when installing MySQL.

### MySQL on a different port
**Fix:** Change `DB_PORT` in `backend/.env` to match (e.g., `3307`).

### Missing npm packages
```
Error: Cannot find module 'express'
```
**Fix:** Run `npm install` inside the relevant directory (`backend/` or `frontend/`).

### CORS errors in the browser console
```
Access to fetch blocked by CORS policy
```
**Fix:** Check `FRONTEND_URL` in `backend/.env` is set to `http://localhost:3000` exactly, and restart the backend.

### API endpoints returning errors
Check the backend terminal for the full error. Common causes:
- `.env` file is missing — copy `.env.example` to `.env`
- Database not created — run the SQL script in MySQL Workbench first

### Empty location results
**Fix:** Run the SQL script again in MySQL Workbench. Use Query B and C to confirm 5 employees and 500 records.

### Incorrect foreign key relationship
**Fix:** Rerun `database/employee_tracking.sql`. The `DROP TABLE IF EXISTS` at the top clears everything and rebuilds correctly.

### Leaflet map not rendering / blank map
**Fix:** The map component uses a dynamic import with `ssr: false`. If you see a blank map:
1. Hard-refresh the browser (`Ctrl+Shift+R`).
2. Check the browser console for JavaScript errors.
3. Ensure `npm install` ran successfully in the `frontend/` folder (leaflet and react-leaflet must be installed).

### Markers not appearing
**Fix:** The map fetches markers from the backend API. Check that:
1. Backend is running on port 5000.
2. `NEXT_PUBLIC_API_URL` in `frontend/.env.local` is `http://localhost:5000/api`.
3. The locations table has data (run SQL validation Query B).

### Duplicate data when rerunning SQL
The script starts with `DROP TABLE IF EXISTS` which removes and recreates the tables, so rerunning always produces exactly 5 employees and 500 records — no duplicates.

---

## 📡 REST API Reference

### `GET /api/users`
Returns all 5 employees.
```json
[
  { "id": 1, "name": "Arun" },
  { "id": 2, "name": "Priya" }
]
```

### `GET /api/locations`
Returns all 500 location records joined with employee names.
```json
[
  {
    "location_id": 1,
    "employee_id": 1,
    "employee_name": "Arun",
    "latitude": "11.0168000",
    "longitude": "76.9558000",
    "recorded_at": "2024-01-15T08:00:00.000Z"
  }
]
```

### `GET /api/locations/latest`
Returns the most recent location for each of the 5 employees.

### `GET /api/locations/:userId`
Returns the employee's info and all 100 location records in chronological order.
```json
{
  "employee": { "id": 1, "name": "Arun" },
  "locations": [ ... ]
}
```
Returns `404` if the employee doesn't exist, `400` for an invalid ID.

### `GET /api/dashboard/stats`
```json
{
  "total_employees": 5,
  "total_locations": 500,
  "employees_with_locations": 5
}
```

---

## 🔒 Security Notes

- Database credentials are stored in `backend/.env` which must **never** be committed to git.
- The frontend only uses `NEXT_PUBLIC_API_URL` — it never sees the database password.
- All SQL queries use parameterized statements (no SQL injection risk).

---

## 🚀 Future Enhancements

- Add real-time GPS tracking via WebSockets or Server-Sent Events
- Add authentication (JWT)
- Add geofencing alerts
- Add date-range filtering for location history
- Export location history as CSV
