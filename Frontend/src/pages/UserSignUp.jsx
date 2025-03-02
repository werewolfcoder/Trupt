import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';

const UserSignUp = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const [user, setUser] = useContext(UserDataContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const newUser = {
            fullname: {
                firstname: firstName,
                lastname: lastName,
            },
            email,
            password
        };

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser);
            if (response.status === 201) {
                const { user: userData, token } = response.data;
                setUser(userData);
                localStorage.setItem('token', token);
                navigate('/login');
            }
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 space-y-6">
                <h1 className="text-2xl font-semibold text-center text-emerald-500">User Sign Up</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">First Name</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Enter First Name"
                            required
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Last Name</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Enter Last Name"
                            required
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Email"
                            required
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Password"
                            required
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition active:scale-95"
                    >
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>

                <div className="text-center space-y-2 text-sm text-gray-600">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login" className="text-emerald-500 hover:underline">Login</Link>
                    </p>
                    <p>
                        Register as an Organization?{' '}
                        <Link to="/org-signup" className="text-emerald-500 hover:underline">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserSignUp;