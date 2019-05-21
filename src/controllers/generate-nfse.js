const citiesJSON = require('../../resources/json/cities.json');
var catalao = require('../templates/nfse/xml/catalao'),
    ginfes = require('../templates/nfse/xml/ginfes'),
    portoAlegre = require('../templates/nfse/xml/porto-alegre'),
    rioDeJaneiro = require('../templates/nfse/xml/rio-de-janeiro'),
    saoPaulo = require('../templates/nfse/xml/sao-paulo'),
    saoJoseDosPinhais = require('../templates/nfse/xml/sao-jose-dos-pinhais');

function chooseModel(object, action) {
    return new Promise((resolve, reject) => {
        const codigoMunicipio = object.config.codigoMunicipio;
        const citiesArray = JSON.parse(JSON.stringify(citiesJSON));
        let keyword = '';
        
        for (let i = 0; i < citiesArray.cities.length; i++) {
            const city = citiesArray.cities[i];
            
            if (city.code === codigoMunicipio) {
                keyword = city.nfseKeyword;
            }
        }
        
        if (keyword === 'ginfes') {
            ginfes.createXml(object, action)
                .then(xmlFromGinfes => {
                    resolve(xmlFromGinfes);
                })
                .catch(errorGinfes => {
                    reject(errorGinfes);
                });
        }

        if (keyword === 'catalao') {
            catalao.createXml(object, action)
                .then(xmlFromCatalao => {
                    resolve(xmlFromCatalao);
                })
                .catch(errorCatalao => {
                    reject(errorCatalao);
                });
        }

        if (keyword === 'portoAlegre') {
            portoAlegre.createXml(object, action)
                .then(xmlFromPortoAlegre => {
                    resolve(xmlFromPortoAlegre);
                })
                .catch(errorPortoAlegre => {
                    reject(errorPortoAlegre);
                });
        }

        if (keyword === 'saoPaulo') {
            saoPaulo.createXml(object, action)
                .then(xmlFromSaoPaulo => {
                    resolve(xmlFromSaoPaulo);
                })
                .catch(errorSaoPaulo => {
                    reject(errorSaoPaulo);
                });
        }

        if (keyword === 'rioDeJaneiro') {
            rioDeJaneiro.createXml(object, action)
                .then(xmlFromRioDeJaneiro => {
                    resolve(xmlFromRioDeJaneiro);
                })
                .catch(errorRioDeJaneiro => {
                    reject(errorRioDeJaneiro);
                });
        }

        if (keyword === 'saoJoseDosPinhais') {
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