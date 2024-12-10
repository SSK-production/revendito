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
import VehicleDetails from "@/app/components/offers/VehicleDetails";
import PropertyDetails from "@/app/components/offers/PropertyDetails";
import CommercialDetails from "@/app/components/offers/CommercialDetails";

interface BaseOffer {
  id: number;
  vendor: string;
  vendorType: string;
  title: string;
  description: string;
  price: number;
  city: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
  photos: string[];
  contactNumber?: string;
  contactEmail?: string;
  type: "vehicle" | "realEstate" | "commercial";

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
        className="w-full h-[75vh] " // 80% de la hauteur de l'écran
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
                className="rounded-lg object-contain" // Ajuste l'image pour remplir sans déformer
                priority
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Détails de l'offre */}
      <div className="w-full text-center max-w-4xl p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Offer Details</h1>

        {/* Informations générales */}
        <div className="space-y-6">
          {/* Vendor Details */}
          <div className="bg-white border rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Vendor Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-500">Vendor</p>
                <a href={`/profile/?user=${data.vendor}&role=${data.vendorType}`}>{data.vendor}</a>
                <p className="text-lg text-gray-800 font-semibold flex items-center justify-center gap-2">
                  {data.vendor}
                  <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full shadow-sm hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400">
                    {data.vendorType}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-gray-500">Category</p>
                <p className="text-lg text-gray-800 font-semibold capitalize">
                  {category || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">City</p>
                <p className="text-lg text-gray-800 font-semibold">
                  {data.city || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Country</p>
                <p className="text-lg text-gray-800 font-semibold">
                  {data.country || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Contact Number</p>
                <p className="text-lg text-gray-800 font-semibold">
                  {data.contactNumber || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Contact Email</p>
                <p className="text-lg text-gray-800 font-semibold">
                  {data.contactEmail || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white border rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Description
            </h2>
            <p className="text-lg text-gray-700 break-words">
              {data.description || "No description provided."}
            </p>
          </div>
        </div>

        {/* Affichage spécifique selon le type */}
        {category === "vehicle" && <VehicleDetails data={data} />}

        {category === "property" && (
          <PropertyDetails data={data} />
        )}

        {category === "commercial" && (
         <CommercialDetails data={data} />
        )}
      </div>
    </div>
  );
};

export default Page;
