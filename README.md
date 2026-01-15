# Habit Tracker Sprint Clone

## Setup Instructions

### 1. Prerequisites
- Node.js (v16+)
- PostgreSQL (Ensure it is running)

### 2. Database Setup
1. Create a PostgreSQL database named `habiti`:
   ```bash
   createdb habiti
   ```
2. Run the schema script to create tables:
   ```bash
   psql -d habiti -f schema.sql
   ```
   *Note: If your postgres user has a password, you may need to update `server/.env` with `postgresql://user:password@localhost:5432/habiti`*

### 3. Installation

**Server:**
```bash
cd server
npm install
```

**Client:**
```bash
cd client
npm install
```

### 4. Running the App

**Start Backend:**
```bash
cd server
npm start
```

**Start Frontend:**
```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Features
- **Authentication**: Signup and Login with JWT.
- **Habit Dashboard**: Create habits, checking off for today, delete habits.
- **Streaks**: Visual streak indicator.
- **Analytics**: Bar chart of completion counts.
- **Journal**: Daily mood and text entry.