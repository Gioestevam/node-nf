const nodenf = require('./src/choice-nf');

const objectMaceio = {
	"config": {
		"diretorioDoCertificado": "/home/ofm/Downloads/pfx/client-maceio.pfx",
		"senhaDoCertificado": "1234",
		"producaoHomologacao": "homologacao",
		"codigoMunicipio": "2704302"
	},
	"emissor": {
		"cnpj": "10771824000119",
		"inscricaoMunicipal": "900855312"
	},
	"rps": [{
		"tipo": 1,
		"dataEmissao": "2019-03-25T00:00:00",
		"naturezaOperacao": "1",
		"optanteSimplesNacional": "2",
		"incentivadorCultural": "2",
		"status": "1",
		"servicos": [{
			"valorServicos": 105.00,
			"valorDeducoes": 0.00,
			"valorPis": 0.00,
			"valorCofins": 0.00,
			"valorInss": 0.00,
			"valorIr": 0.00,
			"valorCsll": 0.00,
			"issRetido": 2,
			"valorIss": 2.10,
			"baseCalculo": 105.00,
			"aliquota": 0.0200,
			"valorLiquidoNfse": 105.00,
			"itemListaServico": "107",
			"codigoTributacaoMunicipio": "6209100",
			"discriminacao": "Ref. Servico Conforme O.S. Foi feito ajustes nas configuracoes do SITEF.;Foi feito a instalacao do PINPAD.;Foi feito testes de venda com cartao.",
			"codigoMunicipío": "2704302"
		}],
		"prestador": {
			"cnpj": "10771824000119",
			"inscricaoMunicipal": "900855312"
		},
		"tomador": {
			"cnpjCpf": "08485955000198",
			"inscricaoMunicipal": "900081220",
			"razaoSocial": "JOALHERIA DIVINO ESPIRITO SANTO LTDA ME",
			"endereco": {
				"endereco": "R AGERSON DANTAS",
				"numero": "66",
				"bairro": "Centro",
				"codigoMunicipio": "2704302",
				"uf": "AL",
				"cep": "57020310"
			},
			"contato": {
				"telefone": "8232211212",
				"email": "analu-melo@hotmail.com"
			}
		}
	}]
}

const objectItu = {
	"config": {
		"diretorioDoCertificado": "/home/ofm/Downloads/pfx/client-itu.pfx",
		"senhaDoCertificado": "brmed2018",
		"producaoHomologacao": "homologacao",
		"codigoMunicipio": "2704302"
	},
	"emissor": {
		"cnpj": "17845667000198",
		"inscricaoMunicipal": "900855312"
	},
	"rps": [{
		"tipo": 1,
		"dataEmissao": "2019-03-25T00:00:00",
		"naturezaOperacao": "1",
		"optanteSimplesNacional": "2",
		"incentivadorCultural": "2",
		"status": "1",
		"servicos": [{
			"valorServicos": 105.00,
			"valorDeducoes": 0.00,
			"valorPis": 0.00,
			"valorCofins": 0.00,
			"valorInss": 0.00,
			"valorIr": 0.00,
			"valorCsll": 0.00,
			"issRetido": 2,
			"valorIss": 2.10,
			"baseCalculo": 105.00,
			"aliquota": 0.0200,
			"valorLiquidoNfse": 105.00,
			"itemListaServico": "107",
			"codigoTributacaoMunicipio": "6209100",
			"discriminacao": "Ref. Servico Conforme O.S. Foi feito ajustes nas configuracoes do SITEF.;Foi feito a instalacao do PINPAD.;Foi feito testes de venda com cartao.",
			"codigoMunicipío": "2704302"
		}],
		"prestador": {
			"cnpj": "17845667000198",
			"inscricaoMunicipal": "900855312"
		},
		"tomador": {
			"cnpjCpf": "08485955000198",
			"inscricaoMunicipal": "900081220",
			"razaoSocial": "JOALHERIA DIVINO ESPIRITO SANTO LTDA ME",
			"endereco": {
				"endereco": "R AGERSON DANTAS",
				"numero": "66",
				"bairro": "Centro",
				"codigoMunicipio": "2704302",
				"uf": "AL",
				"cep": "57020310"
			},
			"contato": {
				"telefone": "8232211212",
				"email": "analu-melo@hotmail.com"
			}
		}
	}]
}

const objectRioSearchSituationAndSearchRpsLot = {
	"config": {
		"diretorioDoCertificado": "/home/ofm/Downloads/pfx/client-rio.pfx",
		"senhaDoCertificado": "12345678",
		"producaoHomologacao": "homologacao",
		"codigoMunicipio": "3304557"
	},
	"prestador": {
		"cnpj": "10393366000121",
		"inscricaoMunicipal": "04386965"
	},
	"protocolo": "489"
}

