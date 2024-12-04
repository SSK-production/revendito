"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface BaseOffer {
  id: number;
  title: string;
  description: string;
  price: number;
  city: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
  photos: string[];
  type: "vehicle" | "realEstate" | "commercial";

  // Champs spécifiques aux véhicules
  vehicleType?: string;
  model?: string;
  year?: number;
  mileage?: number;
  fuelType?: string;
  color?: string;
  transmission?: string;

  // Champs spécifiques à l'immobilier
  propertyType?: string;
  surface?: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  heatingType?: string;
  energyClass?: string;
  furnished?: boolean;

  // Champs spécifiques au commercial
  commercialType?: string;
  duration?: number;
}

const Page: React.FC = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const offerId = searchParams.get("offerId");

  const [data, setData] = useState<BaseOffer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!offerId || !category) {
      setError("Missing required parameters: 'category' or 'offerId'.");
      return;
    }

    const fetchOffer = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/offer`, {
          params: { category, offerId },
        });
        setData(response.data.data);
        setError(null);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || "Erreur API.");
        } else {
          setError("Une erreur inattendue est survenue.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [offerId, category]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>No data available for the given offer.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-4">
      {/* Carrousel */}
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        modules={[Navigation, Pagination]}
        className="w-full h-[80vh] max-w-4xl" // 80% de la hauteur de l'écran
      >
        {data.photos.map((photo, index) => (
          <SwiperSlide
            key={index}
            className="w-full h-full flex justify-center items-center" // Assure que chaque slide prend 100% de l'espace disponible
          >
            <div className="relative w-full h-full">
              <Image
                src={photo}
                alt={`Offer image ${index + 1}`}
                layout="fill" // Prend 100% de l'espace du conteneur
                className="rounded-lg object-cover" // Ajuste l'image pour remplir sans déformer
                priority
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Détails de l'offre */}
      <div className="w-full text-center max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Offer Details</h1>

        {/* Informations générales */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-lg font-medium text-gray-600">ID:</p>
            <p className="text-xl text-gray-800 font-semibold">{data.id}</p>
          </div>
          <div>
            <p className="text-lg font-medium text-gray-600">Category:</p>
            <p className="text-xl text-gray-800 font-semibold capitalize">
              {category}
            </p>
          </div>
          <div>
            <p className="text-lg font-medium text-gray-600">City:</p>
            <p className="text-xl text-gray-800 font-semibold">{data.city}</p>
          </div>
          <div>
            <p className="text-lg font-medium text-gray-600">Country:</p>
            <p className="text-xl text-gray-800 font-semibold">
              {data.country}
            </p>
          </div>
          <div className="col-span-2 w-full bg-gray-50 rounded-lg p-4 shadow-md">
            <p className="text-lg font-medium text-gray-600 mb-2">
              Description:
            </p>
            <p className="break-words text-lg text-gray-700">
              {data.description || "No description provided."}
            </p>
          </div>
        </div>

        {/* Affichage spécifique selon le type */}
        {category === "vehicle" && (
          <div className="bg-gray-50 border rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Vehicle Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-lg font-medium text-gray-600">
                  Vehicle Type:
                </p>
                <p className="text-xl text-gray-800 font-semibold">
                  {data.vehicleType}
                </p>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-600">Model:</p>
                <p className="text-xl text-gray-800 font-semibold">
                  {data.model}
                </p>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-600">Year:</p>
                <p className="text-xl text-gray-800 font-semibold">
                  {data.year}
                </p>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-600">Mileage:</p>
                <p className="text-xl text-gray-800 font-semibold">
                  {data.mileage} km
                </p>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-600">Fuel Type:</p>
                <p className="text-xl text-gray-800 font-semibold">
                  {data.fuelType}
                </p>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-600">
                  Transmission:
                </p>
                <p className="text-xl text-gray-800 font-semibold">
                  {data.transmission}
                </p>
              </div>
            </div>
          </div>
        )}

        {category === "property" && (
          <div className="bg-gray-50 border rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Property Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-lg font-medium text-gray-600">
                  Property Type:
                </p>
                <p className="text-xl text-gray-800 font-semibold">
                  {data.propertyType}
                </p>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-600">Surface:</p>
                <p className="text-xl text-gray-800 font-semibold">
                  {data.surface} m²
                </p>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-600">Rooms:</p>
                <p className="text-xl text-gray-800 font-semibold">
                  {data.rooms}
                </p>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-600">Bedrooms:</p>
                <p className="text-xl text-gray-800 font-semibold">
                  {data.bedrooms}
                </p>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-600">Bathrooms:</p>
                <p className="text-xl text-gray-800 font-semibold">
                  {data.bathrooms}
                </p>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-600">Furnished:</p>
                <p className="text-xl text-gray-800 font-semibold">
                  {data.furnished ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>
        )}

        {category === "commercial" && (
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
        )}
      </div>
    </div>
  );
};

export default Page;
