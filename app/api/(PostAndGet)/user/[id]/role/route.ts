import { getUserFromRequest } from '@/app/lib/tokenManager';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

function isValidRole(role: string | null): boolean {
    return role === 'ADMIN' || role === 'MODERATOR';
}

export async function PATCH(req: NextRequest): Promise<Response> {
    const url = new URL(req.url);
    const id = url.pathname.split('/').at(-2); // route = /api/user/[id]/role

    if (!id) {
        return NextResponse.json({ error: 'Invalid ID in URL' }, { status: 400 });
    }

    try {
        const user = await getUserFromRequest(req);
        if (!user) {
            return NextResponse.json({ error: 'Utilisateur non authentifié.' }, { status: 401 });
        }

        const currentUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { role: true },
        });

        if (!currentUser || !isValidRole(currentUser.role)) {
            return NextResponse.json({ error: 'Accès non autorisé.' }, { status: 403 });
        }

        const body = await req.json();
        const { role } = body;

        if (!role) {
            return NextResponse.json({ error: 'Role is required' }, { status: 400 });
        }

        if (role === 'ADMIN' && currentUser.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Only an ADMIN can assign the ADMIN role' }, { status: 403 });
        }

        if (role === 'MODERATOR' && currentUser.role === 'USER') {
            return NextResponse.json({ error: 'Only an ADMIN or MODERATOR can assign the MODERATOR role' }, { status: 403 });
        }

        const targetEntity = await prisma.user.findUnique({ where: { id } }) 
            || await prisma.company.findUnique({ where: { id } });

        if (!targetEntity) {
            return NextResponse.json({ error: 'User or Company not found' }, { status: 404 });
        }

        if (targetEntity.role === 'ADMIN' && currentUser.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Only an ADMIN can update the ADMIN role' }, { status: 403 });
        }
        if (targetEntity.role === 'MODERATOR' && currentUser.role === 'USER') {
            return NextResponse.json({ error: 'Only an ADMIN or MODERATOR can update the MODERATOR role' }, { status: 403 });
            
        }

        const updateData = { role };
        if ('username' in targetEntity) {
            await prisma.user.update({ where: { id }, data: updateData });
        } else {
            await prisma.company.update({ where: { id }, data: updateData });
        }

        return NextResponse.json({
            message: 'Role updated successfully',
            entity: { id, role },
        });
    } catch (error) {
        console.error('Error updating role:', error);
        return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
    }
}
