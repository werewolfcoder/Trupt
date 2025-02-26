import React, {useState,useContext} from 'react';
import { Link,useNavigate} from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';
import axios from 'axios';

const UserLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); 

      const navigate = useNavigate();
      const [user, setUser] = useContext(UserDataContext);


    const handleSubmit = async(e) => {
        e.preventDefault();
        const UserData=({
            email:email,
            password:password});

            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`,UserData);
            if(response.status === 200){
                const data = response.data;
                setUser(data.user);
                localStorage.setItem('token',data.token);
                navigate('/');
            }

        console.log(email, password);
        setEmail('');
        setPassword('');
    }
  return (
    <div>
      <h1>User Login</h1>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input onChange={(e)=>{
            setEmail(e.target.value);

        }} value={email} required type="email" placeholder="Enter Email"/>
        <label>Password</label>
        <input onChange={(e)=>{
            setPassword(e.target.value);
        }} value={password} required type="password" placeholder="Enter Password"/>
        <button>Login</button>
        <p>Don't have an account?</p>
        <Link to='/signup'>Sign Up</Link>
        <p>login as an Organization</p>
        <Link to='/org-login'> Login</Link>
      </form>
    </div>
  );
}

export default UserLogin;