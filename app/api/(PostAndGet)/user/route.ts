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

// export async function GET() {
//   try {
//     const users = await prisma.user.findMany();
//     return new Response(JSON.stringify(users), { status: 200 });
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       console.error(error);
//       return new Response('Error fetching users: ' + error.message, { status: 500 });
//     }
//     return new Response(JSON.stringify({ error: `Erreur serveur ${error}` }), { status: 500 });
//   }
// }

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
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;
    const nameFilter = searchParams.get('name') || '';

    const usersWithDetails = await prisma.user.findMany({
      skip,
      take: limit,
      where: {
        OR: [
          { username: { contains: nameFilter, mode: 'insensitive' } },
          { firstName: { contains: nameFilter, mode: 'insensitive' } },
          { lastName: { contains: nameFilter, mode: 'insensitive' } },
        ],
      },
      include: {
        bannedCompanies: true,
        vehicleOffers: true,
        realEstateOffers: true,
        commercialOffers: true,
      },
    });

    const companies = await prisma.company.findMany({
      where: {
      companyName: { contains: nameFilter, mode: 'insensitive' },
      },
      include: {
        bannedByUser: true,
        vehicleOffers: true,
        realEstateOffers: true,
        commercialOffers: true,
      },
      skip,
      take: limit,
    });

    const usersWithOfferCounts = usersWithDetails.map((user) => ({
      ...user,
      vehicleOfferCount: user.vehicleOffers.length,
      realEstateOfferCount: user.realEstateOffers.length,
      commercialOfferCount: user.commercialOffers.length,
    }));

    const companiesWithOfferCounts = companies.map((company) => ({
      ...company,
      vehicleOfferCount: company.vehicleOffers.length,
      realEstateOfferCount: company.realEstateOffers.length,
      commercialOfferCount: company.commercialOffers.length,
    }));

    const entities = [...usersWithOfferCounts, ...companiesWithOfferCounts];



    const totalUsers = await prisma.user.count({
      where: {
        OR: [
          { username: { contains: nameFilter, mode: 'insensitive' } },
          { firstName: { contains: nameFilter, mode: 'insensitive' } },
          { lastName: { contains: nameFilter, mode: 'insensitive' } },
        ],
      },
    });

    const totalCompanies = await prisma.company.count({
      where: {
        companyName: { contains: nameFilter, mode: 'insensitive' },
      },
    });

    const totalEntities = totalUsers + totalCompanies;

    const totalPages = Math.ceil(totalEntities / limit);

    return NextResponse.json(
      {
        users: entities,
        companies,
        pagination: {
          totalUsers,
          totalCompanies,
          totalEntities,
          totalPages,
          currentPage: page,
          limit,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);
      return new Response('Error fetching users and companies: ' + error.message, { status: 500 });
    }
    return new Response(JSON.stringify({ error: `Server error: ${error}` }), { status: 500 });
  }
}