import { useEffect, useState } from 'react';
import axios from "axios";

export default function useLastOffers(offerType: string) {
    const [offers, setOffers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLastOffers = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await axios.get(`/api/last-${offerType}-offers`);
                setOffers(response.data);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'An unknown error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLastOffers();
    }, [offerType]);

    return { offers, isLoading, error };
}