var ginfes  = require('./xml/ginfes'),
    portoAlegre  = require('./xml/porto-alegre'),
    rioDeJaneiro = require('./xml/rio-de-janeiro');

function chooseModel (object, action) {
    return new Promise((resolve, reject) => {
        switch (object.config.codigoMunicipio) {
            case '2704302':
                ginfes.createXml(object, action)
                .then(xmlFromGinfes => {
                    resolve(xmlFromGinfes);
                })
                .catch(errorGinfes => {
                    reject(errorGinfes);
                });
                break;
            case '4314902':
                portoAlegre.createXml(object, action)
                .then(xmlFromPortoAlegre => {
                    resolve(xmlFromPortoAlegre);
                })
                .catch(errorPortoAlegre => {
                    reject(errorPortoAlegre);
                });
                break;
    
            case '3304557':
                rioDeJaneiro.createXml(object, action)
                .then(xmlFromRioDeJaneiro => {
                    resolve(xmlFromRioDeJaneiro);
                })
                .catch(errorRioDeJaneiro => {
                    reject(errorRioDeJaneiro);
                });
                break;

            default:
                break;
        }
    })
}

module.exports = {
    chooseModel
}