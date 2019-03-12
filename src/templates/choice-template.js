var generateNfse = require('./nfse/generate-nfse');

function createLotInvoiceModel(invoiceType, object, action) {
    return new Promise((resolve, reject) => {
        if (invoiceType === 'nfe') {
    
        }
        if (invoiceType === 'nfse') {
            return generateNfse.chooseModel(object, action)
            .then(nfseXml => {
                resolve(nfseXml);
            })
            .catch(errorNfseXml => {
                console.log(errorNfseXml);
                reject(errorNfseXml);
            })
        }
        if (invoiceType === 'cte') {
    
        }
        if (invoiceType === 'nfce') {
    
        }
        if (invoiceType === 'danfe') {
    
        }
        if (invoiceType === 'darf') {
    
        }
    })
}

function searchSituacionInvoiceModel(invoiceType, object, action) {
    return new Promise((resolve, reject) => {
        if (invoiceType === 'nfse') {
            return generateNfse.chooseModel(object, action)
            .then(nfseXml => {
                resolve(nfseXml);
            })
            .catch(errorNfseXml => {
                console.log(errorNfseXml);
                reject(errorNfseXml);
            })
        }
    }) 
}

function searchRpsLotModel(invoiceType, object, action) {
    return new Promise((resolve, reject) => {
        if (invoiceType === 'nfse') {
            return generateNfse.chooseModel(object, action)
            .then(nfseXml => {
                resolve(nfseXml);
            })
            .catch(errorNfseXml => {
                console.log(errorNfseXml);
                reject(errorNfseXml);
            })
        }
    }) 
}

function searchNfseByRpsModel(invoiceType, object, action) {
    return new Promise((resolve, reject) => {
        if (invoiceType === 'nfse') {
            return generateNfse.chooseModel(object, action)
            .then(nfseXml => {
                resolve(nfseXml);
            })
            .catch(errorNfseXml => {
                console.log(errorNfseXml);
                reject(errorNfseXml);
            })
        }
    }) 
}

function searchInvoiceModel(invoiceType, object, action) {
    return new Promise((resolve, reject) => {
        if (invoiceType === 'nfe') {
    
        }
        if (invoiceType === 'nfse') {
            return generateNfse.chooseModel(object, action)
            .then(nfseXml => {
                resolve(nfseXml);
            })
            .catch(errorNfseXml => {
                console.log(errorNfseXml);
                reject(errorNfseXml);
            })
        }
        if (invoiceType === 'cte') {
    
        }
        if (invoiceType === 'nfce') {
    
        }
        if (invoiceType === 'danfe') {
    
        }
        if (invoiceType === 'darf') {
    
        }
    }) 
}

function cancelInvoiceModel(invoiceType, object, action) {
    return new Promise((resolve, reject) => {
        if (invoiceType === 'nfe') {
    
        }
        if (invoiceType === 'nfse') {
            return generateNfse.chooseModel(object, action)
            .then(nfseXml => {
                resolve(nfseXml);
            })
            .catch(errorNfseXml => {
                console.log(errorNfseXml);
                reject(errorNfseXml);
            })
        }
        if (invoiceType === 'cte') {
    
        }
        if (invoiceType === 'nfce') {
    
        }
        if (invoiceType === 'danfe') {
    
        }
        if (invoiceType === 'darf') {
    
        }
    }) 
}

function createInvoiceModel(invoiceType, object, action) {
    return new Promise((resolve, reject) => {
        if (invoiceType === 'nfe') {
            
        }
        if (invoiceType === 'nfse') {
            return generateNfse.chooseModel(object, action)
            .then(nfseXml => {
                resolve(nfseXml);
            })
            .catch(errorNfseXml => {
                console.log(errorNfseXml);
                reject(errorNfseXml);
            })
        }
        if (invoiceType === 'cte') {
    
        }
        if (invoiceType === 'nfce') {
    
        }
        if (invoiceType === 'danfe') {
    
        }
        if (invoiceType === 'darf') {
    
        }
    })   
}


module.exports = {
    createLotInvoiceModel,
    createInvoiceModel,
    searchSituacionInvoiceModel,
    searchRpsLotModel,
    searchNfseByRpsModel,
    searchInvoiceModel,
    cancelInvoiceModel
}