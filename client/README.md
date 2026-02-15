# Artist Management System (AMS) - Client

A modern web application for managing artists, songs, and users in the music industry. Built with **React**, **TypeScript**, **Vite**, and **Mantine UI**.

## 📋 Prerequisites

Before running the project, ensure you have:

- **Node.js** (v20 or higher)
- **npm**
- A running backend API (see the server README for setup instructions)

## 🏃‍♂️ Installation & Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd artist-management-system/client

   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```env
   VITE_API_URL=http://localhost:3000
   ```

   Replace `http://localhost:3000` with your actual backend API URL with port that you have used.

4. **Start the development server**
   ```bash
   npm run dev
   ```

The client will start on `http://localhost:5173`

## 📁 Project Structure

```
client/
├── public/                  # Static assets
├── src/
│   ├── api/                 # API service functions
│   │   ├── api.ts          # Axios configuration & interceptors
│   │   ├── artists.api.ts  # Artist-related API calls
│   │   ├── auth.api.ts     # Authentication API calls
│   │   └── user.api.ts     # User-related API calls
│   ├── components/         # Reusable UI components
│   │   ├── artist/        # Artist-specific components
│   │   ├── modal/         # Modal components
│   │   ├── routes/        # Route protection components
│   │   ├── skeleton/      # Loading skeleton components
│   │   ├── songs/         # Song-related components
│   │   ├── ui/            # Base UI components
│   │   └── users/         # User-specific components
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx # Authentication context
│   ├── constant/          # Constants and configurations
│   ├── hook/              # Custom React hooks
│   ├── layout/            # Layout components
│   ├── pages/             # Page components
│   ├── schema/            # Zod validation schemas
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── eslint.config.js
```

## 🔗 API Endpoints

The client expects the following backend endpoints:

| Method | Endpoint                   | Description               | Access                              |
| ------ | -------------------------- | ------------------------- | ----------------------------------- |
| POST   | `/auth/login`              | User login                | Public                              |
| POST   | `/auth/register`           | User registration         | Public                              |
| POST   | `/auth/refresh`            | Refresh access token      | Public                              |
| GET    | `/auth/me`                 | Get current user          | Protected                           |
| GET    | `/users`                   | List all users            | Super Admin                         |
| POST   | `/users/new`               | Create new user           | Super Admin                         |
| PUT    | `/users/:id`               | Update user               | Super Admin                         |
| DELETE | `/users/:id`               | Delete user               | Super Admin                         |
| GET    | `/artist`                  | List all artists          | Artist Manager, Super Admin         |
| POST   | `/artist/new`              | Create new artist         | Artist Manager                      |
| PUT    | `/artist/:id`              | Update artist             | Artist Manager                      |
| DELETE | `/artist/:id`              | Delete artist             | Artist Manager                      |
| GET    | `/artist/export`           | Export artist csv         | Artist Manager                      |
| POST   | `/artist/import`           | Import artist csv         | Artist Manager                      |
| GET    | `/users/getUsersForArtist` | Get users for artist role | Artist Manager                      |
| GET    | `/songs/artist/:id`        | Get songs by artist       | Artist Manager, Artist, Super Admin |
| POST   | `/songs/artist/:id`        | Create new song by artist | Artist                              |
| PUT    | `/songs/:id`               | Get songs by artist       | Artist                              |
| DELETE | `/songs/:id`               | Get songs by artist       | Artist                              |

## 🎯 Key Features Details

### Token Refresh Mechanism

The application automatically handles JWT token expiration:

- Intercepts 401 responses
- Attempts to refresh using the refresh token
- Stores new tokens in localStorage
- Retries the original request

### Form Validation

All forms use Zod schemas with Mantine Form integration:

- Real-time validation feedback
- Type-safe form handling
- Error messages displayed inline

### Authentication Issues, IF ANY

- Clear browser localStorage
- Check that the API URL is correct in your `.env` file
- Ensure the backend server is running
