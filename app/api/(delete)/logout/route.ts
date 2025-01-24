import { NextResponse } from 'next/server';

// Fonction utilitaire pour supprimer un ou plusieurs cookies
export async function GET() {
  const headers = new Headers();
  ['access_token', 'refresh_token'].forEach((cookie) => {
    headers.append(
      'Set-Cookie',
      `${cookie}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict`
    );
  });

  return NextResponse.json(
    { message: 'Logout successful. Cookies deleted.' },
    { headers }
  );
}
