var express = require("express");
var router = express.Router();

var dashboardController = require("../controllers/dashboardController");

router.get("/perfis", function (req, res) {
    dashboardController.perfis(req, res);
});

module.exports = router;
