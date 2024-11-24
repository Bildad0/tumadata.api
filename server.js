// app.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const backupController = require('./controllers/backupController');
const userController = require('./controllers/user.controller');
const cron = require('node-cron'); // Import node-cron for scheduling tasks
const dotenv = require("dotenv");


dotenv.config();
const app = express();
const port = 3004;

app.use(bodyParser.json());
app.use(express.json());

const db = require("./models");
const Role = db.role;

var corsOptions = {
  origin: "*"
}; //change to cors option after development


app.use(cors(corsOptions));
app.use(express.json());

db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');
  initial();
});


function initial() {
  Role.create({
    id: 1,
    name: "user"
  });
 
  Role.create({
    id: 2,
    name: "moderator"
  });
 
  Role.create({
    id: 3,
    name: "admin"
  });
}


// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.get('/',(req, res)=>{
  res.json({ message: 'Welcome to tuma data API, we are under maintenance' });
});

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

// Schedule automatic backups every day at midnight
cron.schedule('0 0 * * *', () => {
  console.log('Running scheduled backup');
  backupController.createBackupCron(); // Call the backup function directly without authentication
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
