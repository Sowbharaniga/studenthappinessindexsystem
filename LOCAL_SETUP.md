# Local Development Setup (Postgres)

Since we have migrated from SQLite to PostgreSQL, you need to set up a local environment variable to connect to your database.

## 1. Create a `.env` file
In the root directory of your project, create a file named `.env` and add your Neon connection string:

```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
JWT_SECRET="your_random_secret_here"
```

## 2. Install dependencies
Ensure all new dependencies are installed:
```bash
npm install
```

## 3. Run migrations locally
Push the schema to your Neon database:
```bash
npx drizzle-kit push
```

## 4. Seed the database
Run the seed script to create the admin user and questions:
```bash
npm run seed
```
*(Note: You may need to add `"seed": "tsx db/seed.ts"` to your `scripts` in `package.json` if it's not there)*

## 5. Start development server
```bash
npm run dev
```
