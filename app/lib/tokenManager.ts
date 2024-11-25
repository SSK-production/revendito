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

export function refreshAccessToken(refreshToken: string): string | null {
  try {
    // Verify and decode the refresh token
    const user = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as UserPayload;

    // Generate a new access token
    const newAccessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      entity: user.entity
    });

    // Create the response with the new access token (if needed elsewhere)
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

    // Return the new access token
    return newAccessToken;
  } catch (error) {
    // Log the error and return null in case of an invalid or expired token
    console.error("Error during token refresh:", error);
    return null;
  }
}



export async function getTokenFromCookies(req: Request): Promise<string | null> {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return null;

  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((c) => c.split("=").map(decodeURIComponent))
  );

  let accessToken = cookies.access_token || null;
  const refreshToken = cookies.refresh_token || null;

  if (!accessToken && refreshToken) {
    // Tentative de rafraîchissement de l'access token
    console.log("Access token manquant, tentative de rafraîchissement...");
    accessToken = refreshAccessToken(refreshToken);

    if (!accessToken) {
      console.error("Erreur lors du rafraîchissement de l'access token");
      return null;
    }
  }

  return accessToken;
}
