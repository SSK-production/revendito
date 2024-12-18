import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Récupérer les données des trois tables
    const commercialOffer = await prisma.commercialOffer.findMany();
    const realEstateOffer = await prisma.realEstateOffer.findMany();
    const vehicleOffer = await prisma.vehicleOffer.findMany();

    // Fusionner les données en ajoutant un paramètre typeOffers
    const allOffers = [
      ...vehicleOffer.map(offer => ({ ...offer, typeOffers: "vehicleOffer" })),
      ...realEstateOffer.map(offer => ({ ...offer, typeOffers: "realEstateOffer" })),
      ...commercialOffer.map(offer => ({ ...offer, typeOffers: "commercialOffer" }))
    ];

    // Utilisation de NextResponse pour envoyer la réponse JSON
    return NextResponse.json(allOffers, { status: 200 });

  } catch (error) {
    console.error(error);
    // Utilisation de NextResponse pour renvoyer une erreur
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des offres' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
