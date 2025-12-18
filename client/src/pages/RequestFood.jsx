import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import API_BASE_URL from '../utils/api';


const RequestFood = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const preFilledData = location.state || {};

    const [formData, setFormData] = useState({
        food_type: preFilledData.foodName || '',
        preferred_time: '',
        urgency: 'Low',
        reason: '',
        location: ''
    });
    const [file, setFile] = useState(null);


    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const onFileChange = e => setFile(e.target.files[0]);

    const onSubmit = async e => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const config = { headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' } };

        const data = new FormData();
        for (const key in formData) data.append(key, formData[key]);
        if (file) data.append('document', file);

        if (preFilledData.donationId) {
            data.append('donationId', preFilledData.donationId);
            data.append('donorId', preFilledData.donorId);
        }

        try {
            const res = await axios.post(`${API_BASE_URL}/api/requests`, data, config);
            const newRequest = res.data;
            alert('✅ Request submitted successfully!');
            navigate('/dashboard', {
                state: {
                    activeTab: 'request',
                    autoOpenChat: true,
                    requestId: newRequest._id,
                    receiverId: newRequest.donor // Use the ID from the created request object
                }
            });
        } catch (err) {
            console.error(err);
            alert('❌ Error submitting request.');
        }
    };

    return (
        <div className="main-content" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            paddingTop: '20px', // Compensate slightly for header if needed, but visually center
            paddingBottom: '20px',
            background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${API_BASE_URL}/uploads/request.jpg') no-repeat center center/cover`
        }}>
            <div className="card fade-in" style={{ width: '450px', maxWidth: '95%', padding: '2rem' }}>
                <div class="text-center mb-4" style={{ marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '2.5rem' }}>🍲</span>
                    <h2 style={{ color: 'var(--secondary-color)', fontWeight: '800', marginTop: '5px', fontSize: '1.8rem' }}>
                        {preFilledData.donationId ? 'Request Donation' : 'Request Help'}
                    </h2>
                    <p style={{ color: '#ccc', fontSize: '0.9rem' }}> {/* Lighter text for dark mode */}
                        {preFilledData.donationId
                            ? `You are requesting "${preFilledData.foodName}"`
                            : 'We are here to support you.'}
                    </p>
                </div>

                <form onSubmit={onSubmit}>
                    {preFilledData.donationId && (
                        <div style={{ background: 'rgba(46, 204, 113, 0.2)', padding: '10px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #2ecc71', fontSize: '0.9rem', color: '#fff' }}>
                            <strong>Selected Item:</strong> {preFilledData.foodName}
                        </div>
                    )}

                    <div className="form-group" style={{ marginBottom: '0.8rem' }}>
                        <input
                            type="text"
                            name="food_type"
                            value={formData.food_type}
                            onChange={onChange}
                            placeholder=" "
                            required
                            readOnly={!!preFilledData.donationId}
                            style={{
                                background: preFilledData.donationId ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                                cursor: preFilledData.donationId ? 'not-allowed' : 'text',
                                color: 'white'
                            }}
                        />
                        <label>Food Type Needed</label>
                    </div>

                    <div className="form-grid" style={{ marginBottom: '0.8rem' }}>
                        <div className="form-group" style={{ margin: 0 }}>
                            <input type="time" name="preferred_time" onChange={onChange} required placeholder=" " />
                            <label>Preferred Time</label>
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                            <select name="urgency" onChange={onChange} placeholder=" " style={{ paddingTop: '0.75rem', height: '100%' }}>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                            <label>Urgency</label>
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '0.8rem' }}>
                        <textarea name="reason" rows="2" onChange={onChange} placeholder=" " required></textarea>
                        <label>Reason for Request</label>
                    </div>

                    <div className="form-group" style={{ marginBottom: '0.8rem' }}>
                        <input type="text" name="location" onChange={onChange} placeholder=" " required />
                        <label>Delivery Location</label>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <input type="file" name="document" onChange={onFileChange} style={{ padding: '0.5rem', border: '1px dashed #999', fontSize: '0.85rem' }} />
                        <label style={{ display: 'none' }}>Document</label>
                    </div>

                    <button type="submit" className="btn btn-secondary" style={{ width: '100%', marginTop: '0.5rem' }}>Submit Request</button>
                </form>
            </div>
        </div>
    );
};

export default RequestFood;
