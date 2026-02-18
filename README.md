# Habiti - PERSONALISED HABIT TRACKER

A beautiful, full-stack habit-tracking application built with React and Supabase. Track your daily habits, journal your reflections, and visualize your progress with detailed analytics.

![Habiti](client/src/assets/logo.png)

## ✨ Features

- **🔐 Authentication**: Secure signup and login with Supabase Auth
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
- Supabase Client (Auth & Database)

**Backend:**
- Supabase (PostgreSQL + Auth)
- Supabase Edge Functions (Optional for advanced logic)

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- Supabase Account

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/habiti.git
cd habiti
```

### 2. Configure Environment
1. Create a Supabase project at [database.new](https://database.new)
2. Get your Project URL and Anon Key from Settings > API
3. Create `client/.env` file:

```bash
cd client
cp .env.example .env
```

Edit `client/.env` and add:
```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Install Dependencies
```bash
cd client && npm install
```

### 4. Run Locally
```bash
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🌐 Deployment

### Deploy Frontend on Vercel/Netlify

1. Fork this repository.
2. Sign up on [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
3. Import the project and set the **Root Directory** to `client`.
4. Add your Environment Variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in the deployment settings.
5. Deploy!

## 📁 Project Structure

```
habiti/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── utils/         # API & Supabase logic
│   │   └── assets/        # Images and assets
│   ├── public/            # Static files
│   └── package.json
├── supabase_migration.sql # Database schema & RLS policies
└── README.md
```

## 🎨 Customization

The app uses a Teal/Emerald color scheme. Customize in:
- `client/src/index.css` - CSS variables and utilities
- `client/tailwind.config.js` - Tailwind configuration

## 📄 License

MIT License - feel free to use this project for learning or building your own habit tracker!

---

**Built with ❤️ for personal growth**
