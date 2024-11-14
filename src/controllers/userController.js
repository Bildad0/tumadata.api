// userController.js
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = "achieng"; // Ideally, store this in an environment variable

// User registration
exports.registerUser = async (req, res) => {
  const { username, password, email, phone } = req.body;

  console.log(`user details: ${username} ${password} ${email} ${phone}`);
  if (!username || !password || !email || !phone) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if the email is already in use
    const checkEmailQuery = `SELECT * FROM "user" WHERE email = ${email}`;
    const checkEmailResult = await db.query(checkEmailQuery, [email]);

    if (checkEmailResult.rows.length > 0) {
      return res.status(400).json({ error: 'Email already in use' });
    } else if(error){
      return res.status(400).json(error.message);
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the "user" table
    const insertQuery = `
          INSERT INTO "user" (username, password, email, phone_number)
          VALUES (${username},${hashedPassword}, ${email}, ${phone})
          RETURNING id, username, email, phone_number
        `;

    const result = await db.query(insertQuery);

    // Return the newly created user data
    const newUser = result.rows[0];
    return res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      phone: newUser.phone_number,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// User login
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    res.json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
};

// Middleware to verify JWT token
exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ auth: false, message: 'No token provided' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(500).json({ auth: false, message: 'Failed to authenticate token' });
    }
    // If everything is good, save the user ID for use in other routes
    req.userId = decoded.id;
    next();
  });
};

exports.getUserByUserName = (req, res, next) => {
  const { username } = req.params;
  const query = `SELECT * FROM "user" WHERE username = ?`;
  db.query(query, [username], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = results[0];
    return res.status(200).json(user);

  });
  next();
}

exports.searchUser = (req, res, next) => {
  const { username } = req.params;
  const query = `SELECT * FROM backups WHERE username=%${username}%`;
  db.query(query, [username], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = results[0];
    return res.status(200).json(user);

  });
  next();
}