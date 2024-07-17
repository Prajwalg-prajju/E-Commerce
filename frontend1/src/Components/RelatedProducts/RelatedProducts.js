import React from "react";
import './RelatedProducts.css'
import Item from "../Item/Item";
import all_related_products from "../Assets/all_related_products";

const RelatedProducts = () =>{
    return(
        <div className="relatedproducts">
            <h1>Related Products</h1>
            <hr/>
            <div className="relatedproducts-item">
                {all_related_products.map((item,i)=>{
                    return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
                })}
            </div>
        </div>
    )
}

export default RelatedProducts;