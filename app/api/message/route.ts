import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { messageSchema } from "@/app/validation"; // Un schéma de validation adapté
import { getUserFromRequest } from "@/app/lib/tokenManager"; // Fonction pour extraire l'utilisateur

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // Récupérer les informations sur l'utilisateur depuis la requête
    const { id: senderId, entity } = await getUserFromRequest(req);

    if (!senderId || !entity) {
      return NextResponse.json(
        { error: "Informations utilisateur non disponibles." },
        { status: 401 }
      );
    }

    // Extraire le corps de la requête JSON
    const { receiverId, content, offerId } = await req.json();

    // Valider les données avec le schéma de validation
    const { error } = messageSchema.validate(
      { senderId, receiverId, content, offerId },
      { abortEarly: false }
    );

    if (error) {
      const validationErrors = error.details.map((err) => err.message);
      console.error("Erreurs de validation:", validationErrors);
      return NextResponse.json({ error: validationErrors }, { status: 400 });
    }

    // Créer un nouveau message
    const newMessage = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
        offerId: 12345,
      },
    });

    // Retourner une réponse JSON avec le message créé
    return NextResponse.json(newMessage, { status: 201 });
  } catch (error: unknown) {
    console.error("Erreur lors de la création du message:", error);

    // Gérer les erreurs et retourner un message approprié
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Erreur lors de la création du message: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Erreur inconnue lors de la création du message" },
      { status: 500 }
    );
  }
}
