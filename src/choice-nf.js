const generate = require('./controllers/generate-nf')
    , choiceTemplate = require('./templates/choice-template')
    , request = require('request')
    , fs = require('fs')
    , xmlDom = require('xmldom').DOMParser;

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

                let xmlDoc          = response.body;
                let xmlParser       = new xmlDom().parseFromString(xmlDoc, 'text/xml');
                let xmlOutPutXml    = xmlParser.getElementsByTagName('outputXML')[0].childNodes[0].nodeValue;
                
                resolve(xmlOutPutXml);
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}

const postLotInvoice    = function(invoiceType, object) {
    return new Promise((resolve, reject) => {
        choiceTemplate.createLotInvoiceModel(invoiceType, object, 'postLotInvoice')
        .then(postLotInvoiceResponse => {
            webServiceRequest(postLotInvoiceResponse.soapEnvelop, postLotInvoiceResponse.url, postLotInvoiceResponse.soapAction, object.config.diretorioDoCertificado, object.config.senhaDoCertificado)
            .then(webServiceResponse => {
                resolve(webServiceResponse);
            })
            .catch(webServiceResponseError => {
                reject(webServiceResponseError);
            })
        })
        .catch(postLotInvoiceResponseError => {
            console.log(postLotInvoiceResponseError);
            return postLotInvoiceResponseError;
        });
    })
}

const searchSituation   = function(invoiceType, object) {
    return new Promise((resolve, reject) => {
        choiceTemplate.searchSituacionInvoiceModel(invoiceType, object, 'searchSituation')
            .then(postSearchSituationResponse => {
                webServiceRequest(postSearchSituationResponse.soapEnvelop, postSearchSituationResponse.url, postSearchSituationResponse.soapAction, object.config.diretorioDoCertificado, object.config.senhaDoCertificado)
                    .then(webServiceResponse => {
                        resolve(webServiceResponse);
                    }).catch(webServiceResponseError => {
                        reject(webServiceResponseError);
                    })
            }).catch(postSearchSituationResponseError => {
                console.log(postSearchSituationResponseError);
                return postSearchSituationResponseError;
            });
    })
} 

const searchRpsLot      = function (invoiceType, object) {
    return new Promise((resolve, reject) => {
        choiceTemplate.searchRpsLotModel(invoiceType, object, 'searchRpsLot')
            .then(postSearchRpsLotResponse => {
                webServiceRequest(postSearchRpsLotResponse.soapEnvelop, postSearchRpsLotResponse.url, postSearchRpsLotResponse.soapAction, object.config.diretorioDoCertificado, object.config.senhaDoCertificado)
                    .then(webServiceResponse => {
                        resolve(webServiceResponse);
                    }).catch(webServiceResponseError => {
                        reject(webServiceResponseError);
                    })
            }).catch(postSearchRpsLotResponseError => {
                console.log(postSearchRpsLotResponseError);
                return postSearchRpsLotResponseError;
            });
    })
} 

const searchNfseByRps   = function (invoiceType, object) {
    return new Promise((resolve, reject) => {
        choiceTemplate.searchNfseByRpsModel(invoiceType, object, 'searchNfseByRps')
            .then(postSearchRpsLotResponse => {
                webServiceRequest(postSearchRpsLotResponse.soapEnvelop, postSearchRpsLotResponse.url, postSearchRpsLotResponse.soapAction, object.config.diretorioDoCertificado, object.config.senhaDoCertificado)
                    .then(webServiceResponse => {
                        resolve(webServiceResponse);
                    }).catch(webServiceResponseError => {
                        reject(webServiceResponseError);
                    })
            }).catch(postSearchRpsLotResponseError => {
                console.log(postSearchRpsLotResponseError);
                return postSearchRpsLotResponseError;
            });
    })
}

const searchInvoice     = function(invoiceType, object) {
    return new Promise((resolve, reject) => {
        choiceTemplate.searchInvoiceModel(invoiceType, object, 'searchInvoice')
            .then(postSearchInvoiceResponse => {
                webServiceRequest(postSearchInvoiceResponse.soapEnvelop, postSearchInvoiceResponse.url, postSearchInvoiceResponse.soapAction, object.config.diretorioDoCertificado, object.config.senhaDoCertificado)
                    .then(webServiceResponse => {
                        resolve(webServiceResponse);
                    }).catch(webServiceResponseError => {
                        reject(webServiceResponseError);
                    })
            }).catch(postSearchInvoiceResponseError => {
                console.log(postSearchInvoiceResponseError);
                return postSearchInvoiceResponseError;
            });
    })
} 

const cancelInvoice     = function(invoiceType, object) {
    return new Promise((resolve, reject) => {
        choiceTemplate.cancelInvoiceModel(invoiceType, object, 'cancelInvoice')
            .then(postCancelInvoiceResponse => {
                webServiceRequest(postCancelInvoiceResponse.soapEnvelop, postCancelInvoiceResponse.url, postCancelInvoiceResponse.soapAction, object.config.diretorioDoCertificado, object.config.senhaDoCertificado)
                    .then(webServiceResponse => {
                        resolve(webServiceResponse);
                    }).catch(webServiceResponseError => {
                        reject(webServiceResponseError);
                    })
            }).catch(postCancelInvoiceResponseError => {
                console.log(postCancelInvoiceResponseError);
                return postCancelInvoiceResponseError;
            });
    })
}

const postInvoice       = function (invoiceType, object) {
    return new Promise((resolve, reject) => {
        choiceTemplate.createInvoiceModel(invoiceType, object, 'postInvoice')
        .then(postInvoiceResponse => {
            webServiceRequest(postInvoiceResponse.soapEnvelop, postInvoiceResponse.url, postInvoiceResponse.soapAction, object.config.diretorioDoCertificado, object.config.senhaDoCertificado)
            .then(webServiceResponse => {
                resolve(webServiceResponse);
            })
            .catch(webServiceResponseError => {
                reject(webServiceResponseError);
            })
        })
        .catch(postInvoiceResponseError => {
            console.log(postInvoiceResponseError);
            return postInvoiceResponseError;
        });
    })    
}

module.exports = {
    postLotInvoice,
    postInvoice,
    searchSituation,
    searchInvoice,
    cancelInvoice,
    searchRpsLot,
    searchNfseByRps
}