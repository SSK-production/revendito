'use client';

import Categories from "@/app/components/home/categories";
import { useState } from "react";
import MainSkeleton from "@/app/components/skeletons/mainSkeleton";

export default function Home() {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <>
            {isLoading && <MainSkeleton />}
            <div style={{ display: isLoading ? 'none' : 'block' }}>
                <Categories onLoad={() => setIsLoading(false)} />
            </div>
        </>
    );
}