const objectRioSearchNfseByRps = {
	"config": {
		"diretorioDoCertificado": "/home/ofm/Downloads/pfx/client-rio.pfx",
		"senhaDoCertificado": "12345678",
		"producaoHomologacao": "homologacao",
		"codigoMunicipio": "3304557"
	},
	"identificacaoRps": {
		"numero": 65,
		"serie": "123",
		"tipo": 1
	},
	"prestador": {
		"cnpj": "10393366000121",
		"inscricaoMunicipal": "04386965"
	}
}

const objectRioSearchInvoice = {
	"config": {
		"diretorioDoCertificado": "/home/ofm/Downloads/pfx/client-rio.pfx",
		"senhaDoCertificado": "12345678",
		"producaoHomologacao": "homologacao",
		"codigoMunicipio": "3304557"
	},
	"prestador": {
		"cnpj": "10393366000121",
		"inscricaoMunicipal": "04386965"
	},
	"periodoEmissao": {
		"dataInicial": "2019-01-29",
		"dataFinal": "2019-01-29"
	},
	"tomador": {
		"cpfCnpj": "12299281460"
	}
}

const objectRioCancelInvoice = {
	"config": {
		"diretorioDoCertificado": "/home/ofm/Downloads/pfx/client-rio.pfx",
		"senhaDoCertificado": "12345678",
		"producaoHomologacao": "homologacao",
		"codigoMunicipio": "3304557"
	},
	"infPedidoCancelamento" : {
		"identificacaoNfse": {
			"numero": 65,
			"cnpj": "10393366000121",
			"inscricaoMunicipal": "04386965",
			"codigoMunicipio" : "3304557"
		},
		"codigoCancelamento": 0
	}
}

const objectRioPostInvoice = {
	"config": {
		"diretorioDoCertificado": "/home/ofm/Downloads/pfx/client-rio.pfx",
		"senhaDoCertificado": "12345678",
		"producaoHomologacao": "homologacao",
		"codigoMunicipio": "3304557"
	},
	"emissor": {
		"cnpj": "10771824000119",
		"inscricaoMunicipal": "04386965"
	},
	"rps": [{
		"tipo": 1,
		"dataEmissao": "2019-03-12T00:00:00",
		"naturezaOperacao": "1",
		"optanteSimplesNacional": "2",
		"incentivadorCultural": "2",
		"status": "1",
		"serie": "1234",
		"servicos": [{
			"valorServicos": 105.00,
			"valorDeducoes": 0.00,
			"valorPis": 0.00,
			"valorCofins": 0.00,
			"valorInss": 0.00,
			"valorIr": 0.00,
			"valorCsll": 0.00,
			"issRetido": 2,
			"valorIss": 2.10,
			"baseCalculo": 105.00,
			"aliquota": 0.0200,
			"valorLiquidoNfse": 105.00,
			"itemListaServico": "1.02",
			"codigoTributacaoMunicipio": "6209100",
			"discriminacao": "Ref. Servico Conforme O.S. Foi feito ajustes nas configuracoes do SITEF.;Foi feito a instalacao do PINPAD.;Foi feito testes de venda com cartao.",
			"codigoMunicipío": "2704302"
		}],
		"prestador": {
			"cnpj": "10771824000119",
			"inscricaoMunicipal": "04386965"
		},
		"tomador": {
			"cnpjCpf": "10771824000119",
			"inscricaoMunicipal": "04386965",
			"razaoSocial": "JOALHERIA DIVINO ESPIRITO SANTO LTDA ME",
			"endereco": {
				"endereco": "R AGERSON DANTAS",
				"numero": "66",
				"bairro": "Centro",
				"codigoMunicipio": "2704302",
				"uf": "AL",
				"cep": "57020310"
			},
			"contato": {
				"telefone": "8232211212",
				"email": "analu-melo@hotmail.com"
			}
		}
	}]
}

// nodenf.postLotInvoice('nfse', objectMaceio)
// 	.then(res => {
// 		console.log(res.body);
// 	})
// 	.catch(err => { console.log(67);
// 		console.log(err);
// 	})

// nodenf.searchSituation('nfse', objectRioSearchSituationAndSearchRpsLot)
// 	.then(res => {
// 		console.log(res);
// 	}).catch(err => {
// 		console.log(err)
// 	})

// nodenf.searchRpsLot('nfse', objectRioSearchSituationAndSearchRpsLot)
// 	.then(res => {
// 		console.log(res);
// 	}).catch(err => {
// 		console.log(err);
// 	})

// nodenf.searchNfseByRps('nfse', objectRioSearchNfseByRps)
// 	.then(res => {
// 		console.log(res);
// 	}).catch(err => {
// 		console.log(err);
// 	})

// nodenf.searchInvoice('nfse', objectRioSearchInvoice)
// 	.then(res => {
// 		console.log(res);
// 	}).catch(err => {
// 		console.log(err);
// 	})

// nodenf.cancelInvoice('nfse', objectRioCancelInvoice)
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