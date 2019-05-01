#[NOTA-FISCAL](https://github.com/giryco/node-nf)
> Gerador de NF-e, NFS-e e NFC-e

##Instalação
```
npm install --save nota-fiscal@latest
```

##Exemplos de utilização para NFS-e
###Enviar lote de RPS
```
const nf = require('nota-fiscal');

const objectGinfes = [{
	"config": {
		"diretorioDoCertificado": "/atalho/para/certificado.pfx",
		"senhaDoCertificado": "su$S3nh@P4r@0C3Rt1fiC4d0",
		"producaoHomologacao": "homologacao",
		"codigoMunicipio": "3523909"
	},
	"emissor": {
		"cnpj": "00000001000000",
		"inscricaoMunicipal": "200000"
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
			"cnpj": "00000001000000",
			"inscricaoMunicipal": "200000"
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

nf.postLotInvoice('nfse', objectGinfes, 0)
	.then(res => {
		console.log(res);
	}).catch(err => {
		console.log(err);
	});
```

###Consultar lote de RPS
```
const nf = require('nota-fiscal');

const objectGinfes = [{
	"config": {
		"diretorioDoCertificado": "/atalho/para/certificado.pfx",
		"senhaDoCertificado": "su$S3nh@P4r@0C3Rt1fiC4d0",
		"producaoHomologacao": "homologacao",
		"codigoMunicipio": "3523909"
	},
	"prestador": {
		"cnpj": "00000001000000",
        "inscricaoMunicipal": "200000"
	},
	"protocolo": "9342689"
}];

nf.searchRpsLot('nfse', objectGinfes)
	.then(res => {
		console.log(res);
	}).catch(err => {
		console.log(err);
	});
```

###Cancelar NFSE
```
const nf = require('nota-fiscal');

const objectGinfes = [{
	"config": {
		"diretorioDoCertificado": "/atalho/para/certificado.pfx",
		"senhaDoCertificado": "su$S3nh@P4r@0C3Rt1fiC4d0",
		"producaoHomologacao": "homologacao",
		"codigoMunicipio": "3523909"
	},
	"prestador": {
		"cnpj": "00000001000000",
        "inscricaoMunicipal": "200000"
	},
	"numeroNfse": 214
}];

nf.cancelInvoice('nfse', objectGinfes)
	.then(res => {
		console.log(res);
	}).catch(err => {
		console.log(err);
	});
```

###Consultar NFS-e por RPS
```
const nf = require('nota-fiscal');

const objectGinfes = [{
	"config": {
		"diretorioDoCertificado": "/atalho/para/certificado.pfx",
		"senhaDoCertificado": "su$S3nh@P4r@0C3Rt1fiC4d0",
		"producaoHomologacao": "homologacao",
		"codigoMunicipio": "3523909"
	},
	"prestador": {
		"cnpj": "00000001000000",
        "inscricaoMunicipal": "200000"
	},
    "identificacaoRps": {
		"numero": 15543793754810,
		"serie": "RPS",
		"tipo": 1
	}
}];

nf.searchNfseByRps('nfse', objectGinfes)
	.then(res => {
		console.log(res);
	}).catch(err => {
		console.log(err);
	});
```

###Consultar situação lote
```
const nf = require('nota-fiscal');

const objectGinfes = [{
	"config": {
		"diretorioDoCertificado": "/atalho/para/certificado.pfx",
		"senhaDoCertificado": "su$S3nh@P4r@0C3Rt1fiC4d0",
		"producaoHomologacao": "homologacao",
		"codigoMunicipio": "3523909"
	},
	"prestador": {
		"cnpj": "00000001000000",
        "inscricaoMunicipal": "200000"
	},
	"protocolo": "9311682"
}];

nf.searchSituation('nfse', objectGinfes)
	.then(res => {
		console.log(res);
	}).catch(err => {
		console.log(err)
	});
```