module.exports = app => {
    require("./authentication")(app),
    require("./cryptoRoutes")(app),

    app.get("/", (req, res) => {
      res.send("nothing to see here folks, move along...");
    });

    app.get("/test", (req, res) => {
      res.send({ active: true });
    });
};