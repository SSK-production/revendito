import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export async function GET(req: NextRequest) {
    // Utilisation correcte de `get` pour extraire le paramètre 'status'
    const status = req.nextUrl.searchParams.get('status'); // Renvoie une chaîne ou null
  
    try {
      // Si status est null, cela signifie qu'il n'est pas présent dans l'URL, donc on n'applique pas de filtre.
      const reports = await prisma.report.findMany({
        where: {
          status: status || undefined,  // Si status est présent, on le filtre, sinon on ne filtre pas
        },
        include: {
          vehicleOffer: true,
          realEstateOffer: true,
          commercialOffer: true,
          reporterUser: true,
          reporterCompany: true,
        },
      });
  
      return NextResponse.json(reports, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 });
    }
  }

  // Fonction POST pour créer un rapport
export async function POST(req: NextRequest) {
    
    try {
      // Extraire les données envoyées dans le corps de la requête
      const body = await req.json();
  
      const {
        reason,
        createdAt,
        status,
        vehicleOfferId,
        realEstateOfferId,
        commercialOfferId,
        vehicleOffer,
        realEstateOffer,
        commercialOffer,
        reporterId,
        reporterType,
      } = body;
  
      // Validation des données nécessaires
      if (!reason || !status || !reporterId || !reporterType) {
        return NextResponse.json({ message: "Données manquantes" }, { status: 400 });
      }
  
      // Vérification de la validité du type de rapporteur
      if (!['USER', 'COMPANY'].includes(reporterType)) {
        return NextResponse.json({ message: "Type de rapporteur invalide" }, { status: 400 });
      }
  
      // Vérification qu'une seule offre est passée dans la requête
      const offerFields = [
        vehicleOfferId, realEstateOfferId, commercialOfferId,
        vehicleOffer, realEstateOffer, commercialOffer
      ];
  
      // Comptage des offres non nulles
      const offerCount = offerFields.filter(field => field !== undefined && field !== null).length;
  
      // Si plus d'une offre est fournie, retourner une erreur
      if (offerCount !== 1) {
        return NextResponse.json({ message: "Une seule offre (vehicle, real estate ou commercial) doit être fournie." }, { status: 400 });
      }
  
      // Initialisation de l'ID de l'offre et des données associées
      let offerId = null;
      let offerData = null;
  
      // Vérification du type d'offre
      if (vehicleOfferId) {
        offerId = vehicleOfferId;
        offerData = vehicleOffer ? { create: vehicleOffer } : undefined;
      } else if (realEstateOfferId) {
        offerId = realEstateOfferId;
        offerData = realEstateOffer ? { create: realEstateOffer } : undefined;
      } else if (commercialOfferId) {
        offerId = commercialOfferId;
        offerData = commercialOffer ? { create: commercialOffer } : undefined;
      }
  
      // Création du signalement dans la base de données avec les relations appropriées
      const newReport = await prisma.report.create({
        data: {
          reason,
          status: status || "pending",  // "pending" par défaut
          createdAt: new Date(createdAt), // Assurez-vous que la date est bien au bon format
          reporterId,
          reporterType,
          vehicleOfferId: vehicleOfferId || null,
          realEstateOfferId: realEstateOfferId || null,
          commercialOfferId: commercialOfferId || null,
          // Relation avec le rapporteur (User ou Company)
          reporterUser: reporterType === 'USER' ? { connect: { id: reporterId } } : undefined,
          reporterCompany: reporterType === 'COMPANY' ? { connect: { id: reporterId } } : undefined,
          // On ajoute les données de l'offre choisie
          vehicleOffer: vehicleOfferData ? { create: vehicleOffer } : undefined,
          realEstateOffer: realEstateOfferData ? { create: realEstateOffer } : undefined,
          commercialOffer: commercialOfferData ? { create: commercialOffer } : undefined,
        },
      });
  
      // Retourner le rapport créé en réponse
      return NextResponse.json(newReport, { status: 201 });
  
    } catch (error) {
      console.error("Error processing request:", error);
      return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 });
    }
  }