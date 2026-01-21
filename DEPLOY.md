# Deployment Guide for Habiti

This project consists of a **Vite React Client** and an **Express Server**. To deploy this effectively, we recommend splitting the services:

1.  **Frontend**: Deployed on **Vercel** (Free, fast global CDN).
2.  **Backend & Database**: Deployed on **Render** (Free tier available for Web Services and Postgres).

---

## Prerequisite: Git
Make sure your project is pushed to a GitHub repository.
1.  Initialize git: `git init`
2.  Add files: `git add .`
3.  Commit: `git commit -m "Ready for deploy"`
4.  Push to a new GitHub repo.

---

## Part 1: Deploy Backend (Render)

1.  **Sign up/Login** to [Render.com](https://render.com).
2.  **Create a Database**:
    *   Click "New +" -> "PostgreSQL".
    *   Name: `habiti-db`.
    *   Region: Closest to you (e.g., Singapore, Frankfurt, Oregon).
    *   Click **Create Database**.
    *   **Keep the page open**; you'll need the "Internal Database URL" and "External Database URL" soon.

3.  **Create the Web Service**:
    *   Click "New +" -> "Web Service".
    *   Connect your GitHub repository.
    *   **Root Directory**: `server`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node index.js`
    *   **Environment Variables** (Add these):
        *   `DB_HOST`: (From your Render DB details)
        *   `DB_USER`: (From Render DB)
        *   `DB_PASS`: (From Render DB)
        *   `DB_NAME`: (From Render DB)
        *   `DB_PORT`: `5432`
        *   *Alternatively, if your app uses a connection string:*
        *   `DATABASE_URL`: Copy the **Internal Database URL** from the database you just created.
        *   `JWT_SECRET`: Generate a random strong string (e.g., use a password generator).
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
