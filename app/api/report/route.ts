import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { offerId, type, reason, reporterId, reporterType } = req.body;

        if (!offerId || !type || !reason || !reporterId || !reporterType) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        try {
            // Prépare les données pour le signalement en fonction du type d'offre
            const data: any = {
                reason,
                reporterId,
                reporterType,
            };

            if (type === "vehicleOffer") {
                data.vehicleOfferId = offerId;
            } else if (type === "realEstateOffer") {
                data.realEstateOfferId = offerId;
            } else if (type === "commercialOffer") {
                data.commercialOfferId = offerId;
            } else {
                return res.status(400).json({ error: "Invalid offer type." });
            }

            // Création du signalement dans la base de données
            const report = await prisma.report.create({
                data,
            });

            return res.status(201).json({ message: "Report created successfully.", report });
        } catch (error) {
            console.error("Error creating report:", error);
            return res.status(500).json({ error: "An error occurred while creating the report." });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed." });
    }
}
