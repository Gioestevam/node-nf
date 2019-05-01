const nodenf = require('../../../src/controllers/choice-nf');

/**
 * RecepcionarLoteRpsV3
 * @param {string} config.diretorioDoCertificado - obrigatório - Atalho para o certificado digital no formato pfx
 * @param {string} config.senhaDoCertificado - obrigatório - Senha do certificado digital no formato pfx
 * @param {string} config.producaoHomologacao - obrigartório - Escolher entre envio para "homologacao" ou "producao"
 * @param {string} config.codigoMunicipio - obrigatório - Procurar pelo número do município (do emissor - dono do certificado) no site do IBGE
 * @param {string} emissor.cnpj - CNPJ da empresa relacionada ao certificado digital
 * @param {string} emissor.inscricaoMunicipal - Inscrição municipal da empresa relacionada ao certificado digital
 * @param {number} rps.tipo - Recibo provisório de serviço do tipo 1
 * @param {string} rps.dataEmissao - Data de emissão da nota no formato "YYYY-MM-DDTHH:MI:SS" (Ex.: 2019-03-21)
 * @param {string} rps.naturezaOperacao - Código de natureza da operação (1 - Tributação no município; 2 - Tributação fora do município; 3 - Isenção; 4 - Imune; 5 - Exigibilidade suspensa por decisão judicial; 6 - Exigibilidade suspensa por procedimento)
 * @param {string} rps.optanteSimplesNacional - Campo de optante pelo simples nacional (1 - Sim; 2 - Não)
 * @param {string} rps.incentivadorCultural - Campo de incentivador cultural (1 - Sim; 2 - Não)
 * @param {string} rps.status - Campo de status (1 - Normal; 2 - Cancelado)
 * @param {number} rps.servicos.valorServicos
 * @param {number} rps.servicos.valorDeducoes
 * @param {number} rps.servicos.valorPis
 * @param {number} rps.servicos.valorCofins
 * @param {number} rps.servicos.valorInss
 * @param {number} rps.servicos.valorIr
 * @param {number} rps.servicos.valorCsll
 * @param {number} rps.servicos.issRetido
 * @param {number} rps.servicos.valorIss
 * @param {number} rps.servicos.baseCalculo
 * @param {number} rps.servicos.aliquota
 * @param {number} rps.servicos.valorLiquidoNfse
 * @param {string} rps.servicos.itemListaServico
 * @param {string} rps.servicos.codigoTributacaoMunicipio
 * @param {string} rps.servicos.discriminacao
 * @param {string} rps.servicos.codigoMunicipio
 * @param {string} rps.prestador.cnpj - CNPJ da empresa prestadora do serviço (geralmente é a emissora - mas não necessariamente)
 * @param {string} rps.prestador.inscricaoMunicipal - Inscrição municipal da empresa prestadora do serviço (geralmente é a emissora - mas não necessariamente)
 * @param {string} rps.tomador.cnpjCpf - obrigatório - CNPJ ou CPF da empresa ou pessoa física que pagou pelo serviço
 * @param {string} rps.tomador.inscricaoMunicipal - obrigatório no caso de uma empresa ser a tomadora do serviço - Inscrição municipal da empresa que pagou pelo serviço
 * @param {string} rps.tomador.razaoSocial - obrigatório no caso de uma empresa ser a tomadora do serviço - Razão social da empresa que pagou pelo serviço
 * @param {string} rps.tomador.endereco.endereco - Logradouro da empresa ou pessoa física que pagou pelo serviço
 * @param {string} rps.tomador.endereco.numero
 * @param {string} rps.tomador.endereco.bairro
 * @param {string} rps.tomador.endereco.codigoMunicipio
 * @param {string} rps.tomador.endereco.uf
 * @param {string} rps.tomador.endereco.cep
 * @param {string} rps.tomador.contato.telefone
 * @param {string} rps.tomador.contato.email
 */

