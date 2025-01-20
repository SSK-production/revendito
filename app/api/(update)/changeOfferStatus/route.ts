import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/app/lib/tokenManager";
import { PrismaClient } from "@prisma/client";
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
    const user = await getUserFromRequest(request);
    const { active, offerId, offerType } = await request.json();
    verifyId(user.id, user.entity);
    console.log("active : ", active, "offerId : ", offerId, "offerType : ", offerType);

    const prisma = getPrismaInstance();
    let offer;

    if (offerType === 'vehicle') {
      offer = await prisma.vehicleOffer.findUnique({
        where: { id: Number(offerId) },
        select: { userId: true, companyId: true }
      });
    } else if (offerType === 'property') {
      offer = await prisma.realEstateOffer.findUnique({
        where: { id: Number(offerId) },
        select: { userId: true, companyId: true }
      });
    } else if (offerType === 'commercial') {
      offer = await prisma.commercialOffer.findUnique({
        where: { id: Number(offerId) },
        select: { userId: true, companyId: true }
      });
    } else {
      return NextResponse.json({ error: "Invalid offer type" }, { status: 400 });
    }

    if (!offer || (user.entity === 'user' && offer.userId !== user.id) || (user.entity === 'company' && offer.companyId !== user.id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (offerType === 'vehicle') {
      await prisma.vehicleOffer.update({
        where: { id: Number(offerId) },
        data: { active: active ? false : true }
      });
    } else if (offerType === 'property') {
      await prisma.realEstateOffer.update({
        where: { id: Number(offerId) },
        data: { active: active ? false : true }
      });
    } else if (offerType === 'commercial') {
      await prisma.commercialOffer.update({
        where: { id: Number(offerId) },
        data: { active: active ? false : true }
      });
    }

    const response = NextResponse.json({ message: "offer status updated" }, {status:200});

    response.cookies.set('access_token', user.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 3600,
        sameSite: 'strict',
        path: '/',
      });
  
      return response; 
  } catch (error: unknown) {
    return NextResponse.json(
        { message: "An error occurred", error: (error as Error).message },
        { status: 500 }
    );
}
}
