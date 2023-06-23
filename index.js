const express = require("express") ;
const path = require("path") ;
const bodyParser = require("body-parser")
const mongoose = require("mongoose") ;

const connectionStirng = "mongodb://127.0.0.1:27017/ead"; 

mongoose.connect(connectionStirng).then(()=>{
    console.log("connected with db");
}).catch(err =>{
    console.log(err); 
}); 


const Product = require("./models/Products");

const app = express() ;
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true})) ;

// app.use(express.json());
// app.use(express.urlencoded) ;
app.set('view engine', 'ejs') ;




app.get('/', (req, res)=>{
    res.render("home", {name: "iqbal"}) ;
})

app.get('/about', (req, res)=>{
   res.render("about") ;
})

app.get('/products', async(req, res)=>{
    const products = await Product.find(); 
   res.render("products", {products}) ;
})
app.get('/product/new', (req, res)=>{
   res.render("newProducts") ;
})


const productMiddleware = (req, res, next) =>{
    const {name, price, qty, manufacturer} = req.body ;
    if(!name || !price || !qty || !manufacturer) return res.redirect('/product/new') ;
    next() ;
}

app.post('/product/save',productMiddleware ,(req, res)=>{
    const newProduct = new Product(req.body); 
    newProduct.save().then(item =>{
        res.redirect('/products');
    }).catch(err=>{
        res.redirect("/product/new");
    })
})
app.get('/product/:pid', async(req, res)=>{
    const product = await Product.findById(req?.params?.pid); 
    res.render("product-details", {product}) ;
 })

app.post('/api', (req, res)=>{
    res.json(req.body) ;
})

app.use('*', (req, res)=>{
    res.render("notFound");
})



app.listen(3000, ()=>{
    console.log("server starts listing on port 3000"); 
})