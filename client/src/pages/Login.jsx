import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import API_BASE_URL from '../utils/api';


const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_BASE_URL}/api/auth/login`, formData);
            localStorage.setItem('token', res.data.token);

            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/dashboard');
        } catch (err) {
            console.error(err.response?.data);
            alert('❌ Login failed: ' + (err.response?.data?.msg || 'Server Error'));
        }
    };

    return (
        <div className="main-content" style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', paddingTop: '0',
            background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${API_BASE_URL}/uploads/login.jpg') no-repeat center center/cover`
        }}>

            <div className="card fade-in" style={{ width: '400px', maxWidth: '90%' }}>
                <h2 className="text-center" style={{ marginBottom: '2rem', color: 'var(--primary-color)', fontWeight: '800' }}>Welcome Back</h2>

                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <input type="email" name="email" value={email} onChange={onChange} placeholder=" " required />
                        <label>Email Address</label>
                    </div>

                    <div className="form-group">
                        <input type="password" name="password" value={password} onChange={onChange} placeholder=" " required />
                        <label>Password</label>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Login</button>
                </form>

                <p className="text-center" style={{ marginTop: '1.5rem', color: '#666' }}>
                    New here? <Link to="/register" style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>Create an Account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
