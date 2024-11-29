'use client';

import Link from "next/link";
import useRoutes from "@/app/hooks/useRoutes";
import {useEffect, useState} from "react";
import FooterSkeleton from "@/app/components/skeletons/footerSkeleton";

export default function Footer() {

    const routes = useRoutes();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (routes && routes.length > 0) {
            setIsLoading(false);
        }
    }, [routes]);

    if (isLoading) {
        return (
            <FooterSkeleton/>
        );
    }

    return (
        <>
            <footer className="self-center border-t border-orange-900 w-screen py-3">
                <section className="container mx-auto w-screen md:w-2/3">
                    <article>
                        <h3 className="text-center mt-4">&copy; SSK Production Agency 2024
                            - {new Date().getFullYear()}</h3>
                        <h3 className="text-center mb-2">All Rights Reserved</h3>
                        <hr className="border-orange-900 mb-2"/>
                        <ul className="grid grid-cols-3 gap-4">
                            {routes.map((route) => (
                                <Link
                                    href={route.path}
                                    key={route.path}
                                    className="hover:underline decoration-orange-700 text-center"
                                >
                                    {route.name}
                                </Link>
                            ))}
                        </ul>
                    </article>
                </section>
            </footer>
        </>
    )
}