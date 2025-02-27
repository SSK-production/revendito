"use server";

import { NextResponse } from "next/server";
import { PrismaClient, User, Company } from "@prisma/client";

import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const RESET_PASSWORD_JWT_SECRET =
  process.env.RESET_PASSWORD_JWT_SECRET || "fallback_secret";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { message: "Token or password is missing" },
        { status: 400 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, RESET_PASSWORD_JWT_SECRET);
    } catch {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }
    console.log(token);
    
    const { email } = decoded as { email: string };
    console.log("email : ", email);
    
    // Vérifier si l'utilisateur existe dans `user`
    const user: User | null = await prisma.user.findUnique({
      where: { email },
    });
  
    

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true },
      });
      return NextResponse.json({ message: "Email verified successfully" }, { status: 200 });
    }

    // Vérifier si l'utilisateur existe dans `company`
    const company: Company | null = await prisma.company.findUnique({
      where: { email },
    });

    if (company) {
      await prisma.company.update({
        where: { id: company.id },
        data: { emailVerified: true },
      });
      return NextResponse.json({ message: "Email verified successfully" }, { status: 200 });
    }

    return NextResponse.json({ message: "User not found" }, { status: 404 });
  } catch (error) {
    console.error("Error verify email:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
