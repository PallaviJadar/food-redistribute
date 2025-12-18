import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import API_BASE_URL from '../utils/api';


const ChatBox = ({ requestId, receiverId, currentUserId, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);
    const [loading, setLoading] = useState(true);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/messages/${requestId}`, {
                headers: { 'x-auth-token': token }
            });
            setMessages(res.data);
            setLoading(false);
            scrollToBottom();
        } catch (err) {
            console.error('Error fetching messages:', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        // Poll for new messages every 2 seconds
        const interval = setInterval(fetchMessages, 2000);

        // Mark messages as read
        const markAsRead = async () => {
            try {
                const token = localStorage.getItem('token');
                await axios.put(`http://localhost:5000/api/messages/${requestId}/read`, {}, {
                    headers: { 'x-auth-token': token }
                });
            } catch (err) {
                console.error('Error marking messages as read:', err);
            }
        };
        markAsRead();

        return () => clearInterval(interval);
    }, [requestId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            console.log("Sending message...", { receiverId, requestId, newMessage });
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_BASE_URL}/api/messages`, {
                receiverId,
                requestId,
                content: newMessage
            }, {
                headers: { 'x-auth-token': token }
            });

            console.log("Message sent success:", res.data);
            setMessages([...messages, res.data]);
            setNewMessage('');
        } catch (err) {
            console.error('Error sending message:', err.response?.data || err.message);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '350px',
            height: '450px',
            background: 'white',
            borderRadius: '15px',
            boxShadow: '0 5px 25px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 9999,
            overflow: 'hidden',
            border: '1px solid #eee'
        }}>
            {/* Header */}
            <div style={{
                padding: '15px',
                background: 'var(--primary-color)',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h4 style={{ margin: 0, fontSize: '1rem' }}>Chat</h4>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}>×</button>
            </div>

            {/* Messages Area */}
            <div style={{
                flex: 1,
                padding: '15px',
                overflowY: 'auto',
                background: '#f9f9f9',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}>
                {loading ? (
                    <p style={{ textAlign: 'center', color: '#888' }}>Loading...</p>
                ) : messages.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#ccc', fontStyle: 'italic', marginTop: '50px' }}>Start the conversation...</p>
                ) : (
                    messages.map((msg, index) => {
                        // Robust check for "isMe"
                        const senderId = typeof msg.sender === 'object' ? msg.sender._id : msg.sender;
                        const isMe = senderId === currentUserId || senderId?.toString() === currentUserId;

                        return (
                            <div key={index} style={{
                                alignSelf: isMe ? 'flex-end' : 'flex-start',
                                maxWidth: '80%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: isMe ? 'flex-end' : 'flex-start'
                            }}>
                                <div style={{
                                    padding: '10px 14px',
                                    borderRadius: isMe ? '18px 18px 0 18px' : '18px 18px 18px 0',
                                    background: isMe ? '#dcf8c6' : '#ffffff', // WhatsApp-like colors
                                    color: '#000000',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                    fontSize: '0.95rem',
                                    lineHeight: '1.4',
                                    border: isMe ? 'none' : '1px solid #f0f0f0'
                                }}>
                                    {msg.content}
                                </div>
                                <span style={{
                                    fontSize: '0.7rem',
                                    color: '#b2bec3',
                                    marginTop: '4px',
                                    marginLeft: '5px',
                                    marginRight: '5px'
                                }}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} style={{
                padding: '10px',
                borderTop: '1px solid #eee',
                display: 'flex',
                gap: '10px',
                background: 'white'
            }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '20px',
                        border: '1px solid #ddd',
                        outline: 'none',
                        fontSize: '0.9rem'
                    }}
                />
                <button type="submit" style={{
                    background: 'var(--primary-color)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    ➤
                </button>
            </form>
        </div>
    );
};

export default ChatBox;
