
const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const passport = require('passport');

const Order = require('../models/order');
const Cart = require('../models/cart');
var Prod = require('../models/product');
const xss = require("xss");
//const uuid = require('node-uuid');
var errorMessage = [];


var csrfProtection = csrf();
//router.use(csrfProtection);
//router.post('/add/product',(req,res)=>{
//    let title=xss(req.body.title);
//    let image=xss(req.body.image);
//    let label=xss(req.body.label);
//    let description=xss(req.body.description);
//    let price=xss(req.body.price);
//    let newProduct=new Prod({
//        imagePath: image,
//        title: title,
//        label:label,
//        description: description,
//        price: parseFloat(price),
//        
//    });
//    console.log("aaaaa");
//    console.log(newProduct.id);
//    let url="/product/"+newProduct.id;
//    console.log(newProduct);
//    newProduct.save(function(err, result) {
//        //req.flash('success', 'Successfully post product!');
//        //res.redirect(url);
//        
//        res.send({redirect:url});
//    });
//
//    //
//})

router.post('/post', (req, res) => {

    let title = req.body.titleInput;
    let image = req.body.imageInput;
    let label = req.body.labelInput;
    let description = req.body.descriptionInput;
    let price = req.body.priceInput;
    if (image == "") errorMessage = "Need image";
    console.log(errorMessage);
    if (!title) errorMessage = "Need title";
    if (image != "" && title != "") {
        let Product = new Prod({
            imagePath: image,
            title: title,
            label: label,
            description: description,
            price: parseFloat(price),
        });
        console.log(Product);
        Product.save(function (err, result) {
            //console.log(Product);
            let url = "/product/" + Product._id;
            res.redirect(url);
        });
    } else {
        res.redirect('post');
    }

});

router.get('/post', (req, res) => {
    res.render('product/uploadProduct', { errorMessage: errorMessage });
});

//router.post('postproduct',(req,res)=>{
//    
//    
//})


router.get('/:id', (req, res) => {
    Prod.findOne({ _id: req.params.id }).then((prodFound) => {
        if (!prodFound) res.send("NO PRODUCT FOUND");
        else res.render('product/single', { product: prodFound });
    });
});
router.get('/label/:id', (req, res) => {
    Prod.find({ label: req.params.id }).then((prodList) => {
        //res.json(prodList);
        res.render('product/prodByLabel', { products: prodList });
    })
});



module.exports = router;