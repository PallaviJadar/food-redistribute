import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaThLarge, FaSignInAlt, FaSignOutAlt, FaPowerOff, FaBars, FaTimes } from 'react-icons/fa';
import API_BASE_URL from '../utils/api';


const Header = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsMenuOpen(false);
        navigate('/login');
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const iconStyle = { fontSize: '1.2rem', verticalAlign: 'middle' };

    return (
        <header>
            <div className="container header-inner">
                <Link to="/" className="logo" onClick={closeMenu}>
                    <img src={`${API_BASE_URL}/uploads/logo.png`} alt="Logo" style={{ height: '32px', objectFit: 'contain' }} />
                </Link>

                <div className="mobile-toggle" onClick={toggleMenu}>
                    {isMenuOpen ? <FaTimes /> : <FaBars />}
                </div>

                <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                    <ul className="nav-list">
                        <li><Link to="/" title="Home" onClick={closeMenu} className="nav-icon-link"><FaHome style={iconStyle} /></Link></li>
                        <li><Link to="/donate" onClick={closeMenu}>Donate</Link></li>
                        <li><Link to="/request" onClick={closeMenu}>Request</Link></li>
                        {token ? (
                            <>
                                <li><Link to="/dashboard" title="Dashboard" onClick={closeMenu} className="nav-icon-link"><FaThLarge style={iconStyle} /></Link></li>
                                <li>
                                    <button className="Btn logout-btn" onClick={handleLogout}>
                                        <div className="sign">
                                            <svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg>
                                        </div>
                                        <div className="text">Logout</div>
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/login" title="Login" onClick={closeMenu} style={{ background: '#0984e3', color: 'white' }} className="nav-icon-link round"><FaSignInAlt style={iconStyle} /></Link></li>
                                <li><Link to="/register" onClick={closeMenu} className="btn btn-primary nav-cta">Get Started</Link></li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;

