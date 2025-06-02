// /zedobambu-monorepo/apps/client/src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Nosso arquivo de inicialização do Firebase
import apiClient from '@/lib/axios'; // Nosso apiClient
import { IUser } from '@zedobambu/shared-types'; // Tipo compartilhado
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  currentUser: (IUser & { firebaseUid: string; role: string; email: string | null }) | null;
  loading: boolean;
  isAuthenticating: boolean; // Para controlar o estado durante chamadas assíncronas de auth
  error: string | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  // Você pode adicionar outros métodos aqui, como signInWithGoogle, etc.
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<(IUser & { firebaseUid: string; role: string; email: string | null }) | null>(null);
  const [loading, setLoading] = useState(true); // Para o estado inicial de autenticação
  const [isAuthenticating, setIsAuthenticating] = useState(false); // Para ações de login/signup
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleUserVerification = async (firebaseUser: FirebaseUser | null): Promise<void> => {
    if (firebaseUser) {
      try {
        const idToken = await firebaseUser.getIdToken(true); // Força a atualização do token
        // Enviar token para o backend para verificação e obtenção de dados/role
        const response = await apiClient.post<{ data: IUser & { uid: string; role: string } }>(
          '/auth/verify-token', // Endpoint da nossa API
          { idToken }
        );
        
        const backendUser = response.data.data;
        setCurrentUser({
            ...backendUser, // Dados do backend (incluindo role)
            firebaseUid: firebaseUser.uid, // UID do Firebase
            email: firebaseUser.email, // Email do Firebase
        });

        // Redirecionamento baseado no role
        if (backendUser.role === 'admin') {
          navigate('/admin/dashboard', { replace: true }); // Supondo que /admin seja outra app ou rota protegida
        } else {
          // navigate('/', { replace: true }); // Ou para uma página de perfil do cliente
        }

      } catch (err) {
        console.error('Error verifying token with backend or fetching user profile:', err);
        setError('Falha ao verificar usuário com o servidor.');
        await firebaseSignOut(auth); // Deslogar do Firebase se a verificação do backend falhar
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
    setLoading(false);
  };


  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      await handleUserVerification(firebaseUser);
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // O navigate não deve ser uma dependência aqui para evitar loops

  const signUp = async (email: string, password: string): Promise<void> => {
    setIsAuthenticating(true);
    setError(null);
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      // O onAuthStateChanged cuidará da verificação com o backend e do estado do usuário.
      // Se você precisar fazer algo imediatamente após o signUp antes do onAuthStateChanged, adicione aqui.
      // Por exemplo, enviar um email de verificação: await sendEmailVerification(userCredential.user);
      console.log('User signed up:', userCredential.user.uid);
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err.message || 'Falha ao criar conta.');
      throw err; // Re-throw para o formulário tratar
    } finally {
      setIsAuthenticating(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    setIsAuthenticating(true);
    setError(null);
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      // O onAuthStateChanged cuidará da verificação com o backend e do estado do usuário.
      console.log('User signed in:', userCredential.user.uid);
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.message || 'Falha ao entrar.');
      throw err; // Re-throw para o formulário tratar
    } finally {
      setIsAuthenticating(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setIsAuthenticating(true);
    setError(null);
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
      navigate('/login', { replace: true }); // Redirecionar para login após logout
    } catch (err: any) {
      console.error('Sign out error:', err);
      setError(err.message || 'Falha ao sair.');
      throw err;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    isAuthenticating,
    error,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};