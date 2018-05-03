import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import parseurl from 'parseurl';

const app = express();
const port = 4000;

let items = [];

const router = express.Router();

app.use(express.static('public'));

// set up our /items route handlers
app.use('/items', router);

app.use(
    session({
        secret: 'board katkey',
        resave: true,
        saveUninitialized: false,
        cookie: { secure: false }
    })
);

const auth = (req, res, next) => {
    if (false) {
        // inspect the session cookie and determine if we're authorized
    } else {
        res.status(401).redirect('/login');
    }
};

app.get('/', auth, (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});
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
