import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import API_BASE_URL from '../utils/api';

import ChatBox from '../components/ChatBox';

const Dashboard = () => {
    const [user, setUser] = useState({});
    const [donations, setDonations] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [myDonations, setMyDonations] = useState([]);
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [adminRequests, setAdminRequests] = useState([]);
    const [donors, setDonors] = useState([]);

    const [activeTab, setActiveTab] = useState('donate'); // User: 'donate', 'request', 'impact' | Admin: 'manage_requests', 'manage_donors'
    const [chatData, setChatData] = useState(null);
    const navigate = useNavigate();

    const location = useLocation();

    useEffect(() => {
        if (location.state) {
            if (location.state.activeTab) {
                setActiveTab(location.state.activeTab);
            }
            // Auto-open chat if requested (from RequestFood.jsx)
            if (location.state.autoOpenChat && location.state.requestId && location.state.receiverId) {
                setChatData({
                    requestId: location.state.requestId,
                    receiverId: location.state.receiverId
                });
                // Optional: clear state to prevent reopening on generic refresh? 
                // React Router history handles this, but explicit is cleaner.
                // For now, simple is better.
            }
        }
    }, [location.state]);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const config = { headers: { 'x-auth-token': token } };

        try {
            if (storedUser && storedUser.role === 'admin') {
                // Admin Fetch
                try {
                    const resAllRequests = await axios.get(`${API_BASE_URL}/api/requests`, config);
                    setAdminRequests(resAllRequests.data);
                } catch (e) { console.error("Error fetching admin requests", e); }

                try {
                    const resDonors = await axios.get(`${API_BASE_URL}/api/admin/users`, config);
                    setDonors(resDonors.data);
                } catch (e) { console.error("Error fetching donors", e); }

                try {
                    // Fetch all donations for admin
                    const resDonations = await axios.get('http://localhost:5000/api/donations', config);
                    setDonations(resDonations.data);
                } catch (e) { console.error("Error fetching donations for admin", e); }
            } else {
                // User Fetch
                const resDonations = await axios.get('http://localhost:5000/api/donations', config);
                setDonations(resDonations.data);

                const resRequests = await axios.get('http://localhost:5000/api/requests/my', config);
                setMyRequests(resRequests.data);

                const resMyDonations = await axios.get('http://localhost:5000/api/donations/my', config);
                setMyDonations(resMyDonations.data);

                if (storedUser && storedUser.role === 'donor') {
                    const resIncoming = await axios.get('http://localhost:5000/api/requests/incoming', config);
                    setIncomingRequests(resIncoming.data);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            // Only force admin tab if no specific tab was requested
            if (storedUser.role === 'admin' && (!location.state || !location.state.activeTab)) {
                setActiveTab('manage_requests');
            }
        }

        fetchData();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            await axios.put(`http://localhost:5000/api/requests/${id}/status`, { status }, config);

            // Refresh requests
            const res = await axios.get('http://localhost:5000/api/requests', config);
            setAdminRequests(res.data);
            alert(`Request ${status} successfully!`);
        } catch (err) {
            console.error(err);
            alert('Error updating status');
        }
    };

    const handleInstantRequest = async (donation) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };

            // 1. Create Request
            const res = await axios.post('http://localhost:5000/api/requests', {
                food_type: donation.food_name,
                preferred_time: 'ASAP',
                urgency: 'High',
                reason: 'Instant Request from Donation',
                location: donation.location,
                donationId: donation._id,
                donorId: donation.donor._id
            }, config);

            // 2. Open Chat
            setChatData({ requestId: res.data._id, receiverId: donation.donor._id });

            // 3. Refresh Requests & Switch Tab
            const resRequests = await axios.get('http://localhost:5000/api/requests/my', config);
            setMyRequests(resRequests.data);
            setActiveTab('request');

        } catch (err) {
            console.error("Error creating instant request:", err);
            alert("Failed to create request. Please try again.");
        }
    };

    const handleDeleteRequest = async (id) => {
        if (!window.confirm("Are you sure you want to delete this request?")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/requests/${id}`, { headers: { 'x-auth-token': token } });
            setMyRequests(myRequests.filter(req => req._id !== id));
            setAdminRequests(adminRequests.filter(req => req._id !== id));
            alert("Request deleted successfully.");
        } catch (err) {
            console.error("Error deleting request:", err);
            alert("Failed to delete request.");
        }
    };

    const handleDeleteDonation = async (id) => {
        if (!window.confirm("Are you sure you want to delete this donation?")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/donations/${id}`, { headers: { 'x-auth-token': token } });
            setDonations(donations.filter(d => d._id !== id));
            setMyDonations(myDonations.filter(d => d._id !== id));
            alert("Donation deleted successfully.");
        } catch (err) {
            console.error("Error deleting donation:", err);
            alert("Failed to delete donation.");
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/admin/users/${id}`, { headers: { 'x-auth-token': token } });
            setDonors(donors.filter(u => u._id !== id));
            alert("User deleted successfully.");
        } catch (err) {
            console.error("Error deleting user:", err);
            alert("Failed to delete user.");
        }
    };

    const calculateImpact = () => {
        const totalDonations = myDonations.length;
        const totalQuantity = myDonations.reduce((acc, curr) => acc + parseInt(curr.quantity || 0), 0);
        return { totalDonations, totalQuantity };
    };

    const impactStats = calculateImpact();

    // Calculate unread messages
    const myRequestsUnread = myRequests.reduce((acc, curr) => acc + (curr.unreadCount || 0), 0);
    const incomingRequestsUnread = incomingRequests.reduce((acc, curr) => acc + (curr.unreadCount || 0), 0);

    const getStatusBadgeClass = (status) => {
        if (status === 'Approved') return 'badge badge-success';
        if (status === 'Rejected') return 'badge badge-danger';
        return 'badge badge-warning';
    };

    return (
        <div className="main-content" style={{ background: 'linear-gradient(135deg, #1e272e 0%, #000000 100%)', minHeight: '100vh' }}>
            {/* Dashboard Header - Clean layout with no overlap */}
            <div style={{ background: 'rgba(0, 184, 148, 0.2)', backdropFilter: 'blur(10px)', color: 'white', padding: '3rem 0 4rem', marginBottom: '2rem', borderBottom: '1px solid rgba(0,184,148,0.3)', transition: 'all 0.3s ease' }}>
                <div className="container text-center">
                    <h1 className="fade-in" style={{ textShadow: '0 0 10px rgba(0,184,148,0.5)' }}>👋 Welcome back, {user.name}!</h1>
                    <p className="fade-in" style={{ opacity: 0.9 }}>Role: {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}</p>
                </div>
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 10 }}>

                {/* ADMIN VIEW */}
                {user.role === 'admin' ? (
                    <>
                        {/* Admin Tabs */}
                        <div className="dashboard-grid fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                            <div onClick={() => setActiveTab('manage_requests')} className={`card ${activeTab === 'manage_requests' ? 'card-active' : ''}`} style={{
                                textAlign: 'center', cursor: 'pointer', borderTop: '5px solid var(--secondary-color)'
                            }}>
                                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🍽️</div>
                                <h3>Manage Requests</h3>
                            </div>
                            <div onClick={() => setActiveTab('manage_donors')} className={`card ${activeTab === 'manage_donors' ? 'card-active' : ''}`} style={{
                                textAlign: 'center', borderTop: '5px solid var(--accent-color)', cursor: 'pointer'
                            }}>
                                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>👥</div>
                                <h3>Manage Donors</h3>
                            </div>
                            <div onClick={() => setActiveTab('manage_donations')} className={`card ${activeTab === 'manage_donations' ? 'card-active' : ''}`} style={{
                                textAlign: 'center', borderTop: '5px solid #a29bfe', cursor: 'pointer'
                            }}>
                                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📦</div>
                                <h3>Manage Donations</h3>
                            </div>
                        </div>

                        {/* Admin Content */}
                        <div className="card fade-in" style={{ marginBottom: '40px', minHeight: '300px' }}>
                            {activeTab === 'manage_requests' && (
                                <>
                                    <h3 className="mb-4" style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>🍽️ All Food Requests</h3>
                                    {adminRequests.length > 0 ? (
                                        <div className="table-container">
                                            <table className="styled-table">
                                                <thead>
                                                    <tr>
                                                        <th>Requester</th>
                                                        <th>Food Type</th>
                                                        <th>Status</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {adminRequests.map((req) => (
                                                        <tr key={req._id}>
                                                            <td>{req.user?.name}<br /><small>{req.user?.email}</small></td>
                                                            <td>{req.food_type}</td>
                                                            <td>
                                                                <span className={getStatusBadgeClass(req.status)}>
                                                                    {req.status}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <div style={{ display: 'flex', gap: '5px' }}>
                                                                    {req.status === 'Pending' && (
                                                                        <>
                                                                            <button onClick={() => handleStatusUpdate(req._id, 'Approved')} className="btn btn-success" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>Approve</button>
                                                                            <button onClick={() => handleStatusUpdate(req._id, 'Rejected')} className="btn btn-danger" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>Reject</button>
                                                                        </>
                                                                    )}
                                                                    <button onClick={() => handleDeleteRequest(req._id)} className="btn btn-danger" style={{ padding: '5px 10px', fontSize: '0.8rem', background: '#d63031' }}>🗑️</button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : <p>No requests found.</p>}
                                </>
                            )}

                            {activeTab === 'manage_donors' && (
                                <>
                                    <h3 className="mb-4" style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>🤝 Registered Donors</h3>
                                    {donors.length > 0 ? (
                                        <div className="table-container">
                                            <table className="styled-table">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Email</th>
                                                        <th>Phone</th>
                                                        <th>Joined</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {donors.map((d) => (
                                                        <tr key={d._id}>
                                                            <td>{d.name}</td>
                                                            <td>{d.email}</td>
                                                            <td>{d.phone}</td>
                                                            <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                                                            <td>
                                                                <button onClick={() => handleDeleteUser(d._id)} className="btn btn-danger" style={{ padding: '5px 10px', fontSize: '0.8rem', background: '#d63031' }}>🗑️</button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : <p>No donors found.</p>}
                                </>
                            )}

                            {activeTab === 'manage_donations' && (
                                <>
                                    <h3 className="mb-4" style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>📦 All Donations</h3>
                                    {donations.length > 0 ? (
                                        <div className="table-container">
                                            <table className="styled-table">
                                                <thead>
                                                    <tr>
                                                        <th>Food Name</th>
                                                        <th>Donor</th>
                                                        <th>Quantity</th>
                                                        <th>Status</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {donations.map((d) => (
                                                        <tr key={d._id}>
                                                            <td>{d.food_name}</td>
                                                            <td>{d.donor?.name}</td>
                                                            <td>{d.quantity}</td>
                                                            <td>{d.status}</td>
                                                            <td>
                                                                <button onClick={() => handleDeleteDonation(d._id)} className="btn btn-danger" style={{ padding: '5px 10px', fontSize: '0.8rem', background: '#d63031' }}>🗑️</button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : <p>No donations found.</p>}
                                </>
                            )}
                        </div>
                    </>
                ) : (
                    /* USER VIEW */
                    <>
                        {/* Action Tabs */}
                        <div className="dashboard-grid fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                            <div onClick={() => setActiveTab('donate')} className={`card ${activeTab === 'donate' ? 'card-active' : ''}`} style={{
                                textAlign: 'center', borderTop: '5px solid var(--secondary-color)', cursor: 'pointer'
                            }}>
                                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🥘</div>
                                <h3>Available Donations</h3>
                                <p>View & Request food.</p>
                            </div>
                            <div onClick={() => setActiveTab('request')} className={`card ${activeTab === 'request' ? 'card-active' : ''}`} style={{
                                textAlign: 'center', borderTop: '5px solid var(--accent-color)', cursor: 'pointer', position: 'relative'
                            }}>
                                {myRequestsUnread > 0 && (
                                    <span style={{
                                        position: 'absolute', top: '10px', right: '10px', background: 'red', color: 'white',
                                        borderRadius: '50%', width: '25px', height: '25px', display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold'
                                    }}>
                                        {myRequestsUnread}
                                    </span>
                                )}
                                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🙋</div>
                                <h3>My Requests</h3>
                                <p>Track status & Chat.</p>
                            </div>
                            <div onClick={() => setActiveTab('impact')} className={`card ${activeTab === 'impact' ? 'card-active' : ''}`} style={{
                                textAlign: 'center', borderTop: '5px solid #a29bfe', cursor: 'pointer'
                            }}>
                                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📊</div>
                                <h3>Your Impact</h3>
                                <p>See the difference you made.</p>
                            </div>
                            {user.role === 'donor' && (
                                <div onClick={() => setActiveTab('incoming')} className={`card ${activeTab === 'incoming' ? 'card-active' : ''}`} style={{
                                    textAlign: 'center', borderTop: '5px solid #ff7675', cursor: 'pointer', position: 'relative'
                                }}>
                                    {incomingRequestsUnread > 0 && (
                                        <span style={{
                                            position: 'absolute', top: '10px', right: '10px', background: 'red', color: 'white',
                                            borderRadius: '50%', width: '25px', height: '25px', display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold'
                                        }}>
                                            {incomingRequestsUnread}
                                        </span>
                                    )}
                                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📫</div>
                                    <h3>Incoming Requests</h3>
                                    <p>Requests for your food.</p>
                                </div>
                            )}
                        </div>

                        {/* Content Area */}
                        <div className="card fade-in" style={{ marginBottom: '40px', minHeight: '300px' }}>

                            {/* Available Donations View */}
                            {activeTab === 'donate' && (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                                        <h3>📦 Available Donations</h3>
                                        <Link to="/donate" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>+ New Donation</Link>
                                    </div>
                                    {donations.length > 0 ? (
                                        <div className="table-container">
                                            <table className="styled-table">
                                                <thead>
                                                    <tr>
                                                        <th>Food Name</th>
                                                        <th>Quantity</th>
                                                        <th>Expiry</th>
                                                        <th>Location</th>
                                                        <th>Donor</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {donations.map((donation) => (
                                                        <tr key={donation._id}>
                                                            <td>{donation.food_name}</td>
                                                            <td>{donation.quantity}</td>
                                                            <td>{new Date(donation.expiry_date).toLocaleDateString()}</td>
                                                            <td>{donation.location}</td>
                                                            <td>{donation.donor?.name}</td>
                                                            <td>
                                                                {user.role === 'requester' && (
                                                                    <button
                                                                        onClick={() => handleInstantRequest(donation)}
                                                                        style={{ background: 'var(--secondary-color)', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem' }}
                                                                    >
                                                                        Request & Chat 💬
                                                                    </button>
                                                                )}
                                                                {user._id === donation.donor?._id && (
                                                                    <button
                                                                        onClick={() => handleDeleteDonation(donation._id)}
                                                                        style={{ background: '#d63031', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem', marginLeft: '5px' }}
                                                                    >
                                                                        🗑️
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : <p style={{ fontStyle: 'italic', color: '#888' }}>No active donations at the moment.</p>}
                                </>
                            )}

                            {/* My Requests View */}
                            {activeTab === 'request' && (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                                        <h3>📜 Your Requests</h3>
                                        <Link to="/request" className="btn btn-secondary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>+ New Request</Link>
                                    </div>
                                    {myRequests.length > 0 ? (
                                        <div className="table-container">
                                            <table className="styled-table">
                                                <thead>
                                                    <tr>
                                                        <th>Food Type</th>
                                                        <th>Date</th>
                                                        <th>Status</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {myRequests.map((req) => (
                                                        <tr key={req._id}>
                                                            <td>{req.food_type}</td>
                                                            <td>{new Date(req.request_date).toLocaleDateString()}</td>
                                                            <td>
                                                                <span className={getStatusBadgeClass(req.status)}>
                                                                    {req.status}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                                                    {(req.donor || req.donation?.donor) ? (
                                                                        req.status === 'Approved' ? (
                                                                            <button
                                                                                onClick={() => setChatData({ requestId: req._id, receiverId: (req.donor || req.donation.donor)._id })}
                                                                                className="btn btn-primary"
                                                                                style={{ padding: '5px 15px', fontSize: '0.8rem', border: 'none', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', position: 'relative' }}
                                                                            >
                                                                                <span>Chat</span> 💬
                                                                                {req.unreadCount > 0 && (
                                                                                    <span style={{
                                                                                        position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white',
                                                                                        borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center',
                                                                                        justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold'
                                                                                    }}>
                                                                                        {req.unreadCount}
                                                                                    </span>
                                                                                )}
                                                                            </button>
                                                                        ) : (
                                                                            <span style={{ color: '#e67e22', fontSize: '0.8rem', fontStyle: 'italic', maxWidth: '150px', display: 'inline-block', lineHeight: '1.2' }}>
                                                                                Wait for Admin Approval to Chat ⏳
                                                                            </span>
                                                                        )
                                                                    ) : (
                                                                        <span style={{ color: '#aaa', fontSize: '0.85rem', marginRight: '5px' }}>No Linked Donor</span>
                                                                    )}
                                                                    <button onClick={() => handleDeleteRequest(req._id)} className="btn btn-danger" style={{ padding: '5px 10px', fontSize: '0.8rem', background: '#d63031', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>🗑️</button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : <p style={{ fontStyle: 'italic', color: '#888' }}>You haven't made any requests yet.</p>}
                                </>
                            )}

                            {/* Impact View */}
                            {activeTab === 'impact' && (
                                <div className="text-center fade-in">
                                    <h3 style={{ marginBottom: '30px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>🌟 Your Contribution</h3>
                                    <div className="stats-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', maxWidth: '800px', margin: '0 auto' }}>
                                        <div style={{ background: '#2d3436', padding: '30px', borderRadius: '24px', border: '1px solid #4b4b4b', boxShadow: '0 10px 20px rgba(0,0,0,0.2)', transition: 'var(--transition)' }}>
                                            <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🍲</div>
                                            <h2 style={{ fontSize: '3.5rem', color: '#ffffff', margin: '10px 0', fontWeight: '800' }}>{impactStats.totalQuantity}</h2>
                                            <p style={{ color: '#b2bec3', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px' }}>Meals Donated</p>
                                        </div>
                                        <div style={{ background: '#2d3436', padding: '30px', borderRadius: '24px', border: '1px solid #4b4b4b', boxShadow: '0 10px 20px rgba(0,0,0,0.2)', transition: 'var(--transition)' }}>
                                            <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🎁</div>
                                            <h2 style={{ fontSize: '3.5rem', color: '#ffffff', margin: '10px 0', fontWeight: '800' }}>{impactStats.totalDonations}</h2>
                                            <p style={{ color: '#b2bec3', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px' }}>Active Donations</p>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '50px' }}>
                                        <p style={{ fontSize: '1.2rem', color: '#636e72', padding: '0 10px' }}>"Small acts, when multiplied by millions of people, can transform the world."</p>
                                    </div>
                                </div>
                            )}

                            {/* Incoming Requests View (Donor) */}
                            {activeTab === 'incoming' && (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                                        <h3>📫 Requests for Your Food</h3>
                                    </div>
                                    {incomingRequests.length > 0 ? (
                                        <div className="table-container">
                                            <table className="styled-table">
                                                <thead>
                                                    <tr>
                                                        <th>Requester</th>
                                                        <th>Item</th>
                                                        <th>Date</th>
                                                        <th>Status</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {incomingRequests.map((req) => (
                                                        <tr key={req._id}>
                                                            <td>{req.user?.name}<br /><small>{req.user?.email}</small></td>
                                                            <td>{req.donation?.food_name || req.food_type}</td>
                                                            <td>{new Date(req.request_date).toLocaleDateString()}</td>
                                                            <td>
                                                                <span className={getStatusBadgeClass(req.status)}>
                                                                    {req.status}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                {req.status === 'Approved' ? (
                                                                    <button
                                                                        onClick={() => setChatData({ requestId: req._id, receiverId: req.user._id })}
                                                                        className="btn-primary"
                                                                        style={{ padding: '5px 10px', fontSize: '0.8rem', border: 'none', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', position: 'relative' }}
                                                                    >
                                                                        <span>Chat</span> 💬
                                                                        {req.unreadCount > 0 && (
                                                                            <span style={{
                                                                                position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white',
                                                                                borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center',
                                                                                justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold'
                                                                            }}>
                                                                                {req.unreadCount}
                                                                            </span>
                                                                        )}
                                                                    </button>
                                                                ) : (
                                                                    <span style={{ color: '#e67e22', fontSize: '0.8rem', fontStyle: 'italic', maxWidth: '150px', display: 'inline-block', lineHeight: '1.2' }}>
                                                                        Wait for Admin Approval to Chat ⏳
                                                                    </span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : <p style={{ fontStyle: 'italic', color: '#888' }}>No requests for your donations yet.</p>}
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>

            {
                chatData && (
                    <ChatBox
                        requestId={chatData.requestId}
                        receiverId={chatData.receiverId}
                        currentUserId={user.id || user._id}
                        onClose={() => {
                            setChatData(null);
                            fetchData();
                        }}
                    />
                )
            }
        </div >
    );
};
export default Dashboard;
