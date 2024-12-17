"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faBusinessTime,
  faCar,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CategorieLink() {
  const { category } = useParams(); // Récupère la catégorie depuis l'URL

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 fixed w-4/5 top-10 left-0l bg-gray-50 z-40">
      <Link href="/offers/vehicle">
        <header
          className={`group flex items-center justify-center gap-4 bg-blue-100 rounded-lg text-blue-800 font-semibold p-6 shadow transition-transform hover:scale-105 hover:shadow-lg text-center ${
            category === "vehicle" ? "border-4 border-blue-500" : ""
          }`}
        >
          <div className="p-4 rounded-full">
            <FontAwesomeIcon icon={faCar} className="text-2xl" />
          </div>
          <span className="text-lg">Vehicle</span>
        </header>
      </Link>

      <Link href="/offers/property">
        <header
          className={`group flex items-center justify-center gap-4 bg-green-100 rounded-lg text-green-800 font-semibold p-6 shadow transition-transform hover:scale-105 hover:shadow-lg text-center ${
            category === "property" ? "border-4 border-green-600" : ""
          }`}
        >
          <div className="p-4 rounded-full">
            <FontAwesomeIcon icon={faBuilding} className="text-2xl" />
          </div>
          <span className="text-lg">Property</span>
        </header>
      </Link>

      <Link href="/offers/commercial">
        <header
          className={`group flex items-center justify-center gap-4 bg-orange-100 rounded-lg text-orange-800 font-semibold p-6 shadow transition-transform hover:scale-105 hover:shadow-lg text-center ${
            category === "commercial" ? "border-4 border-orange-600" : ""
          }`}
        >
          <div className="p-4 rounded-full">
            <FontAwesomeIcon icon={faBusinessTime} className="text-2xl" />
          </div>
          <span className="text-lg">Commercial</span>
        </header>
      </Link>
      <p className="text-lg mb-4">
        Bienvenue dans la catégorie{" "}
        <strong className="text-orange-700">{category}</strong>.<br />
      </p>
    </section>
  );
}
