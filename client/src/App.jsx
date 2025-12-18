import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Donate from './pages/Donate';
import RequestFood from './pages/RequestFood';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import PrivateRoute from './components/PrivateRoute';
import API_BASE_URL from './utils/api';


function App() {
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        // Simulate loading time (e.g., waiting for assets or initial checks)
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000); // 2 seconds delay

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: '#ffffff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
                flexDirection: 'column'
            }}>
                <img
                    src={`${API_BASE_URL}/uploads/logo.png`}
                    alt="Loading..."

                    style={{
                        width: '150px',
                        height: '150px',
                        objectFit: 'contain',
                        marginBottom: '20px',
                        animation: 'pulse 1.5s infinite'
                    }}
                />
                <style>{`
                    @keyframes pulse {
                        0% { transform: scale(1); opacity: 1; }
                        50% { transform: scale(1.1); opacity: 0.8; }
                        100% { transform: scale(1); opacity: 1; }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <Router>
            {/* Main App Container */}
            <div className="App">
                <Header />
                <div className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                        <Route path="/terms" element={<TermsOfService />} />

                        <Route element={<PrivateRoute />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/donate" element={<Donate />} />
                            <Route path="/request" element={<RequestFood />} />
                        </Route>
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
