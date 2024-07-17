import React from "react";
import './Hero.css'
import hand_icon from '../Assets/hand_icon.png'
import arrow_icon from '../Assets/arrow.png'
import hero_image from '../Assets/hero_image.png'
import { Link } from "react-router-dom";

function Hero(){
    return (
        <div className="hero">
            <div className="hero-left">
                <h2>NEW ARRIVALS ONLY</h2>
                <div>
                    <div className="hand-hand-icon">
                        <p>new</p>
                        <img src={hand_icon} alt=''/>
                    </div>
                    <p>collections</p>
                    <p>for everyone</p>
                </div>
                <div className="hero-latest-btn">
                    <div><Link style={{textDecoration:'none'}} to='/mens' >Latest collection</Link></div>
                    <img src={arrow_icon} alt=''/>
                </div>
            </div>

            <div className="hero-right">
                <img src={hero_image} alt=""/>

            </div>
        </div>
    )
}

export default Hero