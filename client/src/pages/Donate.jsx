import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../utils/api';


const Donate = () => {
    const [formData, setFormData] = useState({
        food_name: '', quantity: '', location: '', expiry_date: ''
    });
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const config = { headers: { 'x-auth-token': token } };

        try {
            await axios.post(`${API_BASE_URL}/api/donations`, formData, config);
            alert('✅ Donation submitted successfully.');
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert('❌ Error processing donation.');
        }
    };

    return (
        <div className="main-content" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            paddingTop: '0',
            background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${API_BASE_URL}/uploads/donate.jpg') no-repeat center center/cover`
        }}>
            <div className="card fade-in" style={{ width: '500px', maxWidth: '90%' }}>
                <div className="text-center mb-4">
                    <span style={{ fontSize: '3rem' }}>🎁</span>
                    <h2 style={{ color: 'var(--dark-color)', fontWeight: '800', marginTop: '10px' }}>Donate Food</h2>
                    <p style={{ color: '#888' }}>Fill in the details to share your food.</p>
                </div>

                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <input type="text" name="food_name" onChange={onChange} placeholder=" " required />
                        <label>Food Item Name</label>
                    </div>

                    <div className="form-group">
                        <input type="number" name="quantity" onChange={onChange} min="1" placeholder=" " required />
                        <label>Quantity (KGs/Units)</label>
                    </div>

                    <div className="form-group">
                        <input type="text" name="location" onChange={onChange} placeholder=" " required />
                        <label>Pickup Location</label>
                    </div>

                    <div className="form-group">
                        <input type="date" name="expiry_date" onChange={onChange} required placeholder=" " min={new Date().toISOString().split('T')[0]} />
                        <label>Expiry Date</label>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Submit Donation</button>
                </form>
            </div>
        </div >
    );
};

export default Donate;
