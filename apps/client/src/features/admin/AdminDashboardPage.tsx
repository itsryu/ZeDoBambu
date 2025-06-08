import React, { useState } from 'react';
import { User, ShoppingBag, LayoutDashboard, Utensils } from 'lucide-react';
import ProductManagement from './ProductManagement';
import UserManagement from './UserManagement';
import { useAuth } from '@/contexts/AuthContext';

type Tab = 'dashboard' | 'products' | 'users' | 'orders';

const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const { currentUser } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <div><h1 className="text-2xl font-bold text-gray-800">Dashboard</h1><p className="mt-2 text-gray-600">Em breve: um resumo das principais métricas.</p></div>;
      case 'products':
        return <ProductManagement />;
      case 'users':
        return <UserManagement />;
      case 'orders':
        return <div><h1 className="text-2xl font-bold text-gray-800">Pedidos</h1><p className="mt-2 text-gray-600">Em breve: uma lista de todos os pedidos recebidos.</p></div>;
      default:
        return <div>Selecione uma opção</div>;
    }
  };

  const TabButton = ({ tab, icon: Icon, label }: { tab: Tab, icon: React.ElementType, label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === tab
        ? 'bg-orange-500 text-white shadow-md'
        : 'text-gray-600 hover:bg-orange-100 hover:text-orange-700'
        }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.16))]">
      <aside className="w-64 bg-white p-4 flex-shrink-0 border-r flex flex-col">
        <div>
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-800">Painel Admin</h2>
            <p className="text-sm text-gray-500">Bem-vindo, {currentUser?.name}</p>
          </div>
          <nav className="space-y-2">
            <TabButton tab="dashboard" icon={LayoutDashboard} label="Dashboard" />
            <TabButton tab="products" icon={ShoppingBag} label="Gerir Produtos" />
            <TabButton tab="users" icon={User} label="Gerir Utilizadores" />
            <TabButton tab="orders" icon={Utensils} label="Ver Pedidos" />
          </nav>
        </div>
      </aside>

      <main className="flex-grow p-6 sm:p-8 lg:p-10 bg-gray-50 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboardPage;