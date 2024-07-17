import React, { useState } from "react";
import './Navbar.css'
import navlogo from '../../assets/nav-logo.svg'
import useradmin from '../../assets/useradmin.png'
import {Link} from "react-router-dom"
const Navbar = ()=>{

    const toggleMenu = ()=>{

    }



    return(

        <>
        <div className="navbar">
            <img src={navlogo} alt="" className="nav-logo"/>
            <div className="adminpic" onClick={toggleMenu}>
                <Link to='http://localhost:3000/'><img src={useradmin} alt="" className="nav-profile"/></Link>
            </div>
        </div>
        </>
    )
}

export default Navbar;