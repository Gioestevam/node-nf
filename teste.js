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

nodenf.postInvoice('nfse', objectMaceio, 'homologacao')
.then(res => {
    console.log(res.body);
})
.catch(err => { console.log(67);
    console.log(err);
})