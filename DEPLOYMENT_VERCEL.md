# Free Deployment Guide (Vercel + Neon Postgres)

This guide walks you through deploying the Student Happiness Index System for **100% free** using Vercel for hosting and Neon for the database.

## Prerequisites
1. A [GitHub](https://github.com) account.
2. A [Vercel](https://vercel.com) account.
3. A [Neon](https://neon.tech) account.

---

## Step 1: Create a Free Postgres Database on Neon
1. Log in to [Neon Console](https://console.neon.tech).
2. Create a new project named `student-happiness`.
3. In the Dashboard, find the **Connection String**.
4. Select **Transaction mode** (recommended for serverless).
5. Copy the URL (it looks like `postgresql://user:password@host/dbname?sslmode=require`).

---

## Step 2: Deploy to Vercel
1. Push your latest code (with the Postgres changes I made) to GitHub.
2. Go to the [Vercel Dashboard](https://vercel.com/dashboard).
3. Click **Add New** > **Project**.
4. Import your GitHub repository.
5. **Environment Variables**:
   Add the following variables:
   - `DATABASE_URL`: (Paste your Neon connection string here)
   - `JWT_SECRET`: (Any random long string)
   - `NODE_ENV`: `production`
6. Click **Deploy**.

---

## Step 3: Initialize the Database
Once the deployment is finished, you need to create the tables in your new database.
1. Open your project folder in a local terminal.
2. Run the following command (replace `YOUR_NEON_URL` with your actual Neon URL):
   ```bash
   $env:DATABASE_URL="YOUR_NEON_URL"
   npx drizzle-kit push
   ```
3. (Optional) Seed the database if you have a seed script:
   ```bash
   npx ts-node db/seed.ts
   ```

---

## Why this is 100% Free
- **Vercel Hobby Plan**: Free hosting for non-commercial projects.
- **Neon Free Tier**: Offers a generous free tier for Postgres with auto-scaling.
- **Persistence**: Unlike SQLite on free servers, Neon stores your data permanently in the cloud.
