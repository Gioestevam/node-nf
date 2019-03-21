const generate = require('./generate-nf')
    , choiceTemplate = require('../templates/choice-template')
    , request = require('request')
    , fs = require('fs');

function webServiceRequest (xmlEnveloped, url, soapAction = null, certificatePath, certificatePassword) {
    return new Promise((resolve, reject) => {
        try {
            var options = {
                method: 'POST',
                url: url,
                agentOptions: {
                    pfx: fs.readFileSync(certificatePath),
                    passphrase: certificatePassword,
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
                
                resolve(response);
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}

const postInvoice = function(invoiceType, object) {
    return new Promise((resolve, reject) => {
        choiceTemplate.createInvoiceModel(invoiceType, object, 'postInvoice')
        .then(postInvoiceResponse => {
            webServiceRequest(postInvoiceResponse.soapEnvelop, postInvoiceResponse.url, postInvoiceResponse.soapAction, object.config.diretorioDoCertificado, object.config.senhaDoCertificado)
            .then(webServiceResponse => {
                resolve(webServiceResponse);
            })
            .catch(webServiceResponseError => {
                console.log(webServiceResponseError);
                reject(webServiceResponseError);
            })
        })
        .catch(postInvoiceResponseError => {
            console.log(postInvoiceResponseError);
            return postInvoiceResponseError;
        });
    })
}

const searchSituation = function(object) {
    var envelopXml = choiceTemplate.choiceTemplate(object);
    var response    = webServiceRequest(envelopXml, url, soapAction);
    return response; 
} 

const searchInvoice = function(object) {
    var envelopXml = choiceTemplate.choiceTemplate(object);
    var response    = webServiceRequest(envelopXml, url, soapAction);
    return response; 
} 

const cancelInvoice = function(object) {
    var envelopXml = choiceTemplate.escolhaTemplate(object);    
    var response    = webServiceRequest(envelopXml, url, soapAction);
    return response;
}

module.exports = {
    postInvoice,
    searchSituation,
    searchInvoice,
    cancelInvoice
}