import React from "react";

interface Property {
  propertyType?: string;
  propertyCondition?: string;
  surface?: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  heatingType?: string;
  energyClass?: string;
  furnished?: boolean;
  parking?: boolean;
  garage?: boolean;
  elevator?: boolean;
  balcony?: boolean;
  terrace?: boolean;
  garden?: boolean;
  basementAvailable?: boolean;
  floorNumber?: number;
  totalFloor?: number;
  avaibilabilityDate?: Date;
  contactNumber?: string;
  contactEmail?: string;
  location?: boolean;
}

interface PropertyDetailsProps {
  data: Property;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ data }) => {
  const optionalFeatures = [
    { label: "Furnished", value: data.furnished },
    { label: "Parking", value: data.parking },
    { label: "Garage", value: data.garage },
    { label: "Elevator", value: data.elevator },
    { label: "Balcony", value: data.balcony },
    { label: "Terrace", value: data.terrace },
    { label: "Garden", value: data.garden },
    { label: "Basement", value: data.basementAvailable },
  ];

  return (
    <div className="space-y-6">
      {/* Main Details */}
      <div className="bg-white border rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Property Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-500">Location</p>
            <p className="text-lg text-gray-800 font-semibold">
              {data.location ? "Yes" : "No"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Property Condition</p>
            <p className="text-lg text-gray-800 font-semibold">
              {data.propertyCondition || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Property Type</p>
            <p className="text-lg text-gray-800 font-semibold">
              {data.propertyType || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Surface</p>
            <p className="text-lg text-gray-800 font-semibold">
              {data.surface ? `${data.surface} m²` : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Rooms</p>
            <p className="text-lg text-gray-800 font-semibold">
              {data.rooms || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Bedrooms</p>
            <p className="text-lg text-gray-800 font-semibold">
              {data.bedrooms || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Bathrooms</p>
            <p className="text-lg text-gray-800 font-semibold">
              {data.bathrooms || "N/A"}
            </p>
          </div>
          {data.location && (
            <div>
              <p className="text-gray-500">Floor Number</p>
              <p className="text-lg text-gray-800 font-semibold">
                {data.floorNumber || "N/A"}
              </p>
            </div>
          )}
          {!data.location && (
            <div>
              <p className="text-gray-500">Total Floors</p>
              <p className="text-lg text-gray-800 font-semibold">
                {data.totalFloor || "N/A"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="bg-white border rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Features</h2>
        <div className="flex flex-wrap gap-3">
          {optionalFeatures
            .filter((feature) => feature.value !== undefined)
            .map((feature, index) => (
              <span
                key={index}
                className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full shadow-sm ${
                  feature.value === true
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {feature.label}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
