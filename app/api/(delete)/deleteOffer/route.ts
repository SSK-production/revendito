import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/app/lib/tokenManager";
import { PrismaClient } from "@prisma/client";
import { verifyId } from "@/app/lib/function";
import bcrypt from "bcrypt";

const getPrismaInstance = (() => {
  let instance: PrismaClient;
  return () => {
    if (!instance) {
      instance = new PrismaClient();
    }
    return instance;
  };
})();

export async function DELETE(request: NextRequest) {
  try {
    const userData = await getUserFromRequest(request);
    const { password, offerId, offerType } = await request.json();
    verifyId(userData.id, userData.entity);

    if (!password) {
      return NextResponse.json(
        { message: "Password not found" },
        { status: 401 }
      );
    }

    if (!offerId || !offerType) {
      return NextResponse.json({ message: "offer not found" }, { status: 401 });
    }

    const prisma = getPrismaInstance();

    if (userData.entity === "user") {
      const user = await prisma.user.findUnique({
        where: { id: userData.id },
      });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return NextResponse.json(
          { error: "Mot de passe incorrect." },
          { status: 401 }
        );
      }
    } else if (userData.entity === "company") {
      const company = await prisma.company.findUnique({
        where: { id: userData.id },
      });

      if (!company || !(await bcrypt.compare(password, company.password))) {
        return NextResponse.json(
          { error: "Mot de passe incorrect." },
          { status: 401 }
        );
      }
    } else {
      return NextResponse.json({ error: "Invalid entity." }, { status: 400 });
    }

    let offer;
    if (offerType === "vehicle") {
      offer = await prisma.vehicleOffer.findUnique({
        where: { id: Number(offerId) },
        select: { userId: true, companyId: true },
      });
    } else if (offerType === "property") {
      offer = await prisma.realEstateOffer.findUnique({
        where: { id: Number(offerId) },
        select: { userId: true, companyId: true },
      });
    } else if (offerType === "commercial") {
      offer = await prisma.commercialOffer.findUnique({
        where: { id: Number(offerId) },
        select: { userId: true, companyId: true },
      });
    } else {
      return NextResponse.json(
        { error: "Invalid offer type" },
        { status: 400 }
      );
    }

    if (
        !offer ||
        (userData.entity === "user" && offer.userId !== userData.id) ||
        (userData.entity === "company" && offer.companyId !== userData.id)
      ) {
        // On arrête immédiatement l'exécution si non autorisé
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
      
      // Si l'exécution atteint ici, l'utilisateur est autorisé, on peut supprimer l'offre
      if (offerType === "vehicle") {
        await prisma.vehicleOffer.delete({
          where: { id: Number(offerId) },
        });
      } else if (offerType === "property") {
        await prisma.realEstateOffer.delete({
          where: { id: Number(offerId) },
        });
      } else if (offerType === "commercial") {
        await prisma.commercialOffer.delete({
          where: { id: Number(offerId) },
        });
      }
      

    const response = NextResponse.json(
      { message: "offer deleted with success" },
      { status: 200 }
    );

    response.cookies.set("access_token", userData.accessToken, {
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
