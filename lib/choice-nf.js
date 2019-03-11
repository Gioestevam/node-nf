var generate = require('./controllers/generate-nf')
    , choiceTemplate = require('./templates/choice-template')
    , request = require('request')
    , fs = require('fs');

exports.choiceNf = choiceNf

function requestWebService (xmlEnveloped, url, soapAction = null, caminhoCertificado, senhaCertificado) {
    var options = {
        method: 'POST',
        url: url,
        agentOptions: {
            pfx: fs.readFileSync(caminhoCertificado),
            passphrase: senhaCertificado,
        },
        headers: {
            "Accept": "text/xml",
            "Content-Type": "text/xml;charset=UTF-8"
        },
        body: xmlEnveloped
    };

    if (soapAction) {
        options.headers = {
            "Accept": "text/xml",
            "Content-Type": "text/xml;charset=UTF-8",
            "SOAPAction": soapAction,
        }
    }

    request(options, function(error, response, body) {
        if (error) {
            return {
                error: error
            }
        }

        return response;
    });
}

choiceNf.prototype.enviarNotaFiscal = function(tipoNotaFiscal, object, url, soapAction = null, caminhoCertificado, senhaCertificado) {
    var envolopeXml = choiceTemplate.gerarModeloNota(tipoNotaFiscal, object);
    var response    = requestWebService(envolopeXml, url, soapAction, caminhoCertificado, senhaCertificado);
    return response;
}

choiceNf.prototype.consultaSituacao = function(object) {
    var envolopeXml = choiceTemplate.choiceTemplate(object);
    var response    = requestWebService(envolopeXml, url, soapAction, caminhoCertificado, senhaCertificado);
    return response; 
} 

choiceNf.prototype.consultaNf = function(object) {
    var envolopeXml = choiceTemplate.choiceTemplate(object);
    var response    = requestWebService(envolopeXml, url, soapAction, caminhoCertificado, senhaCertificado);
    return response; 
} 

choiceNf.prototype.cancelamentoNf = function(object) {
    var envolopeXml = choiceTemplate.escolhaTemplate(object);    
    var response    = requestWebService(envolopeXml, url, soapAction, caminhoCertificado, senhaCertificado);
    return response;
}
