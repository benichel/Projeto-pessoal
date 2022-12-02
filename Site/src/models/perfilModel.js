var database = require("../database/config")

function perfil(tipo_perfil) {
    console.log("ACESSEI O PERFIL MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", tipo_perfil)
    var instrucao = `
        SELECT * FROM perfil WHERE tipo_perfil = '${tipo_perfil}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

module.exports = {
    perfil
};
