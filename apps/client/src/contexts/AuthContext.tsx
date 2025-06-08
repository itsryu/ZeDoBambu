import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import apiClient from '@/lib/axios';
import { IUser } from '@zedobambu/shared-types';
import { useNavigate } from 'react-router-dom';

const getFirebaseAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Email ou senha inválidos.';
    case 'auth/email-already-in-use':
      return 'Este email já está sendo utilizado.';
    case 'auth/weak-password':
      return 'A senha deve ter no mínimo 6 caracteres.';
    case 'auth/popup-closed-by-user':
      return 'O popup de login foi fechado antes da conclusão.';
    default:
      return 'Ocorreu um erro inesperado. Tente novamente.';
  }
};

interface AuthContextType {
  currentUser: (IUser & { firebaseUid: string; role: string; email: string }) | null;
  loading: boolean;
  isAuthenticating: boolean;
  error: string | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>; // NOVO
  signOut: () => Promise<void>;
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
  const [currentUser, setCurrentUser] = useState<(IUser & { firebaseUid: string; role: string; email: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleUserVerification = async (firebaseUser: FirebaseUser | null): Promise<void> => {
    if (firebaseUser) {
      try {
        const idToken = await firebaseUser.getIdToken();
        const response = await apiClient.post<{ data: IUser & { uid: string; role: string } }>(
          '/v1/auth/verify-token', { idToken }
        );
        
        const backendUser = response.data.data;
        setCurrentUser({
            ...backendUser,
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email || backendUser.email || '',
        });
      } catch (err) {
        console.error('Error verifying token:', err);
        setError('Falha ao sincronizar com o servidor.');
        await firebaseSignOut(auth);
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, handleUserVerification);
    return () => unsubscribe();
  }, []);

  const handleAuthSuccess = (backendUser: IUser & { role: string }) => {
    if (backendUser.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  const performAuthAction = async (authPromise: Promise<any>) => {
    setIsAuthenticating(true);
    setError(null);
    try {
      const userCredential = await authPromise;
      if (userCredential && userCredential.user) {
        const idToken = await userCredential.user.getIdToken();
        const response = await apiClient.post<{ data: IUser & { role: string } }>(
            '/v1/auth/verify-token', { idToken }
        );
        handleAuthSuccess(response.data.data);
      }
    } catch (err: any) {
      console.error('Auth action error:', err);
      setError(getFirebaseAuthErrorMessage(err.code));
      throw err;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const signUp = (email: string, password: string) => performAuthAction(createUserWithEmailAndPassword(auth, email, password));
  const signIn = (email: string, password: string) => performAuthAction(signInWithEmailAndPassword(auth, email, password));
  const signInWithGoogle = () => performAuthAction(signInWithPopup(auth, googleProvider));

  const signOut = async (): Promise<void> => {
    setIsAuthenticating(true);
    setError(null);
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
      navigate('/login', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Falha ao sair.');
      throw err;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const value: AuthContextType = {
    currentUser, loading, isAuthenticating, error,
    signUp, signIn, signInWithGoogle, signOut,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};