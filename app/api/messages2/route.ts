import { verifyId } from "@/app/lib/function";
import { getUserFromRequest } from "@/app/lib/tokenManager";
import { messageSchema } from "@/app/validation";
import { PrismaClient, Message } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { id, entity, accessToken } = await getUserFromRequest(req);
    verifyId(id, entity);

    const { content } = await req.json();
    const { error } = messageSchema.validate(
      { content },
      { abortEarly: false }
    );
    if (error) {
      const validationErrors = error.details.map((err) => err.message);
      console.log("Erreurs de validation:", validationErrors);
      return NextResponse.json({ error: validationErrors }, { status: 400 });
    }

    //à UPDATE POUR AJOUTER UNE LOGIQUE CONDITIONNELLE
    const receiverUserId = "9c6d7fa5-24f6-434b-85d2-bf2d4082c7a5";
    const senderCompanyId = null;
    const receiverCompanyId = null;
    const vehicleOfferId = 4;
    const realEstateOfferId = null;
    const commercialOfferId = null;

        const newMessage: Message = await prisma.message.create({
            data: {
                // @ts-ignore
                senderUserId: id,
                receiverUserId,
                senderCompanyId,
                receiverCompanyId,
                content,
                vehicleOfferId,
                realEstateOfferId,
                commercialOfferId
            }
        });

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

