
const tables=require('./tables.js');

var moment = require('moment');
moment().format();

const admcontrollers = {}

var sequelize = require('../model/database');

admcontrollers.financeiro= async (req, res) => {
   
    const { mes } = req.params;

    const data = await sequelize.query("SELECT (SELECT SUM(valor) AS valorpago FROM passageiro_viagem INNER JOIN viagem ON passageiro_viagem.nviagem=viagem.nviagem WHERE pagou='TRUE' AND EXTRACT(year FROM data_viagem)=EXTRACT(year FROM NOW()) AND EXTRACT(month FROM data_viagem)="+mes+"), (SELECT SUM(valor) AS valorporpagar FROM passageiro_viagem INNER JOIN viagem ON passageiro_viagem.nviagem=viagem.nviagem WHERE pagou='FALSE' AND EXTRACT(year FROM data_viagem)=EXTRACT(year FROM NOW()) AND EXTRACT(month FROM data_viagem)="+mes+"), (SELECT COUNT(*) AS viajantes  FROM passageiro_viagem INNER JOIN viagem ON passageiro_viagem.nviagem=viagem.nviagem WHERE EXTRACT(year FROM data_viagem)=EXTRACT(year FROM NOW()) AND EXTRACT(month FROM data_viagem)="+mes+")", 
    null, { raw: true })
    .then(function(data){
        return data;
        })
        .catch(error => {
        return error;
        });
        res.json({success : true, data : data[0]});
}


admcontrollers.estatistica= async (req, res) => {
   
    const { mes } = req.params;

    const data = await sequelize.query("SELECT (SELECT COUNT(*) AS nrclientes FROM clientes WHERE EXTRACT(year FROM data_insercao)=EXTRACT(year FROM NOW()) AND EXTRACT(month FROM data_insercao)="+ mes +"), (SELECT COUNT(*) AS nrviagens FROM viagem WHERE EXTRACT(year FROM data_viagem)=EXTRACT(year FROM NOW()) AND EXTRACT(month FROM data_viagem)="+mes+"), (SELECT COUNT(*) AS nrpedidos FROM pedidos WHERE EXTRACT(year FROM datapedido)=EXTRACT(year FROM NOW()) AND EXTRACT(month FROM datapedido)="+mes+")", 
    null, { raw: true })
    .then(function(data){
        return data;
        })
        .catch(error => {
        return error;
        });
        res.json({success : true, data : data[0]});
}




admcontrollers.viagem= async (req, res) => {

    console.log("\n\n\nAQUI\n\n\n");

    console.log(req.params);
    const { nviagem } = req.params;

    const data = await sequelize.query('SELECT viagem.nviagem, viagem.nprestador, viagem.nviatura, viagem.nadm, viagem.hora_chegada, viagem.hora_saida, viagem.data_viagem, viagem.disponibilidade,  (SELECT origem FROM trajetos WHERE idtrajeto=( SELECT idtrajeto FROM viagem_trajetos WHERE nviagem=viagem.nviagem AND ordem =(SELECT MIN(ordem) FROM viagem_trajetos WHERE nviagem=viagem.nviagem ))) AS origem, (SELECT destino FROM trajetos WHERE idtrajeto=( SELECT idtrajeto FROM viagem_trajetos WHERE nviagem=viagem.nviagem AND ordem =(SELECT MIN(ordem) FROM viagem_trajetos WHERE nviagem=viagem.nviagem ))) AS origemdestino, (SELECT destino FROM trajetos WHERE idtrajeto=( SELECT idtrajeto FROM viagem_trajetos WHERE nviagem=viagem.nviagem AND ordem =(SELECT MAX(ordem) FROM viagem_trajetos WHERE nviagem=viagem.nviagem ))) AS destinofinal FROM viagem WHERE viagem.nviagem='+nviagem, 
    null, { raw: true })
    .then(function(data){
        return data;
        })
        .catch(error => {
        return error;
        });
        res.json({success : true, data : data[0]});


}





