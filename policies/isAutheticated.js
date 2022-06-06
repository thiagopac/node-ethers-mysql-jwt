const passport = require("passport");

module.exports = function(req, res, next) {
  passport.authenticate("jwt", function(err, user) {
        
    // console.log("User object: ", user);

    const { authorization } = req.headers
    // console.log("req.headers: ", req.headers);

    //standard ajax token
    // hard_token FOR TESTS ON DEV ENV ONLY 
    const hard_token = "Bearer eyTabFric4LSPz34Mo0sS3a5cCI6IkpCACJ9.eySdZCI6MSwidXNlcm5hbWUiOiJ0ZXN0dXNlciIsImVtYWlsIjoidGhpYWdvcGFjQGdtYWlsLmNvbSIsImlhdCI6MTU2ODY3NzQ4NiwiZXhwIjoxNzg2NDA1NDg2fQ.q7CFzEOTqCbuvBz_596O5NrQSF4qArjI75UAPDrZ8pL"
    const using_hard_token = hard_token === authorization
    // console.log("hard_token: ", hard_token);
    // console.log("authorization: ", authorization);

    if (err || !user && !using_hard_token) {
    // if (err || !user) {
      res.status(403).send({
        error: "valid auth token missing"
      });
    } else {
      req.user = user;
      next();
    }
  })(req, res, next);
};