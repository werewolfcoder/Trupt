import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { OrgDataContext } from '../context/OrgContext';
import axios from 'axios';
const OrgLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();
  const contextValue = useContext(OrgDataContext);

  const handleSubmit = async(e) => {
    e.preventDefault();
    const OrgData = {
      email: email,
      password: password
    };

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/orgs/login`, OrgData);
      
    if(response.status === 200){
      const data = response.data;
      contextValue.setOrg(data.org);
      localStorage.setItem('token', data.token);
      navigate('/');
    }
    
    console.log(OrgData)
    setEmail('');
    setPassword('');
  }
  
  return (
    <div>
        <h1>Organization Login</h1>
        <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input onChange={(e)=>{
              setEmail(e.target.value);
            }} required type="email" value={email} placeholder="Enter Email"/>
            <label>Password</label>
            <input onChange={(e)=>{
              setPassword(e.target.value);
            }} required type="password" value={password} placeholder="Enter Password"/>
            <button>Login</button>
        </form>
        <Link to='/org-signup'>Don't have an account? Sign Up</Link>
        <Link to="/login">Login as an Individual</Link>
    </div>
  );
}

export default OrgLogin;