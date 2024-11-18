'use client';
import { useEffect, useState } from "react";

const AuthCheckPage = () => {
  const [authStatus, setAuthStatus] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

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
          setAuthStatus("Authenticated");
          setUserEmail(data.email);
        } else if (response.status === 401) {
          // Not authenticated or tokens expired
          setAuthStatus(data.error || "Authentication failed");
        } else {
          // Handle unexpected status
          setAuthStatus("An error occurred during authentication");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setAuthStatus("Error during authentication check");
      }
    };

    // Call the checkAuth function on page load
    checkAuth();
  }, []);

  return (
    <div>
      <h1>Authentication Check</h1>
      {authStatus === "Authenticated" ? (
        <>
          <p>Welcome back, {userEmail}!</p>
        </>
      ) : (
        <>
          <p>{authStatus}</p>
          {/* Optional: Provide a login link or redirect if not authenticated */}
        </>
      )}
    </div>
  );
};

export default AuthCheckPage;
