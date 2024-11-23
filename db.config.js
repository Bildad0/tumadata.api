// db.js
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  HOST: process.env.HOST_NAME,
  USER:process.env.USERNAME ,
  PASSWORD: process.env.PASSWORD,
  DB: process.env.DATABASE,
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
