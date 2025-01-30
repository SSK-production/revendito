'use client';

import {FormEvent, useState} from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';

export default function LoginPage() {
  const { setIsLogin, setUsername, setEntity, setRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit: (e: FormEvent) => Promise<void> = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        setError(error || 'An error occurred');
        return;
      }
      const data = await res.json();
      setError(null);
      setIsLogin(true);
      setUsername(data.user.name);
      setRole(data.user.role);
      setEntity(data.user.entity);      
      
      // on changera la route plus tard c'est juste pour tester
      router.push('/');
    } catch (err) {
      setError('Failed to log in. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        {error && (
          <div className="mb-4 text-red-500 text-sm text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg text-gray-500 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg text-gray-500 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <a href="/forgot-password" className="text-blue-500 hover:underline">
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  );
}
