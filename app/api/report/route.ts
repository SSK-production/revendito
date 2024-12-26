import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import Joi from 'joi';
import { reportSchema } from '@/app/validation';  // Assurez-vous que le chemin vers votre fichier de validation est correct

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  // Récupérer tous les rapports
  try {
    const reports = await prisma.report.findMany({
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
    return NextResponse.json({ error: 'Erreur lors de la récupération des rapports' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Valider les données de la requête avec Joi
  const data = await req.json();

  // Validation avec Joi
  const { error } = reportSchema.validate(data, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return NextResponse.json({ error: errorMessages }, { status: 400 });
  }

  const { reason, reporterId, reporterType, vehicleOfferId, realEstateOfferId, commercialOfferId } = data;

  try {
    const newReport = await prisma.report.create({
      data: {
        reason,
        reporterId,
        reporterType,
        vehicleOfferId,
        realEstateOfferId,
        commercialOfferId,
      },
    });
    return NextResponse.json(newReport, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la création du rapport' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  // Valider les données de la requête avec Joi
  const data = await req.json();

  const { error } = reportSchema.validate(data, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return NextResponse.json({ error: errorMessages }, { status: 400 });
  }

  const { id, reason, status } = data;

  if (!id) {
    return NextResponse.json({ error: 'L\'ID du rapport est requis' }, { status: 400 });
  }

  try {
    const updatedReport = await prisma.report.update({
      where: { id },
      data: { reason, status },
    });
    return NextResponse.json(updatedReport, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la mise à jour du rapport' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  // Valider les données de la requête avec Joi
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: 'L\'ID du rapport est requis' }, { status: 400 });
  }

  try {
    await prisma.report.delete({
      where: { id },
    });
    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la suppression du rapport' }, { status: 500 });
  }
}
