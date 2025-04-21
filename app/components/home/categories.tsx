"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Car, Building2, Briefcase, ChevronRight } from "lucide-react"
import useLastOffers from "@/app/hooks/useLastOffers"

interface Offer {
  id: string
  title: string
  description: string
  price: number
  photos: string[]
}

interface CategoriesProps {
  onLoad?: () => void
}

export default function Categories({ onLoad }: CategoriesProps) {
  useEffect(() => {
    if (onLoad) {
      const timeout = setTimeout(() => {
        onLoad()
      }, 1000)
      return () => clearTimeout(timeout)
    }
  }, [onLoad])

  const lastAutomotiveOffers: Offer[] = useLastOffers("automotive").offers
  const lastEstateOffers: Offer[] = useLastOffers("estate").offers
  const lastServicesOffers: Offer[] = useLastOffers("commercial").offers

  const renderOfferCard = (offer: Offer, category: string) => (
    <div
      key={offer.id}
      className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col h-[400px]" // Fixed size
    >
      {/* Image with fixed height */}
      <div className="relative w-full h-48">
        {offer.photos.length > 0 ? (
          <Image
            src={offer.photos[0] || "/placeholder.svg"}
            alt={offer.title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>
  
      {/* Content with height management */}
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold mb-2 line-clamp-1">{offer.title}</h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-3">{offer.description}</p>
        <p className="text-lg font-bold text-blue-600 mt-auto">€ {offer.price.toLocaleString()}</p>
      </div>
  
      {/* Action button */}
      <div className="p-4 pt-0">
        <Link
          href={`/offer?category=${category}&offerId=${offer.id}`}
          className={`block w-full text-center bg-gray-50 text-black font-bold py-2 px-4 rounded shadow transition duration-300 ${
            category === "vehicle"
              ? "group-hover:bg-green-600 group-hover:text-white"
              : category === "property"
              ? "group-hover:bg-blue-600 group-hover:text-white"
              : "group-hover:bg-orange-600 group-hover:text-white"
          }`}
        >
          View Offer
        </Link>
      </div>
    </div>
  );
  
  const renderCategorySection = (
    title: string,
    icon: React.ReactNode,
    offers: Offer[],
    category: string,
    colorClass: string,
  ) => (
    <div className={`space-y-6 ${colorClass} rounded-lg p-6`}>
      <div className="flex items-center justify-between">
        <Link
          href={`/offers/${category}`}
          className={`flex items-center gap-2 text-2xl font-bold hover:underline ${
            category === "vehicle"
              ? "text-green-600"
              : category === "property"
              ? "text-blue-600"
              : "text-orange-600"
          }`}
        >
          {icon}
          <h2>{title}</h2>
        </Link>
        <Link href={`/offers/${category}`} className="text-blue-600 hover:underline flex items-center">
          See more <ChevronRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
      <div className="grid gap-6">
        {offers.length ? (
          offers.map((offer) => renderOfferCard(offer, category))
        ) : (
          <p className="text-gray-500 italic text-center">No offers available</p>
        )}
      </div>
    </div>
  )

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
      {renderCategorySection("Vehicle", <Car className="h-8 w-8" />, lastAutomotiveOffers, "vehicle", "bg-white-50")}
      {renderCategorySection(
        "Property",
        <Building2 className="h-8 w-8" />,
        lastEstateOffers,
        "property",
        "bg-white-50",
      )}
      {renderCategorySection(
        "Commercial",
        <Briefcase className="h-8 w-8" />,
        lastServicesOffers,
        "commercial",
        "bg-white-50",
      )}
    </section>
  )
}
