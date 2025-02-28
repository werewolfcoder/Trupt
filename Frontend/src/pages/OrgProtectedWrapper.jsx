import React,{ useContext,useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { OrgDataContext } from "../context/OrgContext";
import axios from 'axios';
const OrgProtectedWrapper = ({children}) => {
    const [org,setOrg]=useContext(OrgDataContext);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!token) {
      navigate('/login');
    } 
  }, [token]);
  axios.get(`${import.meta.env.VITE_BASE_URL}/orgs/profile`, {
    headers: {
        Authorization: `Bearer ${token}`}
    }).then((response)=>{
        if(response.status === 200){
             setOrg(response.data)
            setIsLoading(false)
        }}).catch((err)=>{
            console.log(err)
            localStorage.removeItem('token')
            navigate('/login');
        })

        
    return (
      <>
      {children}
      </>
        
        
    );
    };

export default OrgProtectedWrapper;