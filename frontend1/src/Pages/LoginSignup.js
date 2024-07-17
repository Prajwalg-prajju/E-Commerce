import React, { useState } from "react";
import './CSS/LoginSignup.css'
import proflie1 from '../Components/Assets/profile1.png'


const LoginSignup=()=>{

    const [image,setImage] = useState(false);
    const [state,setState] = useState("Login");
    const [formData,setFormData] = useState({
        username:"",
        password:"",
        email:"",
        image:"",
    })


    const changeHandler =(e)=>{
        setFormData({...formData,[e.target.name]:e.target.value})
    }

  
    const handleUploadPic = (e) =>{
        setImage(e.target.files[0]);
    }

    const login = async () =>{
        console.log("Login Function Executed",formData)
        let responseData;
        await fetch("http://localhost:4000/login",{
            method:'POST',
            headers:{
                Accept:'application/form-data',
                'Content-Type':'application/json',
            },
            body:JSON.stringify(formData),
        }).then((respnse)=>respnse.json()).then((data)=>responseData=data)
        if(responseData.success){
            localStorage.setItem('auth-token',responseData.token);
            window.location.replace("/");

        }
        else{
            alert(responseData.errors)
        }
    }

    const signup = async () =>{
        console.log("Signup Function Executed",formData)
        let responseData;

        let profile = formData;

        let profileData = new FormData();
        profileData.append('profile',image);

        await fetch('http://localhost:4000/upload/profile',{
            method:'POST',
            headers:{
                Accept:'application/json',
            },
            body:profileData,
        }).then((resp)=>resp.json()).then((data)=>{responseData=data});
        
        if(responseData.success){
            profile.image = responseData.image_url;
            console.log(profile);
            
            localStorage.setItem('userProfileImage',responseData.image_url);

            await fetch("http://localhost:4000/signup",{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(formData),
            }).then((respnse)=>respnse.json()).then((data)=>responseData=data)
            if(responseData.success){
                localStorage.setItem('auth-token',responseData.token);
                window.location.replace("/");
            }
            else{
                alert(responseData.errors)
            }
        }
    }   

    return(
        
        <div className="loginsignup">
            <div className="loginsignup-container">
                <div className="login-signup-profile">
                    <label htmlFor="file-input">
                        {/* <img src={formData.profilePic ? URL.createObjectURL(formData.profilePic):proflie1} alt=""/> */}
                        <img src={image?URL.createObjectURL(image):proflie1} alt=""/>
                    </label>
                            <div className="upload">
                                Upload Pic
                            </div>
                            <input type="file" name="image" id="file-input" onChange={handleUploadPic} hidden/>
                </div>
                <h1>{state}</h1>
                <div className="loginsignup-fields">
                    {state==="Sign Up"?<input name="username" type="text" placeholder="Your Name" value={formData.username} onChange={changeHandler}/>:<></>}
                    <input name="email" value={formData.email} onChange={changeHandler} type="email" placeholder="Email Id"/>
                    <input name="password" value={formData.password} onChange={changeHandler} type="password" placeholder="Password"/>
                </div>
                <button onClick={()=>{state==="Login"?login():signup()}}>Continue</button>
                {state==="Sign Up"?<p className="loginsignup-login">Already have an account? <span onClick={()=>setState("Login")}>Login here</span></p>:<p className="loginsignup-login">Create an account? <span onClick={()=>setState("Sign Up")}>Click here</span></p>}
                <div className="loginsignup-agree">
                    <input type="checkbox" name='' id=''/>
                    <p>By Continuing, i agree to the terms of use & privacy policy.</p>
                </div>
            </div>
        </div>
    )
}

export default LoginSignup