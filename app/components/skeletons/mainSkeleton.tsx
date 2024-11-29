'use client';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBuilding, faBusinessTime, faCar} from "@fortawesome/free-solid-svg-icons";

export default function MainSkeleton() {
    return (
        <section className="grid grid-cols-3 gap-2 *:cursor-pointer">
            {[
                { icon: faCar, bgColor: 'bg-indigo-100', textColor: 'text-indigo-800' },
                { icon: faBuilding, bgColor: 'bg-stone-200', textColor: 'text-stone-800' },
                { icon: faBusinessTime, bgColor: 'bg-sky-100', textColor: 'text-sky-800' }
            ].map((category, index) => (
                <article
                    key={index}
                    className={`${category.bgColor} ${category.textColor} rounded-lg font-medium flex flex-row items-center gap-2 pl-2 py-2 animate-pulse`}
                >
                    <FontAwesomeIcon icon={category.icon} className="opacity-50" />
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </article>
            ))}
        </section>
    )
}