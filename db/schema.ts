import { pgTable, text, timestamp, real } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const departments = pgTable("departments", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull().unique(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const users = pgTable("users", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    username: text("username").notNull().unique(), // rollNo for students, username for admin
    password: text("password").notNull(),
    role: text("role").$type<"ADMIN" | "STUDENT">().notNull(),
    name: text("name"),
    departmentId: text("department_id").references(() => departments.id),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const surveyResponses = pgTable("survey_responses", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    studentId: text("student_id").notNull().references(() => users.id).unique(),
    score: real("score").notNull(),
    answers: text("answers").notNull(), // JSON string
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const questions = pgTable("questions", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    text: text("text").notNull(),
    category: text("category").notNull(),
    status: text("status").$type<"ACTIVE" | "INACTIVE">().default("ACTIVE").notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

