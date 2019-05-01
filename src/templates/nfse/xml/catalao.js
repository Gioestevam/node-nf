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
    object.config.producaoHomologacao === 'producao' ? url = 'http://200.23.238.210/prodataws/services/NfseWSService?wsdl' : url = 'http://200.23.238.210:8585/prodataws/services/NfseWSService?wsdl';

    return new Promise((resolve, reject) => {
        const pfx = fs.readFileSync(object.config.diretorioDoCertificado);

        pem.readPkcs12(pfx, {
            p12Password: object.config.senhaDoCertificado
        }, (err, cert) => {
            if (err) {
                resolve({
                    error: err
                });
            }
            switch (action) {
                case 'postLotInvoice':
                    try {

                        let xml = '<EnviarLoteRpsEnvio xmlns="http://www.abrasf.org.br/ABRASF/arquivos/nfse.xsd">';
                        xml += '<LoteRps Id="' + object.emissor.cnpj.replace(/[^\d]+/g,'') + timestamp + '">';
                        xml += '<NumeroLote>' + timestamp + '</NumeroLote>';
                        xml += '<Cnpj>' + object.emissor.cnpj.replace(/[^\d]+/g,'') + '</Cnpj>';
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
                                    validator.validateXML(xmlSignature, __dirname + '/../../../../resources/xsd/rio-de-janeiro/tipos_nfse_v01.xsd', function (err, validatorResult) {
                                        if (err) {
                                            console.log(err);
                                            resolve(err);
                                        }

                                        if (!validatorResult.valid) {
                                            console.log(validatorResult);
                                            resolve(validatorResult);
                                        }
                                    });

                                    let xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:not="http://services.nfse">';
                                    xml += '<soapenv:Header/>';
                                    xml += '<soapenv:Body>';
                                    xml += '<not:RecepcionarLoteRpsRequest>';
                                    xml += '<nfseDadosMsg>';
                                    xml += '<![CDATA[' + xmlSignature + ']]>';
                                    xml += '</nfseDadosMsg>';
                                    xml += '</not:RecepcionarLoteRpsRequest>';
                                    xml += '</soapenv:Body>';
                                    xml += '</soapenv:Envelope>';

                                    const result = {
                                        url: url,
                                        soapEnvelop: xml,
                                        soapAction: 'http://notacarioca.rio.gov.br/RecepcionarLoteRps'
                                    }

                                    resolve(result);
                                }).catch(err => {
                                    console.log(err);
                                });
                            })

                    } catch (error) {
                        reject(error);
                    }
                    break;

                case 'searchSituation':
                    try {
                        let xmlContent = '<ConsultarSituacaoLoteRpsEnvio xmlns="http://www.abrasf.org.br/ABRASF/arquivos/nfse.xsd">';
                        xmlContent += '<Prestador>';
                        xmlContent += '<Cnpj>' + object.prestador.cnpj.replace(/[^\d]+/g,'') + '</Cnpj>';
                        xmlContent += '<InscricaoMunicipal>' + object.prestador.inscricaoMunicipal + '</InscricaoMunicipal>';
                        xmlContent += '</Prestador>';
                        xmlContent += '<Protocolo>' + object.protocolo + '</Protocolo>';
                        xmlContent += '</ConsultarSituacaoLoteRpsEnvio>';

                        let xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:not="http://notacarioca.rio.gov.br/">';
                        xml += '<soapenv:Header/>';
                        xml += '<soapenv:Body>';
                        xml += '<not:ConsultarSituacaoLoteRpsRequest>';
                        xml += '<not:inputXML>';
                        xml += '<![CDATA[' + xmlContent + ']]>';
                        xml += '</not:inputXML>';
                        xml += '</not:ConsultarSituacaoLoteRpsRequest>';
                        xml += '</soapenv:Body>';
                        xml += '</soapenv:Envelope>';

                        const result = {
                            url: url,
                            soapEnvelop: xml,
                            soapAction: 'http://notacarioca.rio.gov.br/ConsultarSituacaoLoteRps'
                        }

                        resolve(result);

                    } catch (error) {
                        reject(error)
                    }
                    break;

                case 'searchRpsLot':
                    try {
                        let xmlContent = '<ConsultarLoteRpsEnvio xmlns="http://www.abrasf.org.br/ABRASF/arquivos/nfse.xsd">';
                        xmlContent += '<Prestador>';
                        xmlContent += '<Cnpj>' + object.prestador.cnpj.replace(/[^\d]+/g,'') + '</Cnpj>';
                        xmlContent += '<InscricaoMunicipal>' + object.prestador.inscricaoMunicipal + '</InscricaoMunicipal>';
                        xmlContent += '</Prestador>';
                        xmlContent += '<Protocolo>' + object.protocolo + '</Protocolo>';
                        xmlContent += '</ConsultarLoteRpsEnvio>';

                        validator.validateXML(xmlContent, __dirname + '/../../../../resources/xsd/rio-de-janeiro/tipos_nfse_v01.xsd', function (err, validatorResult) {
                            if (err) {
                                console.log(err);
                                resolve(err);
                            }

                            if (!validatorResult.valid) {
                                console.log(validatorResult);
                                resolve(validatorResult);
                            }
                        });

                        let xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:not="http://notacarioca.rio.gov.br/">';
                        xml += '<soapenv:Header/>';
                        xml += '<soapenv:Body>';
                        xml += '<not:ConsultarLoteRpsRequest>';
                        xml += '<not:inputXML>';
                        xml += '<![CDATA[' + xmlContent + ']]>';
                        xml += '</not:inputXML>';
                        xml += '</not:ConsultarLoteRpsRequest>';
                        xml += '</soapenv:Body>';
                        xml += '</soapenv:Envelope>';

                        const result = {
                            url: url,
                            soapEnvelop: xml,
                            soapAction: 'http://notacarioca.rio.gov.br/ConsultarLoteRps'
                        }

                        resolve(result);

                    } catch (error) {
                        reject(error)
                    }
                    break;

                case 'searchNfseByRps':
                    try {
                        let xmlContent = '<ConsultarNfseRpsEnvio xmlns="http://www.abrasf.org.br/ABRASF/arquivos/nfse.xsd">';
                        xmlContent += '<IdentificacaoRps>';
                        xmlContent += '<Numero>' + object.identificacaoRps.numero + '</Numero>';
                        xmlContent += '<Serie>' + object.identificacaoRps.serie + '</Serie>';
                        xmlContent += '<Tipo>' + object.identificacaoRps.tipo + '</Tipo>';
                        xmlContent += '</IdentificacaoRps>';
                        xmlContent += '<Prestador>';
                        xmlContent += '<Cnpj>' + object.prestador.cnpj.replace(/[^\d]+/g,'') + '</Cnpj>';
                        xmlContent += '<InscricaoMunicipal>' + object.prestador.inscricaoMunicipal + '</InscricaoMunicipal>';
                        xmlContent += '</Prestador>';
                        xmlContent += '</ConsultarNfseRpsEnvio>';

                        let xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:not="http://notacarioca.rio.gov.br/">';
                        xml += '<soapenv:Header/>';
                        xml += '<soapenv:Body>';
                        xml += '<not:ConsultarNfsePorRpsRequest>';
                        xml += '<not:inputXML>';
                        xml += '<![CDATA[' + xmlContent + ']]>';
                        xml += '</not:inputXML>';
                        xml += '</not:ConsultarNfsePorRpsRequest>';
                        xml += '</soapenv:Body>';
                        xml += '</soapenv:Envelope>';

                        const result = {
                            url: url,
                            soapEnvelop: xml,
                            soapAction: 'http://notacarioca.rio.gov.br/ConsultarNfsePorRps'
                        }

                        resolve(result);

                    } catch (error) {
                        reject(error)
                    }
                    break;

                case 'searchInvoice':
                    try {
                        let xmlContent = '<ConsultarNfseEnvio xmlns="http://www.abrasf.org.br/ABRASF/arquivos/nfse.xsd">';
                        xmlContent += '<Prestador>';
                        xmlContent += '<Cnpj>' + object.prestador.cnpj.replace(/[^\d]+/g,'') + '</Cnpj>';
                        xmlContent += '<InscricaoMunicipal>' + object.prestador.inscricaoMunicipal + '</InscricaoMunicipal>';
                        xmlContent += '</Prestador>';
                        xmlContent += '<PeriodoEmissao>';
                        xmlContent += '<DataInicial>' + object.periodoEmissao.dataInicial + '</DataInicial>';
                        xmlContent += '<DataFinal>' + object.periodoEmissao.dataFinal + '</DataFinal>';
                        xmlContent += '</PeriodoEmissao>';
                        xmlContent += '<Tomador>';
                        xmlContent += '<CpfCnpj>';
                        if (object.tomador.cpfCnpj.length === 11) {
                            xmlContent += '<Cpf>' + object.tomador.cpfCnpj + '</Cpf>';
                        }
                        if (object.tomador.cpfCnpj.length === 14) {
                            xmlContent += '<Cnpj>' + object.tomador.cpfCnpj + '</Cnpj>';
                        }
                        xmlContent += '</CpfCnpj>';
                        xmlContent += '</Tomador>';
                        xmlContent += '</ConsultarNfseEnvio>';

                        let xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:not="http://notacarioca.rio.gov.br/">';
                        xml += '<soapenv:Header/>';
                        xml += '<soapenv:Body>';
                        xml += '<not:ConsultarNfseRequest>';
                        xml += '<not:inputXML>';
                        xml += '<![CDATA[' + xmlContent + ']]>';
                        xml += '</not:inputXML>';
                        xml += '</not:ConsultarNfseRequest>';
                        xml += '</soapenv:Body>';
                        xml += '</soapenv:Envelope>';

                        const result = {
                            url: url,
                            soapEnvelop: xml,
                            soapAction: 'http://notacarioca.rio.gov.br/ConsultarNfse'
                        }

                        resolve(result);

                    } catch (error) {
                        reject(error)
                    }
                    break;

                case 'cancelInvoice':
                    try {
                        let xml = '<Pedido xmlns="http://www.abrasf.org.br/ABRASF/arquivos/nfse.xsd">';
                        xml += '<InfPedidoCancelamento Id="Cancelamento_NF' + object.infPedidoCancelamento.identificacaoNfse.numero + '">';
                        xml += '<IdentificacaoNfse>';
                        xml += '<Numero>' + object.infPedidoCancelamento.identificacaoNfse.numero + '</Numero>';
                        xml += '<Cnpj>' + object.infPedidoCancelamento.identificacaoNfse.cnpj.replace(/[^\d]+/g,'') + '</Cnpj>';
                        xml += '<InscricaoMunicipal>' + object.infPedidoCancelamento.identificacaoNfse.inscricaoMunicipal + '</InscricaoMunicipal>';
                        xml += '<CodigoMunicipio>' + object.infPedidoCancelamento.identificacaoNfse.codigoMunicipio + '</CodigoMunicipio>';
                        xml += '</IdentificacaoNfse>';
                        xml += '<CodigoCancelamento>' + object.infPedidoCancelamento.codigoCancelamento + '</CodigoCancelamento>';
                        xml += '</InfPedidoCancelamento>';
                        xml += '</Pedido>';

                        createSignature(xml, cert, 'InfPedidoCancelamento').then(xmlSignature => {
                            // validator.validateXML(xml, __dirname + '/../../resources/xsd/servico_enviar_lote_rps_envio_v03.xsd', function (err, result) {
                            //     if (err) {
                            //         return res.send({
                            //             error: result
                            //         })
                            //     }

                            //     if (!result.valid) {
                            //         return res.send({
                            //             invalid: result
                            //         })
                            //     }
                            // });

                            let xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:not="http://notacarioca.rio.gov.br/">';
                            xml += '<soapenv:Header/>';
                            xml += '<soapenv:Body>';
                            xml += '<not:CancelarNfseRequest>';
                            xml += '<not:inputXML>';
                            xml += '<![CDATA[';
                            xml += '<CancelarNfseEnvio xmlns="http://www.abrasf.org.br/ABRASF/arquivos/nfse.xsd">'
                            xml += xmlSignature;
                            xml += '</CancelarNfseEnvio>'
                            xml += ']]>';
                            xml += '</not:inputXML>';
                            xml += '</not:CancelarNfseRequest>';
                            xml += '</soapenv:Body>';
                            xml += '</soapenv:Envelope>';

                            // console.log(xml);

                            const result = {
                                url: url,
                                soapEnvelop: xml,
                                soapAction: 'http://notacarioca.rio.gov.br/CancelarNfse'
                            }

                            resolve(result);
                        }).catch(err => {
                            console.log(err);
                        });

                    } catch (error) {
                        reject(error)
                    }
                    break;

                case 'postInvoice':
                    try {

                        let xmlContent = '<GerarNfseEnvio xmlns="http://notacarioca.rio.gov.br/WSNacional/XSD/1/nfse_pcrj_v01.xsd">';

                        addSignedXml(object, cert)
                            .then(signedXmlRes => {
                                signedXmlRes.forEach(element => {
                                    xmlContent += element;
                                });

                                xmlContent += '</GerarNfseEnvio>';
                                // validator.validateXML(xml, __dirname + '/../../resources/xsd/servico_enviar_lote_rps_envio_v03.xsd', function (err, result) {
                                //     if (err) {
                                //         return res.send({
                                //             error: result
                                //         })
                                //     }

                                //     if (!result.valid) {
                                //         return res.send({
                                //             invalid: result
                                //         })
                                //     }
                                // });

                                let xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:not="http://notacarioca.rio.gov.br/">';
                                xml += '<soapenv:Header/>';
                                xml += '<soapenv:Body>';
                                xml += '<not:GerarNfseRequest>';
                                xml += '<not:inputXML>';
                                xml += '<![CDATA[' + xmlContent + ']]>';
                                xml += '</not:inputXML>';
                                xml += '</not:GerarNfseRequest>';
                                xml += '</soapenv:Body>';
                                xml += '</soapenv:Envelope>';

                                const result = {
                                    url: url,
                                    soapEnvelop: xml,
                                    soapAction: 'http://notacarioca.rio.gov.br/GerarNfse'
                                }

                                resolve(result);
                            }).catch(err => {
                                console.log(err);
                            });

                    } catch (error) {
                        reject(error);
                    }
                    break;

                default:
                    break;
            }
        });
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
            let prestadorCnpj = object.emissor.cnpj.replace(/[^\d]+/g,'');
            let prestadorIncricaoMunicipal = object.emissor.inscricaoMunicipal;
            if (r.prestador) {
                prestadorCnpj = r.prestador.cnpj.replace(/[^\d]+/g,'');
                prestadorIncricaoMunicipal = r.prestador.inscricaoMunicipal;
            }
            xmlToBeSigned += '<Rps>';
            xmlToBeSigned += '<InfRps xmlns="http://www.abrasf.org.br/ABRASF/arquivos/nfse.xsd" Id="' + object.emissor.cnpj.replace(/[^\d]+/g,'') + timestamp + 'RPS' + index + '">';
            xmlToBeSigned += '<IdentificacaoRps>';
            xmlToBeSigned += '<Numero>' + timestamp + index + '</Numero>';
            xmlToBeSigned += '<Serie>RPS</Serie>';
            xmlToBeSigned += '<Tipo>' + r.tipo + '</Tipo>';
            xmlToBeSigned += '</IdentificacaoRps>';
            xmlToBeSigned += '<DataEmissao>' + r.dataEmissao.replace(/\s/g, 'T') + '</DataEmissao>';
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
            if (r.tomador.cnpjCpf.replace(/[^\d]+/g,'').length > 11) {
                xmlToBeSigned += '<Cnpj>' + r.tomador.cnpjCpf.replace(/[^\d]+/g,'') + '</Cnpj>';
            } else {
                xmlToBeSigned += '<Cpf>' + r.tomador.cnpjCpf.replace(/[^\d]+/g,'') + '</Cpf>';
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

                reject(result);
            });
    })
}