admcontrollers.motorista_registar = async (req,res) => {

    console.log("\n\n\nAQUI\n\n\n");


    // data
    var data;
    const {nome, data_nascimento, morada, codigo_postal, email, telefone, foto} = req.body;

    console.log(nome + " " + data_nascimento + " " + morada + " " + codigo_postal + " " + email + " " + telefone + " " + foto );

    // create
    const datau = await tables.utilizador.create({
        
        nome:nome,
        data_nascimento: moment(data_nascimento, "YYYY-MM-DD"),
        morada:morada,
        codigo_postal:codigo_postal,
        email:email,
        telefone:telefone,
        foto:foto
    })
    .then(function(datau){
    return datau;
    })
    .catch(error =>{
    console.log("Erro: "+error)
    return error;
    });

    const datam = await tables.prestador_de_servico.create({
        nutilizador: datau.nutilizador,
        data_insercao: moment(moment(), "YYYY-MM-DD"),
        nadm: '1'
    })
    .then(function(datam){
    return datam;
    })
    .catch(error =>{
    console.log("Erro: "+error)
    return error;
    });


    data=datau+datam;

    // return res
    res.status(200).json({
    success: true,
    message: datau.nutilizador,
    data: data
    });
    }











//CONTINAUR ISTO --- SO ISTO FEITO PARA A PAGINA ADD CLIENTE EM ADMIN



    
admcontrollers.cliente_registar = async (req,res) => {

    console.log("\n\n\nAQUI\n\n\n");


    // data
    var data;
    const {nome, data_nascimento, morada, codigo_postal, nif, email, telefone, foto} = req.body;

    console.log(nome + " " + data_nascimento + " " + morada + " " + codigo_postal + " " + nif + " " + email + " " + telefone + " " + foto );

    // create
    const datau = await tables.utilizador.create({
        
        nome:nome,
        data_nascimento: moment(data_nascimento, "YYYY-MM-DD"),
        morada:morada,
        codigo_postal:codigo_postal,
        email:email,
        nif:nif,
        telefone:telefone,
        foto:foto
    })
    .then(function(datau){
    return datau;
    })
    .catch(error =>{
    console.log("Erro: "+error)
    return error;
    });

    const datam = await tables.clientes.create({
        nutilizador: datau.nutilizador,
        data_insercao: moment(moment(), "YYYY-MM-DD")

    })
    .then(function(datam){
    return datam;
    })
    .catch(error =>{
    console.log("Erro: "+error)
    return error;
    });


    data=datau+datam;

    // return res
    res.status(200).json({
    success: true,
    message: datau.nutilizador,
    data: data
    });
    }

admcontrollers.viagens= async (req, res) => {


    /*
    const data = await tables.viagem_trajetos.findAll({
       
          
        include: [{model: tables.trajetos, as: 'viagem_trajetos_trajetos'},
        {model: tables.viagem, as: 'viagem_trajetos_viagem'}
      
         ]
        
     
     
        })
        .then(function(data){
        return data;
        })
        .catch(error =>{
        return error;
        })
        res.json({ success: true, data: data });
        
    */





    const data = await sequelize.query('SELECT viagem.nviagem, viagem.nprestador, viagem.nviatura, viagem.nadm, viagem.hora_chegada, viagem.hora_saida, viagem.data_viagem, viagem.disponibilidade,  (SELECT origem FROM trajetos WHERE idtrajeto=( SELECT idtrajeto FROM viagem_trajetos WHERE nviagem=viagem.nviagem AND ordem =(SELECT MIN(ordem) FROM viagem_trajetos WHERE nviagem=viagem.nviagem ))) AS origem, (SELECT destino FROM trajetos WHERE idtrajeto=( SELECT idtrajeto FROM viagem_trajetos WHERE nviagem=viagem.nviagem AND ordem =(SELECT MIN(ordem) FROM viagem_trajetos WHERE nviagem=viagem.nviagem ))) AS origemdestino, (SELECT destino FROM trajetos WHERE idtrajeto=( SELECT idtrajeto FROM viagem_trajetos WHERE nviagem=viagem.nviagem AND ordem =(SELECT MAX(ordem) FROM viagem_trajetos WHERE nviagem=viagem.nviagem ))) AS destinofinal FROM viagem ORDER BY viagem.nviagem', 
    null, { raw: true })
    .then(function(data){
        return data;
        })
        .catch(error => {
        return error;
        });
        res.json({success : true, data : data[0]});

}

