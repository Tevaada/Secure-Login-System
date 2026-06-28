# SecureLogin

SecureLogin is a simple authentication system built with HTML, CSS, JavaScript,
Node.js, Express, SQLite, bcrypt, and JWT cookies.

It supports user registration, login, protected dashboard access, and logout.

## Features

- Create a new user account
- Login with email and password
- Store users in a local SQLite database
- Hash passwords with bcrypt
- Save authentication with an HTTP-only JWT cookie
- Protect dashboard data with `/api/me`
- Logout and clear the session cookie

## Tech Stack

| Part | Technology |
| --- | --- |
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express |
| Database | SQLite |
| Password Security | bcrypt |
| Authentication | JSON Web Token |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the server

```bash
npm start
```

### 3. Open the app

```text
http://localhost:3000
```

The SQLite database is created automatically inside the `data` folder when the
server starts.

## API Routes

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/api/register` | Register a new user |
| `POST` | `/api/login` | Login and create a session cookie |
| `GET` | `/api/me` | Get the logged-in user's profile |
| `POST` | `/api/logout` | Logout and clear the cookie |

## Environment Variables

| Variable | Description | Default |
| --- | --- | --- |
| `PORT` | Server port | `3000` |
| `JWT_SECRET` | Secret key for signing JWT cookies | Development fallback |

For a real deployment, set your own `JWT_SECRET`.

## Project Structure

```text
secure-login-system/
├── data/
│   └── .gitkeep
├── public/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
├── db.js
├── server.js
├── package.json
├── package-lock.json
└── README.md
```

## Notes

- Passwords are never stored as plain text.
- The login token is stored in an HTTP-only cookie.
- `data/users.db` is ignored by Git because it is generated locally.
