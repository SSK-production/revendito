import React from "react";
import Image from "next/image";
import { FaMapMarkerAlt, FaCalendarAlt, FaTag } from "react-icons/fa";
import { Offers } from "@/app/types";



interface OfferCardProps {
  offer: Offers;
}

const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
  return (
    <div
      key={offer.id}
      className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col lg:flex-row transition-transform hover:scale-105 hover:shadow-lg cursor-pointer w-full mb-6"
    >
      {/* Image Section */}
      <div className="relative w-full h-40 lg:w-1/3 lg:h-64 bg-gray-200">
        {offer.photos.length > 0 ? (
          <Image
            src={offer.photos[0]}
            alt={offer.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            objectFit="cover"
            style={{ objectFit: 'cover' }}
            className="rounded-t-lg lg:rounded-none"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-base">
            No Image Available
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="flex flex-col flex-grow p-4 lg:p-6">
        {/* Title and Price */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg lg:text-2xl font-semibold text-gray-800 truncate">
            {offer.title}
          </h2>
          <span className="text-sm lg:text-xl font-bold text-green-500 flex items-center">
            <FaTag className="mr-2" />
            {offer.price} $
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-3">
          <FaMapMarkerAlt className="mr-2 text-red-500" />
          <span className="text-sm lg:text-lg">
            {offer.city}, {offer.country}
          </span>
        </div>

        {/* Description */}
        <div className="text-gray-700 text-sm lg:text-base mb-4 max-w-md line-clamp-3">
          {offer.description}
        </div>

        {/* Dates */}
        <div className="flex justify-between items-end mt-auto text-gray-500 text-xs lg:text-sm">
          <div className="flex items-center">
            <FaCalendarAlt className="mr-2" />
            <p>
              Publié le: {new Date(offer.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center">
            <FaCalendarAlt className="mr-2" />
            <p>
              Mis à jour: {new Date(offer.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
