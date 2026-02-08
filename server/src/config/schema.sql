-- Artist Management System Database Schema
-- This schema will be auto-executed on server startup if tables don't exist

-- Create ENUM types for PostgreSQL (only if they don't exist)
DO $$ BEGIN
    CREATE TYPE gender_type AS ENUM ('m', 'f', 'o');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM ('super_admin', 'artist_manager', 'artist');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE genre_type AS ENUM ('rnb', 'country', 'classic', 'rock', 'jazz');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- User Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    dob DATE,
    gender gender_type DEFAULT 'o',
    address VARCHAR(500),
    role user_role_type NOT NULL DEFAULT 'artist',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email and role (only if they don't exist)
DO $$ BEGIN
    CREATE INDEX idx_users_email ON users(email);
EXCEPTION
    WHEN duplicate_table THEN null;
END $$;

DO $$ BEGIN
    CREATE INDEX idx_users_role ON users(role);
EXCEPTION
    WHEN duplicate_table THEN null;
END $$;

-- Refresh Tokens Table
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create index on refresh tokens
DO $$ BEGIN
    CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
EXCEPTION
    WHEN duplicate_table THEN null;
END $$;

DO $$ BEGIN
    CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
EXCEPTION
    WHEN duplicate_table THEN null;
END $$;

-- Artist Table
CREATE TABLE IF NOT EXISTS artists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    dob DATE,
    gender gender_type DEFAULT 'o',
    address VARCHAR(500),
    first_release_year INTEGER,
    no_of_albums_released INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on artist name
DO $$ BEGIN
    CREATE INDEX idx_artists_name ON artists(name);
EXCEPTION
    WHEN duplicate_table THEN null;
END $$;

-- Song Table
CREATE TABLE IF NOT EXISTS songs (
    id SERIAL PRIMARY KEY,
    artist_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    album_name VARCHAR(255),
    genre genre_type NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
);

-- Create indexes on songs
DO $$ BEGIN
    CREATE INDEX idx_songs_artist_id ON songs(artist_id);
EXCEPTION
    WHEN duplicate_table THEN null;
END $$;

DO $$ BEGIN
    CREATE INDEX idx_songs_genre ON songs(genre);
EXCEPTION
    WHEN duplicate_table THEN null;
END $$;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at (drop if exists, then create)
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_artists_updated_at ON artists;
CREATE TRIGGER update_artists_updated_at BEFORE UPDATE ON artists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_songs_updated_at ON songs;
CREATE TRIGGER update_songs_updated_at BEFORE UPDATE ON songs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default super admin user (password: Admin@123)
-- Note: This is a bcrypt hash of "Admin@123"
INSERT INTO users (first_name, last_name, email, password, role, gender) 
VALUES ('Super', 'Admin', 'admin@admin.com', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGqhePb5DNJY8RQXfm1hzLC', 'super_admin', 'm')
ON CONFLICT (email) DO NOTHING;