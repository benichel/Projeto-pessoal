var perfilModel = require("../models/perfilModel");

var sessoes = [];

function perfil(req, res) {
  var tipo_perfil = req.body.tipo_perfilServer;

  if (tipo_perfil == undefined) {
      res.status(400).send("O perfil está undefined!");
  } else {
    perfilModel.perfil(tipo_perfil)
        .then(
            function (resultado) {
                console.log(`\nResultados encontrados: ${resultado.length}`);
                console.log(`Resultados: ${JSON.stringify(resultado)}`); // transforma JSON em String

                if (resultado.length > 0) {
                    console.log(resultado);
                    res.status(200).json(resultado);
                } else {
                    res.status(204).send("Nenhum resultado encontrado!")
                }
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log("Houve um erro ao buscar os perfis.", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
    }
}

module.exports = {
    perfil
}
