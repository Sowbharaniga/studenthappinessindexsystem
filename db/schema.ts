
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const departments = sqliteTable("departments", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull().unique(),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

export const users = sqliteTable("users", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    username: text("username").notNull().unique(), // rollNo for students, username for admin
    password: text("password").notNull(),
    role: text("role", { enum: ["ADMIN", "STUDENT"] }).notNull(),
    name: text("name"),
    departmentId: text("department_id").references(() => departments.id),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

export const surveyResponses = sqliteTable("survey_responses", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    studentId: text("student_id").notNull().references(() => users.id).unique(),
    score: real("score").notNull(),
    answers: text("answers").notNull(), // JSON string
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

export const questions = sqliteTable("questions", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    text: text("text").notNull(),
    category: text("category").notNull(),
    status: text("status", { enum: ["ACTIVE", "INACTIVE"] }).default("ACTIVE").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});
