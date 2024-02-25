const express = require('express')
const router = express.Router({ mergeParams: true })//to access req.params from other file
const catchAsync = require('../utilities/catchAsync');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware.js')
const reviewController = require('../controllers/reviews.js')

router.post('/', isLoggedIn, validateReview, catchAsync(reviewController.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewController.deleteReview)) //We are deleteting the review and the reference of review from campground

module.exports = router