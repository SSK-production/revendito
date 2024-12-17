import { FiEdit, FiTrash2, FiEye, FiEyeOff } from "react-icons/fi"; // Import des icônes

interface Offer {
  id: number;
  title: string;
  price: number;
  city: string;
  country: string;
  active: boolean;
}

interface UserOffersProps {
  offers: {
    vehicleOffers: Offer[];
    realEstateOffers: Offer[];
    commercialOffers: Offer[];
  };
  currentUserId: string | null;
  userId: string;
}

const UserOffers: React.FC<UserOffersProps> = ({ offers, currentUserId, userId }) => {
  const { vehicleOffers, realEstateOffers, commercialOffers } = offers;

  const handleUpdate = (offerId: number) => console.log(`Update offer ${offerId}`);
  const handlePublish = (offerId: number) => console.log(`Toggle publish for offer ${offerId}`);
  const handleDelete = (offerId: number) => console.log(`Delete offer ${offerId}`);

  const StatusBadge = ({ active }: { active: boolean }) => (
    <span
      className={`inline-block w-3 h-3 rounded-full ${
        active ? "bg-green-500" : "bg-red-400"
      }`}
      title={active ? "Active" : "Inactive"}
    ></span>
  );

  const ActionButtons = ({ offerId, active }: { offerId: number; active: boolean }) => (
    <div className="flex flex-wrap gap-2 md:gap-4 justify-end md:justify-start mt-2">
      <button onClick={() => handleUpdate(offerId)} className="text-blue-500 hover:text-blue-700">
        <FiEdit size={20} title="Update" />
      </button>
      <button
        onClick={() => handlePublish(offerId)}
        className={`hover:text-green-700 text-green-500`}
      >
        {active ? <FiEyeOff size={20} title="Visible" /> : <FiEye size={20} title="Mettre en ligne" />}
      </button>
      <button onClick={() => handleDelete(offerId)} className="text-red-500 hover:text-red-700">
        <FiTrash2 size={20} title="Delete" />
      </button>
    </div>
  );

  const renderOffers = (title: string, offerList: Offer[]) => {
    const filteredOffers = offerList.filter((offer) =>
      currentUserId === userId ? true : offer.active
    );
    return (
      <section>
        {filteredOffers.length > 0 ? (
          <ul className="space-y-4">
            {filteredOffers.map((offer) => (
              <li
                key={offer.id}
                className="p-4 border border-gray-200 rounded-md hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="flex flex-col space-y-1 md:space-y-0 md:space-x-2 md:flex-row items-start">
                {currentUserId === userId && <StatusBadge active={offer.active} />}
                  <div>
                    <p className="text-lg font-semibold">{offer.title}</p>
                    <p className="text-gray-600">
                      Price: <span className="font-medium">{offer.price}€</span>
                    </p>
                    <p className="text-gray-600">
                      Location: {offer.city}, {offer.country}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                {currentUserId === userId && <ActionButtons offerId={offer.id} active={offer.active} />}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No offers available.</p>
        )}
      </section>
    );
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 bg-white shadow-lg rounded-md">
      <h1 className="text-xl font-bold text-center md:text-left">
        {currentUserId === userId ? "Toutes vos offres" : "Offres disponibles"}
      </h1>

      {/* Vehicle Offers */}
      {renderOffers("Vehicle Offers", vehicleOffers)}

      {/* Real Estate Offers */}
      {renderOffers("Real Estate Offers", realEstateOffers)}

      {/* Commercial Offers */}
      {renderOffers("Commercial Offers", commercialOffers)}
    </div>
  );
};

export default UserOffers;
