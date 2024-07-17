import React, { useContext, useEffect, useRef,useState } from "react";
import './Navbar.css'

import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import { Link } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import nav_dropdown from '../Assets/nav_dropdown.png';
import search_icon from '../Assets/search_icon.png';
import userpic from '../Assets/userpic.png';


const Navbar=()=>{
    const [menu,setMenu] = useState("shop")
    const {getTotalCartItems} = useContext(ShopContext)
    const menuRef = useRef()

    const dropdown_toggle = (e) =>{
        menuRef.current.classList.toggle('nav-menu-visible');
        e.target.classList.toggle('open');
    }
    
    const [searchQuery,setSearchQuery] = useState("")
    const handleSearch = () =>{
        if(searchQuery.toLowerCase() === "men"){
            window.location.href='/mens';
        }else if(searchQuery.toLowerCase() === "women"){
            window.location.href='/womens';
        }else if(searchQuery.toLowerCase() === "kid"){
            window.location.href='/kids';
        }else{
            console.log("Search is not Recognized")
        }
    }

    const [userProfileImage,setUserProfileImage] = useState(null);

    useEffect(()=>{
        const storedUserPic = localStorage.getItem('userProfileImage');
        if (storedUserPic){
            setUserProfileImage(storedUserPic);
        }
    },[]);
    
        const [menuVisible,setMenuVisible] = useState(false);

        const toggleMenu = () =>{
            setMenuVisible(!menuVisible);
        }

      

    return(
        <div className="navbar">
            <div className="nav-logo">
                <Link to="/"><img src={logo} alt=""/></Link>
                <p>SHOPZONE</p>
            </div>
            <img className="nav-dropdown" onClick={dropdown_toggle} src={nav_dropdown} alt=""/>
            <ul ref={menuRef} className="nav-menu">
                <li onClick={()=>{setMenu("shop")}}><Link style={{textDecoration:'none'}} to='/'>Shop</Link>{menu==="shop"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu("mens")}}><Link style={{textDecoration:'none'}} to='/mens'>Men</Link>{menu==="mens"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu("womens")}}><Link style={{textDecoration:'none'}} to='womens'>Women</Link>{menu==="womens"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu("kids")}}><Link style={{textDecoration:'none'}} to='kids'>Kids</Link>{menu==="kids"?<hr/>:<></>}</li>
            </ul> 

                <div className="nav-searchbox">
                    <input id='searchInput'type="text" placeholder="Search here..." value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}/>
                    <button className="nav-searchbox-btn" onClick={handleSearch}><img src={search_icon} alt=""/></button>
                </div>
                <div className="nav-userpic" onClick={toggleMenu}>
                    {localStorage.getItem('auth-token') ? (
                        userProfileImage ? (
                            <img src={userProfileImage} alt=""/>
                        ) : (
                            <img src={userpic} alt=""/>
                            )
                        ) : (
                            <img src={userpic} alt=""/>
                        )}

                        {menuVisible && (
                            <div className="menu_user">
                                <li onClick={()=>{setMenu("admin")}}><Link style={{textDecoration:'none'}} to='http://localhost:5173/'>Admin</Link>{menu==="admin"?<hr/>:<></>}</li>
                            </div>
                        )}

                </div>
            
            <div className="nav-login-cart">
                {localStorage.getItem('auth-token')
                ?<button onClick={()=>{localStorage.removeItem('auth-token');window.location.replace('/')}}>Logout</button>
                :<Link to='/login'><button>Login</button></Link>}
                <Link to='/cart'><img src={cart_icon} alt=""/></Link>
                <div className="nav-cart-count">{getTotalCartItems()}</div>
            </div>
            
        </div>
    )
}
export default Navbar