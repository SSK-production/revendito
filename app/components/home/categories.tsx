'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faBusinessTime, faCar } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import useLastOffers from "@/app/hooks/useLastOffers";

interface Offer {
  id: string; // Ajout de l'identifiant pour chaque offre
  title: string;
  description: string;
  price: number;
  photos: string[];
}

interface CategoriesProps {
  onLoad?: () => void;
}

export default function Categories({ onLoad }: CategoriesProps) {
  useEffect(() => {
    if (onLoad) {
      const timeout = setTimeout(() => {
        onLoad();
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [onLoad]);

  const lastAutomotiveOffers: Offer[] = useLastOffers("automotive").offers;
  const lastEstateOffers: Offer[] = useLastOffers("estate").offers;
  const lastServicesOffers: Offer[] = useLastOffers("commercial").offers;

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      {/* Automotive */}
      <article className="flex flex-col bg-indigo-50 rounded-lg shadow-md transition-shadow">
        <header className="flex items-center gap-2 bg-indigo-100 rounded-t-lg text-indigo-800 font-semibold pl-3 py-3">
          <Link href="/offers/vehicle" className="flex items-center gap-2 hover:text-indigo-600">
            <FontAwesomeIcon icon={faCar} />
            Vehicle
          </Link>
        </header>
        <div className="p-3 space-y-4">
          {lastAutomotiveOffers.length ? (
            lastAutomotiveOffers.map((offer) => (
              <Link
                href={`/offer?category=vehicle&offerId=${offer.id}`} // Lien vers la page de l'offre
                key={offer.id}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-lg hover:scale-105 hover:border-indigo-300 transition-all border border-gray-200 flex flex-col"
              >
                {offer.photos.length > 0 ? (
                  <Image
                    src={offer.photos[0]}
                    alt={offer.title}
                    width={300}
                    height={200}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                <h3 className="font-bold text-gray-800 text-sm">{offer.title}</h3>
                <p className="text-gray-600 text-xs">
                  {offer.description.length > 50
                    ? offer.description.slice(0, 50) + "..."
                    : offer.description}
                </p>
                <p className="text-gray-500 text-sm mt-2 font-medium">€ {offer.price}</p>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 italic text-center">No offers available</p>
          )}
        </div>
      </article>

      {/* Estate */}
      <article className="flex flex-col bg-stone-50 rounded-lg shadow-md transition-shadow">
        <header className="flex items-center gap-2 bg-stone-100 rounded-t-lg text-stone-800 font-semibold pl-3 py-3">
          <Link href="/offers/property" className="flex items-center gap-2 hover:text-stone-600">
            <FontAwesomeIcon icon={faBuilding} />
            Property
          </Link>
        </header>
        <div className="p-3 space-y-4">
          {lastEstateOffers.length ? (
            lastEstateOffers.map((offer) => (
              <Link
                href={`/offer?category=property&offerId=${offer.id}`}
                key={offer.id}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-lg hover:scale-105 hover:border-stone-300 transition-all border border-gray-200 flex flex-col"
              >
                {offer.photos.length > 0 ? (
                  <Image
                    src={offer.photos[0]}
                    alt={offer.title}
                    width={300}
                    height={200}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                <h3 className="font-bold text-gray-800 text-sm">{offer.title}</h3>
                <p className="text-gray-600 text-xs">
                  {offer.description.length > 50
                    ? offer.description.slice(0, 50) + "..."
                    : offer.description}
                </p>
                <p className="text-gray-500 text-sm mt-2 font-medium">€ {offer.price}</p>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 italic text-center">No offers available</p>
          )}
        </div>
      </article>

      {/* Commercial */}
      <article className="flex flex-col bg-sky-50 rounded-lg shadow-md transition-shadow">
        <header className="flex items-center gap-2 bg-sky-100 rounded-t-lg text-sky-800 font-semibold pl-3 py-3">
          <Link href="/offers/commercial" className="flex items-center gap-2 hover:text-sky-600">
            <FontAwesomeIcon icon={faBusinessTime} />
            Commercial
          </Link>
        </header>
        <div className="p-3 space-y-4">
          {lastServicesOffers.length ? (
            lastServicesOffers.map((offer) => (
              <Link
                href={`/offer?category=commercial&offerId=${offer.id}`}
                key={offer.id}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-lg hover:scale-105 hover:border-sky-300 transition-all border border-gray-200 flex flex-col"
              >
                {offer.photos.length > 0 ? (
                  <Image
                    src={offer.photos[0]}
                    alt={offer.title}
                    width={300}
                    height={200}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                <h3 className="font-bold text-gray-800 text-sm">{offer.title}</h3>
                <p className="text-gray-600 text-xs">
                  {offer.description.length > 50
                    ? offer.description.slice(0, 50) + "..."
                    : offer.description}
                </p>
                <p className="text-gray-500 text-sm mt-2 font-medium">€ {offer.price}</p>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 italic text-center">No offers available</p>
          )}
        </div>
      </article>
    </section>
  );
}
