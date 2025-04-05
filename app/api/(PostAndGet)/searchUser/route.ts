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
      banReason: string[] | null;
      banEndDate: Date | null;
      banCount: number;
      bannTitle: string | null; // Modifié pour être une chaîne JSON
      bannedByUsername: string | null;
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
      banReason: string[] | null;
      banEndDate: Date | null;
      bannedByUser: { id: string; username: string } | null; // Accepte un objet au lieu d'une chaîne
      bannTitle: string | null; // Modifié pour être une chaîne JSON
    };

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');
    const isBannedParam = searchParams.get('isBanned');

    const isBanned =
      isBannedParam === 'true' ? true : isBannedParam === 'false' ? false : undefined;

    if (!username && isBanned === undefined) {
      return NextResponse.json(
        { error: "Paramètre invalide : 'username' ou 'isBanned' doit être fourni." },
        { status: 400 }
      );
    }

    // Recherche des utilisateurs
    const users = await prisma.user.findMany({
      where: {
        ...(username && { username: { startsWith: username } }),
        ...(isBanned !== undefined && { isBanned }),
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
        banCount: true,
        bannTitle: true,
        bannedByUsername: true, // Assurez-vous que ce champ existe dans votre modèle User
      },
    });

    // Recherche des entreprises
    const companies = await prisma.company.findMany({
      where: {
        ...(username && { companyName: { startsWith: username } }),
        ...(isBanned !== undefined && { isBanned }),
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
        bannTitle: true, // Assurez-vous que ce champ existe dans le modèle Prisma Company
        bannedByUser: true, // Assurez-vous que ce champ existe dans le modèle Prisma Company
      },
    });

    // Transformation des résultats pour convertir bannTitle en chaîne JSON
    const results = [
      ...users.map((user) => ({
        type: 'user' as const,
        ...user,
        bannTitle: user.bannTitle ? JSON.stringify(user.bannTitle) : null, // Convertir en chaîne JSON
      })),
      ...companies.map((company) => ({
        type: 'company' as const,
        ...company,
        bannTitle: company.bannTitle ? JSON.stringify(company.bannTitle) : null, // Convertir en chaîne JSON
      })),
    ];

    if (results.length === 0) {
      return NextResponse.json({ error: 'Aucun résultat trouvé.' }, { status: 404 });
    }

    return NextResponse.json(results);
  } catch (error: unknown) {
    console.error('Erreur lors de la recherche :', error);
    return NextResponse.json({ error: 'Erreur serveur, veuillez réessayer plus tard.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
