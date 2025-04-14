import type { Commercial } from "@/app/types";
import type React from "react";
import {
  FaClock,
} from "react-icons/fa";

// import {
//   FaCar,
//   FaBook,
//   FaUtensils,
//   FaDog,
//   FaFilm,
//   FaTshirt,
//   FaCouch,
//   FaLaptop,
//   FaDumbbell,
//   FaPaintBrush,
//   FaHome,
//   FaMedkit,
//   FaGraduationCap,
//   FaEllipsisH,
//   FaClock,
// } from "react-icons/fa";

// const categoryIcons: { [key: string]: JSX.Element } = {
//   Electronics: <FaLaptop />,
//   Fashion: <FaTshirt />,
//   Home: <FaCouch />,
//   Toys: <FaDog />,
//   Books: <FaBook />,
//   Automotive: <FaCar />,
//   Sports: <FaDumbbell />,
//   "Health & Beauty": <FaMedkit />,
//   "Food & Beverage": <FaUtensils />,
//   "Art & Crafts": <FaPaintBrush />,
//   "Real Estate": <FaHome />,
//   Education: <FaGraduationCap />,
//   Entertainment: <FaFilm />,
//   Pets: <FaDog />,
//   Other: <FaEllipsisH />,
// };

interface Props {
  data: Commercial;
}

const DetailsComponent: React.FC<Props> = ({ data }) => {
  // Parse opening hours if it's a string
  const openingHours =
    typeof data.openingHours === "string"
      ? JSON.parse(data.openingHours)
      : data.openingHours;
  // const categories =
  //   typeof data.categories === "string"
  //     ? JSON.parse(data.categories)
  //     : data.categories || [];

      
  // Order of days for display
  const daysOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="p-6 space-y-8">
     

      {/* Section 2: Opening Hours */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <FaClock className="text-gray-600" />
          <p className="text-lg font-medium text-gray-700">Opening Hours:</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {openingHours &&
            daysOrder.map(
              (day) =>
                openingHours[day] && (
                  <div
                    key={day}
                    className="flex justify-between items-center border-b border-gray-100 py-2"
                  >
                    <span className="font-medium text-gray-700">{day}</span>
                    <span className="text-gray-600">
                      {openingHours[day].start} - {openingHours[day].end}
                    </span>
                  </div>
                )
            )}
        </div>
      </div>

      {/* Section 3: Commercial Details */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Commercial Details
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-lg font-medium text-gray-600">
              Commercial Type:
            </p>
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
