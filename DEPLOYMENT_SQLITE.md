# Deployment Guide (SQLite Implementation)

This guide explains how to deploy the Student Happiness Index System while keeping the **SQLite** database, which requires **zero code changes**.

> [!WARNING]
> **Persistence is Mandatory**: SQLite stores data in a local file (`sqlite.db`). On standard cloud platforms (like Vercel or Render's free tier), this file is deleted every time the app restarts. You **must** use a platform that supports persistent disks.

---

## Option 1: Render (with Persistent Disk)

This method requires a **Starter** plan on Render ($7/month) to enable the Disk feature.

### 1. Create a Web Service
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository.
4. **Configuration**:
   - **Name**: `student-happiness-system`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Select **Starter** (required for disks).

### 2. Add a Persistent Disk
1. In your Web Service settings, go to the **Disks** tab.
2. Click **Add Disk**.
3. **Name**: `sqlite-storage`
4. **Mount Path**: `/opt/render/project/src/data`
5. **Size**: `1 GB` (more than enough).

### 3. Environment Variables
Go to the **Env Vars** tab and add:
- `JWT_SECRET`: (A random string for security)
- `NODE_ENV`: `production`

---

## Option 2: Railway.app (Easier Setup)

Railway handles persistent volumes well and offers a trial period.

### 1. Deploy the App
1. Log in to [Railway](https://railway.app).
2. Click **New Project** > **Deploy from GitHub repo**.
3. Select your repository.

### 2. Add a Volume
1. Once the project is created, click on your service.
2. Go to **Settings** > **Volumes**.
3. Click **Add Volume**.
4. **Mount Path**: `/app/data` (Ensure this matches where your code looks for the DB).

---

## Important Note on Database Path

Since your code currently uses `new Database('sqlite.db')`, it looks for the file in the root directory. To ensure it works on servers with persistent disks:

1. **If using Render**: Use the mount path `/opt/render/project/src` (the root of your app) for the disk, or simply follow the Render dashboard instructions to mount the disk directly to the root if allowed.
2. **Recommendation**: If you find the database is still resetting, we may need to change **one line** in `db/index.ts` to use an environment variable for the path, but let's try the volume mount first.

## Initialization

Once deployed, you may need to seed the database:
1. Access the **Shell** (on Render) or **Terminal** (on Railway).
2. Run:
   ```bash
   npx drizzle-kit push
   npm run seed (if you have a seed script)
   ```
