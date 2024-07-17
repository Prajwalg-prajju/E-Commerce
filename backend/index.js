const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer =  require("multer");
const path = require("path");
const cors = require("cors");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { type } = require("os");
const Razorpay = require('razorpay');
require('dotenv').config();
const crypto = require("crypto");

app.use(express.json());
app.use(cors());

// Database Connection With MongoDB

mongoose.connect("mongodb+srv://prajwalg12:93536218@cluster0.gtqqysy.mongodb.net/shopzone")

// API Creation

app.get("/",(req,res)=>{
    res.send("Express App is Running")
})

// Image Storage Engine

const storage = multer.diskStorage({
    destination: './upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

// Creating Upload Endpoint for images
app.use('/images',express.static('upload/images'))

app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

// Schema for Creating Products 

const Product = mongoose.model("Product",{
    id:{
        type: Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true,
    },
})

app.post('/addproduct',async(req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }else{
        id=1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success:true,
        name:req.body.name,
    })
})

// Creating APi For deleting Products

app.post('/removeproduct',async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Reomved");
    res.json({
        success:true,
        name:req.body.name
    })
})

// Creating API for getting all products

app.get('/allproducts',async(req,res)=>{
    let products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
})

// Schema Creating for User Model

const Users = mongoose.model('Users',{
    image:{
        type:String,
    },
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})


app.post('/admin',async(req,res)=>{

})

// Creating Endpoint for registering User
app.post('/signup', async (req,res)=>{
    let check = await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,errors:"existing user found with same email address"})
    }
    let cart = {};
    for(let i = 0;i<300;i++){
        cart[i]=0;
    }
    // Hash the Password
    bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
        if (err) {
            return res.status(500).json({ success: false, errors: "Password hashing failed" });
        }

    const user = new Users({
        image:req.body.image,
        name:req.body.username,
        email:req.body.email,
        password:hash,
        cartData:cart,
    })
    
    await user.save();

    const data = {
        user:{
            id:user.id
        }
    }

    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true,token})
})
})

// Creating Endpoint for User Login
app.post('/login', async (req, res) => {
    let user = await Users.findOne({ email: req.body.email });
    if (!user) {
        return res.json({ success: false, errors: "Wrong Email Id" });
    }
    bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err || !result) {
            return res.json({ success: false, errors: "Wrong Password" });
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const token = jwt.sign(data, 'secret_ecom');
        res.json({ success: true, token });
    });
});



// Creating Endpoint for new Collection data
app.get('/newcollection',async (req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("NewCollection Fetched");
    res.send(newcollection);
})

// creating endpoint for popular in women section
app.get('/popularinwomen',async(req,res)=>{
    let products = await Product.find({category:"women"});
    let popular_in_women = products.slice(0,4);
    console.log("Popular in women Fetched");
    res.send(popular_in_women);
})

// creating middelware to fetch user

const fetchUser = async (req,res,next)=>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({errors:"Please authenticate using valid token"});
    }else{
        try{
            const data = jwt.verify(token,'secret_ecom');
            req.user = data.user;
            next();
        }catch(error){
            res.status(401).send({errors:"Please authenticate using a valid token"})
        }
    }
}


// Creating endpoint For adding Products in Cartdata
app.post('/addtocart',fetchUser,async (req,res)=>{
    console.log("added",req.body.itemId)
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] +=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.json({ message: "Added" });
})

// creating endpoint to remove product from cartdata
app.post('/removefromcart',fetchUser,async(req,res)=>{
    console.log("removed",req.body.itemId)
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.json({ message: "Removed" });
})

//creating endpoint to get data
app.post('/getcart',fetchUser,async(req,res)=>{
    console.log("GetCart");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})


//-----------------------------------------

app.use('/images',express.static('upload/images'))

app.post("/upload/profile",upload.single('profile'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

// schema for order
const orderSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
    phone: String,
    amount: Number,
});

const Order = mongoose.model('Order', orderSchema);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.post("/order", async (req, res) => {
    try {
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_key_SECRET,
      });
  
      const options = req.body;
      const order = await razorpay.orders.create(options);
  
      if (!order) {
        return res.status(500).send("Error");
      }
  
      res.json(order);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error");
    }
  });
  
  app.post("/order/validate", async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
  
    const sha = crypto.createHmac("sha256", process.env.RAZORPAY_key_SECRET);
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sha.digest("hex");
    if (digest !== razorpay_signature) {
      return res.status(400).json({ msg: "Transaction is not legit!" });
    }
  
    res.json({
      msg: "success",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  });



app.listen(port,(error)=>{
    if(!error){
        console.log("Server Running on Port "+port)
    }else{
        console.log("Error :"+error)
    }
})