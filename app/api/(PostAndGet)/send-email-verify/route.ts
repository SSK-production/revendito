import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const RESET_PASSWORD_JWT_SECRET =
  process.env.RESET_PASSWORD_JWT_SECRET || "fallback_secret";
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, message: "Adresse e-mail invalide." },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, 
      },
    });

    const subject = "Validation de l'adresse email";
    const resetToken = jwt.sign({ email }, RESET_PASSWORD_JWT_SECRET, {
      expiresIn: "30m",
    }); 
    const resetLink = `${BASE_URL}/reset-password?token=${resetToken}`;
    const html = `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; text-align: center;">
                        <h2 style="color: #333;">Validation de l'adresse email</h2>
                        <p>Bonjour,</p>
                        <p>Cliquez sur le lien suivant pour valider adresse email :</p>
                        <a href="${resetLink}" style="color: #1a73e8; display: inline-block; margin: 10px 0; padding: 10px 20px; background-color: #1a73e8; color: #fff; text-decoration: none; border-radius: 5px;">Réinitialiser mon mot de passe</a>
                        <p>Si vous n'avez pas demandé cette vérification, veuillez ignorer cet e-mail.</p>
                        <p>Merci,</p>
                        <p>L'équipe de support</p>
                    </div>
                `;

    const mailOptions = {
      from: "github.project.dev@gmail.com",
      to: email,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    if (!info.messageId) {
      throw new Error("L'envoi de l'e-mail a échoué.");
    }

    return NextResponse.json({
      success: true,
      message: "E-mail envoyé avec succès !",
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'e-mail :", error);
    return NextResponse.json(
      { success: false, message: "Erreur lors de l'envoi de l'e-mail." },
      { status: 500 }
    );
  }
}
