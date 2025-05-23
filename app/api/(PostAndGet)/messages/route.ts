import { getReceiverDetails, verifyId } from "@/app/lib/function";
import { getUserFromRequest } from "@/app/lib/tokenManager";
import { messageSchema } from "@/app/validation";
import { Message, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import Pusher from "pusher";
const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
      // 1. Extraire les paramètres de la requête
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get("userId");
      const page = parseInt(searchParams.get("page") || "1", 10); // Par défaut, page 1
      const pageSize = parseInt(searchParams.get("pageSize") || "10", 10); // Par défaut, 10 éléments par page
  
      if (!userId) {
        return NextResponse.json(
          { error: "L'ID utilisateur est requis." },
          { status: 400 }
        );
      }
  
      if (page < 1 || pageSize < 1) {
        return NextResponse.json(
          { error: "Les paramètres page et pageSize doivent être supérieurs à 0." },
          { status: 400 }
        );
      }
  
      // 2. Calculer l'offset pour la pagination
      const offset = (page - 1) * pageSize;
  
      // 3. Récupérer les derniers messages de chaque conversation avec pagination
      const latestMessages = await prisma.message.findMany({
        where: {
          OR: [
            { senderUserId: userId },
            { receiverUserId: userId },
            { senderCompanyId: userId },
            { receiverCompanyId: userId },
          ],
        },
        orderBy: {
          sentAt: "desc",
        },
        skip: offset, // Ignorer les éléments avant l'offset
        take: pageSize, // Nombre d'éléments à récupérer
        distinct: ["conversationId"],
        include: {
          senderUser: {
            select: {
              username: true,
            },
          },
          senderCompany: {
            select: {
              companyName: true,
            },
          },
          receiverUser: {
            select: {
              username: true,
            },
          },
          receiverCompany: {
            select: {
              companyName: true,
            },
          },
        },
      });
  
      // 4. Transformer les données pour inclure le nom de l'autre personne
      const conversations = latestMessages.map((message) => {
        const otherPerson =
          message.senderUserId === userId
            ? message.receiverUser
              ? { name: message.receiverUser.username }
              : message.receiverCompany
              ? { name: message.receiverCompany.companyName }
              : { name: "Unknown" }
            : message.senderUser
            ? { name: message.senderUser.username }
            : message.senderCompany
            ? { name: message.senderCompany.companyName }
            : { name: "Unknown" };
  
        return {
          id: message.id,
          content: message.content,
          sentAt: message.sentAt,
          conversationId: message.conversationId,
          otherPersonName: otherPerson.name, // Le nom de l'autre personne
        };
      });
  
      // 5. Retourner les résultats avec les informations de pagination
      return NextResponse.json(
        {
          conversations,
          page,
          pageSize,
          total: conversations.length, // Nombre d'éléments retournés
        },
        { status: 200 }
      );
    } catch (error: unknown) {
      console.error("Erreur lors de la récupération des messages:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erreur inconnue";
      return NextResponse.json(
        { error: `Erreur lors de la récupération des messages: ${errorMessage}` },
        { status: 500 }
      );
    }
  }
  
  

  // Configuration de Pusher
    const pusher = new Pusher({
        appId: process.env.PUSHER_APP_ID!,
        key: process.env.PUSHER_KEY!,
        secret: process.env.PUSHER_SECRET!,
        cluster: process.env.PUSHER_CLUSTER!,
        useTLS: true,
    });


  export async function POST(req: NextRequest) {
    try {
        // 1. Récupérer les informations de l'utilisateur
        const { id, entity, username,accessToken, active } = await getUserFromRequest(req);

        if (!active) {
            return NextResponse.json({
              error: "Inactive",
              message: "Your account is inactive. Please contact the support team for more information.",
            });
          }

        verifyId(id, entity);

        // 2. Récupérer et valider les données du corps de la requête
        const { receiverId, offerId, offerType, content, otherPersonName } = await req.json();
        console.log("receiverId : ", receiverId, "content : ", content, "otherPersonName : ", otherPersonName);
        
        
        const { error } = messageSchema.validate({ content }, { abortEarly: false });
        if (error) {
            const validationErrors = error.details.map((err) => err.message);
            console.error("Erreurs de validation:", validationErrors);
            return NextResponse.json({ error: validationErrors }, { status: 400 });
        }

        // 3. Générer un conversationId unique basé sur les participants
        const participants = [id, receiverId].sort().join("-");
        const conversationId = participants;
        const { receiverUserId, receiverCompanyId } = await getReceiverDetails(receiverId);

        if (!receiverUserId && !receiverCompanyId) {
            return NextResponse.json(
                { error: "Destinataire invalide ou non trouvé." },
                { status: 400 }
            );
        }

        // 4. Créer le message dans la base de données
        const newMessage : Message = await prisma.message.create({
            data: {
                senderUserId: entity === "user" ? id : null,
                senderCompanyId: entity === "company" ? id : null,
                receiverUserId,
                receiverCompanyId,
                content,
                conversationId,
                vehicleOfferId: offerType === "vehicle" ? offerId : null,
                realEstateOfferId: offerType === "property" ? offerId : null,
                commercialOfferId: offerType === "commercial" ? offerId : null,
            },
        });

        // Lors de l'envoi d'un nouveau message, déclencher un événement conversation si nécessaire
        await pusher.trigger(`conversations-${receiverId}`, "new-conversation", {
            id: conversationId,
            otherPersonName: username,
            conversationId: conversationId,
            content: content,
            sentAt: new Date().toISOString(),
        });

        await pusher.trigger(`conversations-${id}`, "new-conversation", {
            id: conversationId,
            otherPersonName: otherPersonName,
            conversationId: conversationId,
            content: content,
            sentAt: new Date().toISOString(),
        });

        // 5. Émettre l'événement avec Pusher
        await pusher.trigger(`chat-${conversationId}`, "new-message", {
            newMessage
        });

        // 6. Configurer la réponse avec le cookie d'authentification
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


