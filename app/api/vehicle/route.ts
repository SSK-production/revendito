import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, VehicleOffer } from '@prisma/client';
import { vehicleSchema } from '@/app/validation';
import { getTokenFromCookies, verifyAccessToken } from '@/app/lib/tokenManager';
import { writeFile } from 'fs/promises';
import { join } from 'path';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  console.log('Début du traitement de la requête POST');
  try {
    const token = getTokenFromCookies(req);
    if (!token) {
      console.log('Token d\'accès manquant');
      return NextResponse.json({ error: 'Token d\'accès manquant' }, { status: 401 });
    }

    let decodedToken;
    try {
      decodedToken = verifyAccessToken(token);
    } catch (error: unknown) {
      console.error('Erreur de vérification du token:', error);
      if (error instanceof Error) {
        return NextResponse.json({ error: 'Token invalide: ' + error.message }, { status: 403 });
      }
      return NextResponse.json({ error: 'Erreur inconnue lors de la vérification du token' }, { status: 500 });
    }

    const { id, entity } = decodedToken as { id: string; entity: 'user' | 'company' };
    if (!id || !entity) {
      console.log('Payload du token invalide');
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
    const fields: Record<string, string> = {};

    
    // Parcours des fichiers et champs
    const photos: string[] = [];  // Tableau de chaînes pour les chemins des fichiers

for (const [key, value] of formData.entries()) {
  if (value instanceof Blob) {
    const buffer = Buffer.from(await value.arrayBuffer());
    const filename = `${Date.now()}-${value.name}`;
    const filepath = join(process.cwd(), 'public/uploads', filename);
    
    // Sauvegarde du fichier
    await writeFile(filepath, buffer);

    // Ajout du chemin du fichier dans le tableau photos
    photos.push(`/uploads/${filename}`);
  } else {
    fields[key] = value.toString();
  }
}
console.log("photos: "+photos);


// Validation des champs, y compris les photos (qui sont maintenant des chaînes)
const { error } = vehicleSchema.validate({ ...fields, photos }, { abortEarly: false });

if (error) {
  const validationErrors = error.details.map((err) => err.message);
  console.log('Erreurs de validation:', validationErrors);
  return NextResponse.json({ error: validationErrors }, { status: 400 });
    }
    

    console.log('Début de la création de l\'offre');
    const newVehicleOffer: VehicleOffer = await prisma.vehicleOffer.create({
      data: {
        title: fields.title,
        description: fields.description,
        price: parseFloat(fields.price),
        city: fields.city,
        country: fields.country,
        model: fields.model,
        year: parseInt(fields.year),
        mileage: parseInt(fields.mileage),
        fuelType: fields.fuelType,
        color: fields.color,
        transmission: fields.transmission,
        photos,
        subCategoryId: 1,
        userId: entity === 'user' ? id : null,
        companyId: entity === 'company' ? id : null,
      }
    });
    console.log('Nouvelle offre créée:', newVehicleOffer);

    return NextResponse.json(newVehicleOffer, { status: 201 });
  } catch (error: unknown) {
    console.error('Erreur lors de la création de l\'offre:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Erreur lors de la création de l\'offre: ' + error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Erreur inconnue lors de la création de l\'offre' }, { status: 500 });
  }
}
