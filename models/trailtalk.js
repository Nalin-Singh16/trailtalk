const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    author:
    {
        type: Schema.Types.ObjectId,
        ref: 'User' //model name of the embedded collection
    }
    ,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review' //model name of the embedded collection
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