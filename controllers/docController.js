const tables=require('./tables.js');

const doccontrollers = {}


doccontrollers.documento= async (req, res, next) => {
    const file = req.file

    console.log("\n\n\nAQUI\n\n\n");

    console.log(req.file)
    console.log('Doc: ' + res.req.file.filename);
     if (!file) {
        const error = new Error('No Doc')
        error.httpStatusCode = 400
        return next(error)
        }
     res.send(res.req.file.filename)
}


doccontrollers.add_doc = async (req,res) => {
    // data
    const { nutilizador,nome_doc } = req.body;
    // create
    const data = await documentos.create({
    nutilizador: nutilizador,
    nome_doc: nome_doc
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



doccontrollers.listar= async (req, res) => {    

        console.log("\n\n\n\\n\n\n\nAQUI\n\n\n\n\n\n")

        const { nutilizador } = req.params;

        const data = await tables.documentos.findAll({
            include: [ 
                {model: tables.utilizador, as: 'documentos_utilizador', where:{nutilizador:nutilizador}} 
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




module.exports = doccontrollers;