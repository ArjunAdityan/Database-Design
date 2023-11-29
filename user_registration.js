const express = require('express');
const oracledb = require('oracledb');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Oracle DB Thin Driver Configuration
oracledb.initOracleClient({ libDir: '' });

// Oracle DB Configuration
const dbConfig = {
    user: 'arjun',
    password: 'jayarjun1',
    connectString: 'localhost:1521/xe'
};

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Route for serving the HTML file
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/User_registration.html');
});

// Handle form submission
app.post('/register', async (req, res) => {
    // Extract user data from the request body
    const userData = {
        email: req.body['email'],
        password: req.body['password']
    };

    // Connect to the Oracle Database
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        // Insert user data into the database
        const result = await connection.execute(
            `INSERT INTO USER_REGISTRATION (EMAIL, PASSWORD) VALUES (:email, :password)`,
            userData
        );

        // Commit the transaction
        await connection.commit();

        console.log(result);

        res.send('User registered successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error registering user');
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});