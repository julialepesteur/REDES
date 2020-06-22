const imgcontrollers = {}


imgcontrollers.imagem= async (req, res, next) => {
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



module.exports = imgcontrollers;