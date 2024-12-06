import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { createUserSchema } from '@/app/validation';
const prisma = new PrismaClient();

// interface UserData {
//   username: string;
//   password: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   birthDate: string;  // Date de naissance
//   city: string;
//   country: string;
//   profilePicture?: string;  // Photo de profil
// }

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
    const { username, password, firstName, lastName, email, birthDate, city, country }: User = requestBody;

    // Vérification des champs obligatoires
    if (!username || !password || !firstName || !lastName || !email || !birthDate) {
      return new Response('Missing required fields', { status: 400 });
    }

    // Vérification de l'existence de l'email
    const foundUser = await prisma.user.findUnique({
      where: { email },
    });
    if (foundUser) {
      return new Response(JSON.stringify({ error: 'This email is already used' }), { status: 400 });
    }

    // Validation des données via Joi
    const { error } = createUserSchema.validate(
      { username, password, firstName, lastName, email, birthDate, city, country },
      { abortEarly: false }
    );

    if (error) {
      const validationErrors = error.details.map((err) => err.message);
      return new Response(JSON.stringify({ error: validationErrors }), { status: 400 });
    }

    // Hachage du mot de passe avant de le stocker dans la base de données
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur dans la base de données
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        firstName,
        lastName,
        email,
        birthDate: new Date(birthDate),  // Convertir birthDate en objet Date
        city,
        country,
        profilePicture: '', // Ajouter la logique de gestion de la photo de profil si nécessaire
      },
    });

    // Réponse avec l'utilisateur créé
    return new Response(JSON.stringify(newUser), { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);
      return new Response('Error creating user: ' + error.message, { status: 500 });
    }
    return new Response(JSON.stringify({ error: 'Unknown error' }), { status: 500 });
  }
}
