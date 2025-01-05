import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, CommercialOffer} from '@prisma/client';
import { commercialOfferSchema } from '@/app/validation';
import { getUserFromRequest } from '@/app/lib/tokenManager';
import { processFormData } from '@/app/lib/processFormData';
import { verifyId } from '@/app/lib/function';


const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Paramètres de pagination, avec des valeurs par défaut
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1', 10); // Page par défaut : 1
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10', 10); // Limite par défaut : 10
  
    // Validation des paramètres pour éviter les valeurs trop grandes ou invalides
    if (page <= 0 || limit <= 0) {
    return NextResponse.json({ error: "Page et limit doivent être des valeurs positives" }, { status: 400 });
    }
  
    // Calcul du skip pour l'offset
    const skip = (page - 1) * limit;
  
    // Requête Prisma avec pagination et filtre validated = true
    const commercialOffers = await prisma.commercialOffer.findMany({
    skip: skip,
    take: limit,
    where: {
      validated: true,
      active: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
    });
  
    const totalOffers = await prisma.commercialOffer.count({
    where: {
      validated: true,
      active: true,
    },
    });
  
    return NextResponse.json({
    data: commercialOffers,
    meta: {
      page,
      limit,
      total: totalOffers,
      totalPages: Math.ceil(totalOffers / limit), // Nombre total de pages
    }
    }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching commercial offers:", error);
  
    if (error instanceof Error) {
    return NextResponse.json(
      { error: `Error fetching commercial offers: ${error.message}` },
      { status: 500 }
    );
    }
    return NextResponse.json(
    { error: "An unexpected error occurred." },
    { status: 500 }
    );
  }
  }

export async function POST(req: NextRequest) {
  console.log('Début du traitement de la requête POST');
  try {
    // On récup le token
    const { id, username, entity,isBanned, banReason, banEndDate, accessToken, active } = await getUserFromRequest(req);
    if (isBanned && banEndDate && banEndDate > new Date()) {
      // Si l'utilisateur est banni et la date de fin de bannissement n'est pas dépassée
      return NextResponse.json({
        error: "Banned",
        message: `You are banned from using this service. Reason: ${
          banReason || "No reason specified"
        }. Ban will end on: ${banEndDate.toISOString()}.`,
      })
    }

    if (!active) {
      return NextResponse.json({
        error: "Inactive",
        message: "Your account is inactive. Please contact the support team for more information.",
      });
    }
    // Vérification si l'entité existe
    verifyId(id, entity);
    
    const formData = await req.formData();
    const uploadDir = 'public/offer';

    // Traitement des données de formulaire et des fichiers
    const { fields, photos } = await processFormData(formData, uploadDir);

    console.log('Fields:', fields);
    console.log('Uploaded Photos:', photos);

    fields.categories = JSON.parse(fields.categories); // Transforme la chaîne JSON en tableau
    fields.openingHours = JSON.parse(fields.openingHours);
    // Validation des champs, y compris les photos (qui sont maintenant des chaînes)
    const { error } = commercialOfferSchema.validate({ ...fields, photos }, { abortEarly: false });

    if (error) {
      const validationErrors = error.details.map((err) => err.message);
      console.log('Erreurs de validation:', validationErrors);
      return NextResponse.json({ error: validationErrors }, { status: 400 });
    }

    console.log('Début de la création de l\'offre');
    console.log({data: {
      vendor: username,
      vendorType: entity,
      title: fields.title,
      description: fields.description,
      price: parseFloat(fields.price),
      city: fields.city,
      country: fields.country,
      openingHours: JSON.stringify(fields.openingHours),
      categories: [JSON.stringify(fields.categories)],
      commercialType: fields.commercialType,
      duration: parseInt(fields.duration),
      contractType: fields.contractType,
      workSchedule: fields.workSchedule,
      contactNumber: fields.contactNumber,
      contactEmail: fields.contactEmail,
      photos,  
      userId: entity === 'user' ? id : null,
      companyId: entity === 'company' ? id : null,
    }});
    
    const newCommercialOffer: CommercialOffer = await prisma.commercialOffer.create({
      data: {
        vendor: username,
        vendorType: entity,
        title: fields.title,
        description: fields.description,
        price: parseFloat(fields.price),
        city: fields.city,
        country: fields.country,
        openingHours: JSON.stringify(fields.openingHours),
        categories: [JSON.stringify(fields.categories)],
        commercialType: fields.commercialType,
        duration: parseInt(fields.duration),
        contractType: fields.contractType,
        workSchedule: fields.workSchedule,
        contactNumber: fields.contactNumber,
        contactEmail: fields.contactEmail,
        photos,  
        userId: entity === 'user' ? id : null,
        companyId: entity === 'company' ? id : null,
      }
    });
    console.log('Nouvelle offre créée:', newCommercialOffer);

    const response = NextResponse.json({ newCommercialOffer }, { status: 201 });

    response.cookies.set('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 3600,
        sameSite: 'strict',
        path: '/',
      });
  
      return response; 
  } catch (error: unknown) {
    console.error('Erreur lors de la création de l\'offre:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Erreur lors de la création de l\'offre: ' + error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Erreur inconnue lors de la création de l\'offre' }, { status: 500 });
  }
}
