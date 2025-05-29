import { Routes, Route, Link } from 'react-router-dom';
import HomePage from '@/features/home/HomePage';
import MenuPage from '@/features/menu/MenuPage';
import { Layout } from '@/components/layout/Layout';
import { NotFoundPage } from '@/pages/NotFoundPage';

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/cardapio" element={<MenuPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Layout>
    );
}

export default App;