const controller = require("../controllers/backup.controller");

module.exports = function(app){
    app.use(function(res){
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
          );
    });

    app.post("/api/backup/",controller.Upload);
    app.get('/api/:userId/backups',controller.Uploads);

}