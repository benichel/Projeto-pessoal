create database projeto_pessoal;
use projeto_pessoal;

create table perfil(
idPerfil_investimento int primary key auto_increment,
tipo_perfil varchar (45)
);

create table usuario(
idUsuario int primary key auto_increment,
nome varchar (45),
email varchar (45),
login varchar (45),
senha char (8),
fk_idPerfil int,
foreign key (fk_idPerfil) references perfil(idPerfil_investimento)
);

create table endereco (
idEndereco int primary key auto_increment,
cep varchar (10),
numero int,
fk_idUsuario int,
foreign key (fk_idUsuario) references usuario(idUsuario)
);

insert into perfil values 
(null,"moderado"),
(null, "conservador"),
(null, "arrojado");