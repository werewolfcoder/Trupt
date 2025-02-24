import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { OrgDataContext } from '../context/OrgContext';

const OrgLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { org, setOrg } = useContext(OrgDataContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const OrgData = {
            email: email,
            password: password
        };

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/orgs/loginOrg`, OrgData);

        if (response.status === 200) {
            const data = response.data;
            setOrg(data.org);
            localStorage.setItem('token', data.token);
            navigate('/');
        }

        setEmail('');
        setPassword('');
    }

    return (
        <div>
            <h1>Organization Login</h1>
            <form onSubmit={handleSubmit}>
                <label>Email</label>
                <input
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    type="email"
                    value={email}
                    placeholder="Enter Email"
                />
                <label>Password</label>
                <input
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    type="password"
                    value={password}
                    placeholder="Enter Password"
                />
                <button>Login</button>
            </form>
            <Link to='/org-signup'>Don't have an account? Sign Up</Link>
            <Link to="/login">Login as an Individual</Link>
        </div>
    );
}

export default OrgLogin;