/**
 * Libs
 */
const XmlSignatureController = require('../../../../lib/xml-signature');
const xmlSignatureController = new XmlSignatureController();

/**
 * Third party
 */
const fs = require('fs');
const pem = require('pem');
const validator = require('xsd-schema-validator');

const timestamp = Date.now();

function createXml(object, action) {
    var url = '';
    object.config.producaoHomologacao === 'producao' ? url = 'https://nfe.sjp.pr.gov.br/servicos/issOnline2/ws/index.php?wsdl' : url = 'https://nfe.sjp.pr.gov.br/servicos/issOnline2/homologacao/ws/index.php?wsdl';
    
    return new Promise((resolve, reject) => {
        switch (action) {
            case 'postInvoice':
                try {
                    const pfx = fs.readFileSync(object.config.diretorioDoCertificado);

                    pem.readPkcs12(pfx, {
                        p12Password: object.config.senhaDoCertificado
                    }, (err, cert) => {
                        if (err) {
                            resolve({
                                error: err
                            });
                        }
                        
                        let xml = '<EnviarLoteRpsEnvio xmlns="http://nfe.sjp.pr.gov.br/servico_enviar_lote_rps_envio_v03.xsd">';
                        xml += '<LoteRps Id="' + object.emissor.cnpj.replace(/\.|\/|\s/g, '') + timestamp + '">';
                        xml += '<NumeroLote xmlns="http://nfe.sjp.pr.gov.br/tipos_v03.xsd">' + timestamp + '</NumeroLote>';
                        xml += '<Cnpj xmlns="http://nfe.sjp.pr.gov.br/tipos_v03.xsd">' + object.emissor.cnpj.replace(/\.|\/|\s/g, '') + '</Cnpj>';
                        xml += '<InscricaoMunicipal xmlns="http://nfe.sjp.pr.gov.br/tipos_v03.xsd">' + object.emissor.inscricaoMunicipal + '</InscricaoMunicipal>';
                        xml += '<QuantidadeRps xmlns="http://nfe.sjp.pr.gov.br/tipos_v03.xsd">' + object.rps.length + '</QuantidadeRps>';
                        xml += '<ListaRps xmlns="http://nfe.sjp.pr.gov.br/tipos_v03.xsd">';

                        addSignedXml(object, cert)
                            .then(signedXmlRes => {
                                signedXmlRes.forEach(element => {
                                    xml += element  ;
                                });
                                xml += '</ListaRps>';
                                xml += '</LoteRps>';
                                xml += '</EnviarLoteRpsEnvio>';

                                createSignature(xml, cert, 'LoteRps').then(xmlSignature => {
                                    validator.validateXML(xmlSignature, __dirname + '/../../../../resources/xsd/ginfes/servico_enviar_lote_rps_envio_v03.xsd', function (err, validatorResult) {
                                        // if (err) {
                                        //     console.log(err);
                                        //     resolve(err);
                                        // }

                                        // if (!validatorResult.valid) {
                                        //     console.log(validatorResult);
                                        //     resolve(validatorResult);
                                        // }

                                        let xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:nfe="http://nfe.sjp.pr.gov.br">';
                                        xml += '<soap:Header />';
                                        xml += '<soap:Body>';
                                        xml += '<RecepcionarLoteRpsV3>';
                                        xml += '<arg0>';
                                        xml += '<ns2:cabecalho xmlns:ns2="http://nfe.sjp.pr.gov.br/cabecalho_v03.xsd" versao="3">';
                                        xml += '<versaoDados>3</versaoDados>';
                                        xml += '</cabecalho>';
                                        xml += '</arg0>';
                                        xml += '<arg1>';
                                        xml += xmlSignature;
                                        xml += '</arg1>';
                                        xml += '</RecepcionarLoteRpsV3>';
                                        xml += '</soap:Body>';
                                        xml += '</soap:Envelope>';

                                        const result = {
                                            url: url,
                                            soapEnvelop: xml
                                        }
                                        
                                        resolve(result);
                                    });
                                }).catch(err => {
                                    console.log(err);
                                });
                            })
                    });
                } catch (error) {
                    reject(error);
                }
                break;

            default:
                break;
        }
    })
}

