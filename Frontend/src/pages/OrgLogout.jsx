import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const OrgLogout = () => {
    const token = localStorage.getItem('token');
    const navigate= useNavigate();

    axios.get(`${import.meta.env.VITE_BASE_URL}/orgs/logout`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response)=>{
        if(response.status === 200){
            localStorage.removeItem('token');
            navigate('/org-login');
        }
    })
    return(
        <div>org logged out</div>
    )
}

export default OrgLogout;