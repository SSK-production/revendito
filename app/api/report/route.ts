import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Report, ReporterType } from "@prisma/client";
import { reportSchema } from "@/app/validation";
import { getUserFromRequest } from "@/app/lib/tokenManager";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { id, entity } = await getUserFromRequest(req);

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

    const { error } = reportSchema.validate(
      { reason, vehicleOfferId, realEstateOfferId, commercialOfferId },
      { abortEarly: false }
    );
    if (error) {
      const validationErrors = error.details.map((err) => err.message);
      console.log("Erreurs de validation:", validationErrors);
      return NextResponse.json({ error: validationErrors }, { status: 400 });
    }

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

    return NextResponse.json(newReport, { status: 201 });
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