module.exports = {
    createXml
}

function addSignedXml(object, cert) {
    return new Promise((resolve, reject) => {
        let xmlToBeSigned = '';
        let xmlToBeSignedArray = [];
        let xmlSignedArray = [];
        object.rps.forEach((r, index) => {
            let prestadorCnpj = object.emissor.cnpj.replace(/\.|\/|\s/g, '');
            let prestadorIncricaoMunicipal = object.emissor.inscricaoMunicipal;
            if (r.prestador) {
                prestadorCnpj = r.prestador.cnpj.replace(/\.|\/|\s/g, '');
                prestadorIncricaoMunicipal = r.prestador.inscricaoMunicipal;
            }
            xmlToBeSigned += '<Rps>';
            xmlToBeSigned += '<InfRps Id="' + object.emissor.cnpj.replace(/\.|\/|\s/g, '') + timestamp + 'RPS' + index + '">';
            xmlToBeSigned += '<IdentificacaoRps>';
            xmlToBeSigned += '<Numero>' + timestamp + index + '</Numero>';
            xmlToBeSigned += '<Serie>RPS</Serie>';
            xmlToBeSigned += '<Tipo>' + r.tipo + '</Tipo>';
            xmlToBeSigned += '</IdentificacaoRps>';
            xmlToBeSigned += '<DataEmissao>' + r.dataEmissao + '</DataEmissao>';
            xmlToBeSigned += '<NaturezaOperacao>' + r.naturezaOperacao + '</NaturezaOperacao>';
            xmlToBeSigned += '<OptanteSimplesNacional>' + r.optanteSimplesNacional + '</OptanteSimplesNacional>';
            xmlToBeSigned += '<IncentivadorCultural>' + r.incentivadorCultural + '</IncentivadorCultural>';
            xmlToBeSigned += '<Status>' + r.status + '</Status>';

            r.servicos.forEach(s => {
                xmlToBeSigned += '<Servico>';
                xmlToBeSigned += '<Valores>';
                xmlToBeSigned += '<ValorServicos>' + s.valorServicos + '</ValorServicos>';
                xmlToBeSigned += '<ValorDeducoes>' + s.valorDeducoes + '</ValorDeducoes>';
                xmlToBeSigned += '<ValorPis>' + s.valorPis + '</ValorPis>';
                xmlToBeSigned += '<ValorCofins>' + s.valorCofins + '</ValorCofins>';
                xmlToBeSigned += '<ValorInss>' + s.valorInss + '</ValorInss>';
                xmlToBeSigned += '<ValorIr>' + s.valorIr + '</ValorIr>';
                xmlToBeSigned += '<ValorCsll>' + s.valorCsll + '</ValorCsll>';
                xmlToBeSigned += '<IssRetido>' + s.issRetido + '</IssRetido>';
                xmlToBeSigned += '<ValorIss>' + s.valorIss + '</ValorIss>';
                xmlToBeSigned += '<BaseCalculo>' + s.baseCalculo + '</BaseCalculo>';
                xmlToBeSigned += '<Aliquota>' + s.aliquota + '</Aliquota>';
                xmlToBeSigned += '<ValorLiquidoNfse>' + s.valorLiquidoNfse + '</ValorLiquidoNfse>';
                xmlToBeSigned += '</Valores>';
                xmlToBeSigned += '<ItemListaServico>' + s.itemListaServico + '</ItemListaServico>';
                xmlToBeSigned += '<CodigoTributacaoMunicipio>' + s.codigoTributacaoMunicipio + '</CodigoTributacaoMunicipio>';
                xmlToBeSigned += '<Discriminacao>' + s.discriminacao + '</Discriminacao>';
                xmlToBeSigned += '<CodigoMunicipio>' + s.codigoMunicipío + '</CodigoMunicipio>';
                xmlToBeSigned += '</Servico>';
            });

            xmlToBeSigned += '<Prestador>';
            xmlToBeSigned += '<Cnpj>' + prestadorCnpj + '</Cnpj>';
            xmlToBeSigned += '<InscricaoMunicipal>' + prestadorIncricaoMunicipal + '</InscricaoMunicipal>';
            xmlToBeSigned += '</Prestador>';
            xmlToBeSigned += '<Tomador>';
            xmlToBeSigned += '<IdentificacaoTomador>';
            xmlToBeSigned += '<CpfCnpj>';
            if (r.tomador.cnpjCpf.replace(/\.|\/|\s/g, '').length > 11) {
                xmlToBeSigned += '<Cnpj>' + r.tomador.cnpjCpf.replace(/\.|\/|\s/g, '') + '</Cnpj>';
            } else {
                xmlToBeSigned += '<Cpf>' + r.tomador.cnpjCpf.replace(/\.|\/|\s/g, '') + '</Cpf>';
            }
            xmlToBeSigned += '</CpfCnpj>';
            xmlToBeSigned += '<InscricaoMunicipal>' + r.tomador.inscricaoMunicipal + '</InscricaoMunicipal>';
            xmlToBeSigned += '</IdentificacaoTomador>';
            xmlToBeSigned += '<RazaoSocial>' + r.tomador.razaoSocial + '</RazaoSocial>';
            xmlToBeSigned += '<Endereco>';
            xmlToBeSigned += '<Endereco>' + r.tomador.endereco.endereco + '</Endereco>';
            xmlToBeSigned += '<Numero>' + r.tomador.endereco.numero + '</Numero>';
            xmlToBeSigned += '<Bairro>' + r.tomador.endereco.bairro + '</Bairro>';
            xmlToBeSigned += '<CodigoMunicipio>' + r.tomador.endereco.codigoMunicipio + '</CodigoMunicipio>';
            xmlToBeSigned += '<Uf>' + r.tomador.endereco.uf + '</Uf>';
            xmlToBeSigned += '<Cep>' + r.tomador.endereco.cep + '</Cep>';
            xmlToBeSigned += '</Endereco>';
            xmlToBeSigned += '<Contato>';
            xmlToBeSigned += '<Telefone>' + r.tomador.contato.telefone + '</Telefone>';
            xmlToBeSigned += '<Email>' + r.tomador.contato.email + '</Email>';
            xmlToBeSigned += '</Contato>';
            xmlToBeSigned += '</Tomador>';
            xmlToBeSigned += '</InfRps>';
            xmlToBeSigned += '</Rps>';

            xmlToBeSignedArray.push(xmlToBeSigned);

        });
        resolve(xmlToBeSignedArray);
        // xmlToBeSignedArray.map((rps, index) => {
        //     createSignature(rps, cert, 'InfRps')
        //         .then(createdSignatureXml => {
        //             xmlSignedArray.push(createdSignatureXml);

        //             if ((xmlToBeSignedArray.length - 1) === index) {
        //                 resolve(xmlSignedArray);
        //             }
        //         }).catch(error => {
        //             const result = {
        //                 message: 'Erro no map de createSignature',
        //                 error: error
        //             }

        //             reject(result);
        //         })
        // })
    })
}

function createSignature(xmlToBeSigned, cert, xmlElement) {
    return new Promise((resolve, reject) => {
        xmlSignatureController.addSignatureToXml(xmlToBeSigned, cert, xmlElement)
            .then(xmlSigned => {
                resolve(xmlSigned);
            })
            .catch(xmlSignedError => {
                const result = {
                    message: 'Erro na assinatura de nota',
                    error: xmlSignedError
                }

                reject(result);
            });
    })
}