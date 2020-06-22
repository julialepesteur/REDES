const tables=require('./tables.js');

var moment = require('moment');
moment().format();

var sequelize = require('../model/database');

const motcontrollers = {}


motcontrollers.viagens= async (req, res) => {

    console.log("\n\n\nAQUI\n\n\n");

    console.log(req.params);
    const { nprestador } = req.params;

    const data = await tables.viagem_trajetos.findAll({
       
        
   include: [{model: tables.trajetos, as: 'viagem_trajetos_trajetos'},
   {model: tables.viagem, as: 'viagem_trajetos_viagem',  where: { nprestador: nprestador } }
 
    ]
   


    })
    .then(function(data){
    return data;
    })
    .catch(error =>{
    return error;
    })
    res.json({ success: true, data: data });

}



motcontrollers.viagemkm= async (req, res) => {

    console.log("\n\n\nAQUI\n\n\n");

    console.log(req.params);
    const { nviagem } = req.params;

    const data = await sequelize.query('SELECT SUM(distancia) FROM viagem INNER JOIN viagem_trajetos ON viagem.nviagem=viagem_trajetos.nviagem INNER JOIN trajetos ON viagem_trajetos.idtrajeto=trajetos.idtrajeto WHERE viagem.nviagem='+nviagem, 
    null, { raw: true })
    .then(function(data){
        return data;
        })
        .catch(error => {
        return error;
        });
        res.json({success : true, data : data[0]});


}



motcontrollers.clientes= async (req, res) => {

    console.log("\n\n\nAQUI\n\n\n");

    console.log(req.params);
    const { nviagem } = req.params;

    const data = await tables.passageiro_viagem.findAll({
        where: { nviagem: nviagem },
        
        include: [{model: tables.trajetos, as: 'passageiro_viagem_trajetos' },
         {model: tables.clientes, as: 'passageiro_viagem_clientes',

         include: [{model: tables.utilizador, as: 'clientes_utilizador' }]
        
        
        },
 
    ]
   


    })
    .then(function(data){
    return data;
    })
    .catch(error =>{
    return error;
    })
    res.json({ success: true, data: data });


}


motcontrollers.classificacoes= async (req, res) => {

    console.log("\n\n\nAQUI\n\n\n");

    console.log(req.params);
    const { nprestador } = req.params;

    const data = await tables.classificacao.findAll({
        
        attributes: ['estrelas','descricao', 'data_classificacao'],
        
        include: [
        {model: tables.viagem, as: 'classificacao_viagem', where: { nprestador: nprestador }, attributes: [] },
         {model: tables.utilizador, as: 'classificacao_utilizador', attributes: ['nome','foto'] }
        
        ]
        
        

    })
    .then(function(data){
    return data;
    })
    .catch(error =>{
    return error;
    })
    res.json({ success: true, data: data });


}





    module.exports = motcontrollers;