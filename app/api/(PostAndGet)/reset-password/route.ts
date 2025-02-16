import { NextResponse } from "next/server";
import { PrismaClient, User, Company } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const RESET_PASSWORD_JWT_SECRET = process.env.RESET_PASSWORD_JWT_SECRET || "fallback_secret";

// Fonction pour valider un mot de passe (longueur, complexité)
function isValidPassword(password: string) {
    return password.length >= 8 && /\d/.test(password) && /[A-Za-z]/.test(password);
}

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ message: "Token or password is missing" }, { status: 400 });
        }

        if (!isValidPassword(password)) {
            return NextResponse.json({ message: "Password must be at least 8 characters long and contain letters and numbers." }, { status: 400 });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, RESET_PASSWORD_JWT_SECRET);
        } catch {
            return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
        }

        const { email } = decoded as { email: string };

        // Vérifier si l'utilisateur existe dans `user`
        const user: User | null = await prisma.user.findUnique({ where: { email } });

        if (user) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.user.update({
                where: { id: user.id },
                data: { password: hashedPassword },
            });

            return NextResponse.json({ message: "Password updated successfully" });
        }

        // Vérifier si l'utilisateur existe dans `company`
        const company: Company | null = await prisma.company.findUnique({ where: { email } });

        if (company) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.company.update({
                where: { id: company.id },
                data: { password: hashedPassword },
            });

            return NextResponse.json({ message: "Password updated successfully" });
        }

        return NextResponse.json({ message: "User not found" }, { status: 404 });

    } catch (error) {
        console.error("Error updating password:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
