import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';


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

export async function PUT(req: NextRequest) {
    try {
        const { id, data, offerType } = await req.json();

        // Log des données reçues
        console.log("Received data:", { id, data, offerType });

        const prisma = getPrismaInstance();

        let updatedOffer;
        console.log("id", id + "data", data + "offerType", offerType);
        
        // Vérifie le type d'offre et appelle le modèle approprié
        if (offerType === 'vehicle') {
            updatedOffer = await prisma.vehicleOffer.update({
                where: { id: Number(id) },
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
                where: { id: Number(id) },
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
                where: { id: Number(id) },
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

        return NextResponse.json(updatedOffer, { status: 200 });
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
