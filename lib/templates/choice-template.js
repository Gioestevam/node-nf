var generateNfse = require('./nfse/generate-nfse');

function gerarModeloNota(tipoNotaFiscal, object) {
    if (tipoNotaFiscal === 'nfe') {

    }
    if (tipoNotaFiscal === 'nfse') {
        return generateNfse.escolhaModelo(object);
    }
    if (tipoNotaFiscal === 'cte') {

    }
    if (tipoNotaFiscal === 'nfce') {

    }
    if (tipoNotaFiscal === 'danfe') {

    }
    if (tipoNotaFiscal === 'darf') {

    }
}

module.exports = {
    gerarModeloNota
}