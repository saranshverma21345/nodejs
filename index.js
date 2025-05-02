const express = require('express');
const app = express();
const request = require('request');
const wikip = require('wiki-infobox-parser');

//ejs
app.set("view engine", 'ejs');

//routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/index', (req, response) => {
    if (!req.query.person) {
        return response.status(400).send('Missing search parameter');
    }

    let url = "https://en.wikipedia.org/w/api.php";
    const params = new URLSearchParams({
        action: "opensearch",
        search: req.query.person,
        limit: "1",
        namespace: "0",
        format: "json"
    }).toString();

    url = `${url}?${params}`;

    //get wikip search string
    request(url, (err, res, body) => {
        if (err) {
            return response.status(500).send('Error fetching data');
        }
        const result = JSON.parse(body);
        let x = result[3][0];
        x = x.substring(30, x.length);

        //get wikip json
        wikip(x, (err, final) => {
            if (err) {
                return response.status(500).send('Error parsing Wikipedia data');
            } else {
                const answers = final;
                response.send(answers);
            }
        });
    });
});

//port
app.listen(3000, '0.0.0.0', () => {
    console.log("Listening at port 3000...");
});
