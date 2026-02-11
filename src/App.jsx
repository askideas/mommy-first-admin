import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Login from './pages/Login/Login';
import HomePage from './pages/HomePage/HomePage';
import AboutPage from './pages/AboutPage/AboutPage';
import ContactPage from './pages/ContactPage/ContactPage';
import EnquiryPage from './pages/EnquiryPage/EnquiryPage';
import CareHubPage from './pages/CareHubPage/CareHubPage';
import AffiliateMarketingPage from './pages/AffiliateMarketingPage/AffiliateMarketingPage';
import DonationPage from './pages/DonationPage/DonationPage';
import Media from './pages/Media/Media';
import ShopPage from './pages/ShopPage/ShopPage';
import BundlePage from './pages/BundlePage/BundlePage';
import SocialMediaPage from './pages/SocialMediaPage/SocialMediaPage';
import NavigationMenuPage from './pages/NavigationMenuPage/NavigationMenuPage';
import ReviewsSlider from './pages/ReviewsSlider/ReviewsSlider';
import FaqsSlider from './pages/FaqsSlider/FaqsSlider';
import EventsPage from './pages/Events/EventsPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route - Login */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes - Require Authentication */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="enquiry" element={<EnquiryPage />} />
            <Route path="carehub" element={<CareHubPage />} />
            <Route path="affiliate" element={<AffiliateMarketingPage />} />
            <Route path="donation" element={<DonationPage />} />
            <Route path="media" element={<Media />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="bundle" element={<BundlePage />} />
            <Route path="socialmedia" element={<SocialMediaPage />} />
            <Route path="navigation" element={<NavigationMenuPage />} />
            <Route path="reviews" element={<ReviewsSlider />} />
            <Route path="faqs" element={<FaqsSlider />} />
            <Route path="livesessions" element={<EventsPage />} />
          </Route>

          {/* Catch all - Redirect to home or login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
