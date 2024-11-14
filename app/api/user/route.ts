import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

interface UserData {
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ou Date, si tu traites directement la date
  identityNumber: string;
  address: string;
  city: string;
  country: string;
  email: string;
}

export async function GET() {
    try {
      const users = await prisma.user.findMany();
      return new Response(JSON.stringify(users), { status: 200 });
    } catch (error: any) {
      console.error(error);
      return new Response('Error fetching users: ' + error.message, { status: 500 });
    }
  }

export async function POST(req: Request) {

  
    try {

        const { firstName, lastName, dateOfBirth, identityNumber, address, city, country, email } : UserData = await req.json();
  
        if (!firstName || !lastName || !email ) {
          return new Response('Missing required fields', { status: 400 });
        }
      const newUser : User = await prisma.user.create({
        data: {
          firstName,
          lastName,
          dateOfBirth: new Date(dateOfBirth),
          identityNumber,
          address,
          city,
          country,
          email,
          active: true,
          emailVerified: false,
        },
      });
  
      return new Response(JSON.stringify(newUser), { status: 201 });
    } catch (error: any) {
      console.error(error); // Afficher l'erreur dans la console pour le débogage
      return new Response('Error creating user: ' + error.message, { status: 500 });
    }
  }
  