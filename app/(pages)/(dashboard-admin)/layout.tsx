import type {Metadata} from "next";
import "@/app/globals.css";

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
        <>
        <main>
            {children}
        </main>
        </>
    );
}