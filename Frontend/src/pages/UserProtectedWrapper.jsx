import React,{use, useContext, useEffect} from "react";
import { Navigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
const UserProtectedWrapper = ({children}) => {
    const [user,setUser]=useContext(UserDataContext);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!token) {
      navigate('/login');
    } 
  }, [token]);
  axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
    headers: {
        Authorization: `Bearer ${token}`}
    }).then((response)=>{
        if(response.status === 200){
             setUser(response.data.user)
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

export default UserProtectedWrapper;