const db = require("./models");
const sequelize = require('./config/database');

const User = db.user;
const Backup = db.backup;

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync({ force: false }); // Use { force: true } only in development
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

syncDatabase();
