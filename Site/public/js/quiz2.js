b_usuario.innerHTML = sessionStorage.NOME_USUARIO;
var perfil = [];

var pergunta_1 = document.getElementById('pergunta_1');
var pergunta_2 = document.getElementById('pergunta_2');
var pergunta_3 = document.getElementById('pergunta_3');
var pergunta_4 = document.getElementById('pergunta_4');

function salvar_resposta(question_number, event){
    if(event.target.type === 'radio'){
        console.log(event.target.value);
        perfil.push(event.target.value)
        console.log(perfil)
    }
}

pergunta_1.addEventListener('click', function(event){
    salvar_resposta(1, event)
})
pergunta_2.addEventListener('click', function(event){
    salvar_resposta(2, event)
})
pergunta_3.addEventListener('click', function(event){
    salvar_resposta(3, event)
})
pergunta_4.addEventListener('click', function(event){
    salvar_resposta(4, event)
})

function seu_resultado(){
    var count_arrojado = 0;
    var count_moderado = 0;
    var count_conservador = 0;
    var tipo_perfil = "";

    for (var i = 0; i < perfil.length; i++) {
      if (perfil[i] == "arrojado") {
        count_arrojado++;
      } else if (perfil[i] == "moderado") {
        count_moderado++;
      } else {
        count_conservador++;
      }
    }

    if (count_arrojado > count_moderado && count_arrojado > count_conservador) {
     total_score = "Parabéns! Você é Arrojado!";
     tipo_perfil = "arrojado";
   } else if (count_moderado > count_arrojado && count_moderado > count_conservador) {
     total_score = "Parabéns! Você é Moderado";
     tipo_perfil = "moderado";
   } else if (count_conservador > count_arrojado && count_conservador > count_moderado) {
     total_score = "Parabéns! Você é Conservador";
     tipo_perfil = "conservador";
   } else if(count_arrojado == count_moderado) {//pizzinha do desempate
     total_score = "Muito bem! Você é arrojado";
     tipo_perfil = "arrojado";
   } else if(count_arrojado == count_conservador){
     total_score = "Muito bem! Você é arrojado";
     tipo_perfil = "arrojado";
   } else if (count_moderado == count_conservador){
     total_score = "Parabéns! Você é Moderado";
     tipo_perfil = "moderado";
   }

   atualizar_usuario_perfil(tipo_perfil);
    return total_score;
}

var enviar_1 = document.getElementById('enviar_1');
var enviar_2 = document.getElementById('enviar_2');
var enviar_3 = document.getElementById('enviar_3');
var enviar_4 = document.getElementById('enviar_4');

function proxima_pergunta(numero_pergunta){
    var pergunta_atual = numero_pergunta - 1;
    var numero_pergunta = numero_pergunta.toString();
    var pergunta_atual = pergunta_atual.toString();

    var el = document.getElementById('pergunta_'+numero_pergunta);
    var el2 = document.getElementById('pergunta_'+pergunta_atual);

    el.style.display = "block";
    el2.style.display = "none";
}

enviar_1.addEventListener('click', function(){
    proxima_pergunta(2);
    barra_progresso('25%');
})
enviar_2.addEventListener('click', function(){
    proxima_pergunta(3);
    barra_progresso('50%');
})
enviar_3.addEventListener('click', function(){
    proxima_pergunta(4);
    barra_progresso('75%');
})
enviar_4.addEventListener('click', function(){
    proxima_pergunta(5);
    barra_progresso('100%');
})

enviar_4.addEventListener('click', function(){
    document.getElementById("seu_resultado").innerHTML = seu_resultado();
})

function barra_progresso(porcentagem){
    var barra = document.getElementById("barra_progresso");
    barra.style.width = porcentagem;
}

function atualizar_usuario_perfil(tipo_perfil) {
  var idUsuario = sessionStorage.ID_USUARIO;
  console.log(idUsuario);
  console.log(tipo_perfil)

  fetch("/perfil/perfil", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        tipo_perfilServer: tipo_perfil
    })
  }).then(function (resposta) {

  resposta.json().then(json => {
    console.log(json);
    console.log(JSON.stringify(json));
    console.log(json[0].idPerfil_investimento)

    if (resposta.ok) {
        fetch("/usuarios/atualizar_usuario_perfil", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        // crie um atributo que recebe o valor recuperado aqui
        // Agora vá para o arquivo routes/usuario.js
        idUsuarioServer: idUsuario,
        idPerfilServer: json[0].idPerfil_investimento
    })
    }).then(function (resposta) {

    console.log("resposta: ", resposta);


    if (resposta.ok) {
        // alert("Você será redirecioando automaticamente para o dashboard em 10 segundos")
        // setTimeout(() => {
        //     window.location = "/dashboard/dashboard.html";
        // }, 10000)


    } else {
        throw ("Houve um erro ao tentar realizar a atualização de perfil!");
    }
    }).catch(function (resposta) {
    console.log(`#ERRO: ${resposta}`);

    });
    return false;

    } else {
        throw ("Houve um erro ao tentar realizar a atualização de perfil!");
    }

  });

  }).catch(function (resposta) {
  console.log(`#ERRO: ${resposta}`);

  });
}
