"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
const EmailVerifyPage: React.FC = () => {
    const [isVerified, setIsVerified] = useState(false);
    const [error, setError] = useState('');
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        if (token) {
            // Add your verification logic here
            if (token === '123456') {
                setIsVerified(true);
            } else {
                setError('Invalid verification token');
            }
        }
    }, [token]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="p-6 bg-white rounded-sm shadow-sm">
                {isVerified ? (
                    <p className="text-green-600">Your email has been successfully verified! You can now proceed to use all the features of our service.</p>
                ) : (
                    <p className="text-red-600">{error || 'Verifying your email...'}</p>
                )}
            </div>
        </div>
    );
};

export default EmailVerifyPage;
