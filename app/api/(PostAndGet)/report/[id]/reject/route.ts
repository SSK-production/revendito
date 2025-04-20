import { type NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/app/lib/tokenManager";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function isValidRole(role: string | null): boolean {
  return role === "ADMIN" || role === "MODERATOR";
}


export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non authentifié." },
        { status: 401 }
      );
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    if (!currentUser || !isValidRole(currentUser.role)) {
      return NextResponse.json(
        { error: "Accès non autorisé." },
        { status: 403 }
      );
    }
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID de rapport invalide" },
        { status: 400 }
      );
    }
    console.log("ID du rapport à rejeter:", id);

    await prisma.report.update({
      where: { id },
      data: { status: "REJECTED" },
    });
    console.log("Rapport rejeté avec succès");
    

    // Pour l'exemple, nous simulons une réponse réussie
    return NextResponse.json(
      { message: "Rapport rejeté avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors du rejet du rapport:", error);
    return NextResponse.json(
      { error: "Erreur lors du rejet du rapport" },
      { status: 500 }
    );
  }
}
