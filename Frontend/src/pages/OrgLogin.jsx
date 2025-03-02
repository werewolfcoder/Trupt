import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { OrgDataContext } from "../context/OrgContext";
import { Eye, EyeOff } from "lucide-react";

const OrgLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { org, setOrg } = useContext(OrgDataContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/orgs/loginOrg`,
                { email, password }
            );

            if (response.status === 200) {
                const data = response.data;
                setOrg(data.org);
                localStorage.setItem("token", data.token);
                navigate("/");
            }
        } catch (error) {
            console.error("Login failed:", error);
            alert("Invalid email or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 space-y-6">
                <h1 className="text-2xl font-semibold text-center text-emerald-500">
                    Organization Login
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition active:scale-95"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="text-center space-y-2 text-sm text-gray-600">
                    <p>
                        Don't have an account?{" "}
                        <Link to="/org-signup" className="text-emerald-500 hover:underline">
                            Sign Up
                        </Link>
                    </p>
                    <p>
                        Login as an Individual?{" "}
                        <Link to="/login" className="text-emerald-500 hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrgLogin;