import type {Metadata} from "next";
import "./globals.css";
import Header from "@/app/components/shared/header";
import Footer from "@/app/components/shared/footer";

export const metadata: Metadata = {
    title: "ReVentures",
    description: "Give your old stuff a new life",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className="antialiased min-h-screen flex flex-col bg-slate-50">
        <Header/>
        <main className="flex-1 w-2/3 self-center mt-2 px-4 py-2">
            {children}
        </main>
        <Footer/>
        </body>
        </html>
    );
}