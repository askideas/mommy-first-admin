import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage/HomePage';
import Media from './pages/Media/Media';
import ShopPage from './pages/ShopPage/ShopPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="media" element={<Media />} />
          <Route path="shop" element={<ShopPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
