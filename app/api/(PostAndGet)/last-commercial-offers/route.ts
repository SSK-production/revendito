import {PrismaClient} from "@prisma/client";
import {NextResponse} from "next/server";

const prisma = new PrismaClient();

export async function GET() {

    try {
        const offers = await prisma.commercialOffer.findMany({
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
            take: 3,
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(offers, {status: 200});
    } catch (error) {
        console.error('Error getting last commercial offers:', error);
        return NextResponse.json({error: 'Error getting last commercial offers'}, {status: 500});
    }
}