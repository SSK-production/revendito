import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const page = req.nextUrl.searchParams.get("category") || "vehicle";
    const offerId = parseInt(req.nextUrl.searchParams.get("offerId") || "0", 10);

    if (isNaN(offerId) || offerId <= 0) {
      return NextResponse.json(
        { error: "Invalid or missing offerId parameter." },
        { status: 400 }
      );
    }

    let offer;

    if (page === "vehicle") {
      offer = await prisma.vehicleOffer.findUnique({
        where: {
          id: offerId,
          user: {
            isBanned: false, // Vérifie que l'utilisateur n'est pas banni
          },
          company: {
            isBanned: false, // Vérifie que l'entreprise n'est pas bannie
          },
        },
        include: {
          user: true, // Inclut les détails de l'utilisateur
          company: true, // Inclut les détails de l'entreprise
        },
      });
    } else if (page === "property") {
      offer = await prisma.realEstateOffer.findUnique({
        where: {
          id: offerId,
          user: {
            isBanned: false, // Vérifie que l'utilisateur n'est pas banni
          },
          company: {
            isBanned: false, // Vérifie que l'entreprise n'est pas bannie
          },
        },
        include: {
          user: true,
          company: true,
        },
      });
    } else if (page === "commercial") {
      offer = await prisma.commercialOffer.findUnique({
        where: {
          id: offerId,
          user: {
            isBanned: false, // Vérifie que l'utilisateur n'est pas banni
          },
          company: {
            isBanned: false, // Vérifie que l'entreprise n'est pas bannie
          },
        },
        include: {
          user: true,
          company: true,
        },
      });
    } else {
      return NextResponse.json(
        { error: "Invalid page parameter." },
        { status: 400 }
      );
    }

    if (!offer) {
      return NextResponse.json(
        { error: `Offer not found for id: ${offerId}` },
        { status: 404 }
      );
    }

    // Vérifiez si l'utilisateur ou l'entreprise est actif/active
    const isUserActive = offer.user?.active || false;
    const isCompanyActive = offer.company?.active || false;

    if (!isUserActive && !isCompanyActive) {
      return NextResponse.json(
        { error: "The offer is associated with an inactive user or company." },
        { status: 403 }
      );
    }

    return NextResponse.json({ data: offer });

  } catch (error: unknown) {
    console.error("Error fetching offer:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Error fetching offer: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
