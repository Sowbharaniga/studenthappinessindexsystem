
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

console.log("Checking environment setup...");
console.log("Current directory:", process.cwd());

const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
    console.log(".env file found at:", envPath);
    const content = fs.readFileSync(envPath, "utf-8");
    if (content.includes("DATABASE_URL")) {
        console.log("DATABASE_URL is present in .env");
        if (process.env.DATABASE_URL) {
            console.log("DATABASE_URL is loaded into process.env");
            console.log("Length of URL:", process.env.DATABASE_URL.length);
        } else {
            console.log("ERROR: DATABASE_URL is present in file but NOT loaded into process.env");
        }
    } else {
        console.log("ERROR: DATABASE_URL is MISSING from .env file");
    }
} else {
    console.log("ERROR: .env file NOT found!");
}
