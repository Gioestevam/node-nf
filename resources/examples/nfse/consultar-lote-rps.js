const nodenf = require('../../../src/controllers/choice-nf');


/**
 * ConsultarLoteRpsV3
 * @param {string} config.diretorioDoCertificado - obrigatório - Atalho para o certificado digital no formato pfx
 * @param {string} config.senhaDoCertificado - obrigatório - Senha do certificado digital no formato pfx
 * @param {string} config.producaoHomologacao - obrigartório - Escolher entre envio para "homologacao" ou "producao"
 * @param {string} config.codigoMunicipio - obrigatório - Procurar pelo número do município (do emissor - dono do certificado) no site do IBGE
 * @param {string} prestador.cnpj - CNPJ da empresa prestadora do serviço (geralmente é a emissora - mas não necessariamente)
 * @param {string} prestador.inscricaoMunicipal - Inscrição municipal da empresa prestadora do serviço (geralmente é a emissora - mas não necessariamente)
 * @param {string} protocolo - Número de protocolo recebido no envio do lote de rps (RecepcionarLoteRpsV3)
 */

 //Exemplo GINFES
const objectGinfesSearchRpsLot = {
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
	"protocolo": "9314844"
}

nodenf.searchRpsLot('nfse', objectGinfesSearchRpsLot)
	.then(res => {
		console.log(res);
	}).catch(err => {
		console.log(err);
	})