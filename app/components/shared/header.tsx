'use client';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusCircle} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function Header() {
    return (
        <>
            <header className="border-b border-slate-900/70 flex items-center justify-center sticky">
                <section className="flex flex-row text-slate-800 px-4 py-2 justify-between w-2/3">
                    <h1 className="md:text-lg lg:text-xl xl:text-2xl">
                        <Link href={"/"}>
                            <span className="text-orange-700 dark:text-orange-600 font-medium">Re</span>Ventures
                        </Link>
                    </h1>
                    <nav>
                        <ul className="flex flex-row space-x-4">
                            <li className="relative group">
                              <span className="hover:underline hover:decoration-orange-700 cursor-pointer">
                                Sign up
                              </span>
                                <ul className="absolute px-3 py-1.5 hidden group-hover:flex flex-col bg-white shadow-md border rounded-md">
                                    <Link href={"/user_register"} className="hover:bg-orange-100 px-2 py-1 rounded-lg cursor-pointer">Individual</Link>
                                    <hr className="border-orange-200"/>
                                    <Link href={"/company_register"} className="hover:bg-orange-100 px-2 py-1 rounded-lg cursor-pointer">Company</Link>
                                </ul>
                            </li>
                            <li className="hover:*:underline hover:*:decoration-orange-700">
                                <Link href={"/login"}>Log in</Link>
                            </li>
                            <li className="hover:scale-110 transition-all duration-500">
                                <a href="#" className="text-orange-700 font-bold"> <FontAwesomeIcon
                                    icon={faPlusCircle}/> Post an ad</a>
                            </li>
                        </ul>
                    </nav>
                </section>
            </header>
        </>
    );
}