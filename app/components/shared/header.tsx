'use client';

import Link from "next/link";

export default function Header() {
    return (
        <>
            <header className="fixed top-0 left-0 z-50  border-orange-900/70 flex items-center justify-center sticky bg-gray-50">
                <section className="flex flex-row text-slate-800 px-4 py-2 justify-between w-screen md:w-2/3">
                    <h1 className="md:text-lg lg:text-xl xl:text-2xl">
                        <Link href={"/"}>
                            <span className="text-orange-700 dark:text-orange-600 font-medium">Re</span>Ventures
                        </Link>
                    </h1>
                    <nav className="text-xs md:text-sm lg:text-base xl:text-lg">
                        <ul className="flex flex-row space-x-4">
                            <li className="relative group">
                              <span className="hover:underline hover:decoration-orange-700 cursor-pointer">
                                Sign up
                              </span>
                                <ul className="absolute px-3 py-1.5 hidden group-hover:flex flex-col bg-white shadow-md border rounded-md">
                                    <Link href={"/user-register"} className="hover:bg-orange-100 px-2 py-1 rounded-lg cursor-pointer">Individual</Link>
                                    <hr className="border-orange-200"/>
                                    <Link href={"/company-register"} className="hover:bg-orange-100 px-2 py-1 rounded-lg cursor-pointer">Company</Link>
                                </ul>
                            </li>
                            <li className="hover:*:underline hover:*:decoration-orange-700">
                                <Link href={"/login"}>Log in</Link>
                            </li>
                            <li className="relative group">
                              <span className="text-orange-700 font-bold hover:underline hover:decoration-orange-700 cursor-pointer">
                                Post an ad
                              </span>
                                <ul className="absolute  hidden group-hover:flex flex-col bg-white shadow-md border rounded-md">
                                    <Link href={"/vehicle-offer"} className="hover:bg-blue-100 px-2 py-1 text-center cursor-pointer">Vehicle</Link>
                                    <hr className="border-orange-200"/>
                                    <Link href={"/property-offer"} className="hover:bg-green-100 px-2 py-1 text-center cursor-pointer">Porperty</Link>
                                    <hr className="border-orange-200"/>
                                    <Link href={"/commercial-offer"} className="hover:bg-orange-100 px-2 py-1 text-center cursor-pointer">Commercial</Link>
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </section>
            </header>
        </>
    );
}