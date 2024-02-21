const express = require('express')
const router = express.Router({ mergeParams: true })//to access req.params from other file
const catchAsync = require('../utilities/catchAsync');
const Review = require('../models/review')
const Campground = require('../models/trailtalk')
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware.js')



router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    console.log(review.author)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Your review is submitted')
    res.redirect(`/campgrounds/${campground._id}`)
}))



router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }) //find the campground, and pull (delete) the review with the given review id
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfully deleted your review')
    res.redirect(`/campgrounds/${id}`)
})) //We are deleteting the review and the reference of review from campground

module.exports = router