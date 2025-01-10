import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/app/lib/tokenManager";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { verifyId } from "@/app/lib/function";

const getPrismaInstance = (() => {
  let instance: PrismaClient;
  return () => {
    if (!instance) {
      instance = new PrismaClient();
    }
    return instance;
  };
})();

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    console.log(data.type + " " + data.email + " " + data.password);
    const { id, entity, accessToken, active } = await getUserFromRequest(
      request
    );
    const prisma = getPrismaInstance();
    verifyId(id, entity);

    if (!data.email) {
      return NextResponse.json({ message: "Email not found" }, { status: 401 });
    }
    if (!data.password) {
      return NextResponse.json(
        { message: "Password not found" },
        { status: 401 }
      );
    }

    if (!active) {
      return NextResponse.json({ error: "User not active." }, { status: 401 });
    }

    if (entity === "user") {
      const user = await prisma.user.findUnique({
        where: { id: id },
      });

      if (!user || !(await bcrypt.compare(data.password, user.password))) {
        return NextResponse.json(
          { error: "Mot de passe incorrect." },
          { status: 401 }
        );
      }
    } else if (entity === "company") {
      const company = await prisma.company.findUnique({
        where: { id: id },
      });

      if (
        !company ||
        !(await bcrypt.compare(data.password, company.password))
      ) {
        return NextResponse.json(
          { error: "Mot de passe incorrect." },
          { status: 401 }
        );
      }
    } else {
      return NextResponse.json({ error: "Invalid entity." }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser && existingUser.id !== id) {
      return NextResponse.json(
        { error: "Email already taken." },
        { status: 400 }
      );
    }
    const existingCompany = await prisma.company.findUnique({
      where: { email: data.email },
    });
    if (existingCompany && existingCompany.id !== id) {
      return NextResponse.json(
        { error: "email already taken." },
        { status: 400 }
      );
    }

    if (entity === "user") {
      await prisma.user.update({
        where: { id: id },
        data: {
          email: data.email,
          emailVerified: false,
        },
      });
    }
    if (entity === "company") {
      await prisma.company.update({
        where: { id: id },
        data: {
          email: data.email,
          emailVerified: false,
        },
      });
    }

    // Process the data and update the account here
    const response = NextResponse.json(
      { message: "Account updated successfully" },
      { status: 200 }
    );
    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "Failed to update account", error: (error as Error).message },
      { status: 500 }
    );
  }
}
