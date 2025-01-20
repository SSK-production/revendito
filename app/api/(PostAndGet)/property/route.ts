import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, RealEstateOffer} from '@prisma/client';
import { propertySchema } from '@/app/validation';
import { getUserFromRequest,  } from '@/app/lib/tokenManager';
import { processFormData } from '@/app/lib/processFormData';
import { verifyId } from '@/app/lib/function';
const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1', 10);
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10', 10); 

    if (page <= 0 || limit <= 0) {
      return NextResponse.json({ error: "Page et limit doivent être des valeurs positives" }, { status: 400 });
    }

    const skip = (page - 1) * limit;

    const realEstateOffers = await prisma.realEstateOffer.findMany({
      skip: skip,
      take: limit,
      where: {
        AND: [
          { validated: true },
          { active: true },
          {
            OR: [
              { user: { active: true, isBanned: false } }, // Utilisateur actif
              { company: { active: true, isBanned: false } }, // Entreprise active
            ],
          },
        ],
      },
      include: {
        user: true, // Inclut les informations utilisateur
        company: true, // Inclut les informations entreprise
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const totalOffers = await prisma.realEstateOffer.count({
      where: {
        AND: [
          { validated: true },
          { active: true },
          {
            OR: [
              { user: { active: true, isBanned: false } },
              { company: { active: true, isBanned: false } },
            ],
          },
        ],
      },
      });

    return NextResponse.json({
      data: realEstateOffers,
      meta: {
        page,
        limit,
        total: totalOffers,
        totalPages: Math.ceil(totalOffers / limit),
      }
    }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching property offers:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Error fetching property offers: ${error.message}` },
        { status: 500 }
      );
    }

    // Retour générique pour les autres types d'erreurs
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
    const userData = await getUserFromRequest(req);
    if (userData.isBanned && userData.banEndDate && userData.banEndDate > new Date()) {
      // Si l'utilisateur est banni et la date de fin de bannissement n'est pas dépassée
      return NextResponse.json({
        error: "Banned",
        message: `You are banned from using this service. Reason: ${
          userData.banReason || "No reason specified"
        }. Ban will end on: ${userData.banEndDate.toISOString()}.`,
      }, {status: 403});
    }

    if (!userData.active) {
      return NextResponse.json(
        {
          error: "Your account is inactive. Please contact the support team for more information.",
          message: "Your account is inactive. Please contact the support team for more information.",
        },
        { status: 403 } // Définit le statut HTTP à 403 Forbidden
      );
    }
    // Vérification si l'entité existe
    verifyId(userData.id, userData.entity);

    const formData = await req.formData();
    const uploadDir = 'public/offer';

    // Traitement des données de formulaire et des fichiers
    const { fields, photos } = await processFormData(formData, uploadDir);

    console.log('Fields:', fields);
    console.log('Uploaded Photos:', photos);

    // Validation des champs, y compris les photos (qui sont maintenant des chaînes)
    const { error } = propertySchema.validate({ ...fields, photos }, { abortEarly: false });

    if (error) {
      const validationErrors = error.details.map((err) => err.message);
      console.log('Erreurs de validation:', validationErrors);
      return NextResponse.json({ error: validationErrors }, { status: 400 });
    }

    console.log('Début de la création de l\'offre');
    const newRealEstateOffer: RealEstateOffer = await prisma.realEstateOffer.create({
      data: {
        vendor: userData.username,
        vendorType: userData.entity,
        title: fields.title,
        description: fields.description,
        price: parseFloat(fields.price),
        city: fields.city,
        country: fields.country,
        propertyType: fields.propertyType,
        propertyCondition: fields.propertyCondition,
        surface: parseInt(fields.surface),
        rooms: parseInt(fields.rooms),
        bedrooms: parseInt(fields.bedrooms),
        bathrooms: parseInt(fields.bathrooms),
        heatingType: fields.heatingType,
        energyClass: fields.energyClass,
        furnished: Boolean(fields.furnished),
        parking: Boolean(fields.parking),
        garage: Boolean(fields.garage),
        elevator: Boolean(fields.elevator),
        balcony: Boolean(fields.balcony),
        terrace: Boolean(fields.terrace),
        garden: Boolean(fields.garden),
        basementAvailable: Boolean(fields.basementAvailable),
        floorNumber: parseInt(fields.floorNumber),
        totalFloors: parseInt(fields.totalFloors),
        contactNumber: fields.contactNumber,
        contactEmail: fields.contactEmail,
        availabilityDate: new Date(fields.availabilityDate),
        location: Boolean(fields.location),
        photos,  
        userId: userData.entity === 'user' ? userData.id : null,
        companyId: userData.entity === 'company' ? userData.id : null,
      }
    });
    console.log('Nouvelle offre créée:', newRealEstateOffer);

    const response = NextResponse.json({ newRealEstateOffer }, { status: 201 });

    response.cookies.set('access_token', userData.accessToken, {
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
