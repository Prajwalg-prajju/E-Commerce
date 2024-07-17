import React, { useContext, useState } from "react";
import './ProductDisplay.css'
import star_icon from '../Assets/star_icon.png'
import star_dull_icon from '../Assets/star_dull_icon.png'
import { ShopContext } from "../../Context/ShopContext";

const ProductDisplay = (props)=>{
    const {product} = props;
    const {addToCart} = useContext(ShopContext)

    const [selectedSize,setSelectedSize] = useState("")

    const handleSizeSelect = (size) =>{
        setSelectedSize(size)
    }
    const handleAddToCart = ()=>{
        if(selectedSize !== ''){
            addToCart(product.id, selectedSize)
            // console.log(`Product selected to cart - ID:${product.id}, Size: ${selectedSize}`)
        }else{
            alert("Please select a size before adding to cart")
        }
    }
    
    
    return(
        <div className="productdisplay">
            <div className="productdisplay-left">
                <div className="productdisplay-img-list">
                    <img src={product.image} alt=""/>
                    <img src={product.image} alt=""/>
                    <img src={product.image} alt=""/>
                    <img src={product.image} alt=""/>
                </div>
                <div className="productdisplay-img">
                    <img className="productdisplay-main-img" src={product.image} alt=""/>
                </div>
            </div>
            <div className="productdisplay-right">
                <h1>{product.name}</h1>
                <div className="productdisplay-right-stars">
                    <img src={star_icon} alt=""/>
                    <img src={star_icon} alt=""/>
                    <img src={star_icon} alt=""/>
                    <img src={star_icon} alt=""/>
                    <img src={star_dull_icon} alt=""/>
                    <p>(122)</p>
                </div>
                <div className="productdisplay-right-prices">
                    <div className="productdisplay-right-price-old">${product.old_price}</div>
                    <div className="productdisplay-right-price-new">${product.new_price}</div>
                </div>
                <div className="productdisplay-right-description">
                    In the chilly winter months, this Men's Solid Sports Jacket will keep you warm and fashionable. This jacket, which is made of premium polyester material, is your ideal ally when the brisk winds seem determined to chill you to the bone. Without sacrificing style, it's made to offer outstanding warmth and comfort.
                </div>
                <div className="productdisplay-right-size">
                    <h1>Select Size</h1>
                    <div className="productdisplay-right-size-btn">
                        <button onClick={()=> handleSizeSelect('S')}>S</button>
                        <button onClick={()=> handleSizeSelect('M')}>M</button>
                        <button onClick={()=> handleSizeSelect('L')}>L</button>
                        <button onClick={()=> handleSizeSelect('XL')}>XL</button>
                        <button onClick={()=> handleSizeSelect('XXL')}>XXL</button>
                    </div>
                </div>
                <div className="addtocart-btn">
                <button onClick={handleAddToCart}>ADD TO CART</button></div>
                <p className="productdisplay-right-category"><span>Category :</span>Women , T-Shirt, Crop Top</p>
                <p className="productdisplay-right-category"><span>Tags :</span>Modern , Latest</p>
            </div>
        </div>
    )
}
export default ProductDisplay;
