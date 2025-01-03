import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fonction pour omettre des champs d'un objet
function omitFields<T extends object>(obj: T, fields: (keyof T)[]): Partial<T> {
  const result = { ...obj };
  fields.forEach((field) => delete result[field]);
  return result;
}

export async function GET(req: NextRequest) {
  try {
    const username = req.nextUrl.searchParams.get('user');
    const role = req.nextUrl.searchParams.get('role');

    // Vérifiez que l'username et le rôle sont valides
    if (!username || !role) {
      return NextResponse.json(
        { error: 'Username et rôle sont obligatoires.' },
        { status: 400 }
      );
    }

    let userData;

    // Récupération des données en fonction du rôle
    if (role === 'user') {
      userData = await prisma.user.findUnique({
        where: { username },
        include: {
          vehicleOffers: { orderBy: { createdAt: 'desc' } },
          realEstateOffers: { orderBy: { createdAt: 'desc' } },
          commercialOffers: { orderBy: { createdAt: 'desc' } },
        },
      });
    } else if (role === 'company') {
      userData = await prisma.company.findFirst({
        where: { companyName: username },
        include: {
          vehicleOffers: { orderBy: { createdAt: 'desc' } },
          realEstateOffers: { orderBy: { createdAt: 'desc' } },
          commercialOffers: { orderBy: { createdAt: 'desc' } },
        },
      });
    } else {
      return NextResponse.json(
        { error: 'Rôle invalide. Utilisez "user" ou "company".' },
        { status: 400 }
      );
    }

    // Si aucune donnée n'est trouvée
    if (!userData) {
      return NextResponse.json(
        { error: `Aucune donnée trouvée pour ${username} avec le rôle ${role}.` },
        { status: 404 }
      );
    }

    // Omettre le champ "password" dynamiquement
    const cleanedData = omitFields(userData, ['password']);

    return NextResponse.json(
      {
        user: cleanedData,
        offers: {
          vehicleOffers: userData.vehicleOffers || [],
          realEstateOffers: userData.realEstateOffers || [],
          commercialOffers: userData.commercialOffers || [],
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error fetching data:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
