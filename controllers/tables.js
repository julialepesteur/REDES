
var sequelize = require('../model/database');
const tables = {}


tables.administrador = require('../model/administrador')

tables.callcenter= require('../model/callcenter');

tables.clientes =require('../model/clientes');

tables.prestador_de_servico = require('../model/prestador_de_servico');

tables.comentarios= require ('../model/comentario');

tables.viagem=require('../model/viagem');

tables.viatura=require('../model/viatura');

tables.classificacao=require ('../model/classificacao');


tables.utilizador = require('../model/muv_utilizador');

tables.pedidos=require('../model/pedidos');

tables.callcenter_pedidos = require('../model/callcenter_pedidos');


tables.passageiro_viagem = require('../model/passageiro_viagem');

tables.trajetos=require('../model/trajetos');

tables.viagem_trajetos=require('../model/viagem_trajetos');

tables.dividas=require('../model/dividas');

tables.necessidade_especial=require('../model/necessidade_especial');


tables.bagagem=require('../model/bagagem');

tables.clientes_callcenter=require('../model/clientes_callcenter');

tables.documentos=require('../model/documentos');

var sequelize = require('../model/database');

sequelize.sync()


 module.exports = tables;