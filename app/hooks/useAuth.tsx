'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Définition du type pour le contexte
interface AuthContextType {
  isLogin: boolean;
  username: string | null;
  entity: string | null;
  role: string | null;
  setIsLogin: (value: boolean) => void;
  setUsername: (value: string | null) => void;
  setEntity: (value: string | null) => void;
  setRole: (value: string | null) => void;
}

// Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Provider pour englober l'application
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [entity, setEntity] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  return (
    <AuthContext.Provider
      value={{
        isLogin,
        username,
        entity,
        role,
        setIsLogin,
        setUsername,
        setEntity,
        setRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
