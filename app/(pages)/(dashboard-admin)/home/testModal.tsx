import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface ModalProps {
    isOpen: boolean;
    closeModal: () => void;
}

interface BannedUser {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    city: string;
    country: string;
    isBanned: boolean;
    banReason: string[];
    banEndDate: string;
    banCount: number;
    bannTitle: string; // bannTitle est une chaîne JSON
    bannedByUsername: string;
}

function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        window.addEventListener('resize', listener);
        return () => window.removeEventListener('resize', listener);
    }, [matches, query]);

    return matches;
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

const UserCard: React.FC<{
    user: BannedUser;
    isExpanded: boolean;
    toggleExpand: () => void;
    isDesktop: boolean;
}> = ({ user, isExpanded, toggleExpand, isDesktop }) => {
    let bannTitle: string = 'Unknown reason';

    // Tenter de convertir bannTitle (qui est une chaîne JSON) en objet
    try {
        const parsedBannTitle = JSON.parse(user.bannTitle);
        if (typeof parsedBannTitle === 'object' && parsedBannTitle !== null) {
            bannTitle = parsedBannTitle.super || 'Unknown reason'; // Exemple: on prend la clé 'super' si elle existe
        }
    } catch (e) {
        // Si l'analyse échoue, on laisse 'Unknown reason'
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4 border border-red-300">
            <div className="flex justify-between items-center p-4 bg-gray-50 ">
                <div className="flex items-center space-x-3">
                    <Image
                        src="/icons/mobil-dashboard/ban-user.svg"
                        width={24}
                        height={24}
                        alt="Banned user"
                    />
                    <span className="font-semibold">{`${user.firstName} ${user.lastName}`}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">BANNED</span>
                    {!isDesktop && (
                        <button onClick={toggleExpand} aria-expanded={isExpanded} className="focus:outline-none">
                            <Image
                                src="/icons/mobil-dashboard/userBan/arrow-narrow-down-move.svg"
                                width={20}
                                height={20}
                                alt={isExpanded ? "Collapse details" : "Expand details"}
                                className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                            />
                        </button>
                    )}
                </div>
            </div>
            {(isExpanded || isDesktop) && (
                <div className="p-4 space-y-4">
                    <div className="flex flex-col md:flex-row md:space-x-4">
                        <div className="flex-1 space-y-4">
                            <p className='w-fit border border-b-gray-400'>
                                <strong className="font-semibold "> General Informations</strong>
                            </p>
                            <div className="flex space-x-4">
                                <div className="flex-1 bg-gray-300 p-3 rounded-lg text-center">
                                    <Image
                                        src="/icons/mobil-dashboard/userBan/stop-sign.svg"
                                        width={24}
                                        height={24}
                                        alt="Ban count"
                                        className="mx-auto mb-2"
                                    />
                                    <p className="text-sm font-semibold">Ban Count</p>
                                    <p className="text-lg">{user.banCount}</p>
                                </div>
                                <div className="flex-1 bg-gray-300 p-3 rounded-lg text-center">
                                    <Image
                                        src="/icons/mobil-dashboard/userBan/clock.svg"
                                        width={24}
                                        height={24}
                                        alt="Ban end date"
                                        className="mx-auto mb-2"
                                    />
                                    <p className="text-sm font-semibold">End Ban</p>
                                    <p className="text-lg">{formatDate(user.banEndDate)}</p>
                                </div>
                            </div>
                            <button className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                                UnBan
                            </button>
                        </div>
                        <div className="flex-1 mt-4 md:mt-0">
                            <h3 className="text-lg font-semibold mb-2 border border-b-gray-400 w-fit">Ban Reasons</h3>
                            <div className="space-y-2">
                                {user.banReason.map((reason, index) => (
                                    <div key={index} className="bg-gray-300 p-3 rounded-lg">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <Image
                                                src="/icons/mobil-dashboard/userBan/warning.svg"
                                                width={16}
                                                height={16}
                                                alt="Warning"
                                            />
                                            <h4 className="font-semibold">{bannTitle}</h4> {/* Affichage de bannTitle */}
                                        </div>
                                        <p className="text-sm text-gray-600">{reason}</p>
                                        <p className="text-xs text-right text-red-600 mt-1">
                                            Banned by: {user.bannedByUsername}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const AdminUserBanModal: React.FC<ModalProps> = ({ isOpen, closeModal }) => {
    const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedUserId, setExpandedUserId] = useState<string | null>(null); // Changer ici à string | null
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            fetchBannedUsers();
        }
    }, [isOpen]);

    const fetchBannedUsers = async () => {
        try {
            const response = await fetch(`/api/searchUser?isBanned=true`);
            if (!response.ok) throw new Error("Failed to fetch banned users");
            const data: BannedUser[] = await response.json();
            console.log(data);
            setBannedUsers(data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const filteredUsers = bannedUsers.filter((user) =>
        `${user.firstName} ${user.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    const toggleExpand = (userId: string) => { // Utiliser string ici aussi
        setExpandedUserId(expandedUserId === userId ? null : userId);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay w-full h-full" onClick={closeModal}>
            <div
                className="modal-content w-full h-full flex flex-col"
                ref={containerRef}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">Banned Users</h2>
                    <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="relative mb-4">
                        <input
                            type="text"
                            placeholder="Search by name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <div className="space-y-4">
                        {filteredUsers.map((user) => (
                            <UserCard
                                key={user.id}
                                user={user}
                                isExpanded={expandedUserId === user.id}
                                toggleExpand={() => toggleExpand(user.id)}
                                isDesktop={isDesktop}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUserBanModal;
