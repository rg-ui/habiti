# Deployment Guide for Habiti

This project is a **Static React App** that connects directly to **Supabase**. You do not need a separate backend server.

## Prerequisites
1.  **GitHub Account**: Your project should be pushed to a repository.
2.  **Supabase Project**: Created at [database.new](https://database.new).
3.  **Vercel or Netlify Account**: For hosting the frontend.

---

## Part 1: Configure Supabase

1.  **Get Credentials**:
    *   Go to **Project Settings** -> **API**.
    *   Copy the **Project URL** and **anon / public** Key.

2.  **Database Setup**:
    *   Run the provided `supabase_migration.sql` in the **SQL Editor** of your Supabase dashboard to set up tables and security policies.

---

## Part 2: Deploy Frontend (Vercel Recommended)

1.  **Sign up/Login** to [Vercel.com](https://vercel.com).
2.  Click "Add New..." -> "Project".
3.  Import your GitHub repository.
4.  **Configure Project**:
    *   **Framework Preset**: Vite.
    *   **Root Directory**: `client` (Important! Click Edit if needed).
    *   **Environment Variables**:
        *   `VITE_SUPABASE_URL`: Your Supabase Project URL.
        *   `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
5.  Click **Deploy**.

---

## That's it! 🚀

Your app is now live. Since it uses Supabase for everything (Auth, DB), you don't need to manage any backend servers.
