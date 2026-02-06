import "dotenv/config";
import { prisma } from "./src/lib/prisma";
import bcrypt from "bcryptjs";

async function createUser() {
    const email = "avanfabiandaniswara@gmail.com";

    // Check if user exists
    const existing = await prisma.user.findUnique({
        where: { email }
    });

    if (existing) {
        console.log("✅ User already exists:", email);
        return;
    }

    // Create user
    const hashedPassword = await bcrypt.hash("password123", 10);
    const user = await prisma.user.create({
        data: {
            email,
            name: "Avan Fabian Daniswara",
            password: hashedPassword
        }
    });

    console.log("✅ User created:", user.email, "ID:", user.id);
}

createUser()
    .then(() => prisma.$disconnect())
    .catch((error) => {
        console.error("❌ Error:", error);
        process.exit(1);
    });
