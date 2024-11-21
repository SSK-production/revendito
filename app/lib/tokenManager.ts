import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

interface UserPayload {
  id: string;
  email: string;
  entity: string;
}

const ACCESS_TOKEN_SECRET = process.env.ACCESS_JWT_SECRET || "fallback_secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_JWT_SECRET || "fallback_refresh_secret";

export function verifyAccessToken(
  token: string | undefined
): UserPayload | null {
  try {
    return token
      ? (jwt.verify(token, ACCESS_TOKEN_SECRET) as UserPayload)
      : null;
  } catch {
    return null;
  }
}

export function generateAccessToken(user: UserPayload): string {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
}

export function refreshAccessToken(refreshToken: string): NextResponse | null {
  try {
    // Verify and decode the refresh token
    const user = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as UserPayload;

    // Generate a new access token
    const newAccessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      entity: user.entity
    });

    // Create the response with the new access token
    const response = new NextResponse(
      JSON.stringify({
        email: user.email,
        message: "Token successfully refreshed",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

    // Set the cookie with the new access token
    response.cookies.set("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600, // 1 hour
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error) {
    // In case of an error (invalid or expired token), return an appropriate error
    console.error("Error during token refresh:", error);
    return new NextResponse(
      JSON.stringify({ error: "Invalid or expired refresh token" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}


export function getTokenFromCookies(req: Request): string | null {
    const cookieHeader = req.headers.get('cookie');
    if (!cookieHeader) return null;
  
    const cookies = Object.fromEntries(
      cookieHeader.split('; ').map((c) => c.split('=').map(decodeURIComponent))
    );
    console.log(cookies);
    
    return cookies.access_token || null;
  }