'use server';
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import { getUserFromRequest } from '@/app/lib/tokenManager';
import bcrypt from "bcryptjs";


// Singleton pour Prisma
const getPrismaInstance = (() => {
    let instance: PrismaClient;
    return () => {
        if (!instance) {
            instance = new PrismaClient();
        }
        return instance;
    };
})();


export async function GET(req: NextRequest) {
    try {
      const page = req.nextUrl.searchParams.get("category") || "vehicle";
      const offerId = parseInt(req.nextUrl.searchParams.get("offerId") || "0", 10);
      const prisma = getPrismaInstance();
      if (isNaN(offerId) || offerId <= 0) {
        return NextResponse.json(
          { error: "Invalid or missing offerId parameter." },
          { status: 400 }
        );
      }
  
      let offer;
  
      if (page === "vehicle") {
        offer = await prisma.vehicleOffer.findUnique({
          where: {
            id: offerId,
          },
          
        });
      } else if (page === "property") {
        offer = await prisma.realEstateOffer.findUnique({
          where: {
            id: offerId,
          },
          include: {
            user: true,
            company: true,
          },
        });
      } else if (page === "commercial") {
        offer = await prisma.commercialOffer.findUnique({
          where: {
            id: offerId,
          },
          
        });
      } else {
        return NextResponse.json(
          { error: "Invalid page parameter." },
          { status: 400 }
        );
      }
  
      if (!offer) {
        return NextResponse.json(
          { error: `Offer not found for id: ${offerId}` },
          { status: 404 }
        );
      }
  
      return NextResponse.json({ data: offer });
  
    } catch (error: unknown) {
      console.error("Error fetching offer:", error);
  
      if (error instanceof Error) {
        return NextResponse.json(
          { error: `Error fetching offer: ${error.message}` },
          { status: 500 }
        );
      }
  
      return NextResponse.json(
        { error: "An unexpected error occurred." },
        { status: 500 }
      );
    } finally {
    const prisma = getPrismaInstance();
      await prisma.$disconnect();
    }
  }
  
export async function PUT(req: NextRequest) {
    try {
        const { offerId, data, offerType, password } = await req.json();

        const {id, entity,  accessToken, active} = await getUserFromRequest(req);

        if (!id) {
            return NextResponse.json({ error: 'Utilisateur non authentifié.' }, { status: 401 });
        }
        if (!active) {
            return NextResponse.json({ error: 'Utilisateur non activé.' }, { status: 401 });  
        }
        

        // Log des données reçues
        console.log("Received data: ", { offerId, data, offerType } + " user id : ", id);

        const prisma = getPrismaInstance();

        if (entity === 'user') {
            const user = await prisma.user.findUnique({
            where: { id: id },
            });

            if (!user || !(await bcrypt.compare(password, user.password))) {
            return NextResponse.json({ error: 'Mot de passe incorrect.' }, { status: 401 });
            }
        }
        
        if (entity === 'company') {
            const company = await prisma.company.findUnique({
            where: { id: id },
            });

            if (!company || !(await bcrypt.compare(password, company.password))) {
            return NextResponse.json({ error: 'Mot de passe incorrect.' }, { status: 401 });
            }
        }

        let updatedOffer;
        console.log("id", offerId + " price : ", data.price + " offerType ", offerType);
        
        // Vérifie le type d'offre et appelle le modèle approprié
        if (offerType === 'vehicle') {
            updatedOffer = await prisma.vehicleOffer.update({
                where: { id: Number(offerId) },
                data: {
                    title : data.title,
                    description : data.description,
                    price : parseFloat(data.price),
                    year : parseInt(data.year),  
                    city : data.city,
                    country : data.country,
                    vehicleType : data.vehicleType,
                    model : data.model,
                    mileage : parseInt(data.mileage),
                    fuelType : data.fuelType,
                    color : data.color,
                    transmission : data.transmission,
                    numberOfDoors :  parseInt(data.numberOfDoors),
                    engineSize : parseFloat(data.engineSize),
                    power : parseInt(data.power),
                    emissionClass : data.emissionClass,
                    condition : data.condition,
                    contactNumber : data.contactNumber,
                    contactEmail : data.contactEmail,
                    location : Boolean(data.location),
                } as Prisma.VehicleOfferUpdateInput,
            });
        } else if (offerType === 'commercial') {
            updatedOffer = await prisma.commercialOffer.update({
                where: { id: Number(offerId) },
                data: {
                    title : data.title,
                    description : data.description,
                    price : parseFloat(data.price),
                    year : parseInt(data.year),  
                    city : data.city,
                    country : data.country,
                    commercialType : data.commercialType,
                    duration : parseInt(data.duration),
                    contractType : data.contractType,  
                    workSchedule : data.workSchedule,
                    contactNumber : data.contactNumber,
                    contactEmail : data.contactEmail,
                } as Prisma.CommercialOfferUpdateInput,
            });
        } else if (offerType === 'property') {
            updatedOffer = await prisma.realEstateOffer.update({
                where: { id: Number(offerId) },
                data: {
                    title : data.title,
                    description : data.description,
                    price : parseFloat(data.price),
                    year : parseInt(data.year),  
                    city : data.city,
                    country : data.country,
                    propertyType : data.propertyType,
                    propertyCondition : data.propertyCondition,
                    surface : parseInt(data.surface),
                    rooms : parseInt(data.rooms),
                    bedrooms : parseInt(data.bedrooms),
                    bathrooms : parseInt(data.bathrooms),
                    heatingType : data.heatingType,
                    energyClass : data.energyClass,
                    furnished : Boolean(data.furnished),
                    parking : Boolean(data.parking),
                    garage : Boolean(data.garage),
                    elevator : Boolean(data.elevator),
                    balcony : Boolean(data.balcony),
                    terrace : Boolean(data.terrace),
                    garden : Boolean(data.garden),
                    basementAvailable : Boolean(data.basementAvailable),
                    floorNumber : parseInt(data.floorNumber),
                    totalFloor : parseInt(data.totalFloor),
                    avaibilabilityDate : data.avaibilabilityDate,                   
                    contactNumber : data.contactNumber,
                    contactEmail : data.contactEmail,
                } as Prisma.RealEstateOfferUpdateInput,
            });
        } else {
            return NextResponse.json(
                { error: `Unsupported offer type: ${offerType}` },
                { status: 400 }
            );
        }

        const response = NextResponse.json(updatedOffer, { status: 200 });
        response.cookies.set("access_token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600,
            sameSite: "strict",
            path: "/",
          });
      
          return response;
    } catch (error: unknown) {
        console.error('Error:', error);

        const errorMessage =
            error instanceof Error ? error.message : 'An unknown error occurred';

        return NextResponse.json(
            { error: 'Internal Server Error', details: errorMessage },
            { status: 500 }
        );
    }
}

export async function OPTIONS() {
    return NextResponse.json({ allow: ['PUT'] }, { status: 200 });
}
