# Deployment Guide for Habiti

This project consists of a **Vite React Client** and an **Express Server**. To deploy this effectively, we recommend splitting the services:

1.  **Frontend**: Deployed on **Vercel** (Free, fast global CDN).
2.  **Backend**: Deployed on **Render** (Web Service).
3.  **Database**: Deployed on **Supabase** (Managed PostgreSQL).

---

## Prerequisite: Git
Make sure your project is pushed to a GitHub repository.
1.  Initialize git: `git init`
2.  Add files: `git add .`
3.  Commit: `git commit -m "Ready for deploy"`
4.  Push to a new GitHub repo.

---

## Part 1: Deploy Backend (Render Web Service + Supabase DB)

1.  **Set up Database (Supabase)**:
    *   **Sign up/Login** to [Supabase.com](https://supabase.com).
    *   **Create a new Project**:
        *   Click "New Project".
        *   Choose your organization, name: `habiti-db`, password (save this!), and region.
        *   Click **Create new project**.
    *   **Get Connection String**:
        *   Go to **Project Settings** -> **Database**.
        *   Under **Connection String**, select **Node.js**.
        *   Copy the URL. (It looks like `postgresql://postgres:[PASSWORD]@...`).
        *   *Tip: Use port 5432 (Session Mode) for best compatibility.*

2.  **Deploy Backend (Render)**:
    *   **Sign up/Login** to [Render.com](https://render.com).
    *   Click "New +" -> "Web Service".
    *   Connect your GitHub repository.
    *   **Root Directory**: `server`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node index.js`
    *   **Environment Variables** (Add these):
        *   `DATABASE_URL`: Paste your Supabase Connection String. **Replace `[PASSWORD]` with your actual password.**
        *   `JWT_SECRET`: Generate a random strong string.
    *   Click **Create Web Service**.

4.  **Wait for Build**: Once the deploy finishes, Render will give you a public URL (e.g., `https://habiti-server.onrender.com`). **Copy this URL.**

---

## Part 2: Deploy Frontend (Vercel)

1.  **Sign up/Login** to [Vercel.com](https://vercel.com).
2.  Click "Add New..." -> "Project".
3.  Import your GitHub repository.
4.  **Configure Project**:
    *   **Framework Preset**: Vite (should be auto-detected).
    *   **Root Directory**: Click "Edit" and select `client`.
    *   **Environment Variables**:
        *   Key: `VITE_API_URL`
        *   Value: Your Render Backend URL (e.g., `https://habiti-server.onrender.com`). **Do not add a trailing slash.**
5.  Click **Deploy**.

---

## Part 3: Final Connection

1.  Once Vercel finishes, you will get a frontend URL (e.g., `https://habiti-app.vercel.app`).
2.  Go back to **Render Dashboard** -> Your Web Service -> **Environment**.
3.  Add/Update `CORS_ORIGIN` (if your server uses it) to allow your Vercel URL.
    *   *Note: If your server uses `app.use(cors())` without options, it allows all origins by default (easiest for testing).*

Your app is now live! 🚀
