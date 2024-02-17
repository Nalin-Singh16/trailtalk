const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/trailtalk')
const methodOverride = require('method-override')
const ejsmate = require('ejs-mate');
const { campgroundSchema } = require('./schemas.js');
const catchAsync = require('./utilities/catchAsync');
const ExpressError = require('./utilities/ExpressError');

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
//To handle errors after initial connection was established, you should listen for error events on the connection

app.engine('ejs', ejsmate)
app.set('view engine', 'ejs'); //The default engine extension to use
app.set('views', path.join(__dirname, 'views')); //Setting up a directory or an array of directories for the application's views.
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(methodOverride('_method'))

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
} //function to validate data via joi

app.listen(port, () => {
    console.log(`TrailTalk is talking on port ${port}`)
}) //This app starts a server and listens on port 3000 for connections. 

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })

}))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground })
}))

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/show', { campground })
}))

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('page does not exist', 404)) //similar to next(err), here we are explicity creating an error object
})

//Creating an error handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = "Oh no! Something went wrong!"
    res.status(statusCode).render('error', { err })

})