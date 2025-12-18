import React from 'react';
import { FaInstagram, FaEnvelope, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../utils/api';


const Footer = () => {
    return (
        <footer style={{ background: 'linear-gradient(to right, #fdfbfb, #ebedee)', color: '#2d3436', paddingTop: '4rem', paddingBottom: '2rem', marginTop: 'auto', borderTop: '4px solid var(--primary-color)' }}>
            <div className="container">
                {/* Top Section: Brand & Navigation */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '40px',
                    paddingBottom: '3rem',
                    borderBottom: '1px solid rgba(0, 184, 148, 0.2)'
                }}>
                    <div style={{ flex: '1', minWidth: '280px' }}>
                        <Link to="/" className="logo" style={{ fontSize: '1.8rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                            <img src={`${API_BASE_URL}/uploads/logo.png`} alt="Logo" style={{ height: '80px', objectFit: 'contain' }} />
                            CareNest
                        </Link>
                        <p style={{ opacity: 0.8, fontSize: '1rem', lineHeight: '1.7', maxWidth: '350px', color: '#636e72' }}>
                            Where Extra Food Becomes Someone's Meal. We bridge the gap between surplus food and those in need.
                        </p>
                    </div>

                    <div style={{ flex: '1', minWidth: '200px' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.2rem', color: '#2d3436' }}>Quick Links</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '10px' }}><Link to="/" style={{ textDecoration: 'none', color: '#636e72', transition: 'color 0.2s' }}>Home</Link></li>
                            <li style={{ marginBottom: '10px' }}><Link to="/donate" style={{ textDecoration: 'none', color: '#636e72', transition: 'color 0.2s' }}>Donate Food</Link></li>
                            <li style={{ marginBottom: '10px' }}><Link to="/request" style={{ textDecoration: 'none', color: '#636e72', transition: 'color 0.2s' }}>Request Food</Link></li>
                        </ul>
                    </div>

                    <div style={{ flex: '1', minWidth: '200px' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.2rem', color: '#2d3436' }}>Legal</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '10px' }}><Link to="/privacy" style={{ textDecoration: 'none', color: '#636e72' }}>Privacy Policy</Link></li>
                            <li style={{ marginBottom: '10px' }}><Link to="/terms" style={{ textDecoration: 'none', color: '#636e72' }}>Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section: Developer Credits & Socials */}
                <div style={{ paddingTop: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>

                    <p style={{ fontSize: '0.9rem', color: '#b2bec3' }}>&copy; {new Date().getFullYear()} CareNest. All rights reserved.</p>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '10px'
                        // Removed card styles (background, padding, border, shadow)
                    }}>
                        <p style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            color: '#2d3436',
                            margin: 0
                        }}>
                            Crafted with <FaHeart style={{ color: '#ff7675', animation: 'pulse 1.5s infinite' }} /> by
                            <span style={{
                                background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontWeight: '800'
                            }}>DevXign</span>
                        </p>

                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginTop: '5px' }}>
                            <a href="https://www.instagram.com/devxign__?igsh=MWlxN2p0NWk1NzA5YQ==" target="_blank" rel="noopener noreferrer" style={{ color: '#E1306C', fontSize: '1.4rem' }} className="social-icon">
                                <FaInstagram />
                            </a>
                            <div style={{ width: '1px', height: '15px', background: '#dfe6e9' }}></div>
                            <a href="mailto:tech@devxign.online" style={{ color: '#0984e3', fontSize: '1.4rem' }} className="social-icon">
                                <FaEnvelope />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                    100% { transform: scale(1); }
                }
                .social-icon { transition: transform 0.2s; }
                .social-icon:hover { transform: translateY(-3px); }
            `}</style>
        </footer>
    );
};

export default Footer;
