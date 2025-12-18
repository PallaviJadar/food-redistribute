import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../utils/api';


const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', password: '', role: 'donor'
    });
    const navigate = useNavigate();

    const { name, email, phone, password, role } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/api/auth/register`, formData);
            alert('✅ Registration successful! Please login.');

            navigate('/login');
        } catch (err) {
            console.error(err.response?.data);
            alert('❌ Registration failed: ' + (err.response?.data?.msg || 'Server Error'));
        }
    };

    return (
        <div className="main-content" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            paddingTop: '0',
            background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${API_BASE_URL}/uploads/register.jpg') no-repeat center center/cover`
        }}>

            <div className="card fade-in" style={{ width: '380px', maxWidth: '90%', padding: '2rem' }}>
                <h2 className="text-center" style={{ marginBottom: '1rem', color: 'var(--primary-color)', fontWeight: '800' }}>Create Account</h2>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <input type="text" name="name" value={name} onChange={onChange} placeholder=" " required />
                        <label>Full Name</label>
                    </div>

                    <div className="form-group">
                        <input type="email" name="email" value={email} onChange={onChange} placeholder=" " required />
                        <label>Email Address</label>
                    </div>

                    <div className="form-group">
                        <input type="text" name="phone" value={phone} onChange={onChange} placeholder=" " required />
                        <label>Phone Number</label>
                    </div>

                    <div className="form-group">
                        <input type="password" name="password" value={password} onChange={onChange} placeholder=" " required />
                        <label>Password</label>
                    </div>

                    <div className="form-group">
                        <select name="role" value={role} onChange={onChange} placeholder=" " style={{ paddingTop: '1.2rem' }}>
                            <option value="donor">Donate Food</option>
                            <option value="requester">Request Food</option>
                        </select>
                        <label>I want to...</label>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Get Started</button>
                </form>
                <p className="text-center" style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
