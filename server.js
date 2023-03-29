
const bodyParser = require("body-parser");
const { response } = require("express");
const express = require ("express");
const { request } = require("http");
const app = express();

const port = 3000;

const {v4: uuidv4} = require('uuid'); //universely unique identifier

app.use(bodyParser.json()); //this looks for incoming data

app.use(express.static("public")); //  tells where frontend will go (public folder)

const Redis = require("redis");

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const https = require("https");

const fs = require("fs");

app.use(async function(req, res, next) {
    var cookie = req.cookies.stedicookie;
    if(cookie === undefined && !req.url.includes("login") && !req.url.includes("html")){
        res.status(401);
        res.send("no cookie");
    }
    else {
        //this means cookie was already present
        res.status(200);
        next();
    }
})

app.post('/rapidsteptest', async(req,res)=>{
    const steps = req.body;
    await redisClient.zAdd('Steps',[{score:0,value:JSON.stringify(steps)}]);
    console.log("Steps", steps);
    res.send("Saved");
});

//  -- password default:tT246SyaH8qaCHW6@

const redisClient = Redis.createClient({
    url: "redis://127.0.0.1:6379"
});


app.get("/", (request, response) => {
    response.send("Hello Gary!");
}
);

app.get("/validate/", async(req, res) =>{
    const loginToken = req.cookies.stedicookie;
    console.log("loginToken", loginToken);
    const loginUser = await redisClient.hGet('TokenMap', loginToken);
    res.send(loginUser);
})

app.post('/login', async(req, res) =>{
    const loginUser = req.body.userName;
    const loginPassword = req.body.password; //access the password data in the body
    console.log('Login username: ' +loginUser);
    const correctPassword = await redisClient.hGet('UserMap', loginUser);
    if (loginPassword==correctPassword){
        const loginToken = uuidv4();
        await redisClient.hSet("TokenMap", loginToken, loginUser); //add token to map
        res.cookie('stedicookie',loginToken); //
        res.send(loginToken)
    }else {
        res.status(401); //unauthorized
        res.send("Incorrect password for " + loginUser);
    }
});


app.listen(port, () => {
    redisClient.connect()
    console.log("listening");
});
