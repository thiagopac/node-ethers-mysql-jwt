const passport = require("passport");
const pool = require("./database");
const config = require("./config/config");
const {
    parseResultSet
} = require("./helpers");

const JwtStrategy = require("passport-jwt").Strategy,
    ExtractJwt = require("passport-jwt").ExtractJwt;

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.authentication.jwtSecret;

passport.use(
    new JwtStrategy(opts, async function(jwtPayload, done) {
        try {
            let sql = "SELECT id FROM api_user WHERE id = ?";
            pool.query(sql, [jwtPayload.id]).then(result => {
                let data = parseResultSet(result);
                let user = {
                    ...data[0]
                };
                if (!user) {
                    return done(new Error(), false);
                } else if (jwtPayload.id === user.id) {
                    return done(null, user);
                } else {
                    return done(new Error(), false);
                }
            });
        } catch (err) {
            return done(new Error(), false);
        }
    })
);

module.exports = null;