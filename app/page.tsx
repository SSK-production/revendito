'use client';

import { useState, useEffect } from "react";
import Categories from "@/app/components/home/categories";
import MainSkeleton from "@/app/components/skeletons/mainSkeleton";

export default function Home() {
    const [isClient, setIsClient] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <MainSkeleton />;
    }

    return (
        <>
            {isLoading && <MainSkeleton />}
            <div style={{ display: isLoading ? 'none' : 'block' }}>
                <Categories onLoad={() => setIsLoading(false)} />
            </div>
        </>
    );
}

