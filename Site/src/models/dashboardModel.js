var database = require("../database/config");

function perfis() {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function perfis(): ")
    var instrucao = `
        SELECT count(u.fk_idPerfil) as qtde_perfil, p.tipo_perfil FROM usuario AS u INNER JOIN perfil AS p ON p.idPerfil_investimento = u.fk_idPerfil GROUP BY p.idPerfil_investimento;
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

module.exports = {
    perfis
};
