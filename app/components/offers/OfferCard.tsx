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
      className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col lg:flex-row transition-transform hover:scale-105 hover:shadow-2xl cursor-pointer w-full"
    >
      {/* Image Section */}
      <div
        className="w-full lg:w-1/3 h-56 bg-gray-200 bg-cover bg-center"
        style={{
          backgroundImage: offer.photos.length > 0 ? `url(${offer.photos[0]})` : "none",
        }}
      >
        {offer.photos.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-500 text-base">
            No Image Available
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="flex flex-col flex-grow p-4 lg:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{offer.title}</h2>
          <span className="text-lg font-bold text-green-600">
            {offer.price} $
          </span>
        </div>

        <div className="flex flex-col space-y-2 text-gray-600 text-lg">
          <p>
            <span className="font-medium">Ville:</span> {offer.city}
          </p>
          <p>
            <span className="font-medium">Pays:</span> {offer.country}
          </p>
        </div>
        <div className="flex justify-between items-end mt-auto text-gray-500 text-xs">
          <p>
            <span className="font-medium">Publié le:</span>{" "}
            {new Date(offer.createdAt).toLocaleDateString()}
          </p>
          <p>
            <span className="font-medium">Mis à jour le:</span>{" "}
            {new Date(offer.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
