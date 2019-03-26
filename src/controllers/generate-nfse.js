var ginfes  = require('../templates/nfse/xml/ginfes'),
    portoAlegre  = require('../templates/nfse/xml/porto-alegre'),
    rioDeJaneiro = require('../templates/nfse/xml/rio-de-janeiro'),
    saoJoseDosPinhais = require('../templates/nfse/xml/sao-jose-dos-pinhais');

function chooseModel (object, action) {
    return new Promise((resolve, reject) => {
        const codigoMunicipio = object.config.codigoMunicipio;

        if (codigoMunicipio === '2704302' || codigoMunicipio === '3523909' || codigoMunicipio === '3513801' || codigoMunicipio === '3118601') {
            ginfes.createXml(object, action)
                .then(xmlFromGinfes => {
                    resolve(xmlFromGinfes);
                })
                .catch(errorGinfes => {
                    reject(errorGinfes);
                });
        }

        if (codigoMunicipio === '4314902') {
            portoAlegre.createXml(object, action)
                .then(xmlFromPortoAlegre => {
                    resolve(xmlFromPortoAlegre);
                })
                .catch(errorPortoAlegre => {
                    reject(errorPortoAlegre);
                });
        }

        if (codigoMunicipio === '3304557') {
            rioDeJaneiro.createXml(object, action)
                .then(xmlFromRioDeJaneiro => {
                    resolve(xmlFromRioDeJaneiro);
                })
                .catch(errorRioDeJaneiro => {
                    reject(errorRioDeJaneiro);
                });
        }

        if (codigoMunicipio === '4125506') {
            saoJoseDosPinhais.createXml(object, action)
                .then(xmlFromSaoJoseDosPinhais => {
                    resolve(xmlFromSaoJoseDosPinhais);
                })
                .catch(errorSaoJoseDosPinhais => {
                    reject(errorSaoJoseDosPinhais);
                });
        }
    })
}

module.exports = {
    chooseModel
}