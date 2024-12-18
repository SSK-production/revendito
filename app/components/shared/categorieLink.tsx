"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faBusinessTime, faCar } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CategorieLink() {
  const { category } = useParams(); // Récupère la catégorie depuis l'URL

  return (
    <section className="flex flex-wrap justify-center gap-4 p-4 fixed w-full top-10 left-0 bg-gray-50 z-40">
      <Link href="/offers/vehicle">
        <header
          className={`group flex flex-col items-center gap-2 bg-blue-100 rounded-lg text-blue-800 font-medium shadow transition-transform hover:scale-105 hover:shadow-lg ${
            category === "vehicle" ? "border-2 border-blue-500" : ""
          } w-24 sm:w-32 md:w-40 lg:w-48 p-3 sm:p-4 md:p-5`}
        >
          <div className="flex items-center justify-center rounded-full bg-white w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16">
            <FontAwesomeIcon icon={faCar} className="text-base sm:text-lg md:text-xl lg:text-2xl" />
          </div>
          <span className="text-xs sm:text-sm md:text-base lg:text-lg">Vehicle</span>
        </header>
      </Link>

      <Link href="/offers/property">
        <header
          className={`group flex flex-col items-center gap-2 bg-green-100 rounded-lg text-green-800 font-medium shadow transition-transform hover:scale-105 hover:shadow-lg ${
            category === "property" ? "border-2 border-green-500" : ""
          } w-24 sm:w-32 md:w-40 lg:w-48 p-3 sm:p-4 md:p-5`}
        >
          <div className="flex items-center justify-center rounded-full bg-white w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16">
            <FontAwesomeIcon icon={faBuilding} className="text-base sm:text-lg md:text-xl lg:text-2xl" />
          </div>
          <span className="text-xs sm:text-sm md:text-base lg:text-lg">Property</span>
        </header>
      </Link>

      <Link href="/offers/commercial">
        <header
          className={`group flex flex-col items-center gap-2 bg-orange-100 rounded-lg text-orange-800 font-medium shadow transition-transform hover:scale-105 hover:shadow-lg ${
            category === "commercial" ? "border-2 border-orange-500" : ""
          } w-24 sm:w-32 md:w-40 lg:w-48 p-3 sm:p-4 md:p-5`}
        >
          <div className="flex items-center justify-center rounded-full bg-white w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16">
            <FontAwesomeIcon icon={faBusinessTime} className="text-base sm:text-lg md:text-xl lg:text-2xl" />
          </div>
          <span className="text-xs sm:text-sm md:text-base lg:text-lg">Commercial</span>
        </header>
      </Link>
    </section>
  );
}
