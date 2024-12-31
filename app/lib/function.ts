import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function verifyId(id:string, entity:string) {
    if (entity === 'user') {
        const userExists = await prisma.user.findUnique({ where: { id } });
        if (!userExists) {
          console.log('Utilisateur non trouvé:', id);
          return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
        }
      } else if (entity === 'company') {
        const companyExists = await prisma.company.findUnique({ where: { id } });
        if (!companyExists) {
          console.log('Entreprise non trouvée:', id);
          return NextResponse.json({ error: 'Entreprise non trouvée' }, { status: 404 });
        }
      }
}

export async function getReceiverDetails(receiverId: string) {
  if (!receiverId) {
      throw new Error("Le receiverId est requis pour déterminer le destinataire.");
  }

  // Vérifie si le destinataire est un utilisateur
  const receiverUser = await prisma.user.findUnique({
      where: { id: receiverId },
  });
  if (receiverUser) {
      return { receiverUserId: receiverId, receiverCompanyId: null };
  }

  // Vérifie si le destinataire est une entreprise
  const receiverCompany = await prisma.company.findUnique({
      where: { id: receiverId },
  });
  if (receiverCompany) {
      return { receiverUserId: null, receiverCompanyId: receiverId };
  }

  // Si aucun destinataire trouvé
  return { receiverUserId: null, receiverCompanyId: null };
}

// première l'ettre en majuscule
export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}