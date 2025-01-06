"use client";

import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "axios";
import UserOffers from "@/app/components/profile/UserOffer";
import ProfileHeader from "@/app/components/profile/ProfileHeader";
import GeneralInfo from "@/app/components/profile/GeneralInfo";
import { ProfileData } from "@/app/types";

interface Offer {
  id: number;
  title: string;
  description: string;
  price: number;
  city: string;
  country: string;
  active: boolean;
  validated: boolean;
  photos: string[];
  createdAt: string;
  updatedAt: string;
}

interface UserOffersData {
  vehicleOffers: Offer[];
  realEstateOffers: Offer[];
  commercialOffers: Offer[];
}

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const user = searchParams.get("user");
  const role = searchParams.get("role");

  const [data, setData] = useState<ProfileData | null>(null);
  const [userOffers, setUserOffers] = useState<UserOffersData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingOffers, setLoadingOffers] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userrole, setUserRole] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(2);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();
        console.log(data);

        if (response.status === 200) {
          setIsLogin(true);
          setUserId(data.id);
          setUserRole(data.role);
        } else if (response.status === 401) {
          setIsLogin(false);
        } else {
          setIsLogin(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsLogin(false);
      }
    };

    checkAuth();
  }, []);

  // Récupération des informations générales (profil uniquement)
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !role) {
        setError("Missing parameters: user and role are required.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get<{ user: ProfileData }>("/api/profil", {
          params: { user, role },
        });

        setData(response.data.user);
      } catch {
        setError("Account not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, role]);


  useEffect(() => {
    const fetchData = async () => {

      try {
        setLoading(true);
        const response = await axios.get<{ user: ProfileData }>("/api/report", {
          
        });
        console.log(response);
        
        
      } catch {
        setError("Account not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, role]);

  // Récupération des offres uniquement
  useEffect(() => {
    const fetchOffers = async () => {
      if (!user || !role) return;

      try {
        setLoadingOffers(true);
        const response = await axios.get<{ offers: UserOffersData }>("/api/profil", {
          params: { user, role, page, pageSize },
        });

        setUserOffers(response.data.offers);
      } catch {
        setError("Failed to fetch offers.");
      } finally {
        setLoadingOffers(false);
      }
    };

    fetchOffers();
  }, [user, role, page, pageSize]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">Error: {error}</div>;

  if (data && !data.active && userId !== data.id)
    return <div className="text-center mt-10 text-red-500">Account not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {data && (
        <>
          <ProfileHeader
            data={data}
            isLogin={isLogin}
            showModal={showModal}
            setShowModal={setShowModal}
            currentUserId={userId}
            userId={data.id}
            onBanUser={(userId) => console.log("Ban user:", userId)}
            role={userrole}
          />
          <GeneralInfo data={data} currentUserId={userId} userId={data.id} />
          {!data.isBanned && userOffers && (
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">User Offers</h2>
              {loadingOffers ? (
                <div className="text-center">Loading offers...</div>
              ) : (
                <UserOffers
                  offers={userOffers}
                  currentUserId={userId}
                  userId={data.id}
                />
              )}
            </div>
          )}
        </>
      )}
      {userOffers && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className={`px-4 py-2 mx-1 border rounded ${
              page === 1 ? "bg-gray-300" : "bg-blue-500 text-white"
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={
              userOffers.vehicleOffers.length < pageSize &&
              userOffers.realEstateOffers.length < pageSize &&
              userOffers.commercialOffers.length < pageSize
            }
            className={`px-4 py-2 mx-1 border rounded ${
              userOffers.vehicleOffers.length < pageSize &&
              userOffers.realEstateOffers.length < pageSize &&
              userOffers.commercialOffers.length < pageSize
                ? "bg-gray-300"
                : "bg-blue-500 text-white"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
