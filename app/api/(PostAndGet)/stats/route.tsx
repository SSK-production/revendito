import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Récupérer les statistiques
        const userCount = await prisma.user.count();
        const companyCount = await prisma.company.count();
        const totalUserAndCompanyCount = userCount + companyCount;

        const pendingReportCount = await prisma.report.count({
            where: {
                status: "PENDING",
            },
        });
        const offerCount =
            (await prisma.vehicleOffer.count()) +
            (await prisma.realEstateOffer.count()) +
            (await prisma.commercialOffer.count());

        // Retourner les statistiques
        return NextResponse.json({
            success: true,
            data: {
                totalUserAndCompanyCount,
                pendingReportCount,
                offerCount,
            },
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des statistiques :", error);
        return NextResponse.json(
            { success: false, message: "Erreur interne du serveur" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}