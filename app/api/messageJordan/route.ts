import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { messageSchema } from "@/app/validation"; // Assurez-vous que le schéma de validation existe
import { getUserFromRequest } from "@/app/lib/tokenManager"; // Pour extraire les données de l'utilisateur depuis le token

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Récupération de l'id et accessToken via le cookie
    const { id, accessToken } = await getUserFromRequest(req);

    // Query to get messages sent or received by the user
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderUserId: id },
          { receiverUserId: id },
          { senderCompanyId: id },
          { receiverCompanyId: id },
        ],
      },
      include: {
        senderUser: true,
        senderCompany: true,
        receiverUser: true,
        receiverCompany: true,
        vehicleOffer: true,
        realEstateOffer: true,
        commercialOffer: true,
      },
    });

    // Création de la réponse avec l'id, accessToken, et messages
    const response = NextResponse.json(
      { id, accessToken, messages },
      { status: 200 }
    );

    // Mise à jour du cookie avec l'accessToken
    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
      sameSite: "strict",
      path: "/",
    });

    // Retourne la réponse avec les cookies mis à jour et les messages
    return response;
  } catch (error: unknown) {
    console.error("Erreur lors de la récupération des données:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "Erreur lors de la récupération des données: " + error.message,
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Erreur inconnue lors de la récupération des données" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const requestBody = await req.json();

    // Validate the request body against the schema
    const { error } = messageSchema.validate(requestBody);

    if (error) {
      return NextResponse.json(
        { error: error.details.map((err) => err.message).join(", ") },
        { status: 400 }
      );
    }

    // Continue with the processing if validation passes
    const {
      receiverUserId,
      receiverCompanyId,
      content,
      senderUserId,
      senderCompanyId,
      offerId,
    } = requestBody;

    // Create message logic, assuming everything is valid
    const message = await prisma.message.create({
      data: {
        senderUserId,
        senderCompanyId,
        receiverUserId,
        receiverCompanyId,
        content,
        offerId,
        sentAt: new Date(),
      },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("Error processing the message:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the message." },
      { status: 500 }
    );
  }
}
