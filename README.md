# login system

This is a full-stack website for login. 

## features

This is a full-stack user authentication and management system with:

- Secure registration and login
- JWT-based access and refresh tokens
- Admin/user role management
- MySQL/Postgres/Mongodb any database
- separate admin and user frontends
- Cron jobs, token-based auth, and protected APIs

---

## 📦 Setup Instructions

Follow these steps to get started with the project:

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <your-repo-folder>
```

### 2. Create Environment File

Copy the sample file and fill it with appropriate values:

```bash
cp .env_sample .env
```

See [Environment Variables](#-environment-variables) below for detailed explanation.

### 3. Install Dependencies

```bash
npm install
```

### 4. Initialize the Database

```bash
node init-db_sql.js
```
or
```bash
node init-db_postgres.js
```
or 

For mongodb there is no need to create database

This sets up necessary tables in your MySQL DB.

### 5. Test APIs (Optional)

Navigate to `api_test` folder (or stay in root) and use curl commands listed below to test the APIs.

### 6. Build the Frontends

```bash
cd frontend/admin
npm run build

cd ../user
npm run build

cd ../..
```

### 7. Start the Server

```bash
npm run dev
```

---


## 🌐 API Endpoints

### 1. Register

```bash
curl -X POST http://localhost:3001/api/register   -H "Content-Type: application/json"   -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "password": "@yourPassword123",
    "username": "johndoe"
  }'
```

**Response:**
```json
{"message":"User registered successfully"}
```

### 2. LOGIN API

#### A. USING EMAIL

```bash
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "john.doe4@example.com",
    "password": "@yourPassword123"
  }'
```

**Response:**
```json
{"accessToken":"eyJhbGciOiJIUzI1NiIsInR5c","first_name":"John","last_name":"Doe"}

```

#### B. USING USERNAME

```bash
curl -X POST http://localhost:3001/api/login   -H "Content-Type: application/json"   -c cookies.txt   -d '{
    "username": "johndoe",
    "password": "@yourPassword123"
  }'
```

**Response:**
```json
{"accessToken":"eyJhbGciOiJIU","first_name":"John","last_name":"Doe"} 
```
### 3. REFRESH TOKEN

```bash
curl -X POST http://localhost:3001/api/refresh   -b cookies.txt
```

**Response:**
```json
{"accessToken":"eyJhbGciOiJIUzI1N"}
```

### 4. PASSWORD CHANGE

```bash
curl -X POST http://localhost:3001/api/change-password   -H "Authorization: Bearer eyJhbGciOi"   -H "Content-Type: application/json"   -d '{"old_password": "@yourPassword123", "new_password": "@@yourPassword123"}'      
```

**Response:**
```json
{"message":"Password change successful"}
```

### 5. CHANGE LEVEL

```bash
curl -X POST http://localhost:3001/api/admin-change-level   -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidG9rZW5fdmVyc2lvbiI6MSwiaWF0IjoxNzUxNzMxOTEyLCJleHAiOjE3NTE3MzU1MTJ9.XK6wMhA0BMqjhEU7nH97xnExBbNS4KaG4wyYkbuW9do"   -H "Content-Type: application/json"   -d '{"email": "john.doe@example.com", "level": "1"}'
```

**Response:**
```json
{"message":"Level changed successfully"}
```

### 6. SAMPLE PROTECTED API

```bash
curl -X POST http://localhost:3001/api/add   -H "Authorization: Bearer eyJwdwewdwd"   -H "Content-Type: application/json"   -d '{"a": 10, "b": 15}'
```

**Response:**
```json
{"sum":25}
```


| Variable                | Description                                                          |
| ----------------------- | -------------------------------------------------------------------- |
| `PORT`                  | Port on which the backend server will run (default: `3000`)          |
| `DB_HOST`               | Hostname of the database server (`localhost` for local development)  |
| `DB_USER`               | Database username                                                    |
| `DB_PASSWORD`           | Database password                                                    |
| `DB_NAME`               | Name of the database (`login_system`)                                |
| `ACCESS_TOKEN_SECRET`   | Secret key for signing access tokens                                 |
| `REFRESH_TOKEN_SECRET`  | Secret key for signing refresh tokens                                |
| `ACCESS_TOKEN_EXPIRY`   | Access token expiration time in ms (e.g., `3600000` = 1 hour)        |
| `REFRESH_TOKEN_EXPIRY`  | Refresh token expiration time in ms (e.g., `7200000` = 2 hours)      |
| `TOKEN_SECURE`          | Set `True` if cookies should only be sent over HTTPS                 |
| `MAX_LOGFILE_DURATION`  | How long logs are retained (e.g., `'14d'` = 14 days)                 |
| `FRONTEND_LINK`         | URL to the frontend application (default: `'http://localhost:3000'`) |
| `NODE_ENV`              | Node environment (`dev` or `prod`)                                   |
| `CRON_TIME`             | Cron schedule for periodic tasks (e.g., `'0 2 * * *'` = 2 AM daily)  |
| `FIRST_USER_FIRST_NAME` | First name of the default admin user                                 |
| `FIRST_USER_LAST_NAME`  | Last name of the default admin user                                  |
| `FIRST_USER_EMAIL`      | Email of the default admin user                                      |
| `FIRST_USER_PASSWORD`   | Password for the default admin user                                  |
| `FIRST_USER_USERNAME`   | Username for the default admin user                                  |
