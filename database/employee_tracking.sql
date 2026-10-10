-- ============================================================
-- Employee Tracking System - MySQL Database Script
-- Database: employee_tracking | MySQL 8.0+
-- UPDATED: Added place_name and productivity columns
-- ============================================================

CREATE DATABASE IF NOT EXISTS employee_tracking
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE employee_tracking;

SET SESSION cte_max_recursion_depth = 500;

-- Safe reset: only drops tables inside employee_tracking
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS users;

-- users table
CREATE TABLE users (
  id   INT          NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- locations table with place_name and productivity
CREATE TABLE locations (
  id           INT            NOT NULL AUTO_INCREMENT,
  user_id      INT            NOT NULL,
  latitude     DECIMAL(10,7)  NOT NULL,
  longitude    DECIMAL(10,7)  NOT NULL,
  recorded_at  DATETIME       NOT NULL,
  place_name   VARCHAR(200)   NOT NULL DEFAULT 'Unknown Location',
  productivity ENUM('Productive','Non-Productive') NOT NULL DEFAULT 'Productive',
  PRIMARY KEY (id),
  CONSTRAINT fk_locations_users
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_user_recorded (user_id, recorded_at),
  INDEX idx_productivity  (user_id, productivity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Five employees
INSERT INTO users (name) VALUES
  ('Arun'), ('Priya'), ('Karthik'), ('Divya'), ('Sanjay');

-- ------------------------------------------------
-- Employee 1: Arun | Gandhipuram -> RS Puram
-- ~67 Productive, ~33 Non-Productive
-- ------------------------------------------------
INSERT INTO locations (user_id, latitude, longitude, recorded_at, place_name, productivity)
WITH RECURSIVE nums AS (
  SELECT 0 AS n UNION ALL SELECT n+1 FROM nums WHERE n < 99
)
SELECT
  1,
  ROUND(11.0168 - (n * 0.0004), 7),
  ROUND(76.9558 - (n * 0.0003) + (n % 5) * 0.00005, 7),
  DATE_ADD('2024-01-15 08:00:00', INTERVAL n MINUTE),
  CASE n % 10
    WHEN 0 THEN 'Gandhipuram Bus Stand'
    WHEN 1 THEN 'Big Bazaar Street'
    WHEN 2 THEN 'Cross Cut Road Junction'
    WHEN 3 THEN 'Oppanakara Street'
    WHEN 4 THEN 'Raja Street'
    WHEN 5 THEN 'Lakshmi Mills Junction'
    WHEN 6 THEN 'DB Road'
    WHEN 7 THEN 'Selvapuram Main Road'
    WHEN 8 THEN 'RS Puram Market'
    ELSE        'Mettupalayam Road'
  END,
  CASE WHEN n % 3 = 2 THEN 'Non-Productive' ELSE 'Productive' END
FROM nums;

-- ------------------------------------------------
-- Employee 2: Priya | Peelamedu -> Saravanampatti
-- ------------------------------------------------
INSERT INTO locations (user_id, latitude, longitude, recorded_at, place_name, productivity)
WITH RECURSIVE nums AS (
  SELECT 0 AS n UNION ALL SELECT n+1 FROM nums WHERE n < 99
)
SELECT
  2,
  ROUND(11.0178 + (n * 0.0005), 7),
  ROUND(77.0283 + (n * 0.0004) + (n % 4) * 0.00006, 7),
  DATE_ADD('2024-01-15 08:00:00', INTERVAL n MINUTE),
  CASE n % 10
    WHEN 0 THEN 'Peelamedu Junction'
    WHEN 1 THEN 'Avinashi Road Signal'
    WHEN 2 THEN 'Nava India Complex'
    WHEN 3 THEN 'Hopes College Stop'
    WHEN 4 THEN 'Kovaipudur Road'
    WHEN 5 THEN 'Saravanampatti Main Road'
    WHEN 6 THEN 'Kalapatti Road'
    WHEN 7 THEN 'NGGO Colony'
    WHEN 8 THEN 'IT Corridor Stop'
    ELSE        'Saravanampatti Bus Stand'
  END,
  CASE WHEN n % 4 = 3 THEN 'Non-Productive' ELSE 'Productive' END
FROM nums;

-- ------------------------------------------------
-- Employee 3: Karthik | Singanallur -> Ukkadam
-- ------------------------------------------------
INSERT INTO locations (user_id, latitude, longitude, recorded_at, place_name, productivity)
WITH RECURSIVE nums AS (
  SELECT 0 AS n UNION ALL SELECT n+1 FROM nums WHERE n < 99
)
SELECT
  3,
  ROUND(10.9986 + (n * 0.0004), 7),
  ROUND(77.0183 - (n * 0.0005) + (n % 3) * 0.00007, 7),
  DATE_ADD('2024-01-15 08:00:00', INTERVAL n MINUTE),
  CASE n % 10
    WHEN 0 THEN 'Singanallur Bus Stand'
    WHEN 1 THEN 'Airport Road Junction'
    WHEN 2 THEN 'Neelambar Street'
    WHEN 3 THEN 'Kurichi Junction'
    WHEN 4 THEN 'Ukkadam Market'
    WHEN 5 THEN 'Puliakulam Road'
    WHEN 6 THEN 'Keeranatham Road'
    WHEN 7 THEN 'Ganapathy Main Road'
    WHEN 8 THEN 'Town Hall Area'
    ELSE        'Sulur Bus Stand'
  END,
  CASE WHEN n % 3 = 1 THEN 'Non-Productive' ELSE 'Productive' END
FROM nums;

-- ------------------------------------------------
-- Employee 4: Divya | Race Course -> Saibaba Colony
-- ------------------------------------------------
INSERT INTO locations (user_id, latitude, longitude, recorded_at, place_name, productivity)
WITH RECURSIVE nums AS (
  SELECT 0 AS n UNION ALL SELECT n+1 FROM nums WHERE n < 99
)
SELECT
  4,
  ROUND(11.0074 + (n * 0.0006), 7),
  ROUND(76.9637 + (n * 0.0001) + (n % 6) * 0.00004, 7),
  DATE_ADD('2024-01-15 08:00:00', INTERVAL n MINUTE),
  CASE n % 10
    WHEN 0 THEN 'Race Course Road'
    WHEN 1 THEN 'Raj Complex'
    WHEN 2 THEN 'Tatabad Main Road'
    WHEN 3 THEN 'Saibaba Colony 4th Street'
    WHEN 4 THEN 'Collector Office Road'
    WHEN 5 THEN 'NSR Road Junction'
    WHEN 6 THEN 'Bharathi Park'
    WHEN 7 THEN 'Ayyasamy Kovil Street'
    WHEN 8 THEN 'Gandhipuram West'
    ELSE        'Perianaicker Palayam'
  END,
  CASE WHEN n % 5 = 4 THEN 'Non-Productive' ELSE 'Productive' END
FROM nums;

-- ------------------------------------------------
-- Employee 5: Sanjay | Town Hall -> Avinashi Road
-- ------------------------------------------------
INSERT INTO locations (user_id, latitude, longitude, recorded_at, place_name, productivity)
WITH RECURSIVE nums AS (
  SELECT 0 AS n UNION ALL SELECT n+1 FROM nums WHERE n < 99
)
SELECT
  5,
  ROUND(11.0018 + (n * 0.0002), 7),
  ROUND(76.9674 + (n * 0.0007) + (n % 7) * 0.00005, 7),
  DATE_ADD('2024-01-15 08:00:00', INTERVAL n MINUTE),
  CASE n % 10
    WHEN 0 THEN 'Town Hall'
    WHEN 1 THEN 'Uppilipalayam Road'
    WHEN 2 THEN 'Trichy Road Junction'
    WHEN 3 THEN 'Ondipudur Main Road'
    WHEN 4 THEN 'Kalapatti Road Junction'
    WHEN 5 THEN 'Avinashi Road Flyover'
    WHEN 6 THEN 'CODISSIA Trade Fair'
    WHEN 7 THEN 'Vilankurichi Road'
    WHEN 8 THEN 'Goldwins Junction'
    ELSE        'Neelambur Junction'
  END,
  CASE WHEN n % 3 = 0 THEN 'Non-Productive' ELSE 'Productive' END
FROM nums;

-- ============================================================
-- VALIDATION QUERIES
-- ============================================================

-- A: All employees
SELECT * FROM users;

-- B: Count + productivity per employee (expect 100 each)
SELECT
  u.id, u.name,
  COUNT(l.id)                            AS total_locations,
  SUM(l.productivity = 'Productive')     AS productive,
  SUM(l.productivity = 'Non-Productive') AS non_productive
FROM users u
LEFT JOIN locations l ON u.id = l.user_id
GROUP BY u.id, u.name
ORDER BY u.id;

-- C: Total (expect 500)
SELECT COUNT(*) AS total_locations FROM locations;

-- D: Productivity breakdown
SELECT productivity, COUNT(*) AS count FROM locations GROUP BY productivity;

-- E: Full history (500 rows)
SELECT u.id AS employee_id, u.name, l.id AS location_id,
  l.place_name, l.productivity, l.latitude, l.longitude, l.recorded_at
FROM users u JOIN locations l ON u.id = l.user_id
ORDER BY u.id, l.recorded_at;

-- F: Latest location per employee with productivity
SELECT u.id AS employee_id, u.name,
  l.latitude, l.longitude, l.place_name, l.productivity, l.recorded_at
FROM users u
JOIN (
  SELECT user_id, latitude, longitude, recorded_at, place_name, productivity,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY recorded_at DESC, id DESC) AS rn
  FROM locations
) l ON u.id = l.user_id AND l.rn = 1
ORDER BY u.id;
