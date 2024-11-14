// db.js
const mysql = require('mysql2');
const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();


const pool = new Pool({
  host:process.env.HOST_NAME,
  port: process.env.PORT,
  database: process.env.DATABASE,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  ssl: { rejectUnauthorized: false }
});

pool.connect((err) => {
  if (err) {
    console.error(`Database error: `, err.message);
  } else {
    console.log("Connected to online database");
  }
});

const db = pool;

module.exports = db;
