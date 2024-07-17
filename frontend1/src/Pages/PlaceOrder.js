import React, { useContext, useState } from "react";
import "./CSS/PlaceOrder.css"
import { ShopContext } from "../Context/ShopContext";

const PlaceOrder = ()=>{

    const {getTotalCartAmount } = useContext(ShopContext);

    const [data,setData] = useState({
        firstName:"",
        lastName:"",
        email:"",
        street:"",
        city:"",
        state:"",
        zipcode:"",
        country:"",
        phone:""
    })
    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };


    const placeOrder = async (e) => {
        e.preventDefault();
        const amount = getTotalCartAmount() * 100;
        const currency = "INR";
        const receiptId = "qwsaq1";
    
          const response = await fetch("http://localhost:4000/order", {
            method: "POST",
            body: JSON.stringify({
              amount : getTotalCartAmount() * 100,
              currency,
              receipt: receiptId,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          const order = await response.json();
          console.log(order);
        
    
      
          var options = {
            key: "rzp_test_Q4TJyVg6EOv3ct",
            amount,
            currency,
            name: "ShopZone", 
            description: "Test Transaction",
            order_id: order.id,
            handler: async function (response) {
              const body = {
                ...response,
              };
      
              const validateRes = await fetch(
                "http://localhost:4000/order/validate",
                {
                  method: "POST",
                  body: JSON.stringify(body),
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
              const jsonRes = await validateRes.json();
              console.log(jsonRes);
            },
            prefill: {
              name: "",
              email: data.email,
              contact: data.phone,
            },
            notes: {
              address: data.address,
            },
          };
          var rzp1 = new window.Razorpay(options);
          rzp1.on("payment.failed", function (response) {
            alert(response.error.code);
            alert(response.error.description);
            alert(response.error.source);
            alert(response.error.step);
            alert(response.error.reason);
            alert(response.error.metadata.order_id);
            alert(response.error.metadata.payment_id);
          });
          rzp1.open();
          e.preventDefault();
        };

      
      

    return (
        <form className="place-order">
            <div className="place-order-left">
                <p className="title">Delivery Information</p>
                <div className="multi-fields">
                    <input required name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder="First name"/>
                    <input required name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder="Last name"/>
                </div>
                <input required name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Email address"/>
                <input required name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder="Street"/>
                <div className="multi-fields">
                    <input required name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder="City"/>
                    <input required name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder="State"/>
                </div>
                <div className="multi-fields">
                    <input required name="zipcode" onChange={onChangeHandler} value={data.zipcode} type="text" placeholder="Zip code"/>
                    <input required name="country" onChange={onChangeHandler} value={data.country} type="text" placeholder="Country"/>
                </div>
                <input required name="phone" onChange={onChangeHandler} value={data.phone} type="text" placeholder="Phone"/>
            </div>
            <div className="place-order-right">
            <div className="cartitems-total">
                    <h1>Cart Totals</h1>
                    <div>
                        <div className="cartitems-total-item">
                            <p>Subtotal</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>
                        <hr/>
                        <div className="cartitems-total-item">
                            <p>Shipping Fee</p>
                            <p>Free</p>
                        </div>
                        <hr/>
                        <div className="cartitems-total-item">
                            <h3>Total</h3>
                            <h3>${getTotalCartAmount()}</h3>
                        </div>
                    </div>
                    <button onClick={placeOrder}>PROCEED TO PAYMENT</button>
                </div>
            </div>
        </form>
    )
}

export default PlaceOrder;