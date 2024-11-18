import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// Replace with secure keys
const ACCESS_TOKEN_SECRET = process.env.ACCESS_JWT_SECRET || 'fallback_secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_JWT_SECRET || 'fallback_refresh_secret';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    // Compare the password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return new Response(JSON.stringify({ error: 'Incorrect password' }), { status: 401 });
    }

    // Generate the access token
    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '3h' }
    );

    // Generate the refresh token
    const refreshToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' } 
    );

    // Create cookies
    const accessCookie = `access_token=${accessToken}; HttpOnly; Path=/; Secure; SameSite=Strict; Max-Age=900`;
    const refreshCookie = `refresh_token=${refreshToken}; HttpOnly; Path=/; Secure; SameSite=Strict; Max-Age=604800`;

    // Respond with cookies
    return new Response(
      JSON.stringify({ message: 'Login successful' }),
      {
        status: 200,
        headers: {
          'Set-Cookie': [accessCookie, refreshCookie].join(', '), // Add both cookies
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);
      return new Response('Error during login: ' + error.message, { status: 500 });
    }
    return new Response(JSON.stringify({ error: 'Unknown error' }), { status: 500 });
  }
}
