const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// MongoDB Connection Configuration
mongoose.connect('mongodb://localhost:27017/registration', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a MongoDB Schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// Create a MongoDB model based on the schema
const User = mongoose.model('User', userSchema);

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Route for serving the HTML file
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/User_reg_mongo.html');
});

// Handle form submission
app.post('/register', async (req, res) => {
    // Extract user data from the request body
    const userData = {
        email: req.body['email'],
        password: req.body['password']
    };

    // Create a new user using the User model
    const newUser = new User(userData);

    try {
        // Save the new user to the database
        await newUser.save();

        console.log('User registered successfully');
        res.send('User registered successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error registering user');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
