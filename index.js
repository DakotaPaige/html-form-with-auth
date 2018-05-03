import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

const app = express();
const port = 4000;

let items = [];

const router = express.Router();

const APP_SECRET = process.env.APP_SECRET || 'keyboardcat';

//where we set up the name and information for our cookie
const config = {
    JWT: {
        name: 'thursday_token',
        secret: APP_SECRET,
        expires: 60 * 60 * 60
    }
};

app.use(express.static('public'));

//checks if the cookie exists with the required name, check to see if whats inside the token is correct then redirect to index, otherwise redirect to login
// verify decrypts the token
// checks if user exists and if username and password are correct (would normally check the database here), then nexts onto the index page
const auth = (req, res, next) => {
    //Is there a cookie? Is the cookie our user information?
    // SHOULD BE REFACTORED TO CHECK FOR NO INSTANCE OF COOKIES FIRST, THEN OTHER CODE IN THE ELSE
    if (req.cookies && req.cookies[config.JWT.name]) {
        try {
            //decode the user from the token
            const user = jwt.verify(
                req.cookies[config.JWT.name],
                config.JWT.secret
            );
            // Replace with a SQL query to check database instead of hardcoding
            // Check for the COOKIE information not the response information
            if (
                user &&
                user.name === 'cat' &&
                user.email === 'cats@kittens.com'
            ) {
                //should check token expiry and other things but oh well for this!
                next();
            }
        } catch (e) {
            res.status(401).redirect('/login');
        }
    } else {
        res.status(401).redirect('/login');
    }
};

app.use(cookieParser());

// set up our /items route handlers
app.use('/items', router);

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.get('/', auth, (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

//getting information back from the login form submission
app.post(
    '/authenticate',
    bodyParser.urlencoded({ extended: true }),
    (req, res) => {
        console.log(req.body);
        //checks to see if theres no input, if so redirect back to login page
        if (!req.body.username || !req.body.password) {
            res.status(400).redirect('/login');
        }
        // if the token is correct,create the cookie information to then get out in the auth function
        else if (req.body.username === 'cat' && req.body.password === 'cat') {
            const token = jwt.sign(
                {
                    name: 'cat',
                    email: 'cats@kittens.com',
                    admin: true
                },
                config.JWT.secret,
                {
                    expiresIn: config.JWT.expires
                }
            );

            res.cookie(config.JWT.name, token, {
                maxAge: config.JWT.expires,
                secure: process.env.NODE_ENV === 'production' ? true : false
            });

            console.log(token);

            return res.status(200).redirect('/');
        } else {
            res.status(400).redirect('/login');
        }
    }
);

// BASIC HTTP AUTHETICATION
// const auth = (req, res, next) => {
//     function unauthorized(res) {
//         res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
//         res.sendStatus(401);
//     }

//     let authHeader = (req.headers.authorization || '').split(' ')[1] || '';
//     const [login, password] = new Buffer(authHeader, 'base64')
//         .toString()
//         .split(':');

//     if (login === 'cat' && password === 'cat') {
//         next();
//     } else {
//         return unauthorized(res);
//     }
// };

// app.get('/', auth, (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// });

router
    .route('/items')
    .get(function(request, response) {
        response.send(items);
    })
    // Handling of how POST requests work to the /items route
    .post(bodyParser.urlencoded({ extended: true }), function(
        request,
        response
    ) {
        console.log('Form values:', JSON.stringify(request.body, null, 2));
        const newItem = request.body;
        items.push(newItem);
        response.status(201).redirect('/');

        console.log(newItem);

        // Then send back a 201 status
        // And also send the new quote as JSON in the response
    });

// app.post('/items', bodyParser.urlencoded({ extended: true }), (req, res) => {
//     console.log('Form values:', JSON.stringify(req.body, null, 2));
//     res.status(200).redirect('/');
// });

app.listen(port, function() {
    console.log(`Server running @ localhost:${port}`);
});
