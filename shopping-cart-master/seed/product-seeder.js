var Product = require('../models/product');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('localhost: 27017/shopping');

var products = [
    new Product({
        imagePath: 'http://vignette2.wikia.nocookie.net/narutopediasr/images/d/de/250px-Akatsuki0000.jpeg/revision/latest?cb=20150208145716',
        title: 'I am legend',
        label:'movie',
        description: 'Years after a plague kills most of humanity and transforms the rest into monsters, the sole survivor in New York City struggles valiantly to find a cure.',
        price: 10
    }),
    new Product({
        imagePath: 'http://vignette3.wikia.nocookie.net/le-miiverse-resource/images/f/fa/250px-Death_the_Kid.jpeg/revision/latest?cb=20140816032858',
        title: 'Once Upon A Time In America',
        label:'movie',
        description: 'A former Prohibition-era Jewish gangster returns to the Lower East Side of Manhattan over thirty years later, where he once again must confront the ghosts and regrets of his old life.',
        price: 20
    }),
    new Product({
        imagePath: 'http://vignette4.wikia.nocookie.net/dragonball/images/7/7f/250px-Vegito-2.jpg.jpeg/revision/latest?cb=20111122004608',
        title: 'Inception',
        label:'movie',
        description: 'A thief, who steals corporate secrets through use of dream-sharing technology, is given the inverse task of planting an idea into the mind of a CEO.',
        price: 15
    }),
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/9/94/Transformers_Age_of_Extinction_Poster.jpeg',
        title: 'Transformers: Age of Extinction',
        label:'movie',
        description: 'Autobots must escape sight from a bounty hunter who has taken control of the human serendipity: Unexpectedly, Optimus Prime and his remaining gang turn to a mechanic, his daughter, and her back street racing boyfriend for help.',
        price: 18
    }),
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/8/81/Poster-pursuithappyness.jpg',
        title: 'The Pursuit of Happiness',
        label:'movie',
        description: 'A struggling salesman takes custody of his son as he‘s poised to begin a life-changing professional endeavor.',
        price: 15
    }),
    new Product({
        imagePath:'http://vignette4.wikia.nocookie.net/ayakashi-ghost-guild/images/8/86/250px-Orochi.jpeg/revision/latest?cb=20130521105634',
        title:'MacBook Air',
        label:'laptop',
        description:'The MacBook Air is a line of Macintosh subnotebook computers developed and manufactured by Apple Inc. It consists of a full-size keyboard, a machined aluminum case, and a thin light structure. The Air is available with a screen size of (measured diagonally) 13.3in (29.46 cm), with different specifications produced by Apple, and as of 2011, all models use solid-state drive storage and Intel Core i5 or i7 CPUs. A MacBook Air with an 11.6in (23.78 cm) screen was made available in 2010 and was discontinued on October 27, 2016.',
        price: 999
    }),
];

var done = 0;
for (var i = 0; i < products.length; i++) {
    products[i].save(function(err, result) {
        done++;
        if (done === products.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}