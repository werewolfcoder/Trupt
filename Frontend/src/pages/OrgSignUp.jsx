import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { OrgDataContext } from "../context/OrgContext";

const OrgSignup = () => {
    const [organizationName, setOrganizationName] = useState("");
    const [organizationType, setOrganizationType] = useState("");
    const [address, setAddress] = useState("");
    const [contactPerson, setContactPerson] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { setOrg } = useContext(OrgDataContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const orgData = {
            organizationName,
            organizationType,
            address,
            contactPerson,
            contactNumber,
            email,
            password,
        };

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/orgs/registerOrg`,
                orgData
            );

            if (response.status === 201) {
                const data = response.data;
                setOrg(data.org);
                localStorage.setItem("token", data.token);
                navigate("/");
            }
        } catch (err) {
            setError(err.response ? err.response.data : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 space-y-6">
                <h1 className="text-2xl font-semibold text-center text-emerald-500">
                    Organization Signup
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Organization Name
                        </label>
                        <input
                            type="text"
                            value={organizationName}
                            onChange={(e) => setOrganizationName(e.target.value)}
                            placeholder="Enter organization name"
                            required
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Organization Type
                        </label>
                        <select
                            value={organizationType}
                            onChange={(e) => setOrganizationType(e.target.value)}
                            required
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        >
                            <option value="">Select Type</option>
                            <option value="NGO">NGO</option>
                            <option value="non-profit">Non-Profit</option>
                            <option value="hotel">Hotel</option>
                            <option value="social service">Social Service</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Address</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter address"
                            required
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Contact Person
                        </label>
                        <input
                            type="text"
                            value={contactPerson}
                            onChange={(e) => setContactPerson(e.target.value)}
                            placeholder="Enter contact person name"
                            required
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Contact Number
                        </label>
                        <input
                            type="text"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            placeholder="Enter contact number"
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
                            placeholder="Enter email"
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
                            placeholder="Enter password"
                            required
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition active:scale-95"
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <div className="text-center space-y-2 text-sm text-gray-600">
                    <p>
                        Already have an account?{" "}
                        <Link to="/org-login" className="text-emerald-500 hover:underline">
                            Login
                        </Link>
                    </p>
                    <p>
                        Register as an Individual?{" "}
                        <Link to="/signup" className="text-emerald-500 hover:underline">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrgSignup;