import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const RESET_PASSWORD_JWT_SECRET = process.env.RESET_PASSWORD_JWT_SECRET || "fallback_secret";
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email || typeof email !== "string") {
            return NextResponse.json({ success: false, message: "Adresse e-mail invalide." }, { status: 400 });
        }

        // Création du transporteur SMTP
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: 587,
            secure: false, // SSL si port 465
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false, // Évite certains problèmes TLS
            },
        });

        const subject = "Réinitialisation de mot de passe";
        const resetToken = jwt.sign({ email }, RESET_PASSWORD_JWT_SECRET, { expiresIn: '30m' }); // Génération d'un token JWT
        const resetLink = `${BASE_URL}/reset-password?token=${resetToken}`;
        const html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; text-align: center;">
                <h2 style="color: #333;">Réinitialisation de mot de passe</h2>
                <p>Bonjour,</p>
                <p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe :</p>
                <a href="${resetLink}" style="color: #1a73e8; display: inline-block; margin: 10px 0; padding: 10px 20px; background-color: #1a73e8; color: #fff; text-decoration: none; border-radius: 5px;">Réinitialiser mon mot de passe</a>
                <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet e-mail.</p>
                <p>Merci,</p>
                <p>L'équipe de support</p>
            </div>
        `;

        // Configuration de l’e-mail
        const mailOptions = {
            from: "github.project.dev@gmail.com",
            to: email,
            subject,
            html,
        };

        // Envoi de l’e-mail et vérification du succès
        const info = await transporter.sendMail(mailOptions);
        if (!info.messageId) {
            throw new Error("L'envoi de l'e-mail a échoué.");
        }

        return NextResponse.json({ success: true, message: "E-mail envoyé avec succès !" });
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'e-mail :", error);
        return NextResponse.json({ success: false, message: "Erreur lors de l'envoi de l'e-mail." }, { status: 500 });
    }
}
