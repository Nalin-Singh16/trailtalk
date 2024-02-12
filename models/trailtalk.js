const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String
});

module.exports = mongoose.model('Campground', CampgroundSchema)
// a model named Campground is created with 'CampgroundSchema' schema
// The model Campground is for 'campgrounds' collection in db