import React from "react";

const OfferCardSkeleton: React.FC = () => {
    return (
        <div className="w-full max-w-5xl mx-auto p-6 animate-pulse">
          {/* Skeleton for Image Gallery */}
          <div className="w-2/3 h-80 bg-gray-300 rounded-lg mb-6"></div>
    
          {/* Skeleton for Title and Price */}
          <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
            <div className="w-3/4 h-8 bg-gray-300 rounded mb-4 lg:mb-0"></div>
            <div className="w-1/4 h-8 bg-gray-300 rounded"></div>
          </div>
    
          {/* Skeleton for Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Description */}
            <div className="col-span-2">
              <div className="h-6 w-1/2 bg-gray-300 rounded mb-4"></div>
              <div className="space-y-4">
                <div className="h-4 w-full bg-gray-300 rounded"></div>
                <div className="h-4 w-full bg-gray-300 rounded"></div>
                <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
              </div>
            </div>
    
            {/* Right Column - Additional Information */}
            <div className="space-y-4">
              <div className="h-6 w-2/3 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
              <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
              <div className="h-4 w-2/5 bg-gray-300 rounded"></div>
            </div>
          </div>
    
          {/* Skeleton for Contact Section */}
          <div className="mt-8">
            <div className="h-6 w-1/3 bg-gray-300 rounded mb-4"></div>
            <div className="flex flex-col lg:flex-row items-center gap-4">
              <div className="h-12 w-full lg:w-1/3 bg-gray-300 rounded"></div>
              <div className="h-12 w-full lg:w-1/3 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      );
};

export default OfferCardSkeleton;
