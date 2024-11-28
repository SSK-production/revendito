'use client';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBuilding, faBusinessTime, faCar} from "@fortawesome/free-solid-svg-icons";

export default function Categories() {
    return (
        <>
            <section className="grid grid-cols-3 gap-2 *:cursor-pointer">
                <article className="bg-indigo-100 rounded-lg text-indigo-800 font-medium flex flex-row items-center gap-2 pl-2 py-2 hover:text-indigo-100 hover:bg-indigo-700">
                    <FontAwesomeIcon icon={faCar}/>
                    Automotive
                </article>
                <article
                    className="bg-stone-200 rounded-lg text-stone-800 font-medium flex flex-row items-center gap-2 pl-2 py-2 hover:text-stone-200 hover:bg-stone-700">
                    <FontAwesomeIcon icon={faBuilding}/>
                    Estate
                </article>
                <article
                    className="bg-sky-100 rounded-lg text-sky-800 font-medium flex flex-row items-center gap-2 pl-2 py-2 hover:text-sky-100 hover:bg-sky-700">
                    <FontAwesomeIcon icon={faBusinessTime}/>
                    Services
                </article>
            </section>
        </>
    )
}