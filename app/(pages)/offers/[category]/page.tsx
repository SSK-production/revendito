"use client";
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from "react";
import axios from "axios";
import OfferCard from '@/app/components/offers/OfferCard';
import OfferCardListSkeleton from '@/app/components/skeletons/offerCardListSkeleton';
import CategorieLink from '@/app/components/shared/categorieLink';

interface ApiResponse {
  data: Offers[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface Offers {
  id: number;
  title: string;
  description: string;
  photos: string[];
  price: number;
  city: string;
  country: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

const Page: React.FC = () => {
  const { category } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  console.log(category);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 5;

  const changePage = (newPage: number) => {
    router.push(`?category=${category}&page=${newPage}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/${category}`, {
          params: {
            page,
            limit,
          },
        });
        setData(response.data);
        console.log(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || "Erreur API.");
        } else {
          setError("Une erreur inattendue est survenue.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [category, page, limit]);

  return (
    <>
      <div className="flex flex-col min-h-screen mt-36 p-4 font-medium bg-gray-50 box-border items-center">
        <CategorieLink />
        <div className="flex-1 w-full p-5">
          <main className="flex flex-col min-h-f4/5">
            <div className="flex-1 mb-4">
              {isLoading ? (
                <div className='space-y-8 gap-8'>
                  <OfferCardListSkeleton />
                  <OfferCardListSkeleton />
                  <OfferCardListSkeleton />
                  <OfferCardListSkeleton />
                </div>
              ) : data && data.data.length > 0 ? (
                <div className="space-y-8 grid grid-cols-1 gap-2">
                  {data.data.map((offer: Offers) => (
                    <a key={offer.id} href={`http://localhost:3000/offer?category=${category}&offerId=${offer.id}`}>
                      <OfferCard offer={offer} />
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-red-500 mb-4">
                    Aucune offre trouvée dans cette catégorie.
                  </p>
                  <button
                    onClick={() => router.push('/')}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Retour à l'accueil
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-center items-center mt-5 space-x-4">
              {/* Bouton "Précédent" */}
              {page > 1 ? (
                <button
                  onClick={() => changePage(page - 1)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Précédent
                </button>
              ) : (
                <div className="w-20" /> // Espace réservé pour garder le centrage
              )}

              {/* Indicateur de page */}
              <p className="md:text-lg lg:text-l xl:text-l text-gray-600">
                Page <span className='text-orange-700'>{page}</span> sur <span className='text-orange-700'>{data?.meta?.totalPages || 1}</span>
              </p>

              {/* Bouton "Suivant" */}
              {page < (data?.meta?.totalPages || 1) ? (
                <button
                  onClick={() => changePage(page + 1)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Suivant
                </button>
              ) : (
                <div className="w-20" /> // Espace réservé pour garder le centrage
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Page;
