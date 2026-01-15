# Implementation Plan: Habit Tracker Sprint Clone

## 1. Project Setup
- [x] Scaffold Client (React + Vite)
- [ ] Scaffold Server (Node + Express) - *Pending client setup completion*
- [ ] Install dependencies
    - Client: `tailwindcss postcss autoprefixer react-router-dom axios date-fns recharts lucide-react`
    - Server: `express pg cors dotenv jsonwebtoken bcrypt nodemon`

## 2. Database Schema (PostgreSQL)
- [ ] Design Users table (id, username, password_hash, created_at)
- [ ] Design Habits table (id, user_id, title, description, frequency, goal, color, created_at)
- [ ] Design HabitLogs table (id, habit_id, date, status, notes)
- [ ] Design JournalEntries table (id, user_id, date, content, mood)
- [ ] Create `schema.sql` setup script

## 3. Backend Implementation
- [ ] **Config**: Database connection (`db.js`)
- [ ] **Auth**: `POST /auth/signup`, `POST /auth/login`, Middleware `authenticateToken`
- [ ] **Habits**: `GET /habits`, `POST /habits`, `PUT /habits/:id`, `DELETE /habits/:id`
- [ ] **Tracking**: `POST /habits/:id/check`, `GET /habits/logs`
- [ ] **Journal**: `GET /journal`, `POST /journal`
- [ ] **Analytics**: `GET /analytics/progress`

## 4. Frontend Implementation
- [ ] **Setup**: Tailwind Config, Global Styles (Theme)
- [ ] **Components**:
    - Layout (Sidebar/Navbar)
    - AuthForm (Login/Signup)
    - HabitCard (Streak, Checkbox)
    - CalendarView (Month grid with status)
    - AnalyticsChart (Recharts)
    - JournalEditor
- [ ] **Pages**:
    - `LoginPage`, `SignupPage`
    - `Dashboard` (Habit list + Daily view)
    - `HabitDetails` (Calendar + specific stats)
    - `JournalPage`
- [ ] **Integration**: Connect Axios to API

## 5. Final Polish
- [ ] Error handling (toast notifications)
- [ ] Loading states
- [ ] Setup Instructions (README.md)
