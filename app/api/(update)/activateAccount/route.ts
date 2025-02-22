'use server';

import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/app/lib/tokenManager";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
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
        const {id, entity, accessToken} = await getUserFromRequest(request);
        if (!id || !entity || !accessToken) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const prisma = getPrismaInstance();
        const { active, password } = await request.json();
        verifyId(id, entity)
        
        if (entity === "user") {
              const user = await prisma.user.findUnique({
                where: { id: id },
              });
        
              if (!user || !(await bcrypt.compare(password, user.password))) {
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
                !(await bcrypt.compare(password, company.password))
              ) {
                return NextResponse.json(
                  { error: "Mot de passe incorrect." },
                  { status: 401 }
                );
              }
            } else {
              return NextResponse.json({ error: "Invalid entity." }, { status: 400 });
            }

        
        if (entity === "user") {
          await prisma.user.update({
            where: { id: id },
            data: { active: active ? false : true },
          });
        }
        if (entity === "company") {
            await prisma.company.update({
              where: { id: id },
              data: { active: active ? false : true },
            });
          }
        

        const response = NextResponse.json({ message: "Account status updated" }, {status:200});
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
            { message: "An error occurred", error: (error as Error).message },
            { status: 500 }
        );
    }
}