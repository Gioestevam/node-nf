const generate = require('./generate-nf'),
    choiceTemplate = require('../templates/choice-template'),
    request = require('request'),
    fs = require('fs');

let resultArray = [];

function webServiceRequest(xmlEnveloped, url, soapAction = null, certificatePath, certificatePassword) {
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

const postLotInvoice = function (invoiceType, object) {
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

const postAndSearchLotInvoice = function (invoiceType, object, index) {
    if (index === 0) {
        let message = '';
        (object.length > 1) ? message = `${object.length} lotes enviados`: message = '1 lote enviado';
        console.log(message);
    }

    let newIndex = index + 1;
    index = newIndex;
    console.log(newIndex);
    
    return new Promise((resolvePostAndSearchLotInvoice, rejectPostAndSearchLotInvoice) => {
        choiceTemplate.createLotInvoiceModel(invoiceType, object[newIndex - 1], 'postLotInvoice')
            .then(postLotInvoiceResponse => {
                webServiceRequest(postLotInvoiceResponse.soapEnvelop, postLotInvoiceResponse.url, postLotInvoiceResponse.soapAction, object[newIndex - 1].config.diretorioDoCertificado, object[newIndex - 1].config.senhaDoCertificado)
                    .then(webServiceResponse => {
                        if (webServiceResponse.body.split('ns3:Protocolo&gt;')[1]) {
                            const objectToSearchRpsLot = {
                                config: object[newIndex - 1].config,
                                prestador: object[newIndex - 1].rps[0].prestador,
                                "protocolo": webServiceResponse.body.split('ns3:Protocolo&gt;')[1].split('&lt;/ns3:Protocolo')[0].replace('&lt;/', '')
                            }

                            setTimeout(function () {
                                searchRpsLot(invoiceType, objectToSearchRpsLot)
                                    .then(resolveSearchRpsLot => {
                                        if ((newIndex - 1) < (object.length - 1)) {
                                            resultArray.push(resolveSearchRpsLot.body);
                                            postAndSearchLotInvoice('nfse', object, newIndex);
                                        } else {
                                            resultArray.push(resolveSearchRpsLot.body);
                                            const result = {
                                                message: `${object.length} lotes enviados`,
                                                result: resultArray
                                            }

                                            resolvePostAndSearchLotInvoice(result);
                                        }
                                    })
                                    .catch(rejectSearchRpsLot => {
                                        console.log(rejectSearchRpsLot);
                                        reject(rejectSearchRpsLot);
                                    })
                            }, 10000);
                        } else if (webServiceResponse.body.split('Protocolo&gt;')[1]) {
                            const objectToSearchRpsLot = {
                                config: object[newIndex - 1].config,
                                prestador: object[newIndex - 1].rps[0].prestador,
                                "protocolo": webServiceResponse.body.split('Protocolo&gt;')[1].split('&lt;/Protocolo')[0].replace('&lt;/', '')
                            }

                            setTimeout(function () {
                                searchRpsLot(invoiceType, objectToSearchRpsLot)
                                    .then(resolveSearchRpsLot => {
                                        if ((newIndex - 1) < (object.length - 1)) {
                                            postAndSearchLotInvoice('nfse', object, newIndex);
                                        } else {
                                            const result = {
                                                message: `${object.length} lotes enviados`,
                                                result: resolveSearchRpsLot
                                            }

                                            resolvePostAndSearchLotInvoice(result);
                                        }
                                    })
                                    .catch(rejectSearchRpsLot => {
                                        console.log(rejectSearchRpsLot);
                                        rejectPostAndSearchLotInvoice(rejectSearchRpsLot);
                                    })
                            }, 10000);
                        } else {
                            let newIndex = index + 1;
                            index = newIndex;
                            if ((newIndex - 1) < (object.length - 1)) {
                                postAndSearchLotInvoice('nfse', object, newIndex);
                            } else {
                                const result = {
                                    message: `${object.length} lotes enviados`,
                                    result: webServiceResponse
                                }
                                resolvePostAndSearchLotInvoice(result);
                            }
                        }
                    })
                    .catch(webServiceResponseError => {
                        rejectPostAndSearchLotInvoice(webServiceResponseError);
                    })
            })
            .catch(postLotInvoiceResponseError => {
                console.log(postLotInvoiceResponseError);
                resolvePostAndSearchLotInvoice(postLotInvoiceResponseError);
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
                return postSearchSituationResponseError;
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
                            if (webServiceResponse.body.split('Mensagem&gt;')[1]) {
                                mensagem = webServiceResponse.body.split('Mensagem&gt;')[1].split('&lt;/Mensagem')[0].replace('&lt;/', '');
                            }
                            const codigo = webServiceResponse.body.split('Codigo&gt;')[1].split('&lt;/Codigo')[0].replace('&lt;/', '');

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
                        } else {
                            resolve(webServiceResponse);
                        }
                    }).catch(webServiceResponseError => {
                        reject(webServiceResponseError);
                    })
            }).catch(postSearchRpsLotResponseError => {
                console.log(postSearchRpsLotResponseError);
                return postSearchRpsLotResponseError;
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
                return postSearchRpsLotResponseError;
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
                return postSearchInvoiceResponseError;
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
                return postCancelInvoiceResponseError;
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
                return postInvoiceResponseError;
            });
    })
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