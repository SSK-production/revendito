import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromRequest } from '@/app/lib/tokenManager';

const prisma = new PrismaClient();
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 3; // Fixed limit to display groups 3 by 3

    if (isNaN(page) || page < 1) {
      return NextResponse.json(
        { error: "Invalid pagination parameters. 'page' must be a positive integer." },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    const reports = await prisma.report.findMany({
      orderBy: {
        createdAt: "desc", // Order by most recent first
      },
    });

    if (!reports || reports.length === 0) {
      return NextResponse.json(
        { error: "Aucun rapport trouvé" },
        { status: 404 }
      );
    }

    // Regrouper les rapports par leurs identifiants
    const groupedReports = reports.reduce((acc, report) => {
      const key =
        report.vehicleOfferId ||
        report.realEstateOfferId ||
        report.commercialOfferId;

      if (key) {
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(report);
      }
      return acc;
    }, {} as Record<string, typeof reports>);

    // Transformer l'objet regroupé en tableau
    const allGroups = Object.values(groupedReports).map((group) => ({
      groupKey: group[0].vehicleOfferId || group[0].realEstateOfferId || group[0].commercialOfferId,
      reports: group,
    }));

    const totalGroups = allGroups.length;
    const paginatedGroups = allGroups.slice(skip, skip + limit);
    const totalPages = Math.ceil(totalGroups / limit);

    return NextResponse.json(
      {
        currentPage: page,
        totalPages,
        totalGroups,
        groups: paginatedGroups,
      },
      { status: 200 }
    );
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



export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user = await getUserFromRequest(req);
    if (!user.accessToken) {
      return NextResponse.json({ error: 'Utilisateur non authentifié.' }, { status: 401 });
    }

    // Définition des types de données
    interface ReportBody {
      reason: string;
      status?: string;
      vehicleOfferId?: number | null;
      realEstateOfferId?: number | null;
      commercialOfferId?: number | null;
      reporterUserId?: string | null;
      reporterCompanyId?: string | null;
      reporterType: 'USER' | 'COMPANY';
    }

    const { reason, status, vehicleOfferId, realEstateOfferId, commercialOfferId, reporterUserId, reporterCompanyId, reporterType }: ReportBody = body;
    console.log("reason", reason, status, vehicleOfferId, realEstateOfferId, commercialOfferId, reporterUserId, reporterCompanyId, reporterType);
    
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
      console.log('Invalid reporterType:', reporterType);
      return NextResponse.json({ error: 'Invalid reporterType. It should be USER or COMPANY.' }, { status: 400 });
    }

    if (reporterType === 'USER' && !reporterUserId && typeof reporterUserId !== 'string') {
      console.log('reporterUserId is required when reporterType is USER.');
      return NextResponse.json({ error: 'reporterUserId is required when reporterType is USER.' }, { status: 400 });
      
    }
    if (reporterType === 'COMPANY' && !reporterCompanyId && typeof reporterCompanyId !== 'string') {
      console.log('Invalid reporterCompanyId:', reporterCompanyId);
      return NextResponse.json({ error: 'Invalid reporterCompanyId.' }, { status: 400 });
    }

    if (vehicleOfferId && (typeof vehicleOfferId !== 'number' && vehicleOfferId !== null)) {
      console.log('Invalid vehicleOfferId:', vehicleOfferId);
      return NextResponse.json({ error: 'vehicleOfferId should be a number or null.' }, { status: 400 });
    }

    if (realEstateOfferId && (typeof realEstateOfferId !== 'number' && realEstateOfferId !== null)) {
      console.log('Invalid realEstateOfferId:', realEstateOfferId);
      return NextResponse.json({ error: 'realEstateOfferId should be a number.' }, { status: 400 });
    }

    if (commercialOfferId && (typeof commercialOfferId !== 'number' && commercialOfferId !== null)) {
      console.log('Invalid commercialOfferId:', commercialOfferId);
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
    
    const response = NextResponse.json(
      { message: "offer reported with succes", report: report },
      { status: 200 }
    );
    response.cookies.set("access_token", user.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
      sameSite: "strict",
      path: "/",
    });
    return response
  } catch (error: unknown) {
    console.error('Erreur lors de la création du signalement:', error);

    if (error instanceof Error) {
      return NextResponse.json({ error: 'Erreur lors de la création du signalement: ' + error.message }, { status: 500 });
    }

    // Gestion des erreurs générales
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

