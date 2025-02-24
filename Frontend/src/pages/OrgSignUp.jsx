import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { OrgDataContext } from '../context/OrgContext';

const OrgSignup = () => {
    const [organizationName, setOrganizationName] = useState('');
    const [organizationType, setOrganizationType] = useState('');
    const [address, setAddress] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const { org, setOrg } = useContext(OrgDataContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const orgData = {
            organizationName,
            organizationType,
            address,
            contactPerson,
            contactNumber,
            email,
            password
        };

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/orgs/registerOrg`, orgData);

            if (response.status === 201) {
                const data = response.data;
                setOrg(data.org);
                localStorage.setItem('token', data.token);
                navigate('/');
            }
        } catch (err) {
            setError(err.response ? err.response.data : 'An error occurred');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Organization Name:</label>
                <input
                    type="text"
                    name="organizationName"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Organization Type:</label>
                <select
                    name="organizationType"
                    value={organizationType}
                    onChange={(e) => setOrganizationType(e.target.value)}
                    required
                >
                    <option value="">Select Type</option>
                    <option value="NGO">NGO</option>
                    <option value="non-profit">Non-Profit</option>
                    <option value="hotel">Hotel</option>
                    <option value="social service">Social Service</option>
                </select>
            </div>
            <div>
                <label>Address:</label>
                <input
                    type="text"
                    name="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Contact Person:</label>
                <input
                    type="text"
                    name="contactPerson"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Contact Number:</label>
                <input
                    type="text"
                    name="contactNumber"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Password:</label>
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">Register</button>
            <Link to="/org-login">Already have an account? Login</Link>
            <Link to="/signup">Register as an Individual</Link>
        </form>
    );
};

export default OrgSignup;