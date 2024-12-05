"use client";
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from "react";
import axios from "axios";
import OfferCard from '@/app/components/offers/OfferCard';
import OfferCardListSkeleton from '@/app/components/skeletons/offerCardListSkeleton';
 



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
  const limit = 10;


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

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <>
    <div className="flex flex-col min-h-screen p-5 font-sans bg-gray-50 box-border">
      <header className="w-full text-center mb-5">
        <h1 className="text-2xl font-bold">Catégorie : {category}</h1>
      </header>

      <div className="flex-1 w-full p-5">
        <main className="flex flex-col  min-h-f4/5">
          <div className="flex-1 mb-4">
            <p className="text-lg mb-4">
              Bienvenue dans la catégorie <strong>{category}</strong>.<br />
            </p>

            {isLoading ? (
              <div className='space-y-8 gap-8'>
                <OfferCardListSkeleton/>
                <OfferCardListSkeleton/>
                <OfferCardListSkeleton/>
                <OfferCardListSkeleton/>
              </div>
            ) : data ? (
              <div className="space-y-8 grid grid-cols-1 gap-2">
                {data.data.map((offer: Offers) => (
                  <a key={offer.id} href={`http://localhost:3000/offer?category=${category}&offerId=${offer.id}`}>
                  <OfferCard  offer={offer}/>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-red-500">
                Aucune offre trouvée dans cette catégorie.
              </p>
            )}
          </div>

          <div className="flex justify-between items-center mt-5">
            <button
              onClick={() => changePage(Math.max(page - 1, 1))} // Empêche d'aller en dessous de 1
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              disabled={page === 1}
            >
              Précédent
            </button>
            <p className="text-sm text-gray-600">
              Page {page} sur {data?.meta.totalPages}
            </p>
            <button
              onClick={() =>
                changePage(Math.min(page + 1, data?.meta.totalPages || page))
              } // Empêche d'aller au-delà du total
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              disabled={page === (data?.meta.totalPages || page)}
            >
              Suivant
            </button>
          </div>
        </main>
      </div>
    </div>
    </>
  );
};

export default Page;
