CREATE TABLE trips (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  destination   TEXT NOT NULL,
  start_date    TEXT NOT NULL,
  end_date      TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'planning',
  cover_image_url TEXT,
  map_url       TEXT,
  attachment_url TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE members (
  id      TEXT PRIMARY KEY,
  trip_id TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  name    TEXT NOT NULL
);

CREATE TABLE itineraries (
  id            TEXT PRIMARY KEY,
  trip_id       TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  date          TEXT NOT NULL,
  start_time    TEXT,
  end_time      TEXT,
  title         TEXT NOT NULL,
  memo          TEXT,
  cost          INTEGER,
  cost_currency TEXT NOT NULL DEFAULT 'JPY',
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE accommodations (
  id             TEXT PRIMARY KEY,
  trip_id        TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  check_in       TEXT NOT NULL,
  check_out      TEXT NOT NULL,
  address        TEXT,
  url            TEXT,
  memo           TEXT,
  attachment_url TEXT
);

CREATE TABLE notes (
  id         TEXT PRIMARY KEY,
  trip_id    TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  text       TEXT NOT NULL,
  type       TEXT NOT NULL DEFAULT 'task',
  completed  INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE expenses (
  id                TEXT PRIMARY KEY,
  trip_id           TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  amount            INTEGER NOT NULL,
  currency          TEXT NOT NULL DEFAULT 'JPY',
  paid_by_member_id TEXT NOT NULL REFERENCES members(id),
  memo              TEXT,
  date              TEXT NOT NULL,
  created_at        TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE expense_splits (
  id         TEXT PRIMARY KEY,
  expense_id TEXT NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
  member_id  TEXT NOT NULL REFERENCES members(id),
  amount     INTEGER NOT NULL
);

CREATE TABLE album_links (
  id         TEXT PRIMARY KEY,
  trip_id    TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  url        TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);