admcontrollers.trajetos_viagem= async (req, res) => {

    console.log(req.params);
    const { nviagem } = req.params;



    const data = await sequelize.query("SELECT ordem,origem,destino,origemcoord,destinocoord FROM viagem_trajetos INNER JOIN trajetos ON viagem_trajetos.idtrajeto=trajetos.idtrajeto WHERE nviagem="+nviagem+" ORDER BY ordem", 
    null, { raw: true })
    .then(function(data){
        return data;
        })
        .catch(error => {
        return error;
        });
        res.json({success : true, data : data[0]});

 

    /*
    const data = await tables.viagem_trajetos.findAll({
    where: { nviagem: nviagem },
    include: [ {model: tables.trajetos, as: 'viagem_trajetos_trajetos'} ]
    })
    .then(function(data){
    return data;
    })
    .catch(error =>{
    return error;
    })
    res.json({ success: true, data: data });
    */    

}

    



admcontrollers.municipe_listar = async (req, res) => {    // Munícipe duplicado do callcenter

    
    const data = await tables.clientes.findAll({
        include: [ 
            {model: tables.utilizador, as: 'clientes_utilizador'} 
        ]
    })
    .then(function(data){
    return data;
    })
    .catch(error => {
    return error;
    });
    res.json({success : true, data : data});
    
}



admcontrollers.comentario_listar = async (req, res) => {    // Munícipe duplicado do callcenter
    const { tipo } = req.params;

    const data = await tables.comentarios.findAll({
        where : {tipo:tipo}
    })
    .then(function(data){
    return data;
    })
    .catch(error => {
    return error;
    });
    res.json({success : true, data : data});
    
}




admcontrollers.prestador_listar= async (req, res) => {    // Prestador duplicado do callcenter

    const data = await tables.prestador_de_servico.findAll({
        include: [ 
            {model: tables.utilizador, as: 'prestador_utilizador'} 
        ]
    })
    .then(function(data){
    return data;
    })
    .catch(error => {
    return error;
    });
    res.json({success : true, data : data});
}




admcontrollers.prestador = async (req,res) => {    

            

            const { nutilizador } = req.params;
            const data = await tables.prestador_de_servico.findAll({

                include: [ {model: tables.utilizador, as: 'prestador_utilizador',   where: {nutilizador : nutilizador} } ]
                
            })
            .then(function(data){
            return data;
            })
            .catch(error =>{
            return error;
            })
            res.json({ success: true, data: data });
}


admcontrollers.cliente = async (req,res) => {    
            const { nutilizador } = req.params;
            const data = await tables.clientes.findAll({

                include: [ {model: tables.utilizador, as: 'clientes_utilizador',   where: {nutilizador : nutilizador} } ]

            })
            .then(function(data){
            return data;
            })
            .catch(error =>{
            return error;
            })
            res.json({ success: true, data: data });
}


admcontrollers.cliente_update = async (req,res) => {

	const { nutilizador } = req.params;
    const {nome, telefone, email, morada, codigo_postal } = req.body;
    
	const data = await tables.utilizador.update({
        nome:nome,
        telefone:telefone,
        email:email,
        morada:morada,
        codigo_postal:codigo_postal
        },
        {
        where: {nutilizador : nutilizador},
        })
		.then( function(data){
			return data;
		})
		.catch(error => {
			return error;
        });
        
	res.json({success:true, data:data, message:"Updated successful"});
};






module.exports = admcontrollers;



