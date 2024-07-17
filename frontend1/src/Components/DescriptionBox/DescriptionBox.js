import React from "react";
import './DescriptionBox.css'

const DescriptionBox = () =>{
    return(
        <div className="descriptionbox">
            <div className="descriptionbox-navigator">
                <div className="descriptionbox-nav-box">Description</div>
                <div className="descriptionbox-nav-box fade">Reviews (122)</div>
            </div>
            <div className="descriptionbox-description">
                <p>Welcome to SHOPZONE, your premier destination for online shopping! Browse our extensive selection of high-quality products, from electronics to fashion, and enjoy seamless transactions, secure payments, and fast delivery. Discover convenience and satisfaction like never before with us. Start exploring our offerings today.</p>
                <p>
                Experience convenience at its finest with our user-friendly interface. Explore a diverse range of products and enjoy secure transactions, swift deliveries, and exceptional customer service at SHOPZONE.
                </p>
            </div>
        </div>
    )
}

export default DescriptionBox;