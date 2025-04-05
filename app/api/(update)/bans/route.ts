import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromRequest } from '@/app/lib/tokenManager';

const prisma = new PrismaClient();

// Vérifier si un rôle est valide
function isValidRole(role: string | null): boolean {
  return role === 'ADMIN' || role === 'MODERATOR';
}

// Bannir un utilisateur ou une entreprise

export async function PATCH(req: NextRequest): Promise<Response> {
  try {
    // Récupérer l'utilisateur connecté
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

    // Lire les données envoyées dans le corps de la requête
    const body = await req.json();
    const { id, bannTitle, reason, duration, type, banned } = body;
    let message = '';
    console.log('body', body);
    
    if (!banned) {
      if (!id || !bannTitle || !reason || typeof duration !== 'number' || duration <= 0 || !type) {
        return NextResponse.json(
          { error: 'Données invalides : id, bannTitle, reason, duration et type sont requis.' },
          { status: 400 }
        );
      }
  
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + duration);
      if (type === 'admin' || type === 'moderator') {
        return NextResponse.json({ error: 'You do not have the right to ban an administrator or a moderator.' }, { status: 403 });
        
      }
      if (type === 'user') {
        // Récupérer les données existantes pour l'utilisateur
        const existingUser = await prisma.user.findUnique({
          where: { id },
          select: {
            bannTitle: true,
            banReason: true,
            bannedByUsername: true,
          },
        });
  
        if (!existingUser) {
          return NextResponse.json({ error: 'Utilisateur introuvable.' }, { status: 404 });
        }
  
        // Fusionner les données existantes avec les nouvelles
        
        const updatedBanTitle = existingUser.bannTitle
          ? [...existingUser.bannTitle, ...bannTitle]
          : bannTitle;
  
        const updatedBanReason = existingUser.banReason
          ? [...existingUser.banReason, ...reason]
          : reason;
  
          const updatedBannedByUsername = existingUser.bannedByUsername
          ? [...existingUser.bannedByUsername, user.username]
          : [user.username];
  
        
  
        // Mettre à jour l'utilisateur
        await prisma.user.update({
          where: { id },
          data: {
            isBanned: true,
            banCount: { increment: 1 },
            banReason: updatedBanReason,
            bannTitle: updatedBanTitle,
            banEndDate: endDate,
            bannedByUsername: updatedBannedByUsername,
            bannedBy: user.id,
          },
        });
  
      } else if (type === 'company') {
        // Récupérer les données existantes pour l'entreprise
        const existingCompany = await prisma.company.findUnique({
          where: { id },
          select: {
            bannTitle: true,
            banReason: true,
          },
        });
  
        if (!existingCompany) {
          return NextResponse.json({ error: 'Entreprise introuvable.' }, { status: 404 });
        }
  
        // Fusionner les données existantes avec les nouvelles
        const updatedBanTitle = existingCompany.bannTitle
          ? `${existingCompany.bannTitle}, ${bannTitle}`
          : bannTitle;
  
        const updatedBanReason = existingCompany.banReason
          ? [...existingCompany.banReason, ...reason]
          : reason;
  
        // Mettre à jour l'entreprise
        await prisma.company.update({
          where: { id },
          data: {
            isBanned: true,
            banCount: { increment: 1 },
            banReason: updatedBanReason,
            bannTitle: updatedBanTitle,
            banEndDate: endDate,
            bannedBy: user.id,
          },
        });
  
       
      } else {
        return NextResponse.json({ error: 'Type invalide (user ou company requis).' }, { status: 400 });
      }
      message = 'Ban with successfully'
    }
    else {
      if (type === 'user') {
        await prisma.user.update({
          where: { id },
          data: {
            isBanned: false,
          },
        });
      } 
      else if (type === 'company') {
        await prisma.company.update({
          where: { id },
          data: {
            isBanned: false,
          },
        });
      }
      message = 'Unban with successfully'
    }
    return NextResponse.json({ message: message });
    
  } catch (error) {
    console.error('Erreur lors du bannissement :', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
