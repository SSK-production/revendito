import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Récupérer tous les rapports sans inclure de relations supplémentaires
    const reports = await prisma.report.findMany();

    // Si aucune donnée n'est trouvée
    if (!reports || reports.length === 0) {
      return NextResponse.json({ message: 'Aucun rapport trouvé' }, { status: 404 });
    }

    // Retourner les rapports trouvés
    return NextResponse.json(reports, { status: 200 });
  } catch (error) {
    // Si l'erreur n'est pas un objet, la formater en objet
    console.error('Erreur lors de la récupération des rapports:', error);

    // Vérification si l'erreur est un objet ou non
    const errorMessage = (error instanceof Error) ? error.message : 'Erreur interne du serveur';
    
    // Retourner une réponse d'erreur avec un code 500
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
