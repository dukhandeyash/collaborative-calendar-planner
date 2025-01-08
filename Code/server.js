const express = require('express');
const { createConnection } = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'WP_Project'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      res.status(400).send('Error signing up');
      return;
    }
    res.status(200).send('Signup successful');
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, result) => {
    if (err) {
      res.status(400).send('Error logging in');
      return;
    }
    if (result.length === 0) {
      res.status(404).send('Email not found');
      return;
    }
    const user = result[0];
    if (user.password !== password) {
      res.status(401).send('Incorrect password');
      return;
    }
    res.status(200).send('Login successful');
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});