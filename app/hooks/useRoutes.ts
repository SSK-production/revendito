import { useEffect, useState } from "react";
import axios from "axios";

type Route = { name: string; path: string };

export default function useRoutes() {
    const [routes, setRoutes] = useState<Route[]>([]);

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const res = await axios.get("/api/site-map");
                setRoutes(res.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des routes :", error);
            }
        };

        fetchRoutes();
    }, []); // Le tableau vide [] garantit que cet effet s'exécute une seule fois.

    return routes;
}
