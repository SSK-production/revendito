// app/api/offers/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function GET(request: Request) {
  try {
    // Récupération des paramètres de la requête
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10); // Page par défaut 1
    const limit = parseInt(url.searchParams.get('limit') || '10', 10); // Limite par défaut 10
    const category = url.searchParams.get('category') || ''; // Filtre par catégorie (optionnel)
    const validated = url.searchParams.get('validated'); // Filtre pour savoir si l'offre est validée ou non (true/false)

    // Définir le filtrage par validité (true/false)
    const validationFilter = validated === 'true' ? true : validated === 'false' ? false : undefined;

    // Récupérer les offres filtrées
    const vehicleOffers = await prisma.vehicleOffer.findMany({
      where: {
        ...(category && { type: category }), // Filtre par catégorie
        ...(validationFilter !== undefined && { validated: validationFilter }), // Filtre par validation
      },
      skip: (page - 1) * limit, // Pagination: décalage
      take: limit, // Nombre d'éléments à récupérer
      include: {
        user: true,
        company: true,
      },
    });

    const realEstateOffers = await prisma.realEstateOffer.findMany({
      where: {
        ...(category && { type: category }), // Filtre par catégorie
        ...(validationFilter !== undefined && { validated: validationFilter }), // Filtre par validation
      },
      skip: (page - 1) * limit, // Pagination: décalage
      take: limit, // Nombre d'éléments à récupérer
      include: {
        user: true,
        company: true,
      },
    });

    const commercialOffers = await prisma.commercialOffer.findMany({
      where: {
        ...(category && { type: category }), // Filtre par catégorie
        ...(validationFilter !== undefined && { validated: validationFilter }), // Filtre par validation
      },
      skip: (page - 1) * limit, // Pagination: décalage
      take: limit, // Nombre d'éléments à récupérer
      include: {
        user: true,
        company: true,
      },
    });

    // Combiner toutes les offres dans un seul tableau
    const allOffers = [...vehicleOffers, ...realEstateOffers, ...commercialOffers];
   
    
    return NextResponse.json(allOffers);
  } catch (error) {
    console.error("Error retrieving offers:", error);
    return NextResponse.json({ error: 'Error retrieving offers' }, { status: 500 });
  }
}
