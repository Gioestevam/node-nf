const nodenf = require('./src/controllers/choice-nf');

/**
 * ConsultarNfsePorRpsV3
 */

const objectGinfesSearchNfseByRps = {
	"config": {
		"diretorioDoCertificado": "/home/ofm/Downloads/pfx/client-itu.pfx",
		"senhaDoCertificado": "brmed2018",
		"producaoHomologacao": "homologacao",	
		"codigoMunicipio": "3523909"
	},
	"identificacaoRps": {
		"numero": 15543793754810,
		"serie": "RPS",
		"tipo": 1
	},
	"prestador": {
		"cnpj": "17845667000198",
		"inscricaoMunicipal": "25099"
	}
}

/**
 * ConsultarNfseV3
 */
const objectGinfesSearchInvoice = {
	"config": {
		"diretorioDoCertificado": "/home/ofm/Downloads/pfx/client-itu.pfx",
		"senhaDoCertificado": "brmed2018",
		"producaoHomologacao": "homologacao",
		"codigoMunicipio": "3523909"
	},
	"prestador": {
		"cnpj": "17845667000198",
		"inscricaoMunicipal": "25099"
	},
	"periodoEmissao": {
		"dataInicial": "2019-01-29 00:00:00",
		"dataFinal": "2019-01-29 00:00:00"
	},
	"tomador": {
		"cnpjCpf": "08485955000198"
	}
}

/**
 * CancelarNfseV3
 */
const objectGinfesCancelInvoiceV2 = {
	"config": {
		"diretorioDoCertificado": "/home/ofm/Downloads/pfx/client-itu.pfx",
		"senhaDoCertificado": "brmed2018",
		"producaoHomologacao": "homologacao",
		"codigoMunicipio": "3523909"
	},
	"prestador": {
		"cnpj": "17845667000198",
		"inscricaoMunicipal": "25099"
	},
	"numeroNfse": 214
}

// nodenf.searchNfseByRps('nfse', objectItuSearchNfseByRps)
// 	.then(res => {
// 		console.log(res);
// 	}).catch(err => {
// 		console.log(err);
// 	})

// nodenf.searchInvoice('nfse', objectItuSearchInvoice)
// 	.then(res => {
// 		console.log(res);
// 	}).catch(err => {
// 		console.log(err);
// 	})

// nodenf.cancelInvoice('nfse', objectItuCancelInvoiceV2)
// 	.then(res => {
// 		console.log(res);
// 	}).catch(err => {
// 		console.log(err);
// 	})

// nodenf.postInvoice('nfse', objectRioPostInvoice)
// 	.then(res => {
// 		console.log(res);
// 	}).catch(err => {
// 		console.log(err);
// 	})
