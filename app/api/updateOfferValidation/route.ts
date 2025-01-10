import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Parse la requête et extrait les données nécessaires
    const { id, type, validated }: { id: number; type: string; validated: boolean } = await request.json();

    // Validation des paramètres reçus
    if (typeof id !== 'number' || typeof type !== 'string' || typeof validated !== 'boolean') {
      return NextResponse.json(
        { success: false, message: "Invalid request body. 'id' must be a number, 'type' must be a string, and 'validated' must be a boolean." },
        { status: 400 }
      );
    }

    // Mise à jour en fonction du type d'offre
    let updatedOffer;

    switch (type) {
      case 'vehicleOffer':
        updatedOffer = await prisma.vehicleOffer.update({
          where: { id },
          data: { validated },
        });
        break;
      case 'realEstateOffer':
        updatedOffer = await prisma.realEstateOffer.update({
          where: { id },
          data: { validated },
        });
        break;
      case 'commercialOffer':
        updatedOffer = await prisma.commercialOffer.update({
          where: { id },
          data: { validated },
        });
        break;
      default:
        return NextResponse.json(
          { success: false, message: "Offer type not recognized." },
          { status: 400 }
        );
    }

    // Retourne la réponse de succès avec l'offre mise à jour
    return NextResponse.json({
      success: true,
      message: "Offer validation updated successfully",
      data: updatedOffer,
    });

  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  } finally {
    // Ferme la connexion Prisma
    await prisma.$disconnect();
  }
}
