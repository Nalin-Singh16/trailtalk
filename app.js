const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const ejsmate = require('ejs-mate');
const session = require('express-session')
const ExpressError = require('./utilities/ExpressError');
const flash = require('connect-flash')

const campgrounds = require('./routes/campgrounds') //requiring the express router
const reviews = require('./routes/reviews') //requiring the express router

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
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'Thisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }//date.now is in milliseconds
}
app.use(session(sessionConfig))
app.use(flash())

app.listen(port, () => {
    console.log(`TrailTalk is talking on port ${port}`)
}) //This app starts a server and listens on port 3000 for connections. 

app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})//add it before the routers so that flash is available 

app.use('/campgrounds', campgrounds) //using express router
app.use('/campgrounds/:id/reviews', reviews) //using express router

app.get('/', (req, res) => {
    res.render('home')
});

app.all('*', (req, res, next) => {
    next(new ExpressError('page does not exist', 404)) //similar to next(err), here we are explicity creating an error object
})

//Creating an error handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = "Oh no! Something went wrong!"
    res.status(statusCode).render('error', { err })

})