import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromRequest } from '@/app/lib/tokenManager';

const prisma = new PrismaClient();

function isValidRole(role: string | null): boolean {
    return role === "ADMIN" || role === "MODERATOR";
  }
  
export async function DELETE(
    req: NextRequest,
    
) {
    try {
      const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get("id") || "1", 10);
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
          
      
          if (isNaN(id)) {
            return NextResponse.json(
              { error: "ID de rapport invalide" },
              { status: 400 }
            );
          }
  
      const deletedReport = await prisma.report.delete({
        where: { id },
      });
  
      return NextResponse.json(
        { message: "Report deleted successfully.", report: deletedReport },
        { status: 200 }
      );
    } catch (error: unknown) {
      console.error("Error deleting the report:", error);
  
      if (error instanceof Error) {
        return NextResponse.json(
          { error: "Error deleting the report: " + error.message },
          { status: 500 }
        );
      }
  
      return NextResponse.json(
        { error: "Unknown error occurred while deleting the report." },
        { status: 500 }
      );
    } finally {
      await prisma.$disconnect();
    }
  }