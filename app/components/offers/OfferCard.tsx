import React from "react";

interface Offers {
  id: number;
  title: string;
  description: string;
  photos: string[];
  price: number;
  city: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}

interface OfferCardProps {
  offer: Offers;
}
const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
  return (
    <div
      key={offer.id}
      className="bg-white shadow-xl rounded-lg overflow-hidden w-full flex flex-col sm:flex-row p-4 lg:p-6 transform transition-all hover:scale-105 hover:shadow-2xl cursor-pointer"
    >
      {/* Image section */}
      <div
        className="w-full sm:w-64 lg:w-72 h-48 lg:h-56 bg-cover bg-center rounded-lg mb-4 sm:mb-0"
        style={{
          backgroundImage:
            offer.photos.length > 0 ? `url(${offer.photos[0]})` : "none",
        }}
      ></div>

      {/* Content section */}
      <div className="flex-1 flex flex-col items-start justify-between sm:ml-4 lg:ml-6">
        {/* Title */}
        <div className="w-full mb-4">
          <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 text-center sm:text-left">
            {offer.title}
          </h2>
        </div>

        {/* Details */}
        <div className="flex flex-col lg:flex-row w-full lg:max-w-3xl justify-between items-start lg:items-center">
          {/* Description */}
          <div className="flex-1 mb-4 lg:mb-0 w-full">
            <p className="text-base text-gray-600">
              <b className="text-lg text-gray-700">Description : </b>
              {offer.description}
            </p>
          </div>

          {/* Additional info */}
          <div className="flex-1 lg:ml-6 flex flex-col justify-between items-start lg:items-end space-y-2">
            <p className="text-lg text-gray-700">
              <strong>Prix:</strong>{" "}
              <span className="text-green-600">{offer.price} $</span>
            </p>
            <p className="text-lg text-gray-700">
              <strong>Ville:</strong> {offer.city}
            </p>
            <p className="text-lg text-gray-700">
              <strong>Pays:</strong> {offer.country}
            </p>
            <p className="text-sm text-gray-500">
              <strong>Publié le:</strong>{" "}
              {new Date(offer.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">
              <strong>Mis à jour le:</strong>{" "}
              {new Date(offer.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
