const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { parseResultSet } = require("../helpers");
const pool = require("../database");

const ONE_YEAR = 60 * 60 * 24 * 7 * 30 * 12;
const ONE_MONTH = 60 * 60 * 24 * 7 * 30;
const ONE_WEEK = 60 * 60 * 24 * 7;
const ONE_DAY = 60 * 60 * 24
const ONE_HOUR = 60 * 60;

const TOKEN_EXPIRATION = ONE_YEAR;

function jwtSignUser(user) {

  // console.log('user: ',user);
  try {
    return jwt.sign(user, config.authentication.jwtSecret, {
      expiresIn: TOKEN_EXPIRATION
    });
  } catch (error) {
    // console.log("token sign error", error);
  }
}

module.exports = app => {

  app.post("/login", (req, res) => {
    let sql =
      "SELECT IFNULL(id,0) as id, username, email, password FROM api_user WHERE username = ? AND password = ?";

    let password = req.body.password;
    let username = req.body.username;

    pool
      .query(sql, [username, password])
      .then(result => {

        let data = parseResultSet(result);
        let user = { ...data[0] };
        delete user.password;
        // console.log(user);

        if (!user.id) {
          res.status(402).send({ 'message' : 'invalid credentials' });
        } else {
          res.send({ user, token: jwtSignUser(user), expiresIn: TOKEN_EXPIRATION, typ: "JWT", alg: "HS256", });
        }
      })
      .catch(err => console.log("error in query", err));
  });

};
