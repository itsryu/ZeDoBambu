import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Utensils } from 'lucide-react';

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48" style={{ marginRight: '0.5rem' }}>
    <path fill="#fbc02d" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#e53935" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4caf50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1565c0" d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
  </svg>
);


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