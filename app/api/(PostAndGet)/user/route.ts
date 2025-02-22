'use server';

import { NextResponse } from "next/server";
import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { createUserSchema } from '@/app/validation';
import { capitalizeFirstLetter } from "@/app/lib/function";
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
    const { username, password, firstName, lastName, email, birthDate, city, country } = requestBody;

    // Validation des données via Joi
    const { error } = createUserSchema.validate(
      { username, password, firstName, lastName, email, birthDate, city, country },
      { abortEarly: false }
    );

    if (error) {
      const validationErrors = error.details.map((err) => err.message);
      return NextResponse.json({ error: validationErrors }, { status: 400 });
    }

    // Vérification de l'existence de l'email
    const foundUser = await prisma.user.findUnique({
      where: { email },
    });

    if (foundUser) {
      return NextResponse.json({ error: "This email is already used" }, { status: 400 });
    }

    // Hachage du mot de passe avant de le stocker dans la base de données
    const hashedPassword = await bcrypt.hash(password, 10);
    const capitalizeUsername = capitalizeFirstLetter(username);
    const capitalizeFirstName = capitalizeFirstLetter(firstName);
    const capitalizeLastName = capitalizeFirstLetter(lastName);

    // Création d'un nouvel utilisateur
    const newUser:User = await prisma.user.create({
      data: {
        username: capitalizeUsername,
        password: hashedPassword,
        firstName: capitalizeFirstName,
        lastName: capitalizeLastName,
        email,
        birthDate: new Date(birthDate), // Convertir en objet Date
        city,
        country,
        profilePicture: "", // Placeholder pour une future logique de photo de profil
        
      },
    });

    // Réponse avec l'utilisateur créé
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
