const generate = require('./generate-nf'),
    choiceTemplate = require('../templates/choice-template'),
    request = require('request'),
    fs = require('fs');

let resultArrayPostLotInvoice = [];
let resultArraySearchRpsLot = [];

const postLotInvoice = function (invoiceType, object, index) {
    resultArrayPostLotInvoice = [];
    
    if (index === 0) {
        let message = '';
        (object.length > 1) ? message = `${object.length} lotes enviados`: message = '1 lote enviado';
        console.log(message);
    }
    
    let newIndex = index + 1;
    index = newIndex;

    return new Promise((resolvePostLot, rejectPostLot) => {
        choiceTemplate.createLotInvoiceModel(invoiceType, object[newIndex - 1], 'postLotInvoice')
        .then(postLotInvoiceResponse => {
            webServiceRequest(postLotInvoiceResponse.soapEnvelop, postLotInvoiceResponse.url, postLotInvoiceResponse.soapAction, object[newIndex - 1].config.diretorioDoCertificado, object[newIndex - 1].config.senhaDoCertificado)
                .then(webServiceResponse => {
                    if ((newIndex - 1) < (object.length - 1)) {
                        resultArrayPostLotInvoice.push(webServiceResponse.body);
                        postLotInvoice('nfse', object, newIndex);
                    } else {
                        resultArrayPostLotInvoice.push(webServiceResponse.body);
                        const result = {
                            message: `${object.length} lotes enviados`,
                            result: resultArrayPostLotInvoice
                        }
                        
                        resolvePostLot(result);
                    }
                })
                .catch(webServiceResponseError => {
                    console.log(webServiceResponseError);
                    rejectPostLot(webServiceResponseError);
                })
        })
        .catch(postLotInvoiceResponseError => {
            console.log(postLotInvoiceResponseError);
            rejectPostLot(postLotInvoiceResponseError);
        });
    })
}

const postAndSearchLotInvoice = async function (invoiceType, object, index) {
    if (index === 0) {
        let message = '';
        (object.length > 1) ? message = `${object.length} lotes enviados`: message = '1 lote enviado';
        console.log(message);
    }

    let newIndex = index + 1;
    index = newIndex;

    return new Promise((resolvePostAndSearch, rejectPostAndSearch) => {
        choiceTemplate.createLotInvoiceModel(invoiceType, object[newIndex - 1], 'postLotInvoice')
            .then(postLotInvoiceResponse => {
                webServiceRequest(postLotInvoiceResponse.soapEnvelop, postLotInvoiceResponse.url, postLotInvoiceResponse.soapAction, object[newIndex - 1].config.diretorioDoCertificado, object[newIndex - 1].config.senhaDoCertificado)
                    .then(webServiceResponse => {
                        let objectToSearchRpsLot = {};
                        resultArrayPostLotInvoice.push(webServiceResponse.body);
                        
                        if (webServiceResponse.body.split('ns3:Protocolo&gt;')[1]) {
                            objectToSearchRpsLot = {
                                config: object[newIndex - 1].config,
                                prestador: object[newIndex - 1].rps[0].prestador,
                                "protocolo": webServiceResponse.body.split('ns3:Protocolo&gt;')[1].split('&lt;/ns3:Protocolo')[0].replace('&lt;/', '')
                            }
                        } else if (webServiceResponse.body.split('Protocolo&gt;')[1]) {
                            objectToSearchRpsLot = {
                                config: object[newIndex - 1].config,
                                prestador: object[newIndex - 1].rps[0].prestador,
                                "protocolo": webServiceResponse.body.split('Protocolo&gt;')[1].split('&lt;/Protocolo')[0].replace('&lt;/', '')
                            }
                        } else {
                            let newIndex = index + 1;
                            index = newIndex;
                            if ((newIndex - 1) < (object.length - 1)) {
                                postAndSearchLotInvoice('nfse', object, newIndex);
                            } else {
                                const result = {
                                    message: `${object.length} lotes enviados`,
                                    result: webServiceResponse.body
                                }
                                
                                resolvePostAndSearch(result);
                            }
                        }
    
                        if (objectToSearchRpsLot.config) {
                            setTimeout(function () { 
                                searchRpsLot(invoiceType, objectToSearchRpsLot)
                                    .then(resolveSearchRpsLot => {
                                        if ((newIndex - 1) < (object.length - 1)) {
                                            resultArraySearchRpsLot.push(resolveSearchRpsLot);
                                            postAndSearchLotInvoice('nfse', object, newIndex);
                                        } else {
                                            resultArraySearchRpsLot.push(resolveSearchRpsLot);
                                            
                                            const result = { 
                                                message: `${object.length} lotes enviados`,
                                                resultSearchRpsLot: resultArraySearchRpsLot,
                                                resultPostLotInvoice: resultArrayPostLotInvoice
                                            }
                                            console.log(result);
                                            resolvePostAndSearch(result);
                                        }
                                    })
                                    .catch(rejectSearchRpsLot => {
                                        console.log(rejectSearchRpsLot);
                                        rejectPostAndSearch(rejectSearchRpsLot);
                                    })
                            }, 10000);
                        }
                    })
                    .catch(webServiceResponseError => {
                        rejectPostAndSearch(webServiceResponseError);
                    })
            })
            .catch(postLotInvoiceResponseError => {
                console.log(postLotInvoiceResponseError);
                rejectPostAndSearch(postLotInvoiceResponseError);
            });
    })
}

