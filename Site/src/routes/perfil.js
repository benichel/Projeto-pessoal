var express = require("express");
var router = express.Router();

var perfilController = require("../controllers/perfilController");

router.post("/perfil", function (req, res) {
    perfilController.perfil(req, res);
});

module.exports = router;
