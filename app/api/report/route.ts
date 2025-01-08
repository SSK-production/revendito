import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const reports = await prisma.report.findMany();
    if (!reports) {
      return NextResponse.json(
        { error: "Aucun rapport trouvé" },
        { status: 404 }
      );
    }
    return NextResponse.json(reports, { status: 200 });
  } catch (error: unknown) {
    console.error("Erreur lors de la récupération des reports:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Erreur lors de la récupération des reports: " + error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Erreur inconnue lors de la récupération des reports" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}


export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Définition des types de données
    interface ReportBody {
      reason: string;
      status?: string;
      vehicleOfferId?: number | null;
      realEstateOfferId?: number | null;
      commercialOfferId?: number | null;
      reporterUserId: string;
      reporterCompanyId?: string | null;
      reporterType: 'USER' | 'COMPANY';
    }

    const { reason, status, vehicleOfferId, realEstateOfferId, commercialOfferId, reporterUserId, reporterCompanyId, reporterType }: ReportBody = body;

    // Validation des données
    if (typeof reason !== 'string' || reason.trim() === '') {
      return NextResponse.json({ error: 'Reason is required and should be a string.' }, { status: 400 });
    }

    if (status && typeof status !== 'string') {
      return NextResponse.json({ error: 'Status should be a string.' }, { status: 400 });
    }

    if (status && !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status. It should be one of: pending, approved, rejected.' }, { status: 400 });
    }

    if (reporterType && !['USER', 'COMPANY'].includes(reporterType)) {
      return NextResponse.json({ error: 'Invalid reporterType. It should be USER or COMPANY.' }, { status: 400 });
    }

    if (reporterUserId && typeof reporterUserId !== 'string') {
      return NextResponse.json({ error: 'Invalid reporterUserId.' }, { status: 400 });
    }

    if (reporterCompanyId && typeof reporterCompanyId !== 'string') {
      return NextResponse.json({ error: 'Invalid reporterCompanyId.' }, { status: 400 });
    }

    if (vehicleOfferId && typeof vehicleOfferId !== 'number' && vehicleOfferId !== null) {
      return NextResponse.json({ error: 'vehicleOfferId should be a number or null.' }, { status: 400 });
    }

    if (realEstateOfferId && typeof realEstateOfferId !== 'number') {
      return NextResponse.json({ error: 'realEstateOfferId should be a number.' }, { status: 400 });
    }

    if (commercialOfferId && typeof commercialOfferId !== 'number' && commercialOfferId !== null) {
      return NextResponse.json({ error: 'commercialOfferId should be a number or null.' }, { status: 400 });
    }

    // Création du signalement dans la base de données
    // Assurez-vous que `status` est une des valeurs de l'enum
    const statusValue: 'PENDING' | 'APPROVED' | 'REJECTED' = status?.toUpperCase() as 'PENDING' | 'APPROVED' | 'REJECTED';

    const report = await prisma.report.create({
      data: {
        reason,
        status: statusValue || 'PENDING',  // Ici, 'PENDING' est une valeur valide de l'enum
        vehicleOfferId: vehicleOfferId ?? null,
        realEstateOfferId: realEstateOfferId ?? null,
        commercialOfferId: commercialOfferId ?? null,
        reporterUserId: reporterUserId ?? null,
        reporterCompanyId: reporterCompanyId ?? null,
        reporterType,
      },
    });

    // Retour de la réponse avec le signalement créé
    return NextResponse.json(report);
  } catch (error: any) {
    console.error('Erreur lors de la création du signalement:', error.message);

    // Gestion des erreurs générales
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
