import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, VehicleOffer } from "@prisma/client";
import { vehicleSchema } from "@/app/validation";
import { getUserFromRequest } from "@/app/lib/tokenManager";
import { processFormData } from "@/app/lib/processFormData";
import { verifyId } from "@/app/lib/function";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10", 10);

    if (page <= 0 || limit <= 0) {
      return NextResponse.json(
        { error: "Page et limit doivent être des valeurs positives" },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    const vehicleOffers = await prisma.vehicleOffer.findMany({
      skip: skip,
      take: limit,
      where: {
        AND: [
          { validated: true },
          { active: true },
          {
            OR: [
              { user: { active: true } }, // Utilisateur actif
              { company: { active: true } }, // Entreprise active
            ],
          },
        ],
      },
      include: {
        user: true, // Inclut les informations utilisateur
        company: true, // Inclut les informations entreprise
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalOffers = await prisma.vehicleOffer.count({
      where: {
        AND: [
          { validated: true },
          { active: true },
          {
            OR: [
              { user: { active: true } },
              { company: { active: true } },
            ],
          },
        ],
      },
    });

    return NextResponse.json(
      {
        data: vehicleOffers,
        meta: {
          page,
          limit,
          total: totalOffers,
          totalPages: Math.ceil(totalOffers / limit),
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error fetching vehicle offers:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Error fetching vehicle offers: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  console.log("Début du traitement de la requête POST");
  try {
    // On récup le token
    const {
      id,
      username,
      entity,
      isBanned,
      banReason,
      banEndDate,
      accessToken,
      active,
    } = await getUserFromRequest(req);
    if (isBanned && banEndDate && banEndDate > new Date()) {
      // Si l'utilisateur est banni et la date de fin de bannissement n'est pas dépassée
      return NextResponse.json({
        error: "Banned",
        message: `You are banned from using this service. Reason: ${
          banReason || "No reason specified"
        }. Ban will end on: ${banEndDate.toISOString()}.`,
      });
    } // Vérification si l'entité existe

    if (!active) {
      return NextResponse.json({
        error: "Inactive",
        message:
          "Your account is inactive. Please contact the support team for more information.",
      });
    }

    verifyId(id, entity);

    const formData = await req.formData();
    const uploadDir = "public/offer";

    // Traitement des données de formulaire et des fichiers
    const { fields, photos } = await processFormData(formData, uploadDir);

    console.log("Fields:", fields);
    console.log("Uploaded Photos:", photos);

    // Validation des champs, y compris les photos (qui sont maintenant des chaînes)
    const { error } = vehicleSchema.validate(
      { ...fields, photos },
      { abortEarly: false }
    );

    if (error) {
      const validationErrors = error.details.map((err) => err.message);
      console.log("Erreurs de validation:", validationErrors);
      return NextResponse.json({ error: validationErrors }, { status: 400 });
    }

    console.log("Début de la création de l'offre");
    const newVehicleOffer: VehicleOffer = await prisma.vehicleOffer.create({
      data: {
        vendor: username,
        vendorType: entity,
        title: fields.title,
        description: fields.description,
        price: parseFloat(fields.price),
        city: fields.city,
        country: fields.country,
        vehicleType: fields.vehicleType,
        model: fields.model,
        year: parseInt(fields.year),
        mileage: parseInt(fields.mileage),
        fuelType: fields.fuelType,
        color: fields.color,
        transmission: fields.transmission,
        numberOfDoors: parseInt(fields.numberOfDoors),
        engineSize: parseFloat(fields.engineSize),
        power: parseInt(fields.power),
        emissionClass: fields.emissionClass,
        condition: fields.condition,
        contactNumber: fields.contactNumber,
        contactEmail: fields.contactEmail,
        location: Boolean(fields.location),
        photos,
        userId: entity === "user" ? id : null,
        companyId: entity === "company" ? id : null,
      },
    });
    console.log("Nouvelle offre créée:", newVehicleOffer);

    const response = NextResponse.json({ newVehicleOffer }, { status: 201 });

    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error("Erreur lors de la création de l'offre:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Erreur lors de la création de l'offre: " + error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Erreur inconnue lors de la création de l'offre" },
      { status: 500 }
    );
  }
}
