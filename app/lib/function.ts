import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

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


export async function authenticate(
  entity: "user" | "company",
  id: string,
  password: string
) {
  console.log("Début de l'authentification :", { entity, id, password });
  
  try {
    if (entity === "user") {
      const user = await prisma.user.findUnique({ where: { id } });

      if (!user) {
        console.error("Utilisateur non trouvé :", id);
        return NextResponse.json(
          { error: "Utilisateur introuvable." },
          { status: 404 }
        );
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        console.error("Mot de passe incorrect pour l'utilisateur :", id);
        
        return false; // Échec
      }

      console.log("Utilisateur authentifié :", id);
      return true; // Succès
    } else if (entity === "company") {
      const company = await prisma.company.findUnique({ where: { id } });

      if (!company) {
        console.error("Entreprise non trouvée :", id);
        return false; // Échec
      }

      const passwordMatch = await bcrypt.compare(password, company.password);
      if (!passwordMatch) {
        console.error("Mot de passe incorrect pour l'entreprise :", id);
        return false; // Échec
      }

      console.log("Entreprise authentifiée :", id);
      return true; // Succès
    } else {
      console.error("Entité invalide :", entity);
      return false
    }
  } catch (error) {
    console.error("Erreur inattendue :", error);
    return false
  }
}


