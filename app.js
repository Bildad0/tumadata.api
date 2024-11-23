// app.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const backupController = require('./controllers/backupController');
const userController = require('./controllers/userController');
const cron = require('node-cron'); // Import node-cron for scheduling tasks
const dotenv = require("dotenv");


dotenv.config();
const app = express();
const port = 3004;

app.use(bodyParser.json());
app.use(express.json());

var corsOptions = {
  origin: "http://localhost:8081"
};
app.use(cors());
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.get('/',(req, res)=>{
  res.json({ message: 'Welcome to tuma data API, we are under maintenance' });
});

// Authentication routes
app.post('/api/register', userController.registerUser);
app.post('/api/login', userController.loginUser);
app.get('/api/verifytoken', userController.verifyToken);

// Protect the backup and restore routes using JWT middleware
app.post('/api/backup', userController.verifyToken, backupController.createBackup);
app.get('/api/backups', userController.verifyToken, backupController.listBackups);
app.get('/api/restore/:backupName', userController.verifyToken, backupController.restoreBackup);

//search routes
app.get('/api/user', userController.verifyToken, userController.getUserByUserName);
app.get('/api/users', userController.verifyToken, userController.searchUser);


// Schedule automatic backups every day at midnight
cron.schedule('0 0 * * *', () => {
  console.log('Running scheduled backup');
  backupController.createBackupCron(); // Call the backup function directly without authentication
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
