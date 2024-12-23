import { getReceiverDetails, verifyId } from "@/app/lib/function";
import { getUserFromRequest } from "@/app/lib/tokenManager";
import { messageSchema } from "@/app/validation";
import { Message, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { log } from "node:console";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        // 1. Extraire les paramètres de la requête
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "L'ID utilisateur est requis." }, { status: 400 });
        }
        console.log(userId);
        
        // 2. Récupérer les derniers messages de chaque conversation
        const latestMessages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderUserId: userId },
                    { receiverUserId: userId },
                ],
            },
            orderBy: {
                sentAt: "desc",
            },
            distinct: ["conversationId"],
        });

        // 3. Retourner les derniers messages de chaque conversation
        return NextResponse.json({ latestMessages }, { status: 200 });

    } catch (error: unknown) {
        console.error("Erreur lors de la récupération des messages:", error);
        const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
        return NextResponse.json(
            { error: `Erreur lors de la récupération des messages: ${errorMessage}` },
            { status: 500 }
        );
    }
}


export async function POST(req: NextRequest) {
    try {
        // 1. Récupérer les informations de l'utilisateur
        const { id, entity, accessToken } = await getUserFromRequest(req);
        verifyId(id, entity);

        // 2. Récupérer et valider les données du corps de la requête
        const { receiverId, offerId, offerType, content } = await req.json();
        const { error } = messageSchema.validate({ content }, { abortEarly: false });
        if (error) {
            const validationErrors = error.details.map((err) => err.message);
            console.error("Erreurs de validation:", validationErrors);
            return NextResponse.json({ error: validationErrors }, { status: 400 });
        }

        log("offerId", offerId);

        // 3. Générer un conversationId unique basé sur les participants
        const participants = [id, receiverId].sort().join("-");
        const conversationId = participants; // Utilise une combinaison triée pour garantir l'unicité
        const { receiverUserId, receiverCompanyId } = await getReceiverDetails(receiverId);

        if (!receiverUserId && !receiverCompanyId) {
            return NextResponse.json(
                { error: "Destinataire invalide ou non trouvé." },
                { status: 400 }
            );
        }
        // 4. Créer le message dans la base de données
        const newMessage: Message = await prisma.message.create({
            data: {
                senderUserId: entity === "user" ? id : null,
                senderCompanyId: entity === "company" ? id : null,
                receiverUserId,
                receiverCompanyId,
                content,
                conversationId, // Associe le message à une conversation unique
                vehicleOfferId: offerType === "vehicle" ? offerId : null,
                realEstateOfferId: offerType === "property" ? offerId : null,
                commercialOfferId: offerType === "commercial" ? offerId : null,
            },
        });

        // 5. Configurer la réponse avec le cookie d'authentification
        const response = NextResponse.json({ newMessage }, { status: 201 });
        response.cookies.set("access_token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600,
            sameSite: "strict",
            path: "/",
        });

        return response;
    } catch (error: unknown) {
        console.error("Erreur lors de la création du message:", error);
        const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
        return NextResponse.json(
            { error: `Erreur lors de la création du message: ${errorMessage}` },
            { status: 500 }
        );
    }
}
