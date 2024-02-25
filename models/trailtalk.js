const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

// https://res.cloudinary.com/douqbebwk/image/upload/w_300/v1600113904/YelpCamp/gxgle1ovzd2f3dgcpass.png

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});



CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
}) //mongoose middleware







module.exports = mongoose.model('Campground', CampgroundSchema)
// a model named Campground is created with 'CampgroundSchema' schema
// The model Campground is for 'campgrounds' collection in db



// CampgroundSchema.pre('findOneAndDelete', async function (doc) {
//     console.log('Before deleting')
//     console.log(doc)

// })

// CampgroundSchema.post('findOneAndDelete', async function (doc) {
//     console.log('After deleting')
//     console.log(doc)

// })

// //you can technically add middleware to the schema from anywhere
// in your code before compiling the model with mongoose.model().
// The key is to ensure the middleware is added before the model is used
// in your application.

// By defining middleware directly in the schema file (where the schema is declared),
// you keep the logic related to a model encapsulated with its definition.