import React from "react";
import {
  FaCar,
  FaBook,
  FaUtensils,
  FaDog,
  FaFilm,
  FaTshirt,
  FaCouch,
  FaLaptop,
  FaDumbbell,
  FaPaintBrush,
  FaHome,
  FaMedkit,
  FaGraduationCap,
  FaEllipsisH,
} from "react-icons/fa";

const categoryIcons: { [key: string]: JSX.Element } = {
  Electronics: <FaLaptop />,
  Fashion: <FaTshirt />,
  Home: <FaCouch />,
  Toys: <FaDog />,
  Books: <FaBook />,
  Automotive: <FaCar />,
  Sports: <FaDumbbell />,
  "Health & Beauty": <FaMedkit />,
  "Food & Beverage": <FaUtensils />,
  "Art & Crafts": <FaPaintBrush />,
  "Real Estate": <FaHome />,
  Education: <FaGraduationCap />,
  Entertainment: <FaFilm />,
  Pets: <FaDog />,
  Other: <FaEllipsisH />,
};

interface Data {
  commercialType?: string;
  duration?: number;
  contractType?: string;
  workSchedule?: string;
  contactNumber?: string;
  contactEmail?: string;
  openingHours?: string | object;
  categories?: string[];
}

interface Props {
  data: Data;
}

const DetailsComponent: React.FC<Props> = ({ data }) => {
  const renderOpeningHours = () => {
    if (typeof data.openingHours === "string") {
      return <p className="text-gray-800">{data.openingHours}</p>;
    }
    if (typeof data.openingHours === "object") {
      return (
        <div className="flex flex-col gap-2 items-center">
          {Object.entries(data.openingHours).map(([day, hours]) => (
            <div
              key={day}
              className="flex justify-between w-full max-w-xs px-4 py-2 bg-gray-100 rounded-full shadow-sm border border-gray-300 text-sm"
            >
              <span className="font-semibold text-gray-700">{day}</span>
              <span className="text-gray-600">
                {typeof hours === "object" && hours.start && hours.end
                  ? `${hours.start} - ${hours.end}`
                  : hours}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return <p className="text-gray-800">No opening hours available</p>;
  };

  return (
    <div className=" p-6 space-y-8">
      {/* Section 1: Categories */}
      {data.categories && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <p className="text-lg font-medium text-gray-700 mb-4">Categories:</p>
          <div className="flex flex-wrap gap-4 justify-center">
            {data.categories.map((category, index) => (
              <div
                key={index}
                className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full shadow-sm gap-2"
              >
                <span className="text-blue-600 text-lg">
                  {categoryIcons[category] || <FaEllipsisH />}
                </span>
                <span>{category}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 2: Opening Hours */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <p className="text-lg font-medium text-gray-700 mb-4">Opening Hours:</p>
        <div>{renderOpeningHours()}</div>
      </div>

      {/* Section 3: Commercial Details */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Commercial Details
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-lg font-medium text-gray-600">Commercial Type:</p>
            <p className="text-xl text-gray-800 font-semibold">
              {data.commercialType || "Not specified"}
            </p>
          </div>
          
          {data.commercialType === "Job" && (
            <>
              {data.duration && (
                <div>
                  <p className="text-lg font-medium text-gray-600">Duration:</p>
                  <p className="text-xl text-gray-800 font-semibold">
                    {data.duration} month
                  </p>
                </div>
              )}
              {data.contractType && (
                <div>
                  <p className="text-lg font-medium text-gray-600">
                    Contract Type:
                  </p>
                  <p className="text-xl text-gray-800 font-semibold">
                    {data.contractType}
                  </p>
                </div>
              )}
              {data.workSchedule && (
                <div>
                  <p className="text-lg font-medium text-gray-600">
                    Work Schedule:
                  </p>
                  <p className="text-xl text-gray-800 font-semibold">
                    {data.workSchedule}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsComponent;
