
const tables=require('./tables.js');

var moment = require('moment');
moment().format();

const cccontrollers = {}


/*
{
		"idcc":"1",
		"ncliente":   "1",
		"idtrajeto": "1",
        "datapedido": "01-01-1999",
        "hora_pedido": "00:00",
        "ida_e_volta": "1",
        "nlugares":   "1",
        "partilhar":  "false",
        "descricao":  "1",
        "estado": "true",
        
        "quantidade":"", 
        "tipo_bagagem":"", 
        "carac":"", 
        "nquantidade":""
}	
*/

cccontrollers.pedido_registar = async (req,res) => {
    // data
    var data;
    const {idcc, ncliente, idtrajeto, datapedido,hora_pedido,ida_e_volta,nlugares,partilhar,descricao,estado, quantidade, tipo_bagagem, carac, nquantidade} = req.body;
    // create
    const datap = await tables.pedidos.create({
        ncliente:   ncliente,
        idtrajeto: idtrajeto,
        datapedido: moment(datapedido, "DD-MM-YYYY"),
        hora_pedido: hora_pedido,
        ida_e_volta: ida_e_volta,
        nlugares:   nlugares,
        partilhar:  partilhar,
        descricao:  descricao,
        estado: estado
    })
    .then(function(datap){
    return datap;
    })
    .catch(error =>{
    console.log("Erro: "+error)
    return error;
    })


    const dataccp = await tables.callcenter_pedidos.create({
        ncall:   idcc,
        npedido: datap.npedido
    })
    .then(function(dataccp){
    return dataccp;
    })
    .catch(error =>{
    console.log("Erro: "+error)
    return error;
    })


    data=datap+dataccp;

    if (quantidade!==""){

        console.log("\nMerda");

        const databag = await tables.bagagem.create({
            npedido: datap.npedido,
            quantidade:quantidade,
            tipo_bagagem:tipo_bagagem
        })
        .then(function(databag){
        return databag;
        })
        .catch(error =>{
        console.log("Erro: "+error)
        return error;
        })
    
        data=data+databag;
    }

    if (nquantidade!==""){

        const datanec = await tables.necessidade_especial.create({
            
            npedido: datap.npedido,
            carac:carac,
            quantidade:nquantidade
        })
        .then(function(datanec){
        return datanec;
        })
        .catch(error =>{
        console.log("Erro: "+error)
        return error;
        })
    
        data=data+datanec;

    }
    // return res
    res.status(200).json({
    success: true,
    message:"Pedido registado",
    data: data
    });
    }


    /*

    {
			"idcc":"1",
			"nome":"nome1",
            "data_nascimento": "02-01-1999",
            "morada":"morada2",
            "codigo_postal":"codigo_postal2",
            "email":"email2",
            "telefone":"93823482"
    }	
    
    */

    cccontrollers.municipe_registar = async (req,res) => {
        // data
        var data;
        const {idcc, nome, data_nascimento, morada, codigo_postal, email, telefone} = req.body;
        // create
        const datau = await tables.utilizador.create({
            nome:nome,
            data_nascimento: moment(data_nascimento, "DD-MM-YYYY"),
            morada:morada,
            codigo_postal:codigo_postal,
            email:email,
            telefone:telefone
        })
        .then(function(datau){
        return datau;
        })
        .catch(error =>{
        console.log("Erro: "+error)
        return error;
        })
    
        const datac = await tables.clientes.create({
            nutilizador: datau.nutilizador,
            data_insercao: moment(moment(), "DD-MM-YYYY")
        })
        .then(function(datac){
        return datac;
        })
        .catch(error =>{
        console.log("Erro: "+error)
        return error;
        })

        const datacc = await tables.clientes_callcenter.create({
            ncall:idcc,
            ncliente:datac.ncliente
        })
        .then(function(datacc){
        return datacc;
        })
        .catch(error =>{
        console.log("Erro: "+error)
        return error;
        })

        data=datau+datac+datacc;

        // return res
        res.status(200).json({
        success: true,
        message:"Pedido registado",
        data: data
        });
        }




        // http://localhost:3000/callcenter/listarmunicipe



        cccontrollers.municipe_listar= async (req, res) => {

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



        //https://stackoverflow.com/questions/53971268/node-sequelize-find-where-like-wildcard
        const Sequelize = require('sequelize');
        const Op = Sequelize.Op;

        cccontrollers.municipe_mostrar = async (req,res) => {    //mesma treta que o listar mas filtra com um WHERE xx LIKE '%yy%' 

            

            const { nome } = req.params;
            const data = await tables.clientes.findAll({

                include: [ {model: tables.utilizador, as: 'clientes_utilizador',   where: { nome: { [Op.like]: '%'+nome+'%'}} } ]


                //include: [ {model: tables.utilizador, as: 'clientes_utilizador',  where: { nome: nome }} ]
                 
            })
            .then(function(data){
            return data;
            })
            .catch(error =>{
            return error;
            })
            res.json({ success: true, data: data });
            }














            cccontrollers.prestador_listar= async (req, res) => {

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
    

    
            cccontrollers.prestador_mostrar = async (req,res) => {    //mesma treta que o listar mas filtra com um WHERE xx LIKE '%yy%' 
    
                console.log("\n\n AQUI:")
    
                const { nome } = req.params;
                const data = await tables.prestador_de_servico.findAll({
    
                    include: [ {model: tables.utilizador, as: 'prestador_utilizador',   where: { nome: { [Op.like]: '%'+nome+'%'}} } ]
    
                     
                })
                .then(function(data){
                return data;
                })
                .catch(error =>{
                return error;
                })
                res.json({ success: true, data: data });


                
                }
    





                cccontrollers.prestador_comentario= async (req, res) => {

                    const data = await tables.comentarios.findAll({
                        include: [ 
                            {model: tables.utilizador, as: 'comentario_utilizador'} 
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














/*
    controllers.genero_list= async (req, res) => {
        const data = await Genero.findAll({
        })
        .then(function(data){
        return data;
        })
        .catch(error => {
        return error;
        });
        res.json({success : true, data : data});
    }

    controllers.filme_list= async (req, res) => {
        const data = await Filme.findAll({
        include: [ 
            {model: Genero, as: 'generos'} 
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

    controllers.filme_remove = async (req,res) => {
        // parameter get id
        const { id } = req.body;
        // delete por sequelize
        const del = await Filme.destroy({
        where: { id: id}
        })
        res.json({success:true,deleted:del,message:"Removido com sucesso"});
        }



    controllers.filme_update = async (req,res) => {
        // parameter get id
        const { id } = req.params;
        // parameter POST
        const {descricao, titulo, foto, genero} = req.body;
        // Update data
        const data = await Filme.update({
        descricao:descricao,
        titulo:titulo,
        foto:foto,
        genero:genero
        },
        {
        where: { id: id}
        })
        .then( function(data){
        return data;
        })
        .catch(error => {
        return error;
        })
        res.json({success:true, data:data, message:"Atualizado com sucesso"});
        }

 
    
    controllers.filme_img= async (req, res, next) => {
        const file = req.file

        console.log(req.file)
        console.log('Imagem: ' + res.req.file.filename);
         if (!file) {
            const error = new Error('Insira imagem')
            error.httpStatusCode = 400
            return next(error)
            }
         res.send(res.req.file.filename)
    }
    
    
    controllers.filme_detail = async (req,res) => {
        const { id } = req.params;
        const data = await Filme.findAll({
        where: { id: id },
        include: [ {model: Genero, as: 'generos'} ]
        })
        .then(function(data){
        return data;
        })
        .catch(error =>{
        return error;
        })
        res.json({ success: true, data: data });
        }






    controllers.filme_create = async (req,res) => {
        // data
        const { descricao, titulo, foto, genero } = req.body;
        // create
        const data = await Filme.create({
        descricao: descricao,
        titulo: titulo,
        foto: foto,
        genero: genero
        })
        .then(function(data){
        return data;
        })
        .catch(error =>{
        console.log("Erro: "+error)
        return error;
        })
        // return res
        res.status(200).json({
        success: true,
        message:"Registado",
        data: data
        });
        }

     controllers.generos_add = async ( req, res) => {
                //Cria Generos
        const response = await sequelize.sync().then(function() {
                Genero.create({
                    id: '0',
                    descricao: 'Drama'
                });
                Genero.create({
                    id: '1',
                    descricao: 'Ação'
                });
                Genero.create({
                    id: '2',
                    descricao: 'Aventura'
                });
                Genero.create({
                    id: '3',
                    descricao: 'Suspense'
                });
                Genero.create({
                    id: '4',
                    descricao: 'Terror'
                });
                Genero.create({
                    id: '5',
                    descricao: 'Comédia'
                });
                Genero.create({
                    id: '6',
                    descricao: 'Animação'
                });
                Genero.create({
                    id: '7',
                    descricao: 'Ficção'
                });
                Genero.create({
                    id: '8',
                    descricao: 'Fantasia'
                });
            })
            .catch(err => {
            return err;
            });
            res.json(response)
            }

    */





    module.exports = cccontrollers;