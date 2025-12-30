import bcrypt from "bcryptjs";
import { prisma } from '@/lib/prisma';

async function CreateUser() {
    const hashedPassword = await bcrypt.hash("admineduvoka123", 10);

    await prisma.user.create({
        data: {
            email: "admineduvoka@example.com",
            password: hashedPassword,
            name: "Admin User",
        }
    });
}

async function main() {
    await CreateUser();
}

main().then(() => console.log("User created successfully")).catch((e) => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});