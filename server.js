// app.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const backupController = require('./controllers/backup.controller');
const userController = require('./controllers/user.controller');
const cron = require('node-cron'); // Import node-cron for scheduling tasks
const dotenv = require("dotenv");
const db = require("./models");

dotenv.config();
const app = express();
const port = 3004;
const Role = db.role;

var corsOptions = {
  origin: "*"
}; //change to cors option after development


app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to tuma data API' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

db.sequelize.authenticate().then(() => {
  db.sequelize.sync({ force: true }).then(() => {
    initial();
  });
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

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/backup.routes')(app);

