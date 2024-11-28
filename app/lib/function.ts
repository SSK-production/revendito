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