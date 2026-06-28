-- Create artists table
CREATE TABLE IF NOT EXISTS artists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    bio TEXT,
    photo_r2_key TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Add assigned_artist_id to bookings
ALTER TABLE bookings ADD COLUMN assigned_artist_id INTEGER REFERENCES artists(id);

-- Add some default artists (optional, for testing)
INSERT INTO artists (name, bio, is_active) VALUES ('Aakriti', 'Founder and Lead Artist', 1);
