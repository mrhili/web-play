const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');





// IP-Based Cloaking Route
app.get('/ip-cloak', (req, res) => {
    const userIP = req.ip;
    const localNetwork = userIP.startsWith('::ffff:192.168');
    res.render('ip-cloak', { localNetwork });
});


// User-Agent Cloaking Route
app.get('/user-agent-cloak', (req, res) => {
    const userAgent = req.headers['user-agent'];
    const isGoogleBot = /Googlebot/.test(userAgent);
    res.render('user-agent-cloak', { isGoogleBot });
});

// Referrer-Based Cloaking Route
app.get('/referrer-cloak', (req, res) => {
    const referrer = req.get('Referrer') || '';
    const fromGoogle = referrer.includes('google.com');
    res.render('referrer-cloak', { fromGoogle });
});


// JavaScript Fingerprinting-Based Cloaking Route
app.get('/js-fingerprint-cloak', (req, res) => {
    res.render('js-fingerprint-cloak');
});


// INDEX
app.get('/', (req, res) => {

    res.render('index');
});




// Start the Server
app.listen(3000, () => {
    console.log('Cloaking demo app running on http://localhost:3000');
});