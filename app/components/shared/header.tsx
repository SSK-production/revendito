'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
    return (
        <>
            <header className="border-b border-slate-900/70 flex items-center justify-center sticky">
                <section className="flex flex-row text-slate-800 px-4 py-2 justify-between w-2/3">
                    <h1><span className="text-orange-700 dark:text-orange-600 font-medium">Re</span>Ventures</h1>
                    <nav>
                        <ul className="flex flex-row space-x-4">
                            <li className="hover:*:underline hover:*:decoration-orange-700">
                                <a href="#">Sign up</a>
                            </li>
                            <li className="hover:*:underline hover:*:decoration-orange-700">
                                <a href="#">Log in</a>
                            </li>
                            <li className="hover:scale-110 transition-all duration-500">
                                <a href="#" className="text-orange-700 font-bold"> <FontAwesomeIcon icon={faPlusCircle} /> Post an ad</a>
                            </li>
                        </ul>
                    </nav>
                </section>
            </header>
        </>
    );
}