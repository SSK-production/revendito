import React from "react";

const OfferCardListSkeleton: React.FC = () => {
  return (
    <div
      className="bg-white shadow-xl rounded-lg overflow-hidden w-full flex flex-col sm:flex-row p-6 animate-pulse"
    >
      {/* Skeleton for Image */}
      <div className="w-full sm:w-72 h-56 bg-gray-300 rounded-lg mb-4 sm:mb-0"></div>

      <div className="flex-1 sm:flex sm:flex-col items-center justify-start sm:ml-6">
        {/* Skeleton for Title */}
        <div className="w-full mb-4 text-center">
          <div className="h-8 w-2/3 bg-gray-300 rounded mx-auto"></div>
        </div>

        <div className="flex sm:flex-row w-full sm:max-w-lg justify-center items-center text-center">
          {/* Skeleton for Description */}
          <div className="flex-1 mb-4 sm:mb-6 w-full">
            <div className="h-4 w-full bg-gray-300 rounded mb-2"></div>
            <div className="h-4 w-5/6 bg-gray-300 rounded mx-auto"></div>
          </div>

          {/* Skeleton for Details */}
          <div className="flex-1 sm:ml-6 flex flex-col justify-between items-center">
            <div className="flex flex-col mt-3 space-y-2 w-full">
              <div className="h-4 w-1/2 bg-gray-300 rounded mx-auto"></div>
              <div className="h-4 w-1/3 bg-gray-300 rounded mx-auto"></div>
              <div className="h-4 w-1/4 bg-gray-300 rounded mx-auto"></div>
              <div className="h-3 w-2/5 bg-gray-300 rounded mx-auto"></div>
              <div className="h-3 w-2/5 bg-gray-300 rounded mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferCardListSkeleton;
