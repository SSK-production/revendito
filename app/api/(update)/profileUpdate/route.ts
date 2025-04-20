import { getUserFromRequest } from "@/app/lib/tokenManager";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const getPrismaInstance = (() => {
  let instance: PrismaClient;
  return () => {
    if (!instance) {
      instance = new PrismaClient();
    }
    return instance;
  };
})();

export async function PUT(req: NextRequest) {
  try {
    const { id, entity, accessToken, active } = await getUserFromRequest(req);
    if (!id) {
      return NextResponse.json(
        { error: "User not authenticated." },
        { status: 401 }
      );
    }
    if (!active) {
      return NextResponse.json({ error: "User not active." }, { status: 401 });
    }
    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token not found." },
        { status: 401 }
      );
    }
    if (!entity) {
      return NextResponse.json({ error: "Entity not found." }, { status: 401 });
    }

    const prisma = getPrismaInstance();

    const data = await req.json();

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

    const username: string = data.username || data.companyName;

    const existingUser = await prisma.user.findUnique({
      where: { username: username },
    });
    if (existingUser && existingUser.id !== id) {
      return NextResponse.json(
        { error: "Username already taken." },
        { status: 400 }
      );
    }
    const existingCompany = await prisma.company.findUnique({
      where: { companyName: username },
    });
    if (existingCompany && existingCompany.id !== id) {
      return NextResponse.json(
        { error: "Company name already taken." },
        { status: 400 }
      );
    }

    if (entity === "user") {
      await prisma.user.update({
        where: { id: id },
        data: {
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
          birthDate: new Date(data.birthDate),
          city: data.city,
          country: data.country,
        },
      });
    }
    if (entity === "company") {
      await prisma.company.update({
        where: { id: id },
        data: {
          companyName: data.companyName,
          birthDate: new Date(data.birthDate),
          companyNumber: data.companyNumber,
          city: data.city,
          country: data.country,
          street: data.street,
        },
      });
    }

    return NextResponse.json(
      { message: "Profile updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
