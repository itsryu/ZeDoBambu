import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Utensils } from 'lucide-react';
import { GoogleIcon } from '@/components/svg/Google';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signInWithGoogle, isAuthenticating, error: authError } = useAuth();

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signIn(email, password);
    } catch (err) {
      console.error('Login failed on page:', err);
    }
  };

  const handleGoogleSubmit = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Google sign in failed on page:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <Utensils className="mx-auto h-16 w-auto text-orange-600" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Acesse sua conta</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Ou{' '}
            <Link to="/cadastro" className="font-medium text-orange-600 hover:text-orange-500">crie uma nova conta</Link>
          </p>
        </div>

        {authError && <p className="text-sm text-red-600 text-center bg-red-100 p-3 rounded-md">{authError}</p>}

        <form className="mt-8 space-y-6" onSubmit={handleEmailSubmit}>
          <input id="email-address" name="email" type="email" required placeholder="Seu email" value={email} onChange={(e) => setEmail(e.target.value)} className="..." />
          <input id="password" name="password" type="password" required placeholder="Sua senha" value={password} onChange={(e) => setPassword(e.target.value)} className="..." />
          <div>
            <button type="submit" disabled={isAuthenticating} className="group relative w-full flex justify-center py-3 px-4 ...">
              {isAuthenticating ? 'Entrando...' : 'Entrar com Email'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Ou continue com</span>
            </div>
          </div>

          <div className="mt-6">
            <button onClick={handleGoogleSubmit} disabled={isAuthenticating} className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
              <GoogleIcon />
              Entrar com Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;