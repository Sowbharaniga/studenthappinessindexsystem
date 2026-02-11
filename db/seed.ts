
import { db } from "./index";
import { users, departments } from "./schema";
import bcrypt from "bcryptjs";

async function seed() {
    console.log("Seeding database...");

    // Create Departments
    const deptNames = ['Computer Science', 'Electrical', 'Mechanical', 'Civil', 'Electronics'];
    for (const name of deptNames) {
        try {
            await db.insert(departments).values({ name }).onConflictDoNothing();
            console.log(`Department ${name} created/verified.`);
        } catch (e) {
            console.log(`Error creating department ${name}:`, e);
        }
    }

    // Create Admin User
    const hashedPassword = await bcrypt.hash("admin123", 10);
    try {
        await db.insert(users).values({
            username: "admin",
            password: hashedPassword,
            role: "ADMIN",
            name: "System Admin",
        }).onConflictDoNothing();
        console.log("Admin user created/verified.");
    } catch (e) {
        console.error("Error creating admin:", e);
    }

    console.log("Seeding complete.");
}

seed();