const searchSituation = function (invoiceType, object) {
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
                resolve(postSearchSituationResponseError);
            });
    })
}

const searchRpsLot = function (invoiceType, object) {
    return new Promise((resolve, reject) => {
        choiceTemplate.searchRpsLotModel(invoiceType, object, 'searchRpsLot')
            .then(postSearchRpsLotResponse => {
                webServiceRequest(postSearchRpsLotResponse.soapEnvelop, postSearchRpsLotResponse.url, postSearchRpsLotResponse.soapAction, object.config.diretorioDoCertificado, object.config.senhaDoCertificado)
                    .then(webServiceResponse => {
                        if (invoiceType === 'nfse' && webServiceResponse.body.split('ns4:Codigo&gt;')[1]) {
                            let mensagem = 'sem mensagem';
                            if (webServiceResponse.body.split('ns4:Mensagem&gt;')[1]) {
                                mensagem = webServiceResponse.body.split('ns4:Mensagem&gt;')[1].split('&lt;/ns4:Mensagem')[0].replace('&lt;/', '');
                            }
                            const codigo = webServiceResponse.body.split('ns4:Codigo&gt;')[1].split('&lt;/ns4:Codigo')[0].replace('&lt;/', '');

                            if (codigo === 'E4' || codigo === 'A02') {
                                console.log(mensagem);
                                setTimeout(() => {
                                    searchRpsLot(invoiceType, object)
                                        .then(recursiveResponse => {
                                            resolve(recursiveResponse)
                                        })
                                        .catch(recursiveError => {
                                            reject(recursiveError);
                                        })
                                }, 15000);
                            } else {
                                console.log(mensagem);
                                resolve(webServiceResponse);
                            }
                        } else if (invoiceType === 'nfse' && webServiceResponse.body.split('Codigo&gt;')[1]) {
                            let mensagem = 'sem mensagem';
                            const responseBody = webServiceResponse.body;
                            if (responseBody.split('Mensagem&gt;')[1]) {
                                mensagem = responseBody.split('Mensagem&gt;')[1].split('&lt;/Mensagem')[0].replace('&lt;/', '');
                            }
                            const codigo = responseBody.split('Codigo&gt;')[1].split('&lt;/Codigo')[0].replace('&lt;/', '');

                            if (codigo === 'E4' || codigo === 'A02') {
                                console.log(mensagem);

                                setTimeout(() => {
                                    searchRpsLot(invoiceType, object)
                                        .then(recursiveResponse => {
                                            resolve(recursiveResponse)
                                        })
                                        .catch(recursiveError => {
                                            reject(recursiveError);
                                        })
                                }, 15000);
                            } else {
                                console.log(mensagem);

                                resolve(responseBody);
                            }
                        } else {
                            resolve(webServiceResponse.body);
                        }
                    }).catch(webServiceResponseError => {
                        reject(webServiceResponseError);
                    });
            }).catch(postSearchRpsLotResponseError => {
                console.log(postSearchRpsLotResponseError);
                reject(postSearchRpsLotResponseError);
            });
    })
}

const searchNfseByRps = function (invoiceType, object) {
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
                reject(postSearchRpsLotResponseError);
            });
    })
}

const searchInvoice = function (invoiceType, object) {
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
                reject(postSearchInvoiceResponseError);
            });
    })
}

const cancelInvoice = function (invoiceType, object) {
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
                reject(postCancelInvoiceResponseError);
            });
    })
}

const postInvoice = function (invoiceType, object) {
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
                reject(postInvoiceResponseError);
            });
    })
}

function webServiceRequest(xmlEnveloped, url, soapAction = null, certificatePath, certificatePassword) {
    try {
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
                
                request(options, function (error, response, body) {
                    if (error) {
                        const result = {
                            message: 'Verifique se o webservice está online',
                            error: error 
                        };
                        console.log(result);
                        reject(result);
                    }
                    
                    resolve(response);
                });
            } catch (error) {
                console.log(error);
                reject(error);
            }
        })        
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    postLotInvoice,
    postAndSearchLotInvoice,
    postInvoice,
    searchSituation,
    searchInvoice,
    cancelInvoice,
    searchRpsLot,
    searchNfseByRps
}