# Habiti - PERSONALISED HABIT TRACKER

A beautiful, full-stack habit-tracking application built with React and Express.js. Track your daily habits, journal your reflections, and visualize your progress with detailed analytics.

![Habiti](client/src/assets/logo.png)

## ✨ Features

- **🔐 Authentication**: Secure signup and login with JWT tokens
- **📋 Habit Dashboard**: Create, edit, and delete habits with daily check-ins
- **🔥 Streaks**: Visual streak indicators and heatmap calendars
- **📊 Analytics**: Bar charts and completion statistics
- **📝 Journal**: Daily mood and text entries
- **🤖 AI Coach**: Rule-based chatbot for habit tips and insights
- **👑 Premium Features**: Advanced analytics for Pro users
- **🛡️ Admin Panel**: User management for administrators

## 🛠️ Tech Stack

**Frontend:**
- React 19 + Vite
- TailwindCSS 4
- Framer Motion
- Recharts
- React Router DOM

**Backend:**
- Node.js + Express.js
- PostgreSQL
- JWT Authentication
- bcrypt for password hashing

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/habiti.git
cd habiti
```

### 2. Database Setup
```bash
# Create database
createdb habiti

# Run schema
psql -d habiti -f schema.sql
```

### 3. Configure Environment

**Server (.env):**
```bash
cd server
cp .env.example .env
# Edit .env with your database URL and JWT secret
```

**Client (.env):**
```bash
cd client
cp .env.example .env
# Set VITE_API_URL for production
```

### 4. Install Dependencies
```bash
# Server
cd server && npm install

# Client
cd ../client && npm install
```

### 5. Run Locally
```bash
# Terminal 1: Start backend
cd server && npm start

# Terminal 2: Start frontend
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🌐 Deployment

### Option 1: Vercel (Frontend) + Render (Backend) + Supabase (DB)

#### 1. Deploy Database on Supabase
1. Create a project on [Supabase.com](https://supabase.com).
2. Get the connection string from Settings -> Database (Use Session Mode/Port 5432).

#### 2. Deploy Backend on Render
1. Create a new Web Service on Render.
2. Configure settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
3. Set environment variables:
   - `DATABASE_URL`: Your Supabase connection string.
   - `JWT_SECRET`: A secure random string
   - `NODE_ENV`: `production`

#### 3. Deploy Frontend on Vercel
1. Go to [Vercel.com](https://vercel.com) and import your repo
2. Configure:
   - **Framework**: Vite
   - **Root Directory**: `client`
3. Add environment variable:
   - `VITE_API_URL`: Your Render backend URL (e.g., `https://habiti-api.onrender.com`)

### Option 2: Netlify (Frontend) + Render (Backend) + Supabase (DB)

1. Deploy DB on Supabase and Backend on Render (same as above)
2. Deploy frontend on Netlify:
   - Connect your repo
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`
   - Add `VITE_API_URL` environment variable

## 📁 Project Structure

```
habiti/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── utils/         # API utilities
│   │   └── assets/        # Images and assets
│   ├── public/            # Static files
│   └── package.json
├── server/                 # Express backend
│   ├── routes/            # API routes
│   ├── middleware/        # Auth middleware
│   ├── db.js              # Database connection
│   └── package.json
├── schema.sql             # Database schema
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/refresh` - Refresh JWT token
- `GET /auth/verify` - Verify token validity

### Habits
- `GET /habits` - Get all user habits
- `POST /habits` - Create new habit
- `PUT /habits/:id` - Update habit
- `DELETE /habits/:id` - Delete habit
- `POST /habits/:id/check` - Toggle habit completion
- `GET /habits/logs` - Get all habit logs

### Journal
- `GET /journal` - Get all entries
- `POST /journal` - Create/update entry

### Analytics
- `GET /analytics/progress` - Get completion stats
- `GET /analytics/weekly` - Weekly performance (Pro)
- `GET /analytics/correlations` - Mood correlations (Pro)

### Admin
- `GET /admin/users` - List all users
- `PUT /admin/users/:id/premium` - Toggle premium status

### Chat
- `GET /chat/tips` - Get AI tips
- `POST /chat/ask` - Ask AI a question

## 👤 Creating Admin User

```bash
cd server
node make-admin.js <username>
```

## 🎨 Customization

The app uses a Teal/Emerald color scheme. Customize in:
- `client/src/index.css` - CSS variables and utilities
- `client/tailwind.config.js` - Tailwind configuration

## 📄 License

MIT License - feel free to use this project for learning or building your own habit tracker!

---

**Built with ❤️ for personal growth**
