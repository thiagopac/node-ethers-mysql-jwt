const mysql = require("mysql");
const util = require("util");
require("dotenv").config();

const standardConnectionOpts = {
  connectionLimit: 100,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  debug: false,
  multipleStatements: true,
  timezone: "-03:00"
};

var pool = mysql.createPool(
  process.env.INSTANCE_CONNECTION_NAME
    ? {
        ...standardConnectionOpts, //for cloud instance db
        socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`
      }
    : {
        ...standardConnectionOpts,
        host: process.env.DB_HOST
      }
);

pool.query = util.promisify(pool.query);

module.exports = pool;