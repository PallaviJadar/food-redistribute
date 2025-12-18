import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../utils/api';

const Home = () => {
    const images = [
        `${API_BASE_URL}/uploads/1.jpg`,
        `${API_BASE_URL}/uploads/2.jpg`,
        `${API_BASE_URL}/uploads/3.jpg`
    ];

    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <section className="hero" style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            marginTop: '-80px',
            overflow: 'hidden'
        }}>
            {/* Background Images with Crossfade */}
            {images.map((img, index) => (
                <div key={index} style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${img}') no-repeat center 20%/cover`,
                    opacity: index === currentImage ? 1 : 0,
                    transition: 'opacity 1.5s ease-in-out',
                    zIndex: -1
                }}></div>
            ))}

            <div className="hero-content fade-in" style={{ maxWidth: '800px', padding: '20px', color: 'white', zIndex: 1 }}>
                <span style={{
                    display: 'inline-block',
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(5px)',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    marginBottom: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                }}>
                    ✨ Join the movement against hunger
                </span>
                <h1 style={{
                    fontSize: '4rem',
                    marginBottom: '20px',
                    fontWeight: '700',
                    lineHeight: '1.2',
                    textShadow: '0 4px 20px rgba(0,0,0,0.3)'
                }}>
                    Where Extra Food Becomes Someone's Meal
                </h1>
                <p style={{
                    fontSize: '1.5rem',
                    marginBottom: '40px',
                    opacity: '0.9',
                    maxWidth: '600px',
                    margin: '0 auto 40px'
                }}>
                    Connect surplus food with those in need. Simple, fast, and impactful.
                </p>
                <div className="hero-buttons" style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                    <Link to="/donate" className="btn btn-primary">Donate Food</Link>
                    <Link to="/request" className="btn btn-secondary">Request Food</Link>
                </div>

                <div className="stats-container" style={{ marginTop: '60px', display: 'flex', gap: '40px', justifyContent: 'center', opacity: '0.8' }}>
                    <div>
                        <h3 style={{ fontSize: '2rem', fontWeight: 'bold' }}>1k+</h3>
                        <p>Meals Saved</p>
                    </div>
                    <div>
                        <h3 style={{ fontSize: '2rem', fontWeight: 'bold' }}>500+</h3>
                        <p>Happy Donors</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Home;

