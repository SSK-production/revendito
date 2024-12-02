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
      className="bg-white shadow-xl rounded-lg overflow-hidden w-full flex flex-col sm:flex-row p-6 transform transition-all hover:scale-105 hover:shadow-2xl cursor-pointer"
    >
      <div
        className="w-full sm:w-72 h-56 bg-cover bg-center rounded-lg mb-4 sm:mb-0"
        style={{
          backgroundImage:
            offer.photos.length > 0 ? `url(${offer.photos[0]})` : "none",
        }}
      ></div>

      <div className="flex-1 sm:flex sm:flex-col items-center justify-start sm:ml-6">
        <div className="w-full mb-4 text-center">
          <h2 className="text-3xl font-semibold text-gray-800">
            {offer.title}
          </h2>
        </div>

        <div className="flex sm:flex-row w-full sm:max-w-lg justify-center items-center text-center">
          <div className="flex-1 mb-4 sm:mb-6 w-full">
            <p className="text-base text-gray-600">
              <b className="text-lg text-gray-700">Description : </b>
              {offer.description}
            </p>
          </div>

          <div className="flex-1 sm:ml-6 flex flex-col justify-between items-center">
            <div className="flex flex-col mt-3 space-y-2">
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
    </div>
  );
};

export default OfferCard;
