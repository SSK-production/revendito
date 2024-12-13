import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type SearchResult =
  | {
      type: 'user';
      id: string;
      username: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
      city: string;
      country: string;
      isBanned: boolean;
      banReason: string | null;
      banEndDate: Date | null;
    }
  | {
      type: 'company';
      id: string;
      companyName: string;
      email: string;
      city: string;
      country: string;
      street: string;
      companyNumber: string;
      isBanned: boolean;
      banReason: string | null;
      banEndDate: Date | null;
    };

export async function GET(req: NextRequest): Promise<Response> {
  try {
    // Récupérer les paramètres de la requête
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    // Validation des paramètres
    if (!username) {
      return NextResponse.json(
        { error: "Paramètre invalide : 'username' est requis." },
        { status: 400 }
      );
    }

    // Recherche des utilisateurs dont le username commence par la valeur fournie
    const users = await prisma.user.findMany({
      where: {
        username: {
          startsWith: username,
        },
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        city: true,
        country: true,
        isBanned: true,
        banReason: true,
        banEndDate: true,
      },
    });

    // Recherche des entreprises dont le companyName commence par la valeur fournie
    const companies = await prisma.company.findMany({
      where: {
        companyName: {
          startsWith: username,
        },
      },
      select: {
        id: true,
        companyName: true,
        email: true,
        city: true,
        country: true,
        street: true,
        companyNumber: true,
        isBanned: true,
        banReason: true,
        banEndDate: true,
      },
    });

    // Combiner les résultats
    const results: SearchResult[] = [
      ...users.map((user) => ({
        type: 'user' as const,
        ...user,
      })),
      ...companies.map((company) => ({
        type: 'company' as const,
        ...company,
      })),
    ];

    // Si aucun résultat trouvé
    if (results.length === 0) {
      return NextResponse.json({ error: 'Aucun résultat trouvé.' }, { status: 404 });
    }

    // Retourner les résultats trouvés
    return NextResponse.json(results);
  } catch (error: unknown) {
    console.error('Erreur lors de la recherche :', error);
    return NextResponse.json({ error: 'Erreur serveur, veuillez réessayer plus tard.' }, { status: 500 });
  } finally {
    // Fermer le client Prisma
    await prisma.$disconnect();
  }
}
