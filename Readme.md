# Artist Management System (AMS) - Client

A modern web application for managing artists, songs, and users in the music industry. Built with React, TypeScript, Vite, and Mantine UI.

## 🚀 Features

### 🔐 Authentication & Authorization

- **Login/Register System** - Secure user authentication
- **JWT-based Authentication** - Token-based security with refresh mechanism
- **Role-Based Access Control (RBAC)** - Three user roles:
  - `super_admin`
  - `artist_manager`
  - `artist`

### 👥 User Management (Super Admin) (/users)

- Skeleton loading
- View all users in a paginated table (super_admin user)
- Add new users with role assignment (super_admin, Add User btn, opens modal, validation for fields)
- Edit existing user details (super_admin, table action - pencil icon, opens update modal, validation for fields)
- Delete users (super_admin, table action - trash icon, opens confirmation modal, confirm btn soft deletes user)

### 🎤 Artist Management (Super Admin(Limited), Artist Manager) (/artists)

- Skeleton loading
- View all artists in a paginated table (super_admin and artist_manager)
- Add new artists with user association (artist_manager, Add artist btn, visible for artist_manager only, opens modal, validation for fields)
- Edit artist information (artist_manager,table action - pencil icon, visible for artist_manager only, opens modal, validation for fields)
- Delete artists (with cascade warning for associated songs) (artist_manager,table action - trash icon, visible for artist_manager only, opens confirmation modal)
- Batch upload artists via CSV input (artist_manager, Import btn, select sample file, validated in backend)
- Export artists data to CSV (artist_manager, Export btn, downloads file)
- View artist's songs (artist_manager, super_admin, table action - music icon)

### 🎵 Song Management (Artist) (/songs)

- Skeleton loading
- View all songs in a paginated table (artist user)
- Add new songs with role assignment (artist, Add Song btn, opens modal, validation for fields)
- Edit existing song details (artist, table action - pencil icon, opens update modal, validation for fields)
- Delete song (artist, table action - trash icon, opens confirmation modal, confirm btn soft deletes user)
- Redirect to Artist association required page for user with unassociated artists

### 📊 Dashboard

- Quick profile
- Dummy stats

### 🎨 UI/UX Features

- Modern, responsive design with Mantine UI
- Loading skeletons for better UX
- Toast notifications for actions
- Form validation using Zod schemas
- Pagination for large datasets
- Modal-based add/edit/delete operations

## 🛠️ Tech Stack

- **Frontend Framework**: React
- **Language**: TypeScript
- **Build Tool**: Vite
- **UI Library**: Mantine UI
- **State Management**: TanStack React Query v5
- **Routing**: React Router DOM v7
- **Form Handling**: Mantine Form with Zod resolver
- **HTTP Client**: Axios and React Query
- **Validation**: Zod
- **Icons**: Tabler Icons
- **Styling**: Tailwind CSS v4

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

## 🔐 Role Permissions

| Feature              | Super Admin         | Artist Manager | Artist |
| -------------------- | ------------------- | -------------- | ------ |
| Dashboard            | ✅                  | ✅             | ✅     |
| User Management      | ✅                  | ❌             | ❌     |
| Artist Management    | ✅ (Limited Action) | ✅             | ❌     |
| View Songs by Artist | ✅                  | ✅             | ❌     |
| Manage Own Songs     | ❌                  | ❌             | ✅     |

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

# Project Setup

Please follow both the **client** and **server** README files to properly run the project.

## Steps

1. **Server**
   - Navigate to the server folder.
   - Follow the instructions in `Readme.md` to install dependencies, configure environment variables, and start the server.

2. **Client**
   - Navigate to the client folder.
   - Follow the instructions in `Readme.md` to install dependencies and start the development server.

> ⚠️ Make sure both the client and server are running to use the application properly.

### Minor Hiccup (Sorry for inconveniences)

- When importing artists via batch import, the user_id field is required. Regular users may not know this value, so developers will need to obtain it by visiting the /users/getUsersForArtist API on the artists page. This endpoint returns users who have artist roles and are not yet associated with any artists.

- Please ensure all fields are necessary, user_id values should be active in system and should not be associated with others artists 

- Please find sample csv file in below path:

```bash
artist-management-system/server/src/sample/sample-artists.csv
```
