import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

interface UserData {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;  // Date de naissance
  city: string;
  country: string;
  profilePicture?: string;  // Photo de profil
}

export async function GET() {
  try {
    const users = await prisma.user.findMany();
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
       // Vérifiez ce qui est envoyé
      
      const { username, password, firstName, lastName, email, birthDate, city, country, profilePicture }: UserData = requestBody;
       
      // Vérification des champs obligatoires
      if (!username || !password || !firstName || !lastName || !email || !birthDate) {
        return new Response('Missing required fields', { status: 400 });
      }
  
      // Hachage du mot de passe avant de le stocker dans la base de données
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(requestBody);
      // Créer un nouvel utilisateur dans la base de données
      const newUser: User = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          firstName,
          lastName,
          email,
          birthDate: new Date(birthDate),  // Convertir birthDate en objet Date
          city,
          country,
          profilePicture,
        },
      });
  
      // Réponse avec l'utilisateur créé
      return new Response(JSON.stringify(newUser), { status: 201 });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        return new Response('Error creating user: ' + error.message, { status: 500 });
      }
      return new Response(JSON.stringify({ error: 'Erreur inconnue' }), { status: 500 });
    }
  }
  