var generateNfse = require('./nfse/generate-nfse');

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
    createInvoiceModel
}