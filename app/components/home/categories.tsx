'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faBusinessTime, faCar } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import useLastOffers from "@/app/hooks/useLastOffers";

interface Offer {
  id: string;
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

  const renderOfferCard = (offer: Offer, category: string) => (
    <Link
      href={`/offer?category=${category}&offerId=${offer.id}`}
      key={offer.id}
      className="group block bg-white rounded-sm shadow hover:shadow-lg transition-all border border-gray-200"
    >
      {offer.photos.length > 0 ? (
      <div className="relative w-full h-40">
        <Image
        src={`${offer.photos[0]}`}
        alt={offer.title}
        layout="fill"
        objectFit="cover"
        className="rounded-t-sm group-hover:opacity-90"
        priority
        />
      </div>
      ) : (
      <div className="w-full h-40 bg-gray-100 rounded-t-md flex items-center justify-center text-gray-400">
        No Image
      </div>
      )}
      <div className="mt-0 p-4">
      <h3 className="font-semibold text-gray-800 text-sm group-hover:underline">{offer.title}</h3>
      <p className="text-gray-600 text-xs mt-1">
        {offer.description.length > 50
        ? offer.description.slice(0, 50) + "..."
        : offer.description}
      </p>
      <p className="text-gray-700 text-sm font-bold mt-2">€ {offer.price}</p>
      </div>
    </Link>
  );

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {/* Automotive */}
      <article className="bg-blue-50 rounded-lg shadow-md">
        <header className="flex items-center gap-2 bg-blue-100 rounded-t-lg text-blue-800 font-semibold pl-4 py-3">
          <Link href="/offers/vehicle" className="flex items-center gap-2 hover:text-blue-600">
            <FontAwesomeIcon icon={faCar} />
            Vehicle
          </Link>
        </header>
        <div className="p-4 space-y-4">
          {lastAutomotiveOffers.length
            ? lastAutomotiveOffers.map((offer) => renderOfferCard(offer, "vehicle"))
            : <p className="text-gray-500 italic text-center">No offers available</p>}
          <Link
            href="/offers/vehicle"
            className="text-blue-600 text-sm font-semibold hover:underline flex justify-end"
          >
            Voir plus →
          </Link>
        </div>
      </article>

      {/* Estate */}
      <article className="bg-green-50 rounded-lg shadow-md">
        <header className="flex items-center gap-2 bg-green-100 rounded-t-lg text-green-800 font-semibold pl-4 py-3">
          <Link href="/offers/property" className="flex items-center gap-2 hover:text-green-600">
            <FontAwesomeIcon icon={faBuilding} />
            Property
          </Link>
        </header>
        <div className="p-4 space-y-4">
          {lastEstateOffers.length
            ? lastEstateOffers.map((offer) => renderOfferCard(offer, "property"))
            : <p className="text-gray-500 italic text-center">No offers available</p>}
          <Link
            href="/offers/property"
            className="text-green-600 text-sm font-semibold hover:underline flex justify-end"
          >
            Voir plus →
          </Link>
        </div>
      </article>

      {/* Commercial */}
      <article className="bg-orange-50 rounded-lg shadow-md">
        <header className="flex items-center gap-2 bg-orange-100 rounded-t-lg text-orange-800 font-semibold pl-4 py-3">
          <Link href="/offers/commercial" className="flex items-center gap-2 hover:text-orange-600">
            <FontAwesomeIcon icon={faBusinessTime} />
            Commercial
          </Link>
        </header>
        <div className="p-4 space-y-4">
          {lastServicesOffers.length
            ? lastServicesOffers.map((offer) => renderOfferCard(offer, "commercial"))
            : <p className="text-gray-500 italic text-center">No offers available</p>}
          <Link
            href="/offers/commercial"
            className="text-orange-600 text-sm font-semibold hover:underline flex justify-end"
          >
            Voir plus →
          </Link>
        </div>
      </article>
    </section>
  );
}
