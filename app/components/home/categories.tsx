'use client';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBuilding, faBusinessTime, faCar} from "@fortawesome/free-solid-svg-icons";
import {Fragment, useEffect} from "react";
import useLastOffers from "@/app/hooks/useLastOffers";

interface CategoriesProps {
    onLoad?: () => void;
}

export default function Categories({onLoad}: CategoriesProps) {

    useEffect(() => {
        if (onLoad) {
            const timeout = setTimeout(() => {
                onLoad();
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [onLoad]);

    const lastAutomotiveOffers = useLastOffers('automotive').offers;
    const lastEstateOffers = useLastOffers('estate').offers;
    const lastServicesOffers = useLastOffers('commercial').offers;

    return (
        <>
            <section className="grid grid-cols-3 gap-2 *:cursor-pointer">
                <article
                    className="flex flex-col gap-2">

                    <p className="flex flex-row items-center gap-2 bg-indigo-100 rounded-lg text-indigo-800 font-medium pl-2 py-2 hover:text-indigo-100 hover:bg-indigo-700">
                        <FontAwesomeIcon icon={faCar}/> Automotive
                    </p>

                    <ul className="flex flex-col gap-2 border bg-indigo-400 text-indigo-50 rounded-lg p-2">
                        {lastAutomotiveOffers.map((offer, index) => (
                            <Fragment key={index}>
                                <li className="text-xs">{offer.title}</li>
                                <li className="text-xs break-words">{offer.description}</li>
                                <li className="text-xs break-words">€ {offer.price}</li>
                            </Fragment>
                        ))}
                    </ul>
                </article>
                <article
                    className="flex flex-col gap-2">

                    <p className="flex flex-row items-center gap-2 bg-stone-100 rounded-lg text-stone-800 font-medium pl-2 py-2 hover:text-stone-100 hover:bg-stone-700">
                        <FontAwesomeIcon icon={faBuilding}/> Estate
                    </p>

                    <ul className="flex flex-col gap-2 border bg-stone-400 text-stone-50 rounded-lg p-2">
                        {lastEstateOffers.map((offer, index) => (
                            <Fragment key={index}>
                                <li className="text-xs">{offer.title}</li>
                                <li className="text-xs break-words">{offer.description.length >= 30 ? offer.description.slice(0, 30) + '...' : offer.description}</li>
                                <li className="text-xs break-words">€ {offer.price}</li>
                            </Fragment>
                        ))}
                    </ul>
                </article>
                <article
                    className="flex flex-col gap-2">

                    <p className="flex flex-row items-center gap-2 bg-sky-100 rounded-lg text-sky-800 font-medium pl-2 py-2 hover:text-sky-100 hover:bg-sky-700">
                        <FontAwesomeIcon icon={faBusinessTime}/> Estate
                    </p>

                    <ul className="flex flex-col gap-2 border bg-sky-400 text-sky-50 rounded-lg p-2">
                        {lastServicesOffers.map((offer, index) => (
                            <Fragment key={index}>
                                <li className="text-xs">{offer.title}</li>
                                <li className="text-xs break-words">{offer.description.length >= 30 ? offer.description.slice(0, 30) + '...' : offer.description}</li>
                                <li className="text-xs break-words">€ {offer.price}</li>
                            </Fragment>
                        ))}
                    </ul>
                </article>
            </section>
        </>
    )
}