import { PrismaClient, VehicleOffer } from '@prisma/client';
import { vehicleSchema } from '@/app/validation';
import { getTokenFromCookies, verifyAccessToken } from '@/app/lib/tokenManager';
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const token = getTokenFromCookies(req);
    if (!token) {
      return new Response(JSON.stringify({ error: 'Access token is missing' }), { status: 401 });
    }

    let decodedToken;
    try {
      decodedToken = verifyAccessToken(token);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Invalid token'+ error.message, }), { status: 403 });
      }
      return new Response(JSON.stringify({ error: 'Erreur inconnue' }), { status: 500 });
    }

    const { id, entity } = decodedToken as { id: string; entity: 'user' | 'company' };

    if (!id || !entity) {
      return new Response(JSON.stringify({ error: 'Invalid token payload' }), { status: 400 });
    }

    // Vérification si l'entité existe (optionnel)
    if (entity === 'user') {
      const userExists = await prisma.user.findUnique({ where: { id } });
      if (!userExists) {
        return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
      }
    } else if (entity === 'company') {
      const companyExists = await prisma.company.findUnique({ where: { id } });
      if (!companyExists) {
        return new Response(JSON.stringify({ error: 'Company not found' }), { status: 404 });
      }
    }

    const requestBody = await req.json();
    const { title, description, price, city, country, model, year, mileage, fuelType, color, transmission, subCategoryId } : VehicleOffer = requestBody;

    const { error } = vehicleSchema.validate(
      { title, description, price, city, country, model, year, mileage, fuelType, color, transmission, subCategoryId },
      { abortEarly: false }
    );

    if (error) {
      const validationErrors = error.details.map((err) => err.message);
      return new Response(JSON.stringify({ error: validationErrors }), {
        status: 400,
      });
    }

    const newVehicleOffer : VehicleOffer = await prisma.vehicleOffer.create({
      data : {
        title,
        description,
        price,
        city,
        country,
        model,
        year,
        mileage,
        fuelType,
        color,
        transmission,
        subCategoryId,
        userId: entity === 'user' ? id : null,
        companyId: entity === 'company' ? id : null,
      }
    })

    return new Response(JSON.stringify(newVehicleOffer), {status: 201})
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);
      return new Response('Error creating offer: ' + error.message, { status: 500 });
    }
    return new Response(JSON.stringify({ error: 'Erreur inconnue' }), { status: 500 });
  }
} 