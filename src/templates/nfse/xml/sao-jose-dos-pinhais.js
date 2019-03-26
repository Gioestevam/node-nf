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
                                    xml += element;
                                });
                                xml += '</ListaRps>';
                                xml += '</LoteRps>';
                                xml += '</EnviarLoteRpsEnvio>';

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

                                        let xml = '<soap:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="http://nfe.sjp.pr.gov.br">';
                                        xml += '<soap:Header />';
                                        xml += '<soap:Body>';
                                        xml += '<ns1:RecepcionarLoteRpsV3>';
                                        xml += '<arg0>';
                                        xml += '<ns2:cabecalho xmlns:ns2="http://nfe.sjp.pr.gov.br/cabecalho_v03.xsd" versao="3">';
                                        xml += '<versaoDados>3</versaoDados>';
                                        xml += '</cabecalho>';
                                        xml += '</arg0>';
                                        xml += '<arg1>';
                                        xml += xmlSignature;
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
                                xml += '<ns2:cabecalho versao="3" xmlns:ns2="http://www.ginfes.com.br/cabecalho_v03.xsd">';
                                xml += '<versaoDados>3</versaoDados>';
                                xml += '</ns2:cabecalho>';
                                xml += '</arg0>';
                                xml += '<arg1>';
                                xml += xmlSignature;
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
                                xml += '<ns2:cabecalho xmlns:ns2="http://nfe.sjp.pr.gov.br/cabecalho_v03.xsd" versao="3">';
                                xml += '<versaoDados>3</versaoDados>';
                                xml += '</cabecalho>';
                                xml += '</arg0>';
                                xml += '<arg1>';
                                xml += xmlSignature;
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