import React from 'react';

const TermsOfService = () => {
    return (
        <div className="main-content container fade-in" style={{ paddingBottom: '4rem', maxWidth: '800px' }}>
            <h1 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', fontWeight: '800' }}>Terms of Service</h1>
            <p style={{ color: '#666', marginBottom: '2rem' }}>Last Updated: {new Date().toLocaleDateString()}</p>

            <section style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--secondary-color)', marginBottom: '1rem' }}>1. Acceptance of Terms</h3>
                <p>By accessing and using <strong>CareNest</strong>, you accept and agree to be bound by the terms and provision of this agreement.</p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--secondary-color)', marginBottom: '1rem' }}>2. Description of Service</h3>
                <p>CareNest is a platform designed to bridge the gap between surplus food and those in need. We provide:</p>
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '10px' }}>
                    <li>A platform for donors to list excess food items.</li>
                    <li>A mechanism for individuals or NGOs to request food.</li>
                    <li>Tools to coordinate the pickup and delivery of donated items.</li>
                </ul>
                <p style={{ marginTop: '10px' }}><strong>Future Enhancements:</strong> We are continuously working to expand our impact. In the coming days, we aim to introduce services for <strong>clothes donation</strong> and other essential supplies.</p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--secondary-color)', marginBottom: '1rem' }}>3. User Responsibilities</h3>
                <p>Users are responsible for:</p>
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '10px' }}>
                    <li>Ensuring the safety and hygiene of donated food.</li>
                    <li>Providing accurate information regarding donations and requests.</li>
                    <li>Respecting the privacy and dignity of all community members.</li>
                </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--secondary-color)', marginBottom: '1rem' }}>4. Limitation of Liability</h3>
                <p>CareNest acts as an intermediary and is not liable for the quality of food donated or any issues arising from the consumption of donated items. Donors and recipients participate at their own risk.</p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: 'var(--secondary-color)', marginBottom: '1rem' }}>5. Modifications</h3>
                <p>We reserve the right to modify these terms at any time. Continued use of the platform after any such changes constitutes your acceptance of the new Terms of Service.</p>
            </section>
        </div>
    );
};

export default TermsOfService;
