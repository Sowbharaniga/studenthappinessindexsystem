
import * as dotenv from "dotenv";
dotenv.config();

import { db } from "./index";
import { users, departments, questions } from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function seed() {
    console.log("Seeding database...");

    // Create Departments
    const deptNames = ['Computer Science', 'Electrical', 'Mechanical', 'Civil', 'Electronics'];
    for (const name of deptNames) {
        try {
            await db.insert(departments).values({ name }).onConflictDoNothing();
            console.log(`Department ${name} created/verified.`);
        } catch (e: any) {
            console.log(`Error creating department ${name}:`, e.message);
        }
    }

    // Create Admin User
    const existingAdmin = (await db.select().from(users).where(eq(users.username, "admin")))[0];
    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        try {
            await db.insert(users).values({
                username: "admin",
                password: hashedPassword,
                role: "ADMIN",
                name: "System Admin",
            }).onConflictDoNothing();
            console.log("Admin user created.");
        } catch (e) {
            console.error("Error creating admin:", e);
        }
    } else {
        console.log("Admin user already exists.");
    }

    // Seed Questions
    const existingQuestions = (await db.select().from(questions))[0];
    if (!existingQuestions) {


        console.log("Seeding questions...");
        const categories = [
            {
                title: "Academics",
                questions: [
                    "How manageable is your academic workload?",
                    "How satisfied are you with the quality of teaching?",
                    "How clear and understandable are the lectures?",
                    "How supportive are your faculty members?",
                    "How fair is the evaluation and grading system?",
                ]
            },
            {
                title: "Facilities & Infrastructure",
                questions: [
                    "How would you rate classroom infrastructure?",
                    "How satisfied are you with laboratory facilities?",
                    "How would you rate the library resources?",
                    "How satisfied are you with hostel/campus facilities?",
                    "How clean and well-maintained is the campus?",
                ]
            },
            {
                title: "Learning Resources",
                questions: [
                    "How satisfied are you with access to digital learning resources?",
                    "How reliable is the campus internet/WiFi?",
                    "How useful are workshops and seminars conducted?",
                ]
            },
            {
                title: "Personal Well-being",
                questions: [
                    "How well are you able to manage stress?",
                    "How supported do you feel emotionally on campus?",
                    "How safe do you feel within the campus?",
                    "How satisfied are you with your work-life balance?",
                ]
            },
            {
                title: "Social & Campus Life",
                questions: [
                    "How satisfied are you with your social life on campus?",
                    "How inclusive and welcoming is the campus environment?",
                    "How satisfied are you with extracurricular activities?",
                    "How comfortable are you expressing your opinions freely?",
                ]
            },
            {
                title: "Career & Growth",
                questions: [
                    "How satisfied are you with placement support?",
                    "How confident do you feel about your career readiness?",
                    "How helpful are internships/industry exposure opportunities?",
                ]
            },
            {
                title: "Overall",
                questions: [
                    "Overall, how happy are you with your college experience?",
                ]
            }
        ];

        for (const cat of categories) {
            for (const qText of cat.questions) {
                await db.insert(questions).values({
                    text: qText,
                    category: cat.title,
                    status: "ACTIVE"
                });
            }
        }
        console.log("Questions seeded.");
    } else {
        console.log("Questions already exist, skipping seed.");
    }

    console.log("Seeding complete.");
}

seed()
    .then(() => {
        console.log("Seeding process finished.");
        process.exit(0);
    })
    .catch((e) => {
        console.error("Seeding failed:", e);
        process.exit(1);
    });
