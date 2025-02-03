'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/app/hooks/useAuth";


export default function Header() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { isLogin, setIsLogin, username, setUsername, entity, setEntity, role, setRole } = useAuth();


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/api/auth", { withCredentials: true });

        if (response.status === 200) {
          const data = response.data;
          console.log(data);

          setIsLogin(true);
          setUsername(data.username);
          setEntity(data.entity);
          setRole(data.role);
          console.log(data.role);
          
        } else {
          setIsLogin(false);
        }
      } catch (error) {
        console.log("Error checking authentication:", error);
        setIsLogin(false);
      }
    };

    checkAuth();

    // Configurer un intervalle pour vérifier régulièrement l'authentification
    const intervalId = setInterval(() => {
      console.log("Periodic auth check...");
      checkAuth();
    }, 59 * 60 * 1000); // Tous les 59 minutes
  
    // Nettoyer l'intervalle au démontage
    return () => clearInterval(intervalId);
  }, []);

  const handleMenuOpen = (menu: string) => setActiveMenu(menu);
  const handleMenuClose = () => setActiveMenu(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, menu: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveMenu(activeMenu === menu ? null : menu);
    }
    if (e.key === "Escape") {
      handleMenuClose();
    }
  };

  const logout = async () => {
    try {
      const response = await axios.get('/api/logout');
  
      if (response.status === 200) {
        console.log(response.data.message); // Message de confirmation
        // Réinitialiser l'état local
        setIsLogin(false);
        setUsername(null);
        setEntity(null);
        setRole(null);
        window.location.href = '/login'; // Remplacez '/login' par l'URL de votre choix
      } else {
        console.error('Erreur lors du logout', response.data);
      }
    } catch (error) {
      console.error('Erreur lors de la requête :', error);
    }
  }

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-gray-50 shadow-md border-b">
      <section className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <h1 className="text-lg lg:text-xl font-bold">
          <Link href="/">
            <span className="text-orange-700">Re</span>Ventures
          </Link>
        </h1>
       
        {/* Navigation */}
        <nav className="text-sm">
        
          <ul className="flex space-x-6 items-center">
          
            {!isLogin ? (
              <>
                {/* Sign up */}
                <li
                  className="relative"
                  onMouseEnter={() => handleMenuOpen("signup")}
                  onMouseLeave={handleMenuClose}
                >
                  <button
                    className="hover:underline text-orange-700 font-medium"
                    aria-haspopup="true"
                    aria-expanded={activeMenu === "signup"}
                    onKeyDown={(e) => handleKeyDown(e, "signup")}
                  >
                    Sign up
                  </button>
                  <ul
                    className={`absolute left-0 mt-2 bg-white shadow-lg border rounded-md transition-all ${
                      activeMenu === "signup" ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                  >
                    <li>
                      <Link
                        href="/user-register"
                        className="block px-4 py-2 hover:bg-orange-100"
                      >
                        Individual
                      </Link>
                    </li>
                    <li>
                      <hr className="border-orange-200" />
                      <Link
                        href="/company-register"
                        className="block px-4 py-2 hover:bg-orange-100"
                      >
                        Company
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* Log in */}
                <li>
                  <Link
                    href="/login"
                    className="hover:underline text-gray-700 font-medium"
                  >
                    Log in
                  </Link>
                </li>
              </>
            ) : (
              <>
                {/* Post an ad */}
                <li
                  className="relative"
                  onMouseEnter={() => handleMenuOpen("postAd")}
                  onMouseLeave={handleMenuClose}
                >
                  <button
                    className="text-orange-700 font-bold hover:underline"
                    aria-haspopup="true"
                    aria-expanded={activeMenu === "postAd"}
                    onKeyDown={(e) => handleKeyDown(e, "postAd")}
                  >
                    Post an ad
                  </button>
                  <ul
                    className={`absolute left-0 mt-2 bg-white shadow-lg border rounded-md transition-all ${
                      activeMenu === "postAd" ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                  >
                    <li>
                      <Link
                        href="/vehicle-offer"
                        className="block px-4 py-2 hover:bg-blue-100"
                      >
                        Vehicle
                      </Link>
                    </li>
                    <li>
                      <hr className="border-orange-200" />
                      <Link
                        href="/property-offer"
                        className="block px-4 py-2 hover:bg-green-100"
                      >
                        Property
                      </Link>
                    </li>
                    <li>
                      <hr className="border-orange-200" />
                      <Link
                        href="/commercial-offer"
                        className="block px-4 py-2 hover:bg-orange-100"
                      >
                        Commercial
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* Profile */}
                <li
                  className="relative"
                  onMouseEnter={() => handleMenuOpen("profile")}
                  onMouseLeave={handleMenuClose}
                >
                  <button
                    className="text-orange-700 font-bold hover:underline"
                    aria-haspopup="true"
                    aria-expanded={activeMenu === "profile"}
                    onKeyDown={(e) => handleKeyDown(e, "profile")}
                  >
                    {username ? username : "Profile"}
                  </button>
                  <ul
                    className={`absolute left-0 mt-2 bg-white shadow-lg border rounded-md transition-all ${
                      activeMenu === "profile" ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                  >
                    <li>
                      <Link
                        href={`/profile?user=${username}&role=${entity}`}
                        className="block px-4 py-2 hover:bg-blue-100"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <hr className="border-orange-200" />
                      <Link
                        href="/messages"
                        className="block px-4 py-2 hover:bg-green-100"
                      >
                        Messages
                      </Link>
                    </li>
                    {role === "MODERATOR" || role === "ADMIN" ? (
                      <>
                        <li>
                          <hr className="border-orange-200" />
                          <Link
                            href="/home"
                            className="block px-4 py-2 hover:bg-yellow-100"
                          >
                            Administration
                          </Link>
                        </li>
                      </>
                    ) : null}
                    <li>
                      <hr className="border-orange-200" />
                      <button
                        onClick={() => {
                          setIsLogin(false);
                          setUsername(null);
                          logout();
                        }}
                        className="block px-4 py-2 hover:bg-red-100 text-red-500"
                      >
                        Log out
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>
        </nav>
      </section>
    </header>
  );
}
