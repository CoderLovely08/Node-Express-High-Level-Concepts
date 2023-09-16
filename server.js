const express = require('express');

const app = express();

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html')
})


app.get('/sanket', (req, res) => {
    res.sendFile(__dirname + '/sanket.html')
})

app.get('/lovely', (req, res) => {
    res.send("Lovely here")
})

app.listen(3000, (error) => {
    if (error) console.log("Error", error);
    else console.log("Server is running on port 3000");
})