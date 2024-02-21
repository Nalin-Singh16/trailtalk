const express = require('express');
const mongoose = require('mongoose');
const Campground = require('../models/trailtalk')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')

const app = express();
const port = 3000;

main().then(console.log('Database connected'))
    .catch(err => console.log(err));
//To handle initial connection errors

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/trailtalk');
}
mongoose.connection.on('error', err => {
    logError(err);
});

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const randomNum = Math.floor(Math.random() * 100)
        const camp = new Campground({
            location: `${cities[randomNum].city}, ${cities[randomNum].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: `https://source.unsplash.com/collection/483251`,
            description: 'This is a random test description that is used while seeding',
            price: 5000,
            author: '65d62a77cf0249b2bcb73e49'
        })

        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})