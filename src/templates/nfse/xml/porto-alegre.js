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
    object.config.producaoHomologacao === 'producao' ? url = 'http://nfe.portoalegre.rs.gov.br/nfe-ws?wsdl' : url = 'https://nfse-hom.procempa.com.br/bhiss-ws/nfse?wsdl';

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
                        let xml = '<EnviarLoteRpsEnvio  xmlns="http://www.abrasf.org.br/nfse.xsd">';
                        xml += '<LoteRps Id="' + object.emissor.cnpj.replace(/\.|\/|\s/g, '') + timestamp + '" versao="1.00">';
                        xml += '<NumeroLote>' + timestamp + '</NumeroLote>';
                        xml += '<Cnpj>' + object.emissor.cnpj.replace(/\.|\/|\s/g, '') + '</Cnpj>';
                        xml += '<InscricaoMunicipal>' + object.emissor.inscricaoMunicipal + '</InscricaoMunicipal>';
                        xml += '<QuantidadeRps>' + object.rps.length + '</QuantidadeRps>';
                        xml += '<ListaRps>';

                        addSignedXml(object, cert)
                            .then(signedXmlRes => {
                                signedXmlRes.forEach(element => {
                                    xml += element;
                                });
                                xml += '</ListaRps>';
                                xml += '</LoteRps>';
                                xml += '</EnviarLoteRpsEnvio>';

                                createSignature(xml, cert, 'LoteRps').then(xmlSignature => {
                                    validator.validateXML(xmlSignature, __dirname + '/../../resources/xsd/porto-alegre/nfse_v20_08_2015.xsd', function (err, result) {
                                        if (err) {
                                            resolve({
                                                error: result
                                            })
                                        }

                                        if (!result.valid) {
                                            resolve({
                                                invalid: result
                                            })
                                        }
                                    });

                                    let xml = '<S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/">';
                                    xml += '<S:Body>';
                                    xml += '<ns2:RecepcionarLoteRpsRequest xmlns:ns2="http://ws.bhiss.pbh.gov.br">';
                                    xml += '<nfseCabecMsg>';
                                    xml += '<![CDATA[<cabecalho xmlns="http://www.abrasf.org.br/nfse.xsd" versao="1.00">';
                                    xml += '<versaoDados>1.00</versaoDados>';
                                    xml += '</cabecalho>]]>';
                                    xml += '</nfseCabecMsg>';
                                    xml += '<nfseDadosMsg>';
                                    xml += '<![CDATA[' + xmlSignature + ']]>';
                                    xml += '</nfseDadosMsg>';
                                    xml += '</ns2:RecepcionarLoteRpsRequest>';
                                    xml += '</S:Body>';
                                    xml += '</S:Envelope>';

                                    const result = {
                                        url: url,
                                        soapEnvelop: xml,
                                        soapAction: 'http://ws.bhiss.pbh.gov.br/RecepcionarLoteRps'
                                    }

                                    resolve(result);
                                }).catch(err => {
                                    reject(err);
                                });
                            })
                            .catch(error => {
                                const result = {
                                    message: 'Erro na assinatura do XML',
                                    error: error
                                }

                                reject(result);
                            });
                    });
                } catch (error) {
                    reject(error);
                }
                break;

            default:
                break;
        }
    });
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
            
            xmlToBeSigned += '<Servico>';
            xmlToBeSigned += '<Valores>';
            xmlToBeSigned += '<ValorServicos>' + r.servico.valorServicos + '</ValorServicos>';
            xmlToBeSigned += '<ValorDeducoes>' + r.servico.valorDeducoes + '</ValorDeducoes>';
            xmlToBeSigned += '<ValorPis>' + r.servico.valorPis + '</ValorPis>';
            xmlToBeSigned += '<ValorCofins>' + r.servico.valorCofins + '</ValorCofins>';
            xmlToBeSigned += '<ValorInss>' + r.servico.valorInss + '</ValorInss>';
            xmlToBeSigned += '<ValorIr>' + r.servico.valorIr + '</ValorIr>';
            xmlToBeSigned += '<ValorCsll>' + r.servico.valorCsll + '</ValorCsll>';
            xmlToBeSigned += '<IssRetido>' + r.servico.issRetido + '</IssRetido>';
            xmlToBeSigned += '<ValorIss>' + r.servico.valorIss + '</ValorIss>';
            xmlToBeSigned += '<BaseCalculo>' + r.servico.baseCalculo + '</BaseCalculo>';
            xmlToBeSigned += '<Aliquota>' + r.servico.aliquota + '</Aliquota>';
            xmlToBeSigned += '<ValorLiquidoNfse>' + r.servico.valorLiquidoNfse + '</ValorLiquidoNfse>';
            xmlToBeSigned += '</Valores>';
            xmlToBeSigned += '<ItemListaServico>' + r.servico.itemListaServico + '</ItemListaServico>';
            xmlToBeSigned += '<CodigoTributacaoMunicipio>' + r.servico.codigoTributacaoMunicipio + '</CodigoTributacaoMunicipio>';
            xmlToBeSigned += '<Discriminacao>' + r.servico.discriminacao + '</Discriminacao>';
            xmlToBeSigned += '<CodigoMunicipio>' + r.servico.codigoMunicipio + '</CodigoMunicipio>';
            xmlToBeSigned += '</Servico>';

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
        // resolve(xmlToBeSignedArray);
        xmlToBeSignedArray.map((rps, index) => {
            createSignature(rps, cert, 'InfRps')
                .then(createdSignatureXml => {
                    xmlSignedArray.push(createdSignatureXml);

                    if ((xmlToBeSignedArray.length - 1) === index) {
                        resolve(xmlSignedArray);
                    }
                }).catch(error => {
                    const result = {
                        message: 'Erro no map de createSignature',
                        error: error
                    }

                    reject(result);
                })
        })
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

                console.log(result);
            });
    })
}