//Exemplo GINFES
const objectSaoPaulo = {
	"config": {
		"diretorioDoCertificado": "/home/ofm/Downloads/pfx/client-catalao.pfx",
		"senhaDoCertificado": "Cargox2018",
		"producaoHomologacao": "producao",
		"codigoMunicipio": "3550308"
	},
	"emissor": {
		"cnpj": "14797440000126",
		"inscricaoMunicipal": "44857624"
	},
	"rps": [{
		"tipo": "RPS",
		"dataEmissao": "2019-03-19",
		"naturezaOperacao": "1",
		"optanteSimplesNacional": "2",
		"incentivadorCultural": "2",
		"status": "N",
		"servico": {
			"valorServicos": 105.00,
			"valorDeducoes": 0.00,
			"valorPis": 0.00,
			"valorCofins": 0.00,
			"valorInss": 0.00,
			"valorIr": 0.00,
			"valorCsll": 0.00,
			"issRetido": false,
			"valorIss": 2.10,
			"baseCalculo": 105.00,
			"aliquota": 0.0200,
			"valorLiquidoNfse": 105.00,
			"itemListaServico": "1009",
			"codigoTributacaoMunicipio": "461840200",
			"discriminacao": "Ref. Servico Conforme O.S. Foi feito ajustes nas configuracoes do SITEF.;Foi feito a instalacao do PINPAD.;Foi feito testes de venda com cartao.",
			"codigoMunicipio": "3523909"
		},
		"prestador": {
			"cnpj": "14797440000126",
			"inscricaoMunicipal": "44857624"
		},
		"tomador": {
			"cnpjCpf": "70523431000118",
			"inscricaoMunicipal": "0743140200169",
			"razaoSocial": "ALANA E JOSEFA CONSTRUCOES LTDA",
			"endereco": {
				"endereco": "Rua Manuel de Autoguia",
				"numero": "791",
				"bairro": "TATUAPE",
				"codigoMunicipio": "3550308",
				"uf": "SP",
				"cep": "3313020"
			},
			"contato": {
				"telefone": "8232211212",
				"email": "analu-melo@hotmail.com"
			}
		}
	}]
};

const objectGinfes = [{
	"config": {
		"diretorioDoCertificado": "/home/ofm/Downloads/pfx/client-itu.pfx",
		"senhaDoCertificado": "brmed2018",
		"producaoHomologacao": "homologacao",
		"codigoMunicipio": "3523909"
	},
	"emissor": {
		"cnpj": "17845667000192",
		"inscricaoMunicipal": "25099"
	},
	"rps": [{
		"tipo": 1,
		"dataEmissao": "2019-03-19T09:17:00",
		"naturezaOperacao": "1",
		"optanteSimplesNacional": "2",
		"incentivadorCultural": "2",
		"status": "1",
		"servico": {
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
			"itemListaServico": "1009",
			"codigoTributacaoMunicipio": "461840200",
			"discriminacao": "Ref. Servico Conforme O.S. Foi feito ajustes nas configuracoes do SITEF.;Foi feito a instalacao do PINPAD.;Foi feito testes de venda com cartao.",
			"codigoMunicipio": "3523909"
		},
		"prestador": {
			"cnpj": "17845667000192",
			"inscricaoMunicipal": "25099"
		},
		"tomador": {
			"cnpjCpf": "70523431000118",
			"inscricaoMunicipal": "0743140200169",
			"razaoSocial": "ALANA E JOSEFA CONSTRUCOES LTDA",
			"endereco": {
				"endereco": "Rua Manuel de Autoguia",
				"numero": "791",
				"bairro": "TATUAPE",
				"codigoMunicipio": "3550308",
				"uf": "SP",
				"cep": "3313020"
			},
			"contato": {
				"telefone": "8232211212",
				"email": "analu-melo@hotmail.com"
			}
		}
	}]
}];

const objectRio = {
	"config": {
		"diretorioDoCertificado": "/home/ofm/Downloads/pfx/client-rio-de-janeiro.pfx",
		"senhaDoCertificado": "12345678",
		"producaoHomologacao": "homologacao",
		"codigoMunicipio": "3304557"
	},
	"emissor": {
		"cnpj": "10393366000121",
		"inscricaoMunicipal": "04386965"
	},
	"rps": [{
		"tipo": 1,
		"dataEmissao": "2019-03-19T09:17:00",
		"naturezaOperacao": "1",
		"optanteSimplesNacional": "2",
		"incentivadorCultural": "2",
		"status": "1",
		"servico": {
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
			"itemListaServico": "1009",
			"codigoTributacaoMunicipio": "461840200",
			"discriminacao": "Ref. Servico Conforme O.S. Foi feito ajustes nas configuracoes do SITEF.;Foi feito a instalacao do PINPAD.;Foi feito testes de venda com cartao.",
			"codigoMunicipio": "3523909"
		},
		"prestador": {
			"cnpj": "10393366000121",
			"inscricaoMunicipal": "04386965"
		},
		"tomador": {
			"cnpjCpf": "70523431000118",
			"inscricaoMunicipal": "0743140200169",
			"razaoSocial": "ALANA E JOSEFA CONSTRUCOES LTDA",
			"endereco": {
				"endereco": "Rua Manuel de Autoguia",
				"numero": "791",
				"bairro": "TATUAPE",
				"codigoMunicipio": "3550308",
				"uf": "SP",
				"cep": "3313020"
			},
			"contato": {
				"telefone": "8232211212",
				"email": "analu-melo@hotmail.com"
			}
		}
	}]
};

nodenf.postAndSearchLotInvoice('nfse', objectGinfes, 0)
	.then(res => {
		console.log(res);
	})
	.catch(err => {
		console.log(err);
	});