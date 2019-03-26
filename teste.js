const nodenf = require('./src/controllers/choice-nf');

/**
 * RecepcionarLoteRpsV3
 */

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
		"dataEmissao": "2019-03-21T00:00:00",
		"naturezaOperacao": "1",
		"optanteSimplesNacional": "2",
		"incentivadorCultural": "2",
		"status": "1",
		"servicos": [{
			"valorServicos": "105.00",
			"valorDeducoes": "0.00",
			"valorPis": "0.00",
			"valorCofins": "0.00",
			"valorInss": "0.00",
			"valorIr": "0.00",
			"valorCsll": "0.00",
			"issRetido": "2",
			"valorIss": "2.10",
			"baseCalculo": "105.00",
			"aliquota": "0.0200",
			"valorLiquidoNfse": "105.00",
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

const objectDiadema = {
	"config": {
		"diretorioDoCertificado": "/home/ofm/Downloads/pfx/client-diadema.pfx",
		"senhaDoCertificado": "Endsp@20!8",
		"producaoHomologacao": "homologacao",
		"codigoMunicipio": "3513801"
	},
	"emissor": {
		"cnpj": "26390085000155",
		"inscricaoMunicipal": "73797"
	},
	"rps": [{
		"tipo": 1,
		"dataEmissao": "2019-03-19T09:17:00",
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
			"cnpj": "26390085000155",
			"inscricaoMunicipal": "73797"
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
		"codigoMunicipio": "3523909"
	},
	"emissor": {
		"cnpj": "17845667000198",
		"inscricaoMunicipal": "25099"
	},
	"rps": [{
		"tipo": 1,
		"dataEmissao": "2019-03-19T09:17:00",
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
			"inscricaoMunicipal": "25099"
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

const objectContagem = {
	"config": {
		"diretorioDoCertificado": "/home/ofm/Downloads/pfx/client-contagem.pfx",
		"senhaDoCertificado": "Endmg@20!8",
		"producaoHomologacao": "homologacao",
		"codigoMunicipio": "3118601"
	},
	"emissor": {
		"cnpj": "26390085000589",
		"inscricaoMunicipal": "72094962"
	},
	"rps": [{
		"tipo": 1,
		"dataEmissao": "2019-03-19T09:17:00",
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
			"cnpj": "26390085000589",
			"inscricaoMunicipal": "72094962"
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

const objectRioDeJaneiro = {
	"config": {
		"diretorioDoCertificado": "/home/ofm/Downloads/pfx/client-rio-de-janeiro.pfx",
		"senhaDoCertificado": "12345678",
		"producaoHomologacao": "homologacao",
		"codigoMunicipio": "3304557"
	},
	"emissor": {
		"cnpj": "17845667000198",
		"inscricaoMunicipal": "25099"
	},
	"rps": [{
		"tipo": 1,
		"dataEmissao": "2019-03-19T09:17:00",
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
			"inscricaoMunicipal": "25099"
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

const objectPortoAlegre = {
	"config": {
		"diretorioDoCertificado": "/home/ofm/Downloads/pfx/client-porto-alegre.pfx",
		"senhaDoCertificado": "Endpoa@20!8",
		"producaoHomologacao": "homologacao",
		"codigoMunicipio": "4314902"
	},
	"emissor": {
		"cnpj": "26390085000317",
		"inscricaoMunicipal": "28770820"
	},
	"rps": [{
		"tipo": 1,
		"dataEmissao": "2019-03-19T09:17:00",
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
			"cnpj": "26390085000317",
			"inscricaoMunicipal": "28770820"
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

const objectSaoJoseDosPinhais = {
	"config": {
		"diretorioDoCertificado": "/home/ofm/Downloads/pfx/client-sao-jose-dos-pinhais.pfx",
		"senhaDoCertificado": "Endpr@20!8",
		"producaoHomologacao": "homologacao",
		"codigoMunicipio": "4125506"
	},
	"emissor": {
		"cnpj": "26390085000406",
		"inscricaoMunicipal": "28770820"
	},
	"rps": [{
		"tipo": 1,
		"dataEmissao": "2019-03-19T09:17:00",
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
			"codigoTributacaoMunicipio": "631940001",
			"discriminacao": "Ref. Servico Conforme O.S. Foi feito ajustes nas configuracoes do SITEF.;Foi feito a instalacao do PINPAD.;Foi feito testes de venda com cartao.",
			"codigoMunicipío": "2704302"
		}],
		"prestador": {
			"cnpj": "26390085000406",
			"inscricaoMunicipal": "28770820"
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

/**
 * ConsultarLoteRpsV3 e ConsultarSituacaoLoteRpsV3
 */

const objectRioSearchSituationAndSearchRpsLot = {
	"config": {
		"diretorioDoCertificado": "/home/ofm/Downloads/pfx/client-maceio.pfx",
		"senhaDoCertificado": "1234",
		"producaoHomologacao": "homologacao",
		"codigoMunicipio": "2704302"
	},
	"prestador": {
		"cnpj": "10771824000119",
		"inscricaoMunicipal": "900855312"
	},
	"protocolo": "489"
}

const objectItuSearchSituationAndSearchRpsLot = {
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
	"protocolo": "9304084"
}

/**
 * ConsultarNfsePorRpsV3
 */

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

const objectItuSearchNfseByRps = {
	"config": {
		"diretorioDoCertificado": "/home/ofm/Downloads/pfx/client-itu.pfx",
		"senhaDoCertificado": "brmed2018",
		"producaoHomologacao": "homologacao",
		"codigoMunicipio": "3523909"
	},
	"identificacaoRps": {
		"numero": 65,
		"serie": "123",
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

const objectItuSearchInvoice = {
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
const objectMaceioCancelInvoice = {
	"config": {
		"diretorioDoCertificado": "/home/ofm/Downloads/pfx/client-maceio.pfx",
		"senhaDoCertificado": "1234",
		"producaoHomologacao": "homologacao",
		"codigoMunicipio": "2704302"
	},
	"infPedidoCancelamento" : {
		"identificacaoNfse": {
			"numero": 9303278,
			"cnpj": "10771824000119",
			"inscricaoMunicipal": "900855312",
			"codigoMunicipio" : "2704302"
		},
		"codigoCancelamento": 0
	}
}

const objectItuCancelInvoice = {
	"config": {
		"diretorioDoCertificado": "/home/ofm/Downloads/pfx/client-itu.pfx",
		"senhaDoCertificado": "brmed2018",
		"producaoHomologacao": "homologacao",
		"codigoMunicipio": "3523909"
	},
	"infPedidoCancelamento" : {
		"identificacaoNfse": {
			"numero": 9303278,
			"cnpj": "10771824000119",
			"inscricaoMunicipal": "900855312",
			"codigoMunicipio" : "2704302"
		},
		"codigoCancelamento": 0
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

/**
 * GerarNfse
 */

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

// nodenf.postLotInvoice('nfse', objectItu)
// 	.then(res => {
// 		console.log(res.body);
// 	})
// 	.catch(err => {
// 		console.log(err);
// 	})

// nodenf.searchSituation('nfse', objectItuSearchSituationAndSearchRpsLot)
// 	.then(res => {
// 		console.log(res);
// 	}).catch(err => {
// 		console.log(err)
// 	})

// nodenf.searchRpsLot('nfse', objectItuSearchSituationAndSearchRpsLot)
// 	.then(res => {
// 		console.log(res);
// 	}).catch(err => {
// 		console.log(err);
// 	})

// nodenf.searchNfseByRps('nfse', objectItuSearchNfseByRps)
// 	.then(res => {
// 		console.log(res);
// 	}).catch(err => {
// 		console.log(err);
// 	})

nodenf.searchInvoice('nfse', objectItuSearchInvoice)
	.then(res => {
		console.log(res);
	}).catch(err => {
		console.log(err);
	})

// nodenf.cancelInvoice('nfse', objectItuCancelInvoice)
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
