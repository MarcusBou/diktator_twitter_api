const express = require('express');
const fs = require('fs');
const cors = require('cors');
const crypto = require('crypto');
const { Console } = require('console');
const { json } = require('body-parser');
const app = express();
const port = 3000;
const dictatorsPath = "./Dictators.json";
const tweetsPath = "./Tweets.json";
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

function encrypt(text){
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text, 'utf8', 'base64') + cipher.final('base64');
    return encrypted
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/dictators', (req, res) => {
    let rawData = fs.readFileSync(dictatorsPath);
    let data = JSON.parse(rawData);
    let message = encrypt(JSON.stringify(data["dictators"]));
    res.send(`${message}||${key.toString('base64')}||${iv.toString('base64')}`);
});

app.get('/tweets', (req, res) => {
    let rawData = fs.readFileSync(tweetsPath);
    let data = JSON.parse(rawData);
    let message = encrypt(JSON.stringify(data["tweets"]));
    res.send(`${message}||${key.toString('base64')}||${iv.toString('base64')}`);
});

app.get("/dictator", (req, res) => {
    let dictatorRequested = req.query.username;
    let rawData = fs.readFileSync(dictatorsPath);
    let data = JSON.parse(rawData);
    let selectedDictator = data.dictators.find(item => item.name == dictatorRequested);
    res.send(selectedDictator);
});

app.get("/tweetsFromDic", (req, res) => {
    let dictatorRequested = req.query.username;
    let tweetsList = [];
    let rawData = fs.readFileSync(tweetsPath);
    let data = JSON.parse(rawData);
    for(var user in data['tweets']){
        tweetsList.push(user['username']);
    }
    res.send(tweets);
});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));