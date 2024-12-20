import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromRequest } from '@/app/lib/tokenManager';

const prisma = new PrismaClient();

type BanRequest = {
  id: string;
  username: string;
  type: 'user' | 'company';
  reason: string[];
  bannTitle: string;
  duration: number; // Durée en jours
};

// Vérifier si un rôle est valide
function isValidRole(role: string | null): boolean {
  return role === 'ADMIN' || role === 'MODERATOR';
}

// Bannir un utilisateur ou une entreprise
export async function POST(req: NextRequest): Promise<Response> {
  try {
    // Récupération de l'utilisateur connecté
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non authentifié.' }, { status: 401 });
    }

    // Vérification du rôle
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });
    if (!currentUser || !isValidRole(currentUser.role)) {
      return NextResponse.json({ error: 'Accès non autorisé.' }, { status: 403 });
    }

    // Lecture et validation des données
    const body: BanRequest = await req.json();
    const { id, username, type, bannTitle, reason, duration } = body;

    if (!id || !username || !type || !bannTitle || !reason || typeof duration !== 'number' || duration <= 0) {
      return NextResponse.json(
        { error: 'Données invalides : id, username, ban title, type, raison et durée sont requis.' },
        { status: 400 }
      );
    }

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + duration);

    // Logique de bannissement
    if (type === 'user') {
      await prisma.user.update({
        where: { id },
        data: {
          isBanned: true,
          banCount: { increment: 1 },
          banReason: reason,
          bannedByUsername: username,
          bannTitle: bannTitle,
          banEndDate: endDate,
          bannedBy: user.id,
        },
      });

      // Désactiver les offres associées
      await prisma.$transaction([
        prisma.vehicleOffer.updateMany({
          where: { userId: id },
          data: { userIsBanned: true },
        }),
        prisma.realEstateOffer.updateMany({
          where: { userId: id },
          data: { userIsBanned: true },
        }),
        prisma.commercialOffer.updateMany({
          where: { userId: id },
          data: {userIsBanned: true },
        }),
      ]);
    } else if (type === 'company') {
      await prisma.company.update({
        where: { id },
        data: {
          isBanned: true,
          banCount: { increment: 1 },
          banReason: reason,
          banEndDate: endDate,
          bannedBy: user.id,
        },
      });

      // Désactiver les offres associées
      await prisma.$transaction([
        prisma.vehicleOffer.updateMany({
          where: { companyId: id },
          data: { userIsBanned: true },
        }),
        prisma.realEstateOffer.updateMany({
          where: { companyId: id },
          data: { userIsBanned: true },
        }),
        prisma.commercialOffer.updateMany({
          where: { companyId: id },
          data: { userIsBanned: true },
        }),
      ]);
    } else {
      return NextResponse.json({ error: 'Type invalide (user ou company requis).' }, { status: 400 });
    }

    // Réponse en cas de succès
    return NextResponse.json({ message: 'Bannissement appliqué avec succès.' });
  } catch (error: unknown) {
    console.error('Erreur lors du traitement du bannissement :', error);
    return NextResponse.json({ error: 'Erreur serveur, veuillez réessayer plus tard.' }, { status: 500 });
  } finally {
    // Fermer le client Prisma pour éviter les fuites de mémoire
    await prisma.$disconnect();
  }
}
