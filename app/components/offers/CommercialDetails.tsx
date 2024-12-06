import React from "react";

interface Commercial {
    commercialType?: string;
    duration?: number;
    contractType?: string;
    workSchedule?: string;
    contactNumber?: string;
    contactEmail?: string;
}

interface CommercialDetailsProps {
  data: Commercial;
}

const CommercialDetails: React.FC<CommercialDetailsProps> = ({ data }) => {
  return (
    <>
    <div className="bg-gray-50 border rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Commercial Details
            </h2>
            <div>
              <p className="text-lg font-medium text-gray-600">
                Commercial Type:
              </p>
              <p className="text-xl text-gray-800 font-semibold">
                {data.commercialType}
              </p>
            </div>
            {data.duration && (
              <div>
                <p className="text-lg font-medium text-gray-600">Duration:</p>
                <p className="text-xl text-gray-800 font-semibold">
                  {data.duration} days
                </p>
              </div>
            )}
          </div>
    </>
  );
};

export default CommercialDetails;
