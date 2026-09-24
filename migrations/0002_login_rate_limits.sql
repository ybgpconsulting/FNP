CREATE TABLE IF NOT EXISTS login_rate_limits (
  key TEXT PRIMARY KEY,
  window_started_at INTEGER NOT NULL,
  failures INTEGER NOT NULL DEFAULT 0
);