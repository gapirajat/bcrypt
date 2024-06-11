const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));

const users = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  console.log(`Received registration request for user: ${username}`);

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  users.push({ username, password: hashedPassword });

  console.log(`User ${username} registered with hashed password: ${hashedPassword}`);

  res.send('Registration successful');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log(`Received login request for user: ${username}`);

  const user = users.find((user) => user.username === username);

  if (user) {
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      console.log(`User ${username} logged in successfully`);
      res.send('Login successful');
    } else {
      console.log(`User ${username} provided an incorrect password`);
      res.send('Incorrect password');
    }
  } else {
    console.log(`User ${username} not found`);
    res.send('User not found');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
