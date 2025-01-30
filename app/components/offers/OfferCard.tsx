import React from "react";
import Image from "next/image";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { Offers } from "@/app/types";

interface OfferCardProps {
  offer: Offers;
}

const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
  return (
    <div className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 w-full max-w-lg mx-auto mb-10">
      {/* Image Container */}
      <div className="relative w-full h-64 bg-gray-100">
        {offer.photos.length > 0 ? (
          <Image
        src={offer.photos[0] || "/placeholder.svg"}
        alt={offer.title}
        fill
        sizes="100vw"
        className="transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
        <span className="text-sm">No Image Available</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
      {/* Title and Price */}
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-1">
          {offer.title}
        </h3>
        <div className="flex justify-end">
          <span className="text-2xl font-bold text-green-500">{offer.price} €</span>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center text-sm text-gray-500 mb-3">
        <FaMapMarkerAlt className="w-5 h-5 mr-2 flex-shrink-0 text-red-400" />
        <span className="truncate">
        {offer.city}, {offer.country}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
        {offer.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
        <div className="flex items-center">
        <FaCalendarAlt className="w-4 h-4 mr-2" />
        <time dateTime={offer.createdAt}>
          {new Date(offer.createdAt).toLocaleDateString()}
        </time>
        </div>
      </div>
      </div>
    </div>
  );
};

export default OfferCard;
