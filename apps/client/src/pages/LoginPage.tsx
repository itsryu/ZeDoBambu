import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Utensils } from 'lucide-react';

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
    <path fill="#4285F4" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
    <path fill="#34A853" d="M43.611,20.083L43.595,20.083L42,20H24v8h11.303c-0.792,2.43-2.438,4.488-4.638,5.966l5.657,5.657C42.848,36.438,44,32.27,44,28C44,25.12,43.862,22.62,43.611,20.083z"></path>
    <path fill="#FBBC05" d="M9.916,28.895c-1.045-3.131-1.045-6.659,0-9.79l-5.657-5.657C2.146,17.479,1.011,22.01,1.011,24c0,1.99,0.531,3.895,1.445,5.657L9.916,28.895z"></path>
    <path fill="#EA4335" d="M24,48c5.262,0,9.916-2.19,13.234-5.657l-5.657-5.657C30.046,38.236,27.218,39,24,39c-3.731,0-6.94-2.036-8.64-5.035l-5.657,5.657C12.034,44.386,17.51,48,24,48z"></path>
    <path fill="none" d="M0,0h48v48H0z"></path>
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
          <input id="email-address" name="email" type="email" required placeholder="Seu email" value={email} onChange={(e) => setEmail(e.target.value)} className="..."/>
          <input id="password" name="password" type="password" required placeholder="Sua senha" value={password} onChange={(e) => setPassword(e.target.value)} className="..."/>
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