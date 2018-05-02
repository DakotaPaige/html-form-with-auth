import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 4000;

let items = [];

const router = express.Router();

app.use(express.static('public'));

router
    .route('/')
    .get(function(request, response) {
        response.send(items);
    })
    // Handling of how POST requests work to the /items route
    .post(bodyParser.json(), function(request, response) {
        const newItem = request.body;
        items.push(newItem);
        response.status(201).json(newItem);

        console.log(newItem);

        // Then send back a 201 status
        // And also send the new quote as JSON in the response
    });

// set up our /items route handlers
app.use('/items', router);

app.listen(port, function() {
    console.log(`Server running @ localhost:${port}`);
});
