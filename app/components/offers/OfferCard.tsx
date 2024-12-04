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
      className="bg-white shadow-xl rounded-lg overflow-hidden w-full flex p-4 lg:p-6 transform transition-all hover:scale-105 hover:shadow-2xl cursor-pointer"
    >
      {/* Image section */}
      <div
        className="w-1/3 h-48 lg:h-56 bg-gray-200 bg-cover bg-center rounded-lg flex-shrink-0"
        style={{
          backgroundImage:
            offer.photos.length > 0 ? `url(${offer.photos[0]})` : "none",
        }}
      >
        {offer.photos.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            No Image Available
          </div>
        )}
      </div>

      {/* Description section */}
      <div className=" break-words w-2/5 flex flex-col justify-between p-4">
        <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-4">
          {offer.title}
        </h2>
        <div className="w-full break-words bg-gray-50 rounded-lg p-4">
          <p className="text-base text-gray-600">
            <b className="text-lg text-gray-700">Description:</b>{" "}
            {offer.description}
          </p>
        </div>
      </div>

      {/* Info section */}
      <div className="w-1/4 flex flex-col justify-between items-start lg:items-end p-4">
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
  );
};

export default OfferCard;
