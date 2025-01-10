import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Récupérer le paramètre 'validation' de la requête
    const { searchParams } = new URL(req.url);
    const validation = searchParams.get('validation');

    // Préparer les filtres pour chaque type d'offre
    let vehicleOfferFilter: any = {};
    let realEstateOfferFilter: any = {};
    let commercialOfferFilter: any = {};

    // Si un filtre de validation est spécifié, ajoutez-le au filtre de chaque type d'offre
    if (validation === "validated") {
      vehicleOfferFilter = { validated: true };
      realEstateOfferFilter = { validated: true };
      commercialOfferFilter = { validated: true };
    } else if (validation === "notValidated") {
      vehicleOfferFilter = { validated: false };
      realEstateOfferFilter = { validated: false };
      commercialOfferFilter = { validated: false };
    }

    // Récupérer les données des trois tables avec les filtres appliqués
    const commercialOffer = await prisma.commercialOffer.findMany({
      where: commercialOfferFilter,
    });
    const realEstateOffer = await prisma.realEstateOffer.findMany({
      where: realEstateOfferFilter,
    });
    const vehicleOffer = await prisma.vehicleOffer.findMany({
      where: vehicleOfferFilter,
    });

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
