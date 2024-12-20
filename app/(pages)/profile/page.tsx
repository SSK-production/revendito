"use client";

import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import UserOffers from "@/app/components/profile/UserOffer";

interface ProfileData {
  id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  role: string;
  email: string;
  emailVerified: boolean;
  profilePicture?: string;
  active: boolean;
  city: string;
  country: string;
  street?: string;
  birthDate?: string;
  idCardVerified?: boolean;
  companyNumber?: string;
  isBanned?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Offer {
  id: number;
  title: string;
  price: number;
  city: string;
  country: string;
  active: boolean;
  photos: string[];
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
  const [error, setError] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
    
  useEffect(() => {
    // Function to check authentication
    const checkAuth = async () => {
      try {
        // Make the GET request to /api/auth/check
        const response = await fetch("/api/auth", {
          method: "GET",
          credentials: "include", // Ensure cookies are sent with the request
        });

        const data = await response.json();
        console.log(data);
        

        if (response.status === 200) {
          // Successfully authenticated
          setIsLogin(true);
          setUserId(data.id);
        } else if (response.status === 401) {
          // Not authenticated or tokens expired
          setIsLogin(false);        } else {
          // Handle unexpected status
          setIsLogin(false);        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsLogin(false);
      }
    };

    // Call the checkAuth function on page load
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !role) {
        setError("Missing parameters: user and role are required.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get<{
          user: ProfileData;
          offers: UserOffersData;
        }>("/api/profil", { params: { user, role } });

        setData(response.data.user);
        setUserOffers(response.data.offers);
      } catch {
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, role]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-[#cfcfcf] shadow-md rounded-md">
      {data && (
        <>
          {/* Header */}
          <div className="flex items-center space-x-6 mb-6">
            {data.profilePicture ? (
              <Image
                src={data.profilePicture}
                width={80}
                height={80}
                alt="Profile Picture"
                className="w-20 h-20 rounded-full"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold text-gray-700">
                {data.username?.charAt(0) || "P"}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-semibold text-orange-700">
                {data.firstName && data.lastName
                  ? `${data.firstName} ${data.lastName}`
                  : data.companyName || data.username || "User"}
              </h1>
              <p className="text-gray-500">{data.role}</p>
            </div>
          </div>

          {/* General Information */}
          <div className="bg-white p-4 rounded-md shadow-sm mb-6">
            <h2 className="text-lg font-medium text-gray-700 mb-3">
              General Information
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>
                <strong>Email:</strong> {data.email}
              </p>
              <p>
                <strong>Email Verified:</strong>{" "}
                {data.emailVerified ? "Yes" : "No"}
              </p>
              <p>
                <strong>Status:</strong> {data.active ? "Active" : "Inactive"}
              </p>
              {data.birthDate && (
                <p>
                  <strong>Birth Date:</strong>{" "}
                  {new Date(data.birthDate).toLocaleDateString()}
                </p>
              )}
              {data.companyNumber && (
                <p>
                  <strong>Company Number:</strong> {data.companyNumber}
                </p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="bg-white p-4 rounded-md shadow-sm mb-6">
            <h2 className="text-lg font-medium text-gray-700 mb-3">Location</h2>
            <div className="space-y-2 text-gray-600">
              <p>
                <strong>City:</strong> {data.city}
              </p>
              <p>
                <strong>Country:</strong> {data.country}
              </p>
              {data.street && (
                <p>
                  <strong>Street:</strong> {data.street}
                </p>
              )}
            </div>
          </div>

          {/* Offers */}
          {!data.isBanned && userOffers && (
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h2 className="text-lg font-medium text-gray-700 mb-3">
                User Offers
              </h2>
              <UserOffers offers={userOffers} currentUserId={userId} userId={data.id} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
