import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="main-content container fade-in" style={{ paddingBottom: '4rem', maxWidth: '800px' }}>
            <h1 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', fontWeight: '800' }}>Privacy Policy</h1>
            <p style={{ color: '#666', marginBottom: '2rem' }}>Last Updated: {new Date().toLocaleDateString()}</p>

            <section style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--secondary-color)', marginBottom: '1rem' }}>1. Introduction</h3>
                <p>Welcome to <strong>CareNest</strong>. We are committed to protecting your privacy and ensuring your personal information is handled in a safe and responsible manner. This policy outlines how we collect, use, and protect your data.</p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--secondary-color)', marginBottom: '1rem' }}>2. Information We Collect</h3>
                <p>We collect information necessary to facilitate food redistribution, including:</p>
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '10px' }}>
                    <li>Name and contact details (email, phone number) for account creation.</li>
                    <li>Location data to match donors with nearby requesters.</li>
                    <li>Donation and request history to improve our services.</li>
                </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--secondary-color)', marginBottom: '1rem' }}>3. How We Use Your Information</h3>
                <p>Your data is used solely for:</p>
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '10px' }}>
                    <li>Connecting food donors with individuals or organizations in need.</li>
                    <li>Verifying the authenticity of requests to prevent misuse.</li>
                    <li>Improving the CareNest platform and user experience.</li>
                    <li>Communicating updates about our services and future enhancements (e.g., clothes donation).</li>
                </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--secondary-color)', marginBottom: '1rem' }}>4. Future Services</h3>
                <p>As CareNest grows, we plan to expand our services to include other forms of aid, such as <strong>clothes donation</strong> and other essential items. Your information may be used to notify you when these new features become available.</p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--secondary-color)', marginBottom: '1rem' }}>5. Contact Us</h3>
                <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:tech@devxign.online" style={{ color: 'var(--primary-color)' }}>tech@devxign.online</a>.</p>
            </section>
        </div>
    );
};

export default PrivacyPolicy;
