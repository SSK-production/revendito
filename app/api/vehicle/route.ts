import { PrismaClient, Vehicle } from '@prisma/client';

const prisma = new PrismaClient();

interface VehicleRequestBody {
  make: string;
  model: string;
  year: number;
  price: number;
  description: string;
}

export async function GET(): Promise<Response> {
  try {
    // Récupérer les véhicules depuis la base de données
    const vehicles: Vehicle[] = await prisma.vehicle.findMany();
    return new Response(JSON.stringify(vehicles), { status: 200 });
  } catch (error) {
    // Gérer les erreurs
    return new Response(JSON.stringify({ error: `Erreur serveur ${error}` }), { status: 500 });
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    // Extraire les données envoyées dans le corps de la requête
    const { make, model, year, price, description }: VehicleRequestBody = await request.json();

    // Ajouter un nouveau véhicule dans la base de données
    const newVehicle: Vehicle = await prisma.vehicle.create({
      data: {
        make,
        model,
        year,
        price,
        description,
      },
    });

    // Réponse en cas de succès
    return new Response(JSON.stringify(newVehicle), { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: `Erreur serveur lors de l'ajout du véhicule: ${error.message}` }), { status: 500 });
    }
    return new Response(JSON.stringify({ error: 'Erreur inconnue' }), { status: 500 });
  }
}
