const express = require('express');
const ua = require('universal-analytics');
const { readFileSync } = require('fs');
const app = express();
const port = 3413;
const visitor = ua(readFileSync('id'));

const timeStamp = () => {
    let t = new Date();
    return `[${t.getFullYear()}-${t.getMonth()}-${t.getDate()} ${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}]`;
}

app.use((req, res, next) => {
    if (req.url.includes('favicon')) return next();
    console.log(timeStamp() + ' Serving '+req.url);

    // Analytics
    let file = req.url.split('/');
    file = file[file.length-1];
    if (file === '') file = 'index';
    visitor.pageview(req.url, req.hostname, file).send();
    next();
});
app.get('/', (req, res) => res.send('Hello World!'));
app.use(express.static('files'));

app.listen(port, () => console.log('File server up on '+port));