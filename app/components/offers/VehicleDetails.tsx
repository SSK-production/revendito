import React from "react";

interface Vehicle {
  vehicleType?: string;
  model?: string;
  year?: number;
  mileage?: number;
  fuelType?: string;
  color?: string;
  transmission?: string;
  numberOfDoors?: number;
  engineSize?: number;
  power?: number;
  emissionClass?: string;
  condition?: string;
  contactNumber?: string;
  contactEmail?: string;
  location?: boolean;
}

interface VehicleDetailsProps {
  data: Vehicle;
}

const VehicleDetails: React.FC<VehicleDetailsProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Vehicle Details Section */}
      <div className="bg-white border rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <span className="text-blue-500">
            <i className="fas fa-car"></i> {/* Replace with your preferred icon */}
          </span>
          Vehicle Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-500">Location</p>
            <p className="text-lg text-gray-800 font-semibold">
              {data.location === true ? "Yes" : "No"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Condition</p>
            <p className="text-lg text-gray-800 font-semibold">
              {data.condition || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Vehicle Type</p>
            <p className="text-lg text-gray-800 font-semibold">
              {data.vehicleType || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Model</p>
            <p className="text-lg text-gray-800 font-semibold">
              {data.model || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Year</p>
            <p className="text-lg text-gray-800 font-semibold">
              {data.year || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Mileage</p>
            <p className="text-lg text-gray-800 font-semibold">
              {data.mileage ? `${data.mileage} km` : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Transmission</p>
            <p className="text-lg text-gray-800 font-semibold">
              {data.transmission || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Number of Doors</p>
            <p className="text-lg text-gray-800 font-semibold">
              {data.numberOfDoors || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Motor Details Section */}
      <div className="bg-white border rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <span className="text-green-500">
            <i className="fas fa-cogs"></i> {/* Replace with your preferred icon */}
          </span>
          Motor Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-500">Fuel Type</p>
            <p className="text-lg text-gray-800 font-semibold">
              {data.fuelType || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Engine Size</p>
            <p className="text-lg text-gray-800 font-semibold">
              {data.engineSize || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Motor Power</p>
            <p className="text-lg text-gray-800 font-semibold">
              {data.power ? `${data.power} HP` : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Emission Class</p>
            <p className="text-lg text-gray-800 font-semibold">
              {data.emissionClass || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
