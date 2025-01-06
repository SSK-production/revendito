import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Report, ReporterType } from "@prisma/client";
import { reportSchema } from "@/app/validation";
import { getUserFromRequest } from "@/app/lib/tokenManager";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
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
  }
}


export async function POST(req: NextRequest) {
  try {
    // réception des données

    // récupèration de l'id et de l'entity via le cookie
    const { id, entity, accessToken } = await getUserFromRequest(req);
    let reporterId: string = "null";
    let reporterType: ReporterType = ReporterType.USER;

    if (entity === "user") {
      reporterId = id;
      reporterType = ReporterType.USER;
    } else if (entity === "company") {
      reporterId = id;
      reporterType = ReporterType.COMPANY;
    }
    const { reason, vehicleOfferId, realEstateOfferId, commercialOfferId } =
      await req.json();

    //vérification des données
    const { error } = reportSchema.validate(
      { reason, vehicleOfferId, realEstateOfferId, commercialOfferId },
      { abortEarly: false }
    );
    if (error) {
      const validationErrors = error.details.map((err) => err.message);
      console.log("Erreurs de validation:", validationErrors);
      return NextResponse.json({ error: validationErrors }, { status: 400 });
    }

    //ajout des donnée
    const newReport: Report = await prisma.report.create({
      data: {
        reason,
        vehicleOfferId,
        realEstateOfferId,
        commercialOfferId,
        reporterId,
        reporterType,
      },
    });

    //recrée un accessToken
    const response = NextResponse.json({ newReport }, { status: 201 });
    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
      sameSite: "strict",
      path: "/",
    });

    return response;

    //gestion des erreurs
  } catch (error: unknown) {
    console.error("Erreur lors de la création du report:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Erreur lors de la création du report: " + error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Erreur inconnue lors de la création du report" },
      { status: 500 }
    );
  }
}
