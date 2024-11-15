import { Category, PrismaClient, SubCategory } from '@prisma/client';

const prisma = new PrismaClient();
interface SubCategoryData {
    name : string;
    description: string;
    type: Category;
}


export async function GET() {
    try {
      const users = await prisma.subCategory.findMany();
      return new Response(JSON.stringify(users), { status: 200 });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        return new Response('Error fetching users: ' + error.message, { status: 500 });
      }
      return new Response(JSON.stringify({ error: `Erreur serveur ${error}` }), { status: 500 });
    }
  }


export async function POST(req: Request) {
    try {
        const requestBody = await req.json();
        const {name, description, type} : SubCategoryData = requestBody;
        if (!name || !description || !type) {
            return new Response('Missing required fields', { status: 400 });
        }

        const newSubCategorie : SubCategory = await prisma.subCategory.create({
            data: {
                name,
                description,
                type
            }
        });

        return new Response(JSON.stringify(newSubCategorie), {status: 201})
    } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error);
          return new Response('Error creating categorie: ' + error.message, { status: 500 });
        }
        return new Response(JSON.stringify({ error: 'Erreur inconnue' }), { status: 500 });
      }
}