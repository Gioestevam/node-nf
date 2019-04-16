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
    return new Promise((resolve, reject) => {
        if (object.config.producaoHomologacao === 'producao') {
            url = 'https://nfe.prefeitura.sp.gov.br/ws/lotenfe.asmx?WSDL';
        } else {
            const result = {
                message: 'São Paulo não tem ambiente de homologação'
            };

            resolve(result);
        }
        
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

                        const date = new Date();
                        const year = date.getFullYear();
                        const month = (date.getMonth() + 1) < 10 ? '0' + date.getMonth() : date.getMonth();
                        const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
                        const quantityRPS = object.rps.length;
                        let servicesTotal = 0;
                        let deductionsTotal = 0;
                        object.rps.forEach(rps => {                            
                            servicesTotal = rps.servico.valorServicos + servicesTotal;
                            servicesTotal = servicesTotal;

                            deductionsTotal = rps.servico.valorDeducoes + deductionsTotal;
                            deductionsTotal = deductionsTotal;
                        });

                        let xml = '<ns3:PedidoEnvioLoteRPS xmlns:ns3="http://www.prefeitura.sp.gov.br/nfe" xmlns:ns4="http://www.prefeitura.sp.gov.br/nfe/tipos">';
                        xml += '<Cabecalho Versao="1">';
                        xml += '<CPFCNPJRemetente><CNPJ>' + object.emissor.cnpj.replace(/\.|\/|\s/g, '') + '</CNPJ></CPFCNPJRemetente>';
                        xml += '<transacao>1</transacao>';
                        xml += '<dtInicio>' + year + '-' + month + '-' + day + '</dtInicio>';
                        xml += '<dtFim>' + year + '-' + month + '-' + day + '</dtFim>';
                        xml += '<QtdRPS>' + quantityRPS + '</QtdRPS>';
                        xml += '<ValorTotalServicos>' + servicesTotal + '</ValorTotalServicos>';
                        xml += '<ValorTotalDeducoes>' + deductionsTotal + '</ValorTotalDeducoes>';
                        xml += '</Cabecalho>';
                        addSignedXml(object, cert)
                            .then(signedXmlRes => {
                                signedXmlRes.forEach(element => {
                                    xml += element;
                                });

                                xml += '</ns3:PedidoEnvioLoteRPS>';

                                createSignature(xml, cert, 'Cabecalho', true)
                                    .then(xmlSignature => {
                                        validator.validateXML(xmlSignature, __dirname + '/../../../../resources/xsd/sao-paulo/PedidoEnvioLoteRPS_v01.xsd', function (err, validatorResult) {
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
                                            xml += '<ns1:RecepcionarLoteRpsV3 xmlns:ns1="http://homologacao.ginfes.com.br">';
                                            xml += '<arg0>';
                                            xml += '<ns2:cabecalho versao="3" xmlns:ns2="http://www.ginfes.com.br/cabecalho_v03.xsd">';
                                            xml += '<versaoDados>3</versaoDados>';
                                            xml += '</ns2:cabecalho>';
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
                    const prestadorIncricaoMunicipal = object.prestador.inscricaoMunicipal;
                    
                    pem.readPkcs12(pfx, {
                        p12Password: object.config.senhaDoCertificado
                    }, (err, cert) => {
                        if (err) {
                            return res.send({
                                error: err
                            });
                        }

                        let xml = '<PedidoCancelamentoNFe xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://www.prefeitura.sp.gov.br/nfe">';
                        xml += '<Cabecalho Versao="1">';
                        xml += '<CPFCNPJRemetente><CNPJ>' + object.prestador.cnpj.replace(/\.|\/|\s/g, '') + '</CNPJ></CPFCNPJRemetente>';
                        xml += '<transacao>1</transacao>';
                        xml += '</Cabecalho>';
                        xml += '<Detalhe>';
                        xml += '<ChaveNFe>';
                        xml += '<InscricaoPrestador>' + prestadorIncricaoMunicipal + '</InscricaoPrestador>';
                        xml += '<NumeroNFe>' + object.numeroNfse + '</NumeroNFe>';
                        xml += '</ChaveNFe>';
                        xml += '</Detalhe>';
                        xml += '<ns3:NumeroNfse>' + object.numeroNfse + '</ns3:NumeroNfse>';
                        xml += '</PedidoCancelamentoNFe>';

                        createSignature(xml, cert, 'CancelarNfseEnvio', true).then(xmlSignature => {
                            validator.validateXML(xmlSignature, __dirname + '/../../../../resources/xsd/sao-paulo/PedidoCancelamentoNFe_v01.xsd', function (err, validatorResult) {
                                if (err) {
                                    console.log(err);
                                    resolve(err);
                                }

                                if (!validatorResult.valid) {
                                    console.log(validatorResult);
                                    resolve(validatorResult);
                                }

                                let xml = '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
                                xml += '<soap:Header/>';
                                xml += '<soap:Body>';
                                xml += '<ns1:CancelarNfse xmlns:ns1="http://homologacao.ginfes.com.br">';
                                xml += '<arg0>';
                                xml += xmlSignature;
                                xml += '</arg0>';
                                xml += '</ns1:CancelarNfse>';
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

            case 'searchRpsLot':
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

                        let xml = '<ns3:ConsultarLoteRpsEnvio xmlns:ns3="http://www.ginfes.com.br/servico_consultar_lote_rps_envio_v03.xsd" xmlns:ns4="http://www.prefeitura.sp.gov.br/nfe/tipos">';
                        xml += '<ns3:Prestador>';
                        xml += '<ns4:Cnpj>' + object.prestador.cnpj.replace(/\.|\/|\-|\s/g, '') + '</ns4:Cnpj>';
                        xml += '<ns4:InscricaoMunicipal>' + object.prestador.inscricaoMunicipal + '</ns4:InscricaoMunicipal>';
                        xml += '</ns3:Prestador>';
                        xml += '<ns3:Protocolo>' + object.protocolo + '</ns3:Protocolo>';
                        xml += '</ns3:ConsultarLoteRpsEnvio>';

                        createSignature(xml, cert, 'ConsultarLoteRpsEnvio', true).then(xmlSignature => {
                            validator.validateXML(xmlSignature, __dirname + '/../../../../resources/xsd/sao-paulo/PedidoConsultaLote_v01.xsd', function (err, validatorResult) {
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
                                xml += '<ns1:ConsultarLoteRpsV3 xmlns:ns1="http://homologacao.ginfes.com.br">';
                                xml += '<arg0>';
                                xml += '<ns2:cabecalho versao="3" xmlns:ns2="http://www.ginfes.com.br/cabecalho_v03.xsd">';
                                xml += '<versaoDados>3</versaoDados>';
                                xml += '</ns2:cabecalho>';
                                xml += '</arg0>';
                                xml += '<arg1>';
                                xml += xmlSignature;
                                xml += '</arg1>';
                                xml += '</ns1:ConsultarLoteRpsV3>';
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
                            resolve({
                                error: err
                            });
                        }

                        let xml = '<ns3:ConsultarNfseRpsEnvio xmlns:ns3="http://www.ginfes.com.br/servico_consultar_nfse_rps_envio_v03.xsd" xmlns:ns4="http://www.prefeitura.sp.gov.br/nfe/tipos">';
                        xml += '<ns3:IdentificacaoRps>';
                        xml += '<ns4:Numero>' + object.identificacaoRps.numero + '</ns4:Numero>';
                        xml += '<ns4:Serie>' + object.identificacaoRps.serie + '</ns4:Serie>';
                        xml += '<ns4:Tipo>' + object.identificacaoRps.tipo + '</ns4:Tipo>';
                        xml += '</ns3:IdentificacaoRps>';
                        xml += '<ns3:Prestador>';
                        xml += '<ns4:Cnpj>' + object.prestador.cnpj.replace(/\.|\/|\-|\s/g, '') + '</ns4:Cnpj>';
                        xml += '<ns4:InscricaoMunicipal>' + object.prestador.inscricaoMunicipal + '</ns4:InscricaoMunicipal>';
                        xml += '</ns3:Prestador>';
                        xml += '</ns3:ConsultarNfseRpsEnvio>';

                        createSignature(xml, cert, 'ConsultarNfseRpsEnvio', true).then(xmlSignature => {
                            validator.validateXML(xmlSignature, __dirname + '/../../../../resources/xsd/ginfes/servico_consultar_nfse_rps_envio_v03.xsd', function (err, validatorResult) {
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
                                xml += '<ns1:ConsultarNfsePorRpsV3 xmlns:ns1="http://homologacao.ginfes.com.br">';
                                xml += '<arg0>';
                                xml += '<ns2:cabecalho versao="3" xmlns:ns2="http://www.ginfes.com.br/cabecalho_v03.xsd">';
                                xml += '<versaoDados>3</versaoDados>';
                                xml += '</ns2:cabecalho>';
                                xml += '</arg0>';
                                xml += '<arg1>';
                                xml += xmlSignature;
                                xml += '</arg1>';
                                xml += '</ns1:ConsultarNfsePorRpsV3>';
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

            case 'searchSituation':
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

                        let xml = '<ns3:ConsultarSituacaoLoteRpsEnvio xmlns:ns3="http://www.ginfes.com.br/servico_consultar_situacao_lote_rps_envio_v03.xsd" xmlns:ns4="http://www.prefeitura.sp.gov.br/nfe/tipos">';
                        xml += '<ns3:Prestador>';
                        xml += '<ns4:Cnpj>' + object.prestador.cnpj.replace(/\.|\/|\-|\s/g, '') + '</ns4:Cnpj>';
                        xml += '<ns4:InscricaoMunicipal>' + object.prestador.inscricaoMunicipal + '</ns4:InscricaoMunicipal>';
                        xml += '</ns3:Prestador>';
                        xml += '<ns3:Protocolo>' + object.protocolo + '</ns3:Protocolo>';
                        xml += '</ns3:ConsultarSituacaoLoteRpsEnvio>';

                        createSignature(xml, cert, 'ConsultarSituacaoLoteRpsEnvio').then(xmlSignature => {
                            validator.validateXML(xmlSignature, __dirname + '/../../../../resources/xsd/ginfes/servico_consultar_situacao_lote_rps_envio_v03.xsd', function (err, validatorResult) {
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
                                xml += '<ns1:ConsultarSituacaoLoteRpsV3 xmlns:ns1="http://homologacao.ginfes.com.br">';
                                xml += '<arg0>';
                                xml += '<ns2:cabecalho versao="3" xmlns:ns2="http://www.ginfes.com.br/cabecalho_v03.xsd">';
                                xml += '<versaoDados>3</versaoDados>';
                                xml += '</ns2:cabecalho>';
                                xml += '</arg0>';
                                xml += '<arg1>';
                                xml += xmlSignature;
                                xml += '</arg1>';
                                xml += '</ns1:ConsultarSituacaoLoteRpsV3>';
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

            case 'searchInvoice':
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

                        let xml = '<ns3:ConsultarNfseEnvio xmlns:ns3="http://www.ginfes.com.br/servico_consultar_nfse_envio_v03.xsd" xmlns:ns4="http://www.prefeitura.sp.gov.br/nfe/tipos">';
                        xml += '<ns3:Prestador>';
                        xml += '<ns4:Cnpj>' + object.prestador.cnpj.replace(/\.|\/|\-|\s/g, '') + '</ns4:Cnpj>';
                        xml += '<ns4:InscricaoMunicipal>' + object.prestador.inscricaoMunicipal + '</ns4:InscricaoMunicipal>';
                        xml += '</ns3:Prestador>';
                        xml += '<ns3:PeriodoEmissao>';
                        xml += '<ns3:DataInicial>' + object.periodoEmissao.dataInicial + '</ns4:DataInicial>';
                        xml += '<ns3:DataFinal>' + object.periodoEmissao.dataFinal + '</ns4:DataFinal>';
                        xml += '</ns3:PeriodoEmissao>';
                        // xml += '<ns3:Tomador>';
                        // xml += '<ns4:CpfCnpj>';
                        // if (object.tomador.cnpjCpf.replace(/\.|\/|\-|\s/g, '').length === 11) {
                        //     xml += '<ns4:Cpf>' + object.tomador.cnpjCpf.replace(/\.|\/|\-|\s/g, '') + '<ns4:Cpf>';
                        // }

                        // if (object.tomador.cnpjCpf.replace(/\.|\/|\-|\s/g, '').length === 14) {
                        //     xml += '<ns4:Cnpj>' + object.tomador.cnpjCpf.replace(/\.|\/|\-|\s/g, '') + '<ns4:Cnpj>';
                        // }
                        // xml += '</ns4:CpfCnpj>';
                        // xml += '</ns3:Tomador>';
                        xml += '</ns3:ConsultarNfseEnvio>';

                        createSignature(xml, cert, 'ConsultarNfseEnvio').then(xmlSignature => {
                            validator.validateXML(xmlSignature, __dirname + '/../../../../resources/xsd/ginfes/servico_consultar_nfse_envio_v03.xsd', function (err, validatorResult) {
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
                                xml += '<ns1:ConsultarSituacaoLoteRpsV3 xmlns:ns1="http://homologacao.ginfes.com.br">';
                                xml += '<arg0>';
                                xml += '<ns2:cabecalho versao="3" xmlns:ns2="http://www.ginfes.com.br/cabecalho_v03.xsd">';
                                xml += '<versaoDados>3</versaoDados>';
                                xml += '</ns2:cabecalho>';
                                xml += '</arg0>';
                                xml += '<arg1>';
                                xml += xmlSignature;
                                xml += '</arg1>';
                                xml += '</ns1:ConsultarSituacaoLoteRpsV3>';
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
            xmlToBeSigned += '<RPS>';
            xmlToBeSigned += '<ChaveRPS>';
            xmlToBeSigned += '<InscricaoPrestador>' + prestadorIncricaoMunicipal + '</InscricaoPrestador>';
            xmlToBeSigned += '<SerieRPS>RPS</SerieRPS>';
            xmlToBeSigned += '<NumeroRPS>' + timestamp + index + '</NumeroRPS>';
            xmlToBeSigned += '</ChaveRPS>';
            xmlToBeSigned += '<TipoRPS>' + r.tipo + '</TipoRPS>';
            xmlToBeSigned += '<DataEmissao>' + r.dataEmissao + '</DataEmissao>';
            xmlToBeSigned += '<StatusRPS>' + r.status + '</StatusRPS>';
            xmlToBeSigned += '<TributacaoRPS>T</TributacaoRPS>';            
            xmlToBeSigned += '<ValorServicos>' + r.servico.valorServicos + '</ValorServicos>';
            xmlToBeSigned += '<ValorDeducoes>' + r.servico.valorDeducoes + '</ValorDeducoes>';
            xmlToBeSigned += '<CodigoServico>' + r.servico.itemListaServico + '</CodigoServico>';
            xmlToBeSigned += '<AliquotaServicos>' + r.servico.aliquota + '</AliquotaServicos>';
            xmlToBeSigned += '<ISSRetido>' + r.servico.issRetido + '</ISSRetido>';
            xmlToBeSigned += '<CPFCNPJTomador>';
            if (r.tomador.cnpjCpf.replace(/\.|\/|\s/g, '').length > 11) {
                xmlToBeSigned += '<CNPJ>' + r.tomador.cnpjCpf.replace(/\.|\/|\s/g, '') + '</CNPJ>';
            } else {
                xmlToBeSigned += '<CPF>' + r.tomador.cnpjCpf.replace(/\.|\/|\s/g, '') + '</CPF>';
            }
            xmlToBeSigned += '</CPFCNPJTomador>';
            xmlToBeSigned += '<RazaoSocialTomador>' + r.tomador.razaoSocial + '</RazaoSocialTomador>';
            xmlToBeSigned += '<EnderecoTomador>';
            xmlToBeSigned += '<Logradouro>' + r.tomador.endereco.endereco + '</Logradouro>';
            xmlToBeSigned += '<NumeroEndereco>' + r.tomador.endereco.numero + '</NumeroEndereco>';
            xmlToBeSigned += '<Bairro>' + r.tomador.endereco.bairro + '</Bairro>';
            xmlToBeSigned += '<Cidade>' + r.tomador.endereco.codigoMunicipio + '</Cidade>';
            xmlToBeSigned += '<UF>' + r.tomador.endereco.uf + '</UF>';
            xmlToBeSigned += '<CEP>' + r.tomador.endereco.cep + '</CEP>';
            xmlToBeSigned += '</EnderecoTomador>';
            xmlToBeSigned += '<EmailTomador>' + r.tomador.contato.email + '</EmailTomador>';
            xmlToBeSigned += '<Discriminacao>' + r.servico.discriminacao + '</Discriminacao>';
            xmlToBeSigned += '</RPS>';
            xmlToBeSignedArray.push(xmlToBeSigned);

        });

        xmlToBeSignedArray.map((rps, index) => {
            createSignature(rps, cert, 'RPS', true)
                .then(createdSignatureXml => {
                    const signature = '<Assinatura>' + createdSignatureXml.split('<SignatureValue>')[1].split('</SignatureValue>')[0] + '</Assinatura>' ;
                    const rpsSignature = createdSignatureXml.replace(createdSignatureXml.split('<Signature xmlns="http://www.w3.org/2000/09/xmldsig#">')[1].split('</Signature>')[0], '').replace('<Signature xmlns="http://www.w3.org/2000/09/xmldsig#">', '').replace('<Signature>', '').replace('<RPS>', '<RPS>' + signature);
                    xmlSignedArray.push(rpsSignature);
                    
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

function createSignature(xmlToBeSigned, cert, xmlElement, isEmptyUri = null) {
    return new Promise((resolve, reject) => {
        xmlSignatureController.addSignatureToXml(xmlToBeSigned, cert, xmlElement, null, isEmptyUri)
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