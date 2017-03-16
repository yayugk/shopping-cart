var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var Wishlist = require('../models/wishlist');
const xss = require("xss");
var Product = require('../models/product');
var Order = require('../models/order');

/* GET home page. */
router.get('/', function (req, res, next) {
    var successMsg = req.flash('success')[0];
    Product.find(function (err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/index', { title: 'Shopping Cart', products: productChunks, successMsg: successMsg, noMessages: !successMsg });
    });
});

router.get('/add-to-cart/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function (err, product) {
        if (err) {
            return res.redirect('/');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/');
    });
});

router.get('/add-to-wishlist/:id', function (req, res, next) {
    var productId = req.params.id;
    var wishlist = new Wishlist(req.session.wishlist ? req.session.wishlist : {});

    Product.findById(productId, function (err, product) {
        if (err) {
            return res.redirect('/');
        }
        wishlist.add(product, product.id);
        req.session.wishlist = wishlist;
        console.log(req.session.wishlist);
        res.redirect('/');
    });
});

router.get('/reduce/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/remove/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/reduce-wishlist/:id', function (req, res, next) {
    var productId = req.params.id;
    var wishlist = new Wishlist(req.session.wishlist ? req.session.wishlist : {});

    wishlist.reduceByOne(productId);
    req.session.wishlist = wishlist;
    res.redirect('/wishlist');
});

router.get('/add-to-cart-from-list/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    var wishlist = new Wishlist(req.session.wishlist ? req.session.wishlist : {});
    Product.findById(productId, function (err, product) {
        if (err) {
            return res.redirect('/');
        }
        var count = wishlist.items[productId].qty;
        while (count > 0) {
            cart.add(product, product.id);
            req.session.cart = cart;
            count--;
        }
        wishlist.removeItem(productId);
        req.session.wishlist = wishlist;
        console.log(req.session.cart);
        res.redirect('/wishlist');
    });
});

router.get('/remove-wishlist/:id', function (req, res, next) {
    var productId = req.params.id;
    var wishlist = new Wishlist(req.session.wishlist ? req.session.wishlist : {});

    wishlist.removeItem(productId);
    req.session.wishlist = wishlist;
    res.redirect('/wishlist');
});

router.get('/wishlist', function (req, res, next) {
    if (!req.session.wishlist) {
        return res.render('shop/wishlist', { wishlists: null });
    }
    var wishlist = new Wishlist(req.session.wishlist);
    res.render('shop/wishlist', { wishlists: wishlist.generateArray(), totalPrice: wishlist.totalPrice });
});

router.get('/shopping-cart', function (req, res, next) {
    if (!req.session.cart) {
        return res.render('shop/shopping-cart', { products: null });
    }
    var cart = new Cart(req.session.cart);
    res.render('shop/shopping-cart', { products: cart.generateArray(), totalPrice: cart.totalPrice });
});

router.get('/checkout', isLoggedIn, function (req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('shop/checkout', { total: cart.totalPrice, errMsg: errMsg, noError: !errMsg });
});
router.get('/search', (req, res) => {
    //var keyword=xss(req.query.search);
    Product.find({ $or: [{ title: new RegExp(req.query.search, 'i') }, { label: new RegExp(req.query.search, 'i') }] }).then((prodList) => {
        if (prodList.length > 0) {
            res.render("product/prodByLabel", { products: prodList });
        }
        else {
            //res.send("no product");
            res.render('error', { message: "No product found", error: null });
        }
    })
})

router.post('/checkout', isLoggedIn, function (req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);

    var stripe = require("stripe")(
        "sk_test_iBtrcWI7II5dIpN770IUmvgM"
    );

    stripe.charges.create({
        amount: cart.totalPrice * 100,
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Test Charge"
    }, function (err, charge) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }
        var order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            paymentId: charge.id
        });
        order.save(function (err, result) {
            req.flash('success', 'Successfully bought product!');
            req.session.cart = null;
            res.redirect('/');
        });
    });
});


module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};