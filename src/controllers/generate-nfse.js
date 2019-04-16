const citiesJSON = require('../../resources/json/cities.json');
var ginfes = require('../templates/nfse/xml/ginfes'),
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
        console.log(keyword);
        if (keyword === 'ginfes') {
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

        if (codigoMunicipio === '3550308') {
            saoPaulo.createXml(object, action)
                .then(xmlFromSaoPaulo => {
                    resolve(xmlFromSaoPaulo);
                })
                .catch(errorSaoPaulo => {
                    reject(errorSaoPaulo);
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