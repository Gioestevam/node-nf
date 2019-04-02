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
            case 'postLotInvoice':
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

                        let xml = '<ns3:EnviarLoteRpsEnvio xmlns:ns3="http://nfe.sjp.pr.gov.br/servico_enviar_lote_rps_envio_v03.xsd" xmlns:ns4="http://nfe.sjp.pr.gov.br/tipos_v03.xsd">';
                        xml += '<ns3:LoteRps Id="' + object.emissor.cnpj.replace(/\.|\/|\s/g, '') + timestamp + '">';
                        xml += '<ns4:NumeroLote>' + timestamp + '</ns4:NumeroLote>';
                        xml += '<ns4:Cnpj>' + object.emissor.cnpj.replace(/\.|\/|\s/g, '') + '</ns4:Cnpj>';
                        xml += '<ns4:InscricaoMunicipal>' + object.emissor.inscricaoMunicipal + '</ns4:InscricaoMunicipal>';
                        xml += '<ns4:QuantidadeRps>' + object.rps.length + '</ns4:QuantidadeRps>';
                        xml += '<ns4:ListaRps>';

                        addSignedXml(object, cert)
                            .then(signedXmlRes => {
                                signedXmlRes.forEach(element => {
                                    xml += element;
                                });
                                xml += '</ns4:ListaRps>';
                                xml += '</ns3:LoteRps>';
                                xml += '</ns3:EnviarLoteRpsEnvio>';

                                createSignature(xml, cert, 'LoteRps').then(xmlSignature => {
                                    validator.validateXML(xmlSignature, __dirname + '/../../../../resources/xsd/sao-jose-dos-pinhais/servico_enviar_lote_rps_envio_v03.xsd', function (err, validatorResult) {
                                        if (err) {
                                            console.log(err);
                                            resolve(err);
                                        }

                                        if (!validatorResult.valid) {
                                            console.log(validatorResult);
                                            resolve(validatorResult);
                                        }

                                        let xml = '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://nfe.sjp.pr.gov.br">';
                                        xml += '<soap:Header/>';
                                        xml += '<soap:Body>';
                                        xml += '<ns1:RecepcionarLoteRpsV3>';
                                        xml += '<arg0>';
                                        xml += '<![CDATA[<ns2:cabecalho xmlns:ns2="http://nfe.sjp.pr.gov.br/cabecalho_v03.xsd" versao="3">';
                                        xml += '<versaoDados>3</versaoDados>';
                                        xml += '</ns2:cabecalho>]]>';
                                        xml += '</arg0>';
                                        xml += '<arg1>';
                                        xml += '<![CDATA[' + xmlSignature + ']]>';
                                        xml += '</arg1>';
                                        xml += '</ns1:RecepcionarLoteRpsV3>';
                                        xml += '</soap:Body>';
                                        xml += '</soap:Envelope>';
                                        console.log(xml);
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

            case 'cancelInvoice':
                try {
                    const pfx = fs.readFileSync(object.config.diretorioDoCertificado);

                    pem.readPkcs12(pfx, {
                        p12Password: object.config.senhaDoCertificado
                    }, (err, cert) => {
                        if (err) {
                            return res.send({
                                error: err
                            });
                        }
                        let xml = '<ns3:Pedido xmlns:ns3="http://www.ginfes.com.br/servico_cancelar_nfse_envio_v03.xsd" xmlns:ns4="http://www.ginfes.com.br/tipos_v03.xsd">';
                        xml += '<ns4:InfPedidoCancelamento Id="Cancelamento_NF' + object.infPedidoCancelamento.identificacaoNfse.numero + '">';
                        xml += '<ns4:IdentificacaoNfse>';
                        xml += '<ns4:Numero>' + object.infPedidoCancelamento.identificacaoNfse.numero + '</Numero>';
                        xml += '<ns4:Cnpj>' + object.infPedidoCancelamento.identificacaoNfse.cnpj.replace(/\.|\/|\-|\s/g, '') + '</Cnpj>';
                        xml += '<ns4:InscricaoMunicipal>' + object.infPedidoCancelamento.identificacaoNfse.inscricaoMunicipal + '</InscricaoMunicipal>';
                        xml += '<ns4:CodigoMunicipio>' + object.infPedidoCancelamento.identificacaoNfse.codigoMunicipio + '</CodigoMunicipio>';
                        xml += '</ns4:IdentificacaoNfse>';
                        xml += '<ns4:CodigoCancelamento>' + object.infPedidoCancelamento.identificacaoNfse.codigoCancelamento + '</CodigoCancelamento>';
                        xml += '</ns4:InfPedidoCancelamento>';
                        xml += '</ns3:Pedido>';

                        createSignature(xml, cert, 'InfPedidoCancelamento').then(xmlSignature => {
                            validator.validateXML(xmlSignature, __dirname + '/../../../../resources/xsd/ginfes/servico_cancelar_nfse_envio_v03.xsd', function (err, validatorResult) {
                                if (err) {
                                    console.log(err);
                                    resolve(err);
                                }

                                if (!validatorResult.valid) {
                                    console.log(validatorResult);
                                    resolve(validatorResult);
                                }

                                let xml = '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
                                xml += '<soap:Body>';
                                xml += '<ns1:CancelarNfseEnvio xmlns:ns1="http://homologacao.ginfes.com.br">';
                                xml += '<arg0>';
                                xml += '<![CDATA[<ns2:cabecalho xmlns:ns2="http://nfe.sjp.pr.gov.br/cabecalho_v03.xsd" versao="3">';
                                xml += '<versaoDados>3</versaoDados>';
                                xml += '</ns2:cabecalho>]]>';
                                xml += '</arg0>';
                                xml += '<arg1>';
                                xml += '<![CDATA[' + xmlSignature + ']]>';
                                xml += '</arg1>';
                                xml += '</ns1:CancelarNfseEnvio>';
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
                    });

                } catch (error) {
                    reject(error);
                }
                break;

            case 'searchNfseByRps':
                try {
                    const pfx = fs.readFileSync(object.config.diretorioDoCertificado);

                    pem.readPkcs12(pfx, {
                        p12Password: object.config.senhaDoCertificado
                    }, (err, cert) => {
                        if (err) {
                            return res.send({
                                error: err
                            });
                        }
                        let xml = '<ns3:IdentificacaoRps xmlns:ns3="http://www.ginfes.com.br/servico_consultar_nfse_rps_envio_v03.xsd" xmlns:ns4="http://www.ginfes.com.br/tipos_v03.xsd">';
                        xml += '<ns4:Numero>' + object.infPedidoCancelamento.identificacaoNfse.numero + '</Numero>';
                        xml += '<ns4:Serie>' + object.infPedidoCancelamento.identificacaoNfse.serie + '</Serie>';
                        xml += '<ns4:Tipo>' + object.infPedidoCancelamento.identificacaoNfse.tipo + '</Tipo>';
                        xml += '</ns4:IdentificacaoRps>';
                        xml += '<ns4:Prestador>';
                        xml += '<ns4:Cnpj>' + object.infPedidoCancelamento.identificacaoNfse.cnpj.replace(/\.|\/|\-|\s/g, '') + '</Cnpj>';
                        xml += '<ns4:InscricaoMunicipal>' + object.infPedidoCancelamento.identificacaoNfse.inscricaoMunicipal + '</InscricaoMunicipal>';
                        xml += '</ns4:Prestador>';

                        createSignature(xml, cert, 'InfPedidoCancelamento').then(xmlSignature => {
                            validator.validateXML(xmlSignature, __dirname + '/../../../../resources/xsd/ginfes/servico_cancelar_nfse_envio_v03.xsd', function (err, validatorResult) {
                                if (err) {
                                    console.log(err);
                                    resolve(err);
                                }

                                if (!validatorResult.valid) {
                                    console.log(validatorResult);
                                    resolve(validatorResult);
                                }

                                let xml = '<soap:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://nfe.sjp.pr.gov.br">';
                                xml += '<soap:Header />';
                                xml += '<soap:Body>';
                                xml += '<ns1:RecepcionarLoteRpsV3>';
                                xml += '<arg0>';
                                xml += '<![CDATA[<ns2:cabecalho xmlns:ns2="http://nfe.sjp.pr.gov.br/cabecalho_v03.xsd" versao="3">';
                                xml += '<versaoDados>3</versaoDados>';
                                xml += '</ns2:cabecalho>]]>';
                                xml += '</arg0>';
                                xml += '<arg1>';
                                xml += '<![CDATA[' + xmlSignature + ']]>';
                                xml += '</arg1>';
                                xml += '</ns1:RecepcionarLoteRpsV3>';
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
            xmlToBeSigned += '<ns4:Rps>';
            xmlToBeSigned += '<ns4:InfRps Id="' + object.emissor.cnpj.replace(/\.|\/|\s/g, '') + timestamp + 'RPS' + index + '">';
            xmlToBeSigned += '<ns4:IdentificacaoRps>';
            xmlToBeSigned += '<ns4:Numero>' + timestamp + index + '</ns4:Numero>';
            xmlToBeSigned += '<ns4:Serie>RPS</ns4:Serie>';
            xmlToBeSigned += '<ns4:Tipo>' + r.tipo + '</ns4:Tipo>';
            xmlToBeSigned += '</ns4:IdentificacaoRps>';
            xmlToBeSigned += '<ns4:DataEmissao>' + r.dataEmissao + '</ns4:DataEmissao>';
            xmlToBeSigned += '<ns4:NaturezaOperacao>' + r.naturezaOperacao + '</ns4:NaturezaOperacao>';
            xmlToBeSigned += '<ns4:OptanteSimplesNacional>' + r.optanteSimplesNacional + '</ns4:OptanteSimplesNacional>';
            xmlToBeSigned += '<ns4:IncentivadorCultural>' + r.incentivadorCultural + '</ns4:IncentivadorCultural>';
            xmlToBeSigned += '<ns4:Status>' + r.status + '</ns4:Status>';

            r.servicos.forEach(s => {
                xmlToBeSigned += '<ns4:Servico>';
                xmlToBeSigned += '<ns4:Valores>';
                xmlToBeSigned += '<ns4:ValorServicos>' + s.valorServicos + '</ns4:ValorServicos>';
                xmlToBeSigned += '<ns4:ValorDeducoes>' + s.valorDeducoes + '</ns4:ValorDeducoes>';
                xmlToBeSigned += '<ns4:ValorPis>' + s.valorPis + '</ns4:ValorPis>';
                xmlToBeSigned += '<ns4:ValorCofins>' + s.valorCofins + '</ns4:ValorCofins>';
                xmlToBeSigned += '<ns4:ValorInss>' + s.valorInss + '</ns4:ValorInss>';
                xmlToBeSigned += '<ns4:ValorIr>' + s.valorIr + '</ns4:ValorIr>';
                xmlToBeSigned += '<ns4:ValorCsll>' + s.valorCsll + '</ns4:ValorCsll>';
                xmlToBeSigned += '<ns4:IssRetido>' + s.issRetido + '</ns4:IssRetido>';
                xmlToBeSigned += '<ns4:ValorIss>' + s.valorIss + '</ns4:ValorIss>';
                xmlToBeSigned += '<ns4:BaseCalculo>' + s.baseCalculo + '</ns4:BaseCalculo>';
                xmlToBeSigned += '<ns4:Aliquota>' + s.aliquota + '</ns4:Aliquota>';
                xmlToBeSigned += '<ns4:ValorLiquidoNfse>' + s.valorLiquidoNfse + '</ns4:ValorLiquidoNfse>';
                xmlToBeSigned += '</ns4:Valores>';
                xmlToBeSigned += '<ns4:ItemListaServico>' + s.itemListaServico + '</ns4:ItemListaServico>';
                if (s.codigoTributacaoMunicipio) {
                    xmlToBeSigned += '<ns4:CodigoTributacaoMunicipio>' + s.codigoTributacaoMunicipio + '</ns4:CodigoTributacaoMunicipio>';
                }
                xmlToBeSigned += '<ns4:Discriminacao>' + s.discriminacao + '</ns4:Discriminacao>';
                xmlToBeSigned += '<ns4:CodigoMunicipio>' + s.codigoMunicipío + '</ns4:CodigoMunicipio>';
                xmlToBeSigned += '</ns4:Servico>';
            });

            xmlToBeSigned += '<ns4:Prestador>';
            xmlToBeSigned += '<ns4:Cnpj>' + prestadorCnpj + '</ns4:Cnpj>';
            xmlToBeSigned += '<ns4:InscricaoMunicipal>' + prestadorIncricaoMunicipal + '</ns4:InscricaoMunicipal>';
            xmlToBeSigned += '</ns4:Prestador>';
            xmlToBeSigned += '<ns4:Tomador>';
            xmlToBeSigned += '<ns4:IdentificacaoTomador>';
            xmlToBeSigned += '<ns4:CpfCnpj>';
            if (r.tomador.cnpjCpf.replace(/\.|\/|\s/g, '').length > 11) {
                xmlToBeSigned += '<ns4:Cnpj>' + r.tomador.cnpjCpf.replace(/\.|\/|\s/g, '') + '</ns4:Cnpj>';
            } else {
                xmlToBeSigned += '<ns4:Cpf>' + r.tomador.cnpjCpf.replace(/\.|\/|\s/g, '') + '</ns4:Cpf>';
            }
            xmlToBeSigned += '</ns4:CpfCnpj>';
            xmlToBeSigned += '<ns4:InscricaoMunicipal>' + r.tomador.inscricaoMunicipal + '</ns4:InscricaoMunicipal>';
            xmlToBeSigned += '</ns4:IdentificacaoTomador>';
            xmlToBeSigned += '<ns4:RazaoSocial>' + r.tomador.razaoSocial + '</ns4:RazaoSocial>';
            xmlToBeSigned += '<ns4:Endereco>';
            xmlToBeSigned += '<ns4:Endereco>' + r.tomador.endereco.endereco + '</ns4:Endereco>';
            xmlToBeSigned += '<ns4:Numero>' + r.tomador.endereco.numero + '</ns4:Numero>';
            xmlToBeSigned += '<ns4:Bairro>' + r.tomador.endereco.bairro + '</ns4:Bairro>';
            xmlToBeSigned += '<ns4:CodigoMunicipio>' + r.tomador.endereco.codigoMunicipio + '</ns4:CodigoMunicipio>';
            xmlToBeSigned += '<ns4:Uf>' + r.tomador.endereco.uf + '</ns4:Uf>';
            xmlToBeSigned += '<ns4:Cep>' + r.tomador.endereco.cep + '</ns4:Cep>';
            xmlToBeSigned += '</ns4:Endereco>';
            xmlToBeSigned += '<ns4:Contato>';
            xmlToBeSigned += '<ns4:Telefone>' + r.tomador.contato.telefone + '</ns4:Telefone>';
            xmlToBeSigned += '<ns4:Email>' + r.tomador.contato.email + '</ns4:Email>';
            xmlToBeSigned += '</ns4:Contato>';
            xmlToBeSigned += '</ns4:Tomador>';
            xmlToBeSigned += '</ns4:InfRps>';
            xmlToBeSigned += '</ns4:Rps>';

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