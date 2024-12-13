import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

    // Validez l'username et le rôle avec votre logique métier (optionnel, si besoin)
   // Supprimez cette ligne si non applicable à `username`.

    let data;

    // Récupérez les données selon le rôle
    if (role === 'user') {
      data = await prisma.user.findUnique({
        where: { username: username },
      });
    } else if (role === 'company') {
      data = await prisma.company.findFirst({
        where: { companyName: username }, // Remplacez `name` par le champ utilisé pour identifier une entreprise.
      });
    } else {
      return NextResponse.json(
        { error: 'Rôle invalide. Utilisez "user" ou "company".' },
        { status: 400 }
      );
    }

    // Si aucune donnée n'est trouvée
    if (!data) {
      return NextResponse.json(
        { error: `Aucune donnée trouvée pour ${username} avec le rôle ${role}.` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { data },
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
  }
}
