import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, RealEstateOffer} from '@prisma/client';
import { propertySchema } from '@/app/validation';
import { getTokenFromCookies, verifyAccessToken } from '@/app/lib/tokenManager';
import { processFormData } from '@/app/lib/processFormData';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const realEstateOffers = await prisma.realEstateOffer.findMany();

    return NextResponse.json(realEstateOffers, { status: 200 });
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
    // Récupération et gestion du token
    const token = await getTokenFromCookies(req);
    if (!token) {
      console.log('Token d\'accès manquant');
      return NextResponse.json({ error: 'Token d\'accès manquant' }, { status: 401 });
    }
    console.log('Token reçu:', token);

    let decodedToken = null;
    try {
      decodedToken = verifyAccessToken(token);
    } catch (error: unknown) {
      console.error('Erreur de vérification du token:', error);
      if (error instanceof Error) {
        return NextResponse.json({ error: 'Token invalide: ' + error.message }, { status: 403 });
      }
      return NextResponse.json({ error: 'Erreur inconnue lors de la vérification du token' }, { status: 500 });
    }

    // Vérification que decodedToken n'est pas nul ou indéfini
    if (!decodedToken) {
      console.log('Le token décodé est null ou indéfini.');
      return NextResponse.json({ error: 'Token invalide ou expiré' }, { status: 403 });
    }

    const { id, entity } = decodedToken as { id: string; entity: 'user' | 'company' };
    if (!id || !entity) {
      console.log('Payload du token invalide:', decodedToken);
      return NextResponse.json({ error: 'Payload du token invalide' }, { status: 400 });
    }

    // Vérification si l'entité existe
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
        title: fields.title,
        description: fields.description,
        price: parseFloat(fields.price),
        city: fields.city,
        country: fields.country,
        propertyType: fields.propertyType,
        surface: parseInt(fields.surface),
        rooms: parseInt(fields.rooms),
        bedrooms: parseInt(fields.bedrooms),
        bathrooms: parseInt(fields.bathrooms),
        heatingType: fields.heatingType,
        energyClass: fields.energyClass,
        furnished: Boolean(fields.furnished),
        photos,  
        userId: entity === 'user' ? id : null,
        companyId: entity === 'company' ? id : null,
      }
    });
    console.log('Nouvelle offre créée:', newRealEstateOffer);

    return NextResponse.json(newRealEstateOffer, { status: 201 });
  } catch (error: unknown) {
    console.error('Erreur lors de la création de l\'offre:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Erreur lors de la création de l\'offre: ' + error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Erreur inconnue lors de la création de l\'offre' }, { status: 500 });
  }
}
