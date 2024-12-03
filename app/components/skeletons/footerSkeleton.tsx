'use client';

export default function FooterSkeleton() {
    return (
        <footer className="self-center border-t border-orange-900 w-screen">
            <section className="container mx-auto w-screen md:w-2/3">
                <article>
                    <h3 className="text-center mb-2 h-6 bg-gray-300 rounded w-1/3 mx-auto animate-pulse"></h3>
                    <ul className="grid grid-cols-3 gap-4">
                        {[...Array(6)].map((_, index) => (
                            <li
                                key={index}
                                className="h-4 bg-gray-200 rounded animate-pulse"
                            ></li>
                        ))}
                    </ul>
                </article>
            </section>
        </footer>
    )
}