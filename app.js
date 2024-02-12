const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/trailtalk')

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

app.set('view engine', 'ejs'); //The default engine extension to use
app.set('views', path.join(__dirname, 'views')); //Setting up a directory or an array of directories for the application's views.

app.listen(port, () => {
    console.log(`TrailTalk is talking on port ${port}`)
}) //This app starts a server and listens on port 3000 for connections. 

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/makecampground', async (req, res) => {
    const camp = new Campground({ title: 'My backyard', description: 'for free' }) //Creating a new document of model: Campground
    await camp.save();
    res.send(camp)

})