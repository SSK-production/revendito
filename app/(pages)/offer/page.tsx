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
import MessageModal from "@/app/components/Messages/MessageModal";

interface BaseOffer {
  id: number;
  userId: string;
  companyId: string;
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
  const [showModal, setShowModal] = useState<boolean>(false);

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
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-blue-500 h-32 w-32 mb-4 mx-auto animate-spin"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading...</h2>
          <p className="text-gray-500">Please wait while we fetch the offer details.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <p className="text-red-500 text-lg font-semibold">No data available for the given offer.</p>
      </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg font-semibold">No data available for the given offer.</p>
        </div>
      </div>
    );
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
        className="w-full h-[75vh]"
      >
        {data.photos.map((photo, index) => (
          <SwiperSlide
            key={index}
            className="w-full h-full flex justify-center items-center"
          >
            <div className="relative w-full h-full">
              <Image
                src={photo}
                alt={`Offer image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: 'cover' }}
                className="rounded-lg"
                priority
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Titre et prix */}
      <div className="w-full max-w-4xl flex items-center justify-between mt-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center flex-1">
          {data.title}
        </h1>
        <p className="text-2xl font-semibold text-green-600 ml-auto">
          {data.price}€
        </p>
      </div>

      {/* Bouton pour ouvrir la modal */}
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Contacter le vendeur
      </button>

      {/* Modal */}
      <MessageModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        receiverId={data.vendorType === "user" ? data.userId : data.vendorType === "company" ?  data.companyId : null} // Passe l'ID du vendeur
        offerId={data.id} // Passe l'ID de l'offre
        offerType={category || ""} // Passe le type de l'offre
        otherPersonName={data.vendor}
      />

      {/* Détails de l'offre */}
      <div className="w-full text-center max-w-4xl p-6">
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
                <a
                  className="text-lg text-gray-800 font-semibold flex items-center justify-center gap-2"
                  href={`/profile/?user=${data.vendor}&role=${data.vendorType}`}
                >
                  {data.vendor}
                  <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full shadow-sm hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400">
                    {data.vendorType}
                  </span>
                </a>
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
        {category === "vehicle" && (
          <div className="bg-gray-50 border rounded-lg p-6 space-y-8">
            <VehicleDetails data={data} />
          </div>
        )}

        {category === "property" && (
          <div className="bg-gray-50 border rounded-lg p-6 space-y-8">
            <PropertyDetails data={data} />
          </div>
        )}

        {category === "commercial" && (
          <div className="bg-gray-50 border rounded-lg p-6 space-y-8">
            <CommercialDetails data={data} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
