const nodenf = require('../../../src/controllers/choice-nf');

const objectSampa = {
	"config": {
		"diretorioDoCertificado": "/home/ofm/Downloads/pfx/client-sao-paulo.pfx",
		"senhaDoCertificado": "123456789",
		"producaoHomologacao": "producao",
		"codigoMunicipio": "3550308"
	},
	"prestador": {
		"cnpj": "17845667000198",
		"inscricaoMunicipal": "25099"
	},
	"numeroNfse": 214
}

nodenf.cancelInvoice('nfse', objectSampa)
	.then(res => {
		console.log(res);
	}).catch(err => {
		console.log(err);
	})