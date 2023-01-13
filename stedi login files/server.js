const { response } = require("express");
const express = require ("express");
const { request } = require("http");
const app = express();

const port = 3000;

app.get("/", (request, response) => {
    response.send("Hello Gary");
}
);

app.listen(port, () => {
    console.log("listening");
});