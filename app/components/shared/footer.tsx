'use client';
import Link from "next/link";
import useRoutes from "@/app/hooks/useRoutes";

export default function Footer() {

    const routes = useRoutes();

    return (
        <>
            <footer className="self-center border-t border-orange-900 w-screen">
                <section className="container mx-auto w-screen md:w-2/3">
                    <article>
                        <h3 className="text-center mb-2">Site Map</h3>
                        <ul className="grid grid-cols-3 gap-4">
                            {routes.map((route) => (
                                <Link
                                    href={route.path}
                                    key={route.path}
                                >{route.name}</Link>
                            ))}
                        </ul>
                    </article>
                </section>
            </footer>
        </>
    )
}