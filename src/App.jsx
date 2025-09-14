import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import UploadPage from './pages/UploadPage.jsx';
import ResultsPage from './pages/ResultsPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { UploadProvider } from './contexts/UploadContext.jsx'; // Import the new provider

function App() {
  return (
    <AuthProvider>
      <UploadProvider> {/* Wrap the router with the UploadProvider */}
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </Router>
      </UploadProvider>
    </AuthProvider>
  );
}

export default App;
