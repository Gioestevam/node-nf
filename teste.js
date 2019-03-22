const nodenf = require('./src/controllers/choice-nf');

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
		"cnpj": "26390085000406		",
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
			"cnpj": "26390085000406		",
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

nodenf.postInvoice('nfse', objectSaoJoseDosPinhais, 'homologacao')
.then(res => {
    console.log(res);
})
.catch(err => {
    console.log(err);
})