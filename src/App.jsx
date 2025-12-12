import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage/HomePage';
import HeroSection from './pages/HeroSection/HeroSection';
import Products from './pages/Products/Products';
import Categories from './pages/Categories/Categories';
import Banners from './pages/Banners/Banners';
import Media from './pages/Media/Media';
import Settings from './pages/Settings/Settings';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="hero" element={<HeroSection />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="banners" element={<Banners />} />
          <Route path="media" element={<Media />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
