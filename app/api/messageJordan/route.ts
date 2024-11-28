import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Message } from "@prisma/client";
import { messageSchema } from "@/app/validation"; // Assurez-vous que messageSchema est défini dans le fichier de validation
import { getUserFromRequest } from "@/app/lib/tokenManager"; // Assurez-vous que cette fonction est correctement importée

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // Récupération de l'id, entity, et accessToken via le cookie
    const { id, entity, accessToken } = await getUserFromRequest(req);
    const senderId = id;

    // Récupération des données JSON de la requête
    const requestData = await req.json();
    const { receiverId, content, offerId } = requestData;

    // Validation des données avec Joi
    const { error } = messageSchema.validate(requestData, {
      abortEarly: false,
    });
    if (error) {
      const validationErrors = error.details.map((err) => err.message);
      console.error("Erreurs de validation:", validationErrors);
      return NextResponse.json({ error: validationErrors }, { status: 400 });
    }

    // Validation supplémentaire : vérifier si senderId et receiverId existent dans la base de données
    const senderIsUser = await prisma.user.findUnique({
      where: { id: senderId },
    });
    const senderIsCompany = await prisma.company.findUnique({
      where: { id: senderId },
    });

    if (!senderIsUser && !senderIsCompany) {
      return NextResponse.json(
        { error: "L'expéditeur n'existe ni dans User ni dans Company" },
        { status: 400 }
      );
    }

    const receiverIsUser = await prisma.user.findUnique({
      where: { id: receiverId },
    });
    const receiverIsCompany = await prisma.company.findUnique({
      where: { id: receiverId },
    });

    if (!receiverIsUser && !receiverIsCompany) {
      return NextResponse.json(
        { error: "Le destinataire n'existe ni dans User ni dans Company" },
        { status: 400 }
      );
    }

    // Préparer les objets connect pour l'expéditeur et le destinataire
    const senderConnectData = senderIsUser
      ? { senderUser: { connect: { id: senderId } } }
      : senderIsCompany
      ? { senderCompany: { connect: { id: senderId } } }
      : {};

    const receiverConnectData = receiverIsUser
      ? { receiverUser: { connect: { id: receiverId } } }
      : receiverIsCompany
      ? { receiverCompany: { connect: { id: receiverId } } }
      : {};

    // Création du message
    const newMessage: Message = await prisma.message.create({
      data: {
        content,
        offerId: offerId || null, // Assurez-vous que offerId est correctement passé (null si non défini)
        senderId,
        receiverId,
        ...senderConnectData,
        ...receiverConnectData,
      },
    });

    // Création de la réponse avec le message créé et mise à jour du cookie
    const response = NextResponse.json({ newMessage }, { status: 201 });

    // Mise à jour du cookie avec le nouveau access_token
    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600, // 1 heure
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error("Erreur lors de la création du message:", error);
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
