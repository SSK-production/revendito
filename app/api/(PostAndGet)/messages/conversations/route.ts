import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    // Extraire les paramètres de recherche de l'URL
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');

    // Validation de l'ID de conversation
    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 });
    }

    // Récupérer les messages avec les noms associés
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { sentAt: 'asc' }, // Trier par date d'envoi
      include: {
        senderUser: { select: { username: true } }, // Inclure le username de l'expéditeur (si user)
        senderCompany: { select: { companyName: true } }, // Inclure le companyName de l'expéditeur (si company)
        receiverUser: { select: { username: true } }, // Inclure le username du destinataire (si user)
        receiverCompany: { select: { companyName: true } }, // Inclure le companyName du destinataire (si company)
      },
    });

    // Retourner les messages récupérés
    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
