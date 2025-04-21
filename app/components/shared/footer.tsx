"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
    const [showCookieBanner, setShowCookieBanner] = useState(true);


    const handleAcceptCookies = () => {
        setShowCookieBanner(false);
        const currentDate = new Date();
        const expiryDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1)); // expire in 1 month
        localStorage.setItem("cookiesAccepted", "true");
        localStorage.setItem("cookiesAcceptedDate", expiryDate.toString());
    };
    
    useEffect(() => {
        const cookiesAccepted = localStorage.getItem("cookiesAccepted");
        const cookiesAcceptedDate = localStorage.getItem("cookiesAcceptedDate");
        
        if (cookiesAccepted === "true" && cookiesAcceptedDate) {
            const parsedCookiesAcceptedDate = new Date(cookiesAcceptedDate);
            const currentDate = new Date();

            // If cookies have been accepted and the acceptance is not expired
            if (currentDate < parsedCookiesAcceptedDate) {
                setShowCookieBanner(false);
            }
        }
    }, []);
    


   

    return (
        <>
            {showCookieBanner && (
                <div className="fixed bottom-0 left-0 w-full bg-orange-900 text-white p-4 z-50">
                    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm mb-2 md:mb-0">
                            We use cookies to improve your experience. By using our site, you
                            agree to our{" "}
                            <Link href="/privacy-policy" className="underline">
                                Privacy Policy
                            </Link>
                            .
                        </p>
                        <button
                            onClick={handleAcceptCookies}
                            className="bg-white text-orange-900 px-4 py-2 rounded hover:bg-gray-200"
                        >
                            Accept
                        </button>
                    </div>
                </div>
            )}
            <footer className="self-center border-t border-orange-900 w-screen py-3">
                <section className="container mx-auto w-screen md:w-2/3">
                    <article>
                        <h3 className="text-center">
                            &copy; SSK Production Agency 2024 - {new Date().getFullYear()}
                        </h3>
                        <h3 className="text-center mb-2">All Rights Reserved</h3>
                        <hr className="border-orange-900 mb-2" />
                        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-center text-sm">
                            <li>
                                <Link href="/" className="hover:underline">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:underline">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/legal-notice" className="hover:underline">
                                    Legal Notice
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy-policy" className="hover:underline">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </article>
                </section>
            </footer>
        </>
    );
}
