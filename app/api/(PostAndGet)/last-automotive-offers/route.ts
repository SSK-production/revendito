import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Récupérer les offres avec des utilisateurs ou entreprises actives
        const offers = await prisma.vehicleOffer.findMany({
            where: {
                AND: [
                    { active: true }, // Offre active
                    {
                        OR: [
                            { user: { active: true, isBanned: false } }, // Utilisateur actif
                            { company: { active: true, isBanned: false } }, // Entreprise active
                        ],
                    },
                ],
            },
            include: {
                user: true, // Inclut les informations utilisateur
                company: true, // Inclut les informations entreprise
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(offers, { status: 200 });
    } catch (error) {
        console.error("Error fetching offers:", error);
        return NextResponse.json({ error: "Error fetching offers" }, { status: 500 });
    }
}
