import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/app/lib/tokenManager";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { verifyId } from "@/app/lib/function";

const getPrismaInstance = (() => {
  let instance: PrismaClient;
  return () => {
    if (!instance) {
      instance = new PrismaClient();
    }
    return instance;
  };
})();

/**
 * Handles the PUT request to change the password of a user or a company.
 * 
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} - The response object indicating the result of the operation.
 * 
 * @throws {Error} - If there is an error during the process.
 * 
 * The function performs the following steps:
 * 1. Parses the JSON from the request to extract the data.
 * 2. Retrieves the user or company information from the request.
 * 3. Verifies the ID and entity type.
 * 4. Checks if the current password is provided and matches the stored password.
 * 5. Validates that the new password and the repeated new password match.
 * 6. Updates the password in the database.
 * 7. Sets the access token cookie in the response.
 * 8. Returns a success response if the operation is successful.
 * 9. Returns an error response if any step fails.
 */
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, entity, accessToken } = await getUserFromRequest(
      request
    );
    const prisma = getPrismaInstance();
    verifyId(id, entity);

    console.log(data.currentPassword + " " + data.newPassword + " " + data.repeatNewPassword);
    
    
    if (!data.currentPassword || !data.newPassword || !data.repeatNewPassword) {
      return NextResponse.json(
        { message: "data not found" },
        { status: 401 }
      );
    }

    if (entity === "user") {
      const user = await prisma.user.findUnique({
        where: { id: id },
      });

      if (!user || !(await bcrypt.compare(data.currentPassword, user.password))) {
        return NextResponse.json(
          { error: "Mot de passe actuel incorrect." },
          { status: 401 }
        );
      }
    } else if (entity === "company") {
      const company = await prisma.company.findUnique({
        where: { id: id },
      });

      if (
        !company ||
        !(await bcrypt.compare(data.currentPassword, company.password))
      ) {
        return NextResponse.json(
          { error: "Mot de passe actuel incorrect." },
          { status: 401 }
        );
      }
    } else {
      return NextResponse.json({ error: "Invalid entity." }, { status: 400 });
    }
    if (data.newPassword !== data.repeatNewPassword) {
      return NextResponse.json(
        { message: "Passwords do not match" },
        { status: 401 }
      );
        
    }

    if (entity === "user") {
      await prisma.user.update({
        where: { id: id },
        data: {
          password: await bcrypt.hash(data.newPassword, 10),
        },
      });
    }
    if (entity === "company") {
      await prisma.company.update({
        where: { id: id },
        data: {
            password: await bcrypt.hash(data.newPassword, 10),
        },
      });
    }

    // Process the data and update the account here
    const response = NextResponse.json(
      { message: "Account updated successfully" },
      { status: 200 }
    );
    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "Failed to update account", error: (error as Error).message },
      { status: 500 }
    );
  }
}
