const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');

// Create MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'restaurantsystem'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/search', (req, res) => {
    const { query, type, userLocation } = req.body;
    const userLat = userLocation.lat;
    const userLon = userLocation.lon;

    
    //Haversine formula used to find the nearease location from the user live location
    const haversineDistance = `
        (6371 * acos(
            cos(radians(${userLat}))
            * cos(radians(latitude))
            * cos(radians(longitude) - radians(${userLon}))
            + sin(radians(${userLat})) * sin(radians(latitude))
        ))
    `;

    const sqlQuery = `
        SELECT name, city, address, openingtime, closingtime, latitude, longitude, ${haversineDistance} AS distance
        FROM restaurant
        WHERE name LIKE ? AND types = ?
        ORDER BY distance
        LIMIT 10
    `;

    console.log('Executing query:', sqlQuery);

    connection.query(sqlQuery, [`%${query}%`, type], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error searching for restaurants');
            return;
        }
        console.log('Query results:', results);
        res.json(results);
    });
});

app.get('/top-restaurants', (req, res) => {
    connection.query('SELECT * FROM restaurant ORDER BY rating DESC LIMIT 10', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching top restaurants');
            return;
        }
        res.json(results);
    });
});

app.listen(999, () => {
    console.log('Server is running at: 999');
});
