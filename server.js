const bodyParser = require("body-parser");
const { response } = require("express");
const express = require ("express");
const { request } = require("http");
const app = express();

const port = 3000;

const {v4: uuidv4} = require('uuid'); //universely unique identifier

app.use(bodyParser.json()); //this looks for incoming data

const Redis = require("redis");

const redisClient = Redis.createClient({
    url: "redis://127.0.0.1:6379"
});

app.get("/", (request, response) => {
    response.send("Hello Gary");
}
);

app.post('/login', (req, res) =>{
    const loginUser = req.body.userName;
    const loginPassword = req.body.password; //access the password data in the body
    console.log('Login username: ' +loginUser);
    if (loginUser == "gai18003@byui.edu" && loginPassword == "Radar123"){
        const loginToken = uuidv4();
        res.send(loginToken)

    }else {
        res.status(401); //unauthorized
        res.send("Incorrect password for " + loginUser);
    }
});

app.listen(port, () => {
    redisClient.connect();
    console.log("listening");
});

