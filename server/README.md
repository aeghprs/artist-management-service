# Artist Management System - Server

A robust RESTful API backend for managing artists, users, and music albums. Built with Node.js, Express, TypeScript, and PostgreSQL.

## Features

- **User Management**: Create, read, update, delete users with role-based access control (RBAC)
- **Artist Management**: Register artists, bulk import and export artists from CSV
- **Music Management**: Manage songs with genre categorization
- **Authentication**: JWT-based authentication with access and refresh tokens
- **File Upload**: Support for CSV file uploads for bulk artist registration
- **Data Validation**: Zod schema validation for request bodies
- **Role-Based Access**: Three user roles - `super_admin`, `artist_manager`, `artist`

## Tech Stack

- **Runtime**: Node.js (v20.x)
- **Language**: TypeScript (v5.3.3)
- **Framework**: Express.js (v4.18.2)
- **Database**: PostgreSQL (v15.x)
- **ORM/Query**: pg (v8.11.3) - Raw SQL queries
- **Validation**: Zod (v3.22.4)
- **Authentication**: JWT (jsonwebtoken v9.0.3)
- **Password Hashing**: bcryptjs (v3.0.3)
- **File Handling**: Multer (v2.0.2), csv-parser (v3.2.0)
- **Data Export**: json2csv (v6.0.0-alpha.2)

## Project Structure

```
src/
├── config/                 # Configuration files
│   ├── db.ts             # Database connection
│   ├── schema.sql        # SQL schema definitions
│   └── setup-db.ts      # Database setup script
├── controller/            # Route controllers
│   ├── artist.controller.ts
│   ├── artistBatch.controller.ts
│   ├── auth.controller.ts
│   ├── music.controller.ts
│   └── user.controller.ts
├── middlewares/           # Express middlewares
│   ├── auth.middleware.ts
│   ├── multer.upload.ts
│   ├── validate.batchArtists.ts
│   ├── validateQueryParams.ts
│   └── validateRequest.ts
├── routes/               # API route definitions
│   ├── artist.routes.ts
│   ├── auth.routes.ts
│   ├── music.routes.ts
│   └── user.routes.ts
├── schemas/              # Zod validation schemas
│   ├── artist.schema.ts
│   ├── auth.schemas.ts
│   └── music.schema.ts
├── services/             # Business logic layer
│   ├── artist.services.ts
│   ├── artistBatch.services.ts
│   ├── auth.services.ts
│   ├── music.services.ts
│   └── user.services.ts
├── types/                # TypeScript type definitions
│   ├── artist.types.ts
│   ├── music.types.ts
│   ├── pagination.types.ts
│   └── user.types.ts
├── utils/                # Utility functions
│   ├── errorHandler.ts
│   ├── formatDate.ts
│   ├── transformArtist.ts
│   └── validateBatchArtists.ts
├── app.ts               # Express app configuration
└── server.ts            # Server entry point
```

## Getting Started

### Prerequisites

- Node.js (v20.x or higher)
- PostgreSQL (v15.x or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd artist-management-system/server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=artist_management
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# JWT Expiration (hardCoded in project)
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=1d
```

### Running the Application

1. **Setup the database** (creates database):

   ```bash
   npm run setup
   ```

2. **Start the development server**: (creates tables and runs dev server)

   ```bash
   npm run dev
   ```

Make sure the PostgreSQL database is created and accessible before running the server

The server will start on `http://localhost:3001` or on port as defined, ensure same port is used in frontend

## API Endpoints

### Authentication

| Method | Endpoint         | Description          | Access        |
| ------ | ---------------- | -------------------- | ------------- |
| POST   | `/auth/register` | Register a new user  | Public        |
| POST   | `/auth/login`    | Login user           | Public        |
| POST   | `/auth/refresh`  | Refresh access token | Public        |
| GET    | `/auth/me`       | Get current user     | Authenticated |

### Users

| Method | Endpoint                   | Description                                                                                        | Access                      |
| ------ | -------------------------- | -------------------------------------------------------------------------------------------------- | --------------------------- |
| GET    | `/users`                   | Get all users (paginated)                                                                          | super_admin                 |
| POST   | `/users/new`               | Creates new user                                                                                   | super_admin                 |
| PUT    | `/users/:id`               | Update user                                                                                        | super_admin                 |
| DELETE | `/users/:id`               | Delete user                                                                                        | super_admin                 |
| GET    | `/users/getUsersForArtist` | Gets active users with artist role to associate artists and users those are not already associated | artist_manager |

### Artists

| Method | Endpoint         | Description                  | Access                      |
| ------ | ---------------- | ---------------------------- | --------------------------- |
| POST   | `/artist/new`    | Create new artist            | artist_manager              |
| GET    | `/artist`        | Get all artists (paginated)  | artist_manager, super_admin |
| PUT    | `/artist/:id`    | Update artist                | artist_manager              |
| DELETE | `/artist/:id`    | Delete artist                | artist_manager              |
| POST   | `/artist/import` | Bulk create artists from CSV | artist_manager              |
| GET    | `/artist/export` | Export artists as CSV        | artist_manager              |

### Music

| Method | Endpoint                  | Description               | Access                 |
| ------ | ------------------------- | ------------------------- | ---------------------- |
| POST   | `/songs/artist/:artistId` | Create new song           | artist                 |
| GET    | `/songs/artist/:artistId` | Get all songs (paginated) | artist, artist_manager |
| PUT    | `/songs/:id`              | Update song               | artist                 |
| DELETE | `/songs/:id`              | Delete song               | artist                 |

## Database Schema

### Users Table

```sql
users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    dob DATE NOT NULL,
    gender gender_type DEFAULT 'o',
    address VARCHAR(500) NOT NULL,
    role user_role_type DEFAULT 'artist',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)
```

### Artists Table

```sql
artists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    gender gender_type DEFAULT 'o',
    address VARCHAR(500) NOT NULL,
    first_release_year INTEGER NOT NULL,
    no_of_albums_released INTEGER DEFAULT 0,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)
```

### Songs Table

```sql
songs (
    id SERIAL PRIMARY KEY,
    artist_id INTEGER REFERENCES artists(id),
    title VARCHAR(255) NOT NULL,
    album_name VARCHAR(255) NOT NULL,
    genre genre_type NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)
```

### Enum Types

- **gender_type**: `'m'`, `'f'`, `'o'`
- **user_role_type**: `'super_admin'`, `'artist_manager'`, `'artist'`
- **genre_type**: `'rnb'`, `'country'`, `'classic'`, `'rock'`, `'jazz'`

## Middleware

### Auth Middleware

- `verifyJWT` - Verifies JWT access token
- `verifyAuthorizationRole` - Role-based access control

### Upload Middleware

- `upload` - Multer configuration for file uploads
- Handles CSV file uploads for batch artist registration

### Validation Middleware

- `validateRequest` - Zod schema validation
- `validateQueryParams` - Query parameter validation
- `validateBatchArtists` - Batch artist CSV validation

## Validation

Request validation is handled using **Zod** schemas:

- `auth.schemas.ts` - Authentication validation schemas
- `artist.schema.ts` - Artist validation schemas
- `music.schema.ts` - Music/song validation schemas

All endpoints require proper authentication unless otherwise specified. The API uses JWT tokens for stateless authentication.
