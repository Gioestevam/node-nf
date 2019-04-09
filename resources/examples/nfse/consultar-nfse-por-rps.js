const nodenf = require('../../../src/controllers/choice-nf');

/**
 * ConsultarNfsePorRpsV3
 * @param {string} config.diretorioDoCertificado - obrigatório - Atalho para o certificado digital no formato pfx
 * @param {string} config.senhaDoCertificado - obrigatório - Senha do certificado digital no formato pfx
 * @param {string} config.producaoHomologacao - obrigartório - Escolher entre envio para "homologacao" ou "producao"
 * @param {string} config.codigoMunicipio - obrigatório - Procurar pelo número do município (do emissor - dono do certificado) no site do IBGE
 * @param {string} identificacaoRps.numero - obrigatorio - Número retornado na consulta do lote rps em ListaNfse->CompNfse->Nfse->InfNfse->IdentificacaoRps->Numero (ConsultarLoteRpsV3)
 * @param {string} identificacaoRps.serie - obrigatorio - Série retornada na consulta do lote rps em ListaNfse->CompNfse->Nfse->InfNfse->IdentificacaoRps->Serie (ConsultarLoteRpsV3)
 * @param {string} identificacaoRps.tipo - obrigatorio - Tipo retornado na consulta do lote rps em ListaNfse->CompNfse->Nfse->InfNfse->IdentificacaoRps->Tipo (ConsultarLoteRpsV3)
 * @param {string} prestador.cnpj - CNPJ da empresa prestadora do serviço (geralmente é a emissora - mas não necessariamente)
 * @param {string} prestador.inscricaoMunicipal - Inscrição municipal da empresa prestadora do serviço (geralmente é a emissora - mas não necessariamente)
 */

const objectGinfes = {
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

nodenf.searchNfseByRps('nfse', objectGinfes)
	.then(res => {
		console.log(res);
	}).catch(err => {
		console.log(err);
	})