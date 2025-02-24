import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';

const UserSignUp = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');
    const [userData, setUserData] = useState({});
const [userType, setUserType] = useState('donor'); // Add state for user type

    const navigate = useNavigate();
    const [user, setUser] = useContext(UserDataContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = {
            fullname: {
                firstname: firstName,
                lastname: lastName
            },
            email: email,
            password: password,
            userType: userType // Include user type in the new user object
        };

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser);
       if (response.status === 201) {
        const data = response.data;

        setUser(data.user)
        localStorage.setItem('token', data.token);
        navigate('/login');
       }
              
        console.log(userData);
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
    };

    return (
        <div>
            <h1>User Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <label>First Name</label>
                <input
                    onChange={(e) => {
                        setFirstName(e.target.value);
                    }}
                    required
                    type="text"
                    value={firstName}
                    placeholder="Enter First Name"
                />
                <label>Last Name</label>
                <input
                    onChange={(e) => {
                        setLastName(e.target.value);
                    }}
                    required
                    type="text"
                    value={lastName}
                    placeholder="Enter Last Name"
                />
                <label>Email</label>
                <input
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                    required
                    type="email"
                    value={email}
                    placeholder="Enter Email"
                />
                <label>Password</label>
                <input
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                    required
                    type="password"
                    value={password}
                    placeholder="Enter Password"
                />
<label>User Type</label>
                <div>
                    <input
                        type="radio"
                        id="donor"
                        name="userType"
                        value="donor"
                        checked={userType === 'donor'}
                        onChange={(e) => setUserType(e.target.value)}
                    />
                    <label htmlFor="donor">Donor</label>
                    <input
                        type="radio"
                        id="volunteer"
                        name="userType"
                        value="volunteer"
                        checked={userType === 'volunteer'}
                        onChange={(e) => setUserType(e.target.value)}
                    />
                    <label htmlFor="volunteer">Volunteer</label>
                </div>
                <button type="submit">Sign Up</button>
            </form>
            <Link to="/login">Already have an account? Login</Link>
            <Link to="/org-signup">Register as an organization</Link>
        </div>
    );
};

export default UserSignUp;