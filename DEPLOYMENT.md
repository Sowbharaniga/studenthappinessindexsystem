# Deployment Guide (Render + PostgreSQL)

This guide walks you through deploying the Student Happiness Index System to **Render** with a managed **PostgreSQL** database.

## Prerequisites

1. A [GitHub](https://github.com) account.
2. A [Render](https://render.com) account.
3. Your code pushed to a GitHub repository.

---

## Step 1: Create a PostgreSQL Database on Render

1. Log in to [dashboard.render.com](https://dashboard.render.com).
2. Click **New +** > **PostgreSQL**.
3. **Name**: `student-happiness-db`
4. **Database**: `happiness_index`
5. **User**: (leave default or set your own)
6. **Region**: Select the region closest to you.
7. Click **Create Database**.
8. Once created, copy the **Internal Database URL** (for the web service) or **External Database URL** (for local migrations).

---

## Step 2: Deploy the Web Service

1. Click **New +** > **Web Service**.
2. Select your repository.
3. **Configuration**:
   - **Name**: `student-happiness-system`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. **Environment Variables**:
   Click **Advanced** > **Add Environment Variable**:
   - `DATABASE_URL`: (Paste your Internal Database URL here)
   - `JWT_SECRET`: (A long random string, e.g., `3f8a4b2c9d1e5f7g8h9i0j1k2l3m4n5o`)
   - `NODE_ENV`: `production`

---

## Step 3: Initialize the Database (One-time)

Since the database is empty, you need to push the schema and seed it.

### Method A: Using your local machine (Easiest)
1. In your local terminal, set your temporary environment variable:
   - **Windows (PowerShell)**: `$env:DATABASE_URL="YOUR_EXTERNAL_DB_URL"`
2. Run the Drizzle push command:
   ```bash
   npx drizzle-kit push
   ```
3. (Optional) Run the seed script:
   ```bash
   npx ts-node db/seed.ts
   ```

### Method B: Using Render Shell
1. Go to your Web Service in Render.
2. Click **Shell** in the sidebar.
3. Run:
   ```bash
   npx drizzle-kit push
   ```

---

## Step 4: Verification

Once the build is complete, Render will provide a URL (e.g., `https://student-happiness-system.onrender.com`).
- Access the URL.
- Login with the admin credentials (if you ran the seed script).
- Test student registration and survey submission.

---

## Troubleshooting

- **Build Failures**: Check the logs in the Render dashboard. Ensure all dependencies are in `package.json`.
- **Database Connection**: Ensure `DATABASE_URL` is correctly set in the environment variables.
- **SSL Error**: The application is already configured to handle SSL in production (`rejectUnauthorized: false`).
