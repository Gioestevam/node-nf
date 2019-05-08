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

const d = new Date();
const timestamp = Date.now();
const numeroLote = timestamp.toString().substring(4,13) + (d.getYear() - 100);

function createXml(object, action) {
    var url = '';
    object.config.producaoHomologacao === 'producao' ? url = 'https://producao.ginfes.com.br/ServiceGinfesImpl?wsdl' : url = 'https://homologacao.ginfes.com.br/ServiceGinfesImpl?wsdl';
    object.config.producaoHomologacao === 'producao' ? urlXmlns = 'http://producao.ginfes.com.br' : urlXmlns = 'http://homologacao.ginfes.com.br';

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
        });

        switch (action) {
            case 'postLotInvoice':
                try {
                    let xml = '<ns3:EnviarLoteRpsEnvio xmlns:ns3="http://www.ginfes.com.br/servico_enviar_lote_rps_envio_v03.xsd" xmlns:ns4="http://www.ginfes.com.br/tipos_v03.xsd">';
                    xml += '<ns3:LoteRps Id="' + object.emissor.cnpj.replace(/[^\d]+/g,'') + timestamp + '">';
                    xml += '<ns4:NumeroLote>' + numeroLote + '</ns4:NumeroLote>';
                    xml += '<ns4:Cnpj>' + object.emissor.cnpj.replace(/[^\d]+/g,'') + '</ns4:Cnpj>';
                    if (object.emissor.inscricaoMunicipal && object.emissor.inscricaoMunicipal != '') {
                        xml += '<ns4:InscricaoMunicipal>' + object.emissor.inscricaoMunicipal + '</ns4:InscricaoMunicipal>';
                    }
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
                                validator.validateXML(xmlSignature, __dirname + '/../../../../resources/xsd/ginfes/servico_enviar_lote_rps_envio_v03.xsd', function (err, validatorResult) {
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
                                    xml += '<ns1:RecepcionarLoteRpsV3 xmlns:ns1="' + urlXmlns + '">';
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

                        let xml = '<ns3:CancelarNfseEnvio xmlns:ns3="http://www.ginfes.com.br/servico_cancelar_nfse_envio" xmlns:ns4="http://www.ginfes.com.br/tipos">';
                        xml += '<ns3:Prestador>';
                        xml += '<ns4:Cnpj>' + object.prestador.cnpj.replace(/\.|\/|\-|\s/g, '') + '</ns4:Cnpj>';
                        if (object.prestador.inscricaoMunicipal || object.prestador.inscricaoMunicipal != '') {
                            xml += '<ns4:InscricaoMunicipal>' + object.prestador.inscricaoMunicipal + '</ns4:InscricaoMunicipal>';
                        }
                        xml += '</ns3:Prestador>';
                        xml += '<ns3:NumeroNfse>' + object.numeroNfse + '</ns3:NumeroNfse>';
                        xml += '</ns3:CancelarNfseEnvio>';

                        createSignature(xml, cert, 'CancelarNfseEnvio', true).then(xmlSignature => {
                            validator.validateXML(xmlSignature, __dirname + '/../../../../resources/xsd/ginfes/schemas_v202/servico_cancelar_nfse_envio_v02.xsd', function (err, validatorResult) {
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
                                xml += '<ns1:CancelarNfse xmlns:ns1="' + urlXmlns + '">';
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

                        let xml = '<ns3:ConsultarLoteRpsEnvio xmlns:ns3="http://www.ginfes.com.br/servico_consultar_lote_rps_envio_v03.xsd" xmlns:ns4="http://www.ginfes.com.br/tipos_v03.xsd">';
                        xml += '<ns3:Prestador>';
                        xml += '<ns4:Cnpj>' + object.prestador.cnpj.replace(/\.|\/|\-|\s/g, '') + '</ns4:Cnpj>';
                        if (object.prestador.inscricaoMunicipal || object.prestador.inscricaoMunicipal != '') {                            
                            xml += '<ns4:InscricaoMunicipal>' + object.prestador.inscricaoMunicipal + '</ns4:InscricaoMunicipal>';
                        }
                        xml += '</ns3:Prestador>';
                        xml += '<ns3:Protocolo>' + object.protocolo + '</ns3:Protocolo>';
                        xml += '</ns3:ConsultarLoteRpsEnvio>';

                        createSignature(xml, cert, 'ConsultarLoteRpsEnvio').then(xmlSignature => {
                            validator.validateXML(xmlSignature, __dirname + '/../../../../resources/xsd/ginfes/servico_consultar_lote_rps_envio_v03.xsd', function (err, validatorResult) {
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
                                xml += '<ns1:ConsultarLoteRpsV3 xmlns:ns1="' + urlXmlns + '">';
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

                        let xml = '<ns3:ConsultarNfseRpsEnvio xmlns:ns3="http://www.ginfes.com.br/servico_consultar_nfse_rps_envio_v03.xsd" xmlns:ns4="http://www.ginfes.com.br/tipos_v03.xsd">';
                        xml += '<ns3:IdentificacaoRps>';
                        xml += '<ns4:Numero>' + object.identificacaoRps.numero + '</ns4:Numero>';
                        xml += '<ns4:Serie>' + object.identificacaoRps.serie + '</ns4:Serie>';
                        xml += '<ns4:Tipo>' + object.identificacaoRps.tipo + '</ns4:Tipo>';
                        xml += '</ns3:IdentificacaoRps>';
                        xml += '<ns3:Prestador>';
                        xml += '<ns4:Cnpj>' + object.prestador.cnpj.replace(/\.|\/|\-|\s/g, '') + '</ns4:Cnpj>';
                        if (object.prestador.inscricaoMunicipal || object.prestador.inscricaoMunicipal != '') {
                            xml += '<ns4:InscricaoMunicipal>' + object.prestador.inscricaoMunicipal + '</ns4:InscricaoMunicipal>';
                        }
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
                                xml += '<ns1:ConsultarNfsePorRpsV3 xmlns:ns1="' + urlXmlns + '">';
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

                        let xml = '<ns3:ConsultarSituacaoLoteRpsEnvio xmlns:ns3="http://www.ginfes.com.br/servico_consultar_situacao_lote_rps_envio_v03.xsd" xmlns:ns4="http://www.ginfes.com.br/tipos_v03.xsd">';
                        xml += '<ns3:Prestador>';
                        xml += '<ns4:Cnpj>' + object.prestador.cnpj.replace(/\.|\/|\-|\s/g, '') + '</ns4:Cnpj>';
                        if (object.prestador.inscricaoMunicipal || object.prestador.inscricaoMunicipal != '') {                            
                            xml += '<ns4:InscricaoMunicipal>' + object.prestador.inscricaoMunicipal + '</ns4:InscricaoMunicipal>';
                        }
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
                                xml += '<ns1:ConsultarSituacaoLoteRpsV3 xmlns:ns1="' + urlXmlns + '">';
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

                        let xml = '<ns3:ConsultarNfseEnvio xmlns:ns3="http://www.ginfes.com.br/servico_consultar_nfse_envio_v03.xsd" xmlns:ns4="http://www.ginfes.com.br/tipos_v03.xsd">';
                        xml += '<ns3:Prestador>';
                        xml += '<ns4:Cnpj>' + object.prestador.cnpj.replace(/\.|\/|\-|\s/g, '') + '</ns4:Cnpj>';
                        if (object.prestador.inscricaoMunicipal || object.prestador.inscricaoMunicipal != '') {                            
                            xml += '<ns4:InscricaoMunicipal>' + object.prestador.inscricaoMunicipal + '</ns4:InscricaoMunicipal>';
                        }
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
                                xml += '<ns1:ConsultarSituacaoLoteRpsV3 xmlns:ns1="' + urlXmlns + '">';
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
            let prestadorCnpj = object.emissor.cnpj.replace(/[^\d]+/g,'');
            let prestadorIncricaoMunicipal = object.emissor.inscricaoMunicipal;
            if (r.prestador) {
                prestadorCnpj = r.prestador.cnpj.replace(/[^\d]+/g,'');
                prestadorIncricaoMunicipal = r.prestador.inscricaoMunicipal;
            }
            xmlToBeSigned += '<ns4:Rps>';
            if (object.emissor.cnpj || object.emissor.cnpj != '') {
                xmlToBeSigned += '<ns4:InfRps Id="' + object.emissor.cnpj.replace(/[^\d]+/g,'') + timestamp + 'RPS' + index + '">';
            }
            xmlToBeSigned += '<ns4:IdentificacaoRps>';
            xmlToBeSigned += '<ns4:Numero>' + timestamp + index + '</ns4:Numero>';
            xmlToBeSigned += '<ns4:Serie>RPS</ns4:Serie>';
            if (object.emissor.cnpj || object.emissor.cnpj != '') {
                xmlToBeSigned += '<ns4:Tipo>' + r.tipo + '</ns4:Tipo>';
            }
            xmlToBeSigned += '</ns4:IdentificacaoRps>';
            xmlToBeSigned += '<ns4:DataEmissao>' + r.dataEmissao.replace(/\s/g, 'T') + '</ns4:DataEmissao>';
            xmlToBeSigned += '<ns4:NaturezaOperacao>' + r.naturezaOperacao + '</ns4:NaturezaOperacao>';
            if (r.regimeEspecialTributacao && r.regimeEspecialTributacao != '') {
                xmlToBeSigned += '<ns4:RegimeEspecialTributacao>' + r.regimeEspecialTributacao + '</ns4:RegimeEspecialTributacao>';
            }
            xmlToBeSigned += '<ns4:OptanteSimplesNacional>' + r.optanteSimplesNacional + '</ns4:OptanteSimplesNacional>';
            xmlToBeSigned += '<ns4:IncentivadorCultural>' + r.incentivadorCultural + '</ns4:IncentivadorCultural>';
            xmlToBeSigned += '<ns4:Status>' + r.status + '</ns4:Status>';
            
            xmlToBeSigned += '<ns4:Servico>';
            xmlToBeSigned += '<ns4:Valores>';
            xmlToBeSigned += '<ns4:ValorServicos>' + r.servico.valorServicos + '</ns4:ValorServicos>';
            xmlToBeSigned += '<ns4:ValorDeducoes>' + r.servico.valorDeducoes + '</ns4:ValorDeducoes>';
            xmlToBeSigned += '<ns4:ValorPis>' + r.servico.valorPis + '</ns4:ValorPis>';
            xmlToBeSigned += '<ns4:ValorCofins>' + r.servico.valorCofins + '</ns4:ValorCofins>';
            xmlToBeSigned += '<ns4:ValorInss>' + r.servico.valorInss + '</ns4:ValorInss>';
            xmlToBeSigned += '<ns4:ValorIr>' + r.servico.valorIr + '</ns4:ValorIr>';
            xmlToBeSigned += '<ns4:ValorCsll>' + r.servico.valorCsll + '</ns4:ValorCsll>';
            xmlToBeSigned += '<ns4:IssRetido>' + r.servico.issRetido + '</ns4:IssRetido>';
            xmlToBeSigned += '<ns4:ValorIss>' + r.servico.valorIss + '</ns4:ValorIss>';
            xmlToBeSigned += '<ns4:BaseCalculo>' + (r.servico.valorServicos - r.servico.valorDeducoes) + '</ns4:BaseCalculo>';
            xmlToBeSigned += '<ns4:Aliquota>' + r.servico.aliquota + '</ns4:Aliquota>';
            xmlToBeSigned += '<ns4:ValorLiquidoNfse>' + r.servico.valorLiquidoNfse + '</ns4:ValorLiquidoNfse>';
            xmlToBeSigned += '</ns4:Valores>';
            xmlToBeSigned += '<ns4:ItemListaServico>' + r.servico.itemListaServico.replace(/[^\d]+/g,'') + '</ns4:ItemListaServico>';
            if (r.servico.codigoTributacaoMunicipio || r.servico.codigoTributacaoMunicipio != '') {
                xmlToBeSigned += '<ns4:CodigoTributacaoMunicipio>' + r.servico.codigoTributacaoMunicipio.replace(/[^\d]+/g,'') + '</ns4:CodigoTributacaoMunicipio>';
            }
            xmlToBeSigned += '<ns4:Discriminacao>' + r.servico.discriminacao + '</ns4:Discriminacao>';
            xmlToBeSigned += '<ns4:CodigoMunicipio>' + r.servico.codigoMunicipio + '</ns4:CodigoMunicipio>';
            xmlToBeSigned += '</ns4:Servico>';

            xmlToBeSigned += '<ns4:Prestador>';
            xmlToBeSigned += '<ns4:Cnpj>' + prestadorCnpj.replace(/[^\d]+/g,'') +'</ns4:Cnpj>';
            if (prestadorIncricaoMunicipal || prestadorIncricaoMunicipal != '') {
                xmlToBeSigned += '<ns4:InscricaoMunicipal>' + prestadorIncricaoMunicipal + '</ns4:InscricaoMunicipal>';
            }
            xmlToBeSigned += '</ns4:Prestador>';
            xmlToBeSigned += '<ns4:Tomador>';
            xmlToBeSigned += '<ns4:IdentificacaoTomador>';
            xmlToBeSigned += '<ns4:CpfCnpj>';
            if (r.tomador.cnpjCpf.replace(/[^\d]+/g,'').length > 11) {
                xmlToBeSigned += '<ns4:Cnpj>' + r.tomador.cnpjCpf.replace(/[^\d]+/g,'') + '</ns4:Cnpj>';
            } else {
                xmlToBeSigned += '<ns4:Cpf>' + r.tomador.cnpjCpf.replace(/[^\d]+/g,'') + '</ns4:Cpf>';
            }
            xmlToBeSigned += '</ns4:CpfCnpj>';
            if (r.tomador.inscricaoMunicipal || r.tomador.inscricaoMunicipal != '') {
                xmlToBeSigned += '<ns4:InscricaoMunicipal>' + r.tomador.inscricaoMunicipal + '</ns4:InscricaoMunicipal>';
            }
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
            if (r.tomador.contato.telefone && r.tomador.contato.telefone != '') {
                xmlToBeSigned += '<ns4:Telefone>' + r.tomador.contato.telefone + '</ns4:Telefone>';
            }
            if (r.tomador.contato.email && r.tomador.contato.email != '') {
                xmlToBeSigned += '<ns4:Email>' + r.tomador.contato.email + '</ns4:Email>';
            }
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