import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const departments = sqliteTable("departments", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull().unique(),
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const users = sqliteTable("users", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    username: text("username").notNull().unique(), // rollNo for students, username for admin
    password: text("password").notNull(),
    role: text("role").$type<"ADMIN" | "STUDENT">().notNull(),
    name: text("name"),
    departmentId: text("department_id").references(() => departments.id),
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const surveyResponses = sqliteTable("survey_responses", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    studentId: text("student_id").notNull().references(() => users.id).unique(),
    score: real("score").notNull(),
    answers: text("answers").notNull(), // JSON string
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const questions = sqliteTable("questions", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    text: text("text").notNull(),
    category: text("category").notNull(),
    status: text("status").$type<"ACTIVE" | "INACTIVE">().default("ACTIVE").notNull(),
    createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

