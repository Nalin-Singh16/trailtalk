const express = require('express')
const router = express.Router({ mergeParams: true })//to access req.params from other file
const catchAsync = require('../utilities/catchAsync');
const Review = require('../models/review')
const Campground = require('../models/trailtalk')
const ExpressError = require('../utilities/ExpressError')
const { reviewSchema } = require('../schemas.js')

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Your review is submitted')
    res.redirect(`/campgrounds/${campground._id}`)
}))



router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }) //find the campground, and pull (delete) the review with the given review id
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfully deleted your review')
    res.redirect(`/campgrounds/${id}`)
})) //We are deleteting the review and the reference of review from campground

module.exports = router