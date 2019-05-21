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
                        let xml = '<EnviarLoteRpsEnvio xmlns="http://www.abrasf.org.br/nfse.xsd">';
                        xml += '<LoteRps Id="' + object.emissor.cnpj.replace(/[^\d]+/g,'') + timestamp + '">';
                        xml += '<NumeroLote>' + numeroLote + '</NumeroLote>';
                        xml += '<Cnpj>' + object.emissor.cnpj.replace(/[^\d]+/g,'') + '</Cnpj>';
                        if (object.emissor.inscricaoMunicipal && object.emissor.inscricaoMunicipal.trim() != '') {
                            xml += '<InscricaoMunicipal>' + object.emissor.inscricaoMunicipal + '</InscricaoMunicipal>';
                        }
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
                                    validator.validateXML(xmlSignature, __dirname + '/../../../../resources/xsd/catalao/nfse_v2_01.xsd', function (err, validatorResult) {
                                        if (err) {
                                            console.log(err);
                                            resolve(err);
                                        }

                                        if (!validatorResult.valid) {
                                            console.log(validatorResult);
                                            resolve(validatorResult);
                                        }
                                    });

                                    let xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.nfse">';                                    xml += '<soapenv:Header/>';
                                    xml += '<soapenv:Body>';
                                    xml += '<ser:RecepcionarLoteRpsRequest>';
                                    xml += '<nfseCabecMsg>';
                                    xml += '<![CDATA[<cabecalho xmlns="http://www.abrasf.org.br/nfse.xsd" versao="1.00">';
                                    xml += '<versaoDados>1.00</versaoDados>';
                                    xml += '</cabecalho>]]>';
                                    xml += '</nfseCabecMsg>';
                                    xml += '<nfseDadosMsg>';
                                    xml += '<![CDATA[' + xmlSignature + ']]>';
                                    xml += '</nfseDadosMsg>';
                                    xml += '</ser:RecepcionarLoteRpsRequest>';
                                    xml += '</soapenv:Body>';
                                    xml += '</soapenv:Envelope>'; console.log(xml);

                                    const result = {
                                        url: url,
                                        soapEnvelop: xml,
                                        soapAction: 'http://services.nfse/RecepcionarLoteRps'
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
                        let xmlContent = '<ConsultarSituacaoLoteRpsEnvio xmlns="http://www.abrasf.org.br/nfse.xsd">';
                        xmlContent += '<Prestador>';
                        if (object.prestador.cnpj && object.prestador.cnpj.trim() != '') {
                            xmlContent += '<Cnpj>' + object.prestador.cnpj.replace(/[^\d]+/g,'') + '</Cnpj>';
                        }
                        if (object.prestador.inscricaoMunicipal && object.prestador.inscricaoMunicipal.trim() != '') {
                            xmlContent += '<InscricaoMunicipal>' + object.prestador.inscricaoMunicipal + '</InscricaoMunicipal>';
                        }
                        xmlContent += '</Prestador>';
                        if (object.protocolo && object.protocolo.trim() != '') {
                            xmlContent += '<Protocolo>' + object.protocolo + '</Protocolo>';
                        }
                        xmlContent += '</ConsultarSituacaoLoteRpsEnvio>';

                        let xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.nfse">';
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
                            soapAction: 'http://services.nfse/ConsultarSituacaoLoteRps'
                        }

                        resolve(result);

                    } catch (error) {
                        reject(error)
                    }
                    break;

                case 'searchRpsLot':
                    try {
                        let xmlContent = '<ConsultarLoteRpsEnvio xmlns="http://www.abrasf.org.br/nfse.xsd">';
                        xmlContent += '<Prestador>';
                        if (object.prestador.cnpj && object.prestador.cnpj.trim() != '') {
                            xmlContent += '<Cnpj>' + object.prestador.cnpj.replace(/[^\d]+/g,'') + '</Cnpj>';
                        }
                        if (object.prestador.inscricaoMunicipal && object.prestador.inscricaoMunicipal.trim() != '') {
                            xmlContent += '<InscricaoMunicipal>' + object.prestador.inscricaoMunicipal + '</InscricaoMunicipal>';
                        }
                        xmlContent += '</Prestador>';
                        if (object.protocolo && object.protocolo.trim() != '') {
                            xmlContent += '<Protocolo>' + object.protocolo + '</Protocolo>';
                        }
                        xmlContent += '</ConsultarLoteRpsEnvio>';

                        validator.validateXML(xmlContent, __dirname + '/../../../../resources/xsd/catalao/nfse_v2_01.xsd', function (err, validatorResult) {
                            if (err) {
                                console.log(err);
                                resolve(err);
                            }

                            if (!validatorResult.valid) {
                                console.log(validatorResult);
                                resolve(validatorResult);
                            }
                        });

                        let xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.nfse">';
                        xml += '<soapenv:Header/>';
                        xml += '<soapenv:Body>';
                        xml += '<ser:ConsultarLoteRpsRequest>';
                        xml += '<nfseCabecMsg>';
                        xml += '<![CDATA[<cabecalho xmlns="http://www.abrasf.org.br/nfse.xsd" versao="1.00">';
                        xml += '<versaoDados>1.00</versaoDados>';
                        xml += '</cabecalho>]]>';
                        xml += '</nfseCabecMsg>';
                        xml += '<nfseDadosMsg>';
                        xml += '<![CDATA[' + xmlContent + ']]>';
                        xml += '</nfseDadosMsg>';
                        xml += '</ser:ConsultarLoteRpsRequest>';
                        xml += '</soapenv:Body>';
                        xml += '</soapenv:Envelope>';

                        const result = {
                            url: url,
                            soapEnvelop: xml,
                            soapAction: 'http://services.nfse/ConsultarLoteRps'
                        }

                        resolve(result);

                    } catch (error) {
                        reject(error)
                    }
                    break;

                case 'searchNfseByRps':
                    try {
                        let xmlContent = '<ConsultarNfseRpsEnvio xmlns="http://www.abrasf.org.br/nfse.xsd">';
                        xmlContent += '<IdentificacaoRps>';
                        if (object.identificacaoRps.numero && object.identificacaoRps.numero.trim() != '') {
                            xmlContent += '<Numero>' + object.identificacaoRps.numero + '</Numero>';
                        }
                        if (object.identificacaoRps.serie && object.identificacaoRps.serie.trim() != '') {
                            xmlContent += '<Serie>' + object.identificacaoRps.serie + '</Serie>';
                        }
                        if (object.identificacaoRps.tipo && object.identificacaoRps.tipo.trim() != '') {
                            xmlContent += '<Tipo>' + object.identificacaoRps.tipo + '</Tipo>';
                        }
                        xmlContent += '</IdentificacaoRps>';
                        xmlContent += '<Prestador>';
                        if (object.prestador.cnpj && object.prestador.cnpj.trim() != '') {
                            xmlContent += '<Cnpj>' + object.prestador.cnpj.replace(/[^\d]+/g,'') + '</Cnpj>';
                        }
                        if (object.prestador.inscricaoMunicipal && object.prestador.inscricaoMunicipal.trim() != '') {
                            xmlContent += '<InscricaoMunicipal>' + object.prestador.inscricaoMunicipal + '</InscricaoMunicipal>';
                        }
                        xmlContent += '</Prestador>';
                        xmlContent += '</ConsultarNfseRpsEnvio>';

                        let xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.nfse">';
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
                            soapAction: 'http://services.nfse/ConsultarNfsePorRps'
                        }

                        resolve(result);

                    } catch (error) {
                        reject(error)
                    }
                    break;

                case 'searchInvoice':
                    try {
                        let xmlContent = '<ConsultarNfseEnvio xmlns="http://www.abrasf.org.br/nfse.xsd">';
                        xmlContent += '<Prestador>';
                        if (object.prestador.cnpj && object.prestador.cnpj.trim() != '') {
                            xmlContent += '<Cnpj>' + object.prestador.cnpj.replace(/[^\d]+/g,'') + '</Cnpj>';
                        }
                        if (object.prestador.inscricaoMunicipal && object.prestador.inscricaoMunicipal.trim() != '') {
                            xmlContent += '<InscricaoMunicipal>' + object.prestador.inscricaoMunicipal + '</InscricaoMunicipal>';
                        }
                        xmlContent += '</Prestador>';
                        xmlContent += '<PeriodoEmissao>';
                        if (object.periodoEmissao.dataInicial && object.periodoEmissao.dataInicial.trim() != '') {
                            xmlContent += '<DataInicial>' + object.periodoEmissao.dataInicial + '</DataInicial>';
                        }
                        if (object.periodoEmissao.dataFinal && object.periodoEmissao.dataFinal.trim() != '') {
                            xmlContent += '<DataFinal>' + object.periodoEmissao.dataFinal + '</DataFinal>';
                        }
                        xmlContent += '</PeriodoEmissao>';
                        xmlContent += '<Tomador>';
                        if (object.tomador.cpfCnpj && object.tomador.cpfCnpj.trim() != '') {
                            xmlContent += '<CpfCnpj>';
                            if (object.tomador.cpfCnpj.length === 11) {
                                xmlContent += '<Cpf>' + object.tomador.cpfCnpj + '</Cpf>';
                            }
                            if (object.tomador.cpfCnpj.length === 14) {
                                xmlContent += '<Cnpj>' + object.tomador.cpfCnpj + '</Cnpj>';
                            }
                            xmlContent += '</CpfCnpj>';
                        }
                        xmlContent += '</Tomador>';
                        xmlContent += '</ConsultarNfseEnvio>';

                        let xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.nfse">';
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
                            soapAction: 'http://services.nfse/ConsultarNfse'
                        }

                        resolve(result);

                    } catch (error) {
                        reject(error)
                    }
                    break;

                case 'cancelInvoice':
                    try {
                        let xml = '<Pedido xmlns="http://www.abrasf.org.br/nfse.xsd">';
                        if (object.numeroNfse && object.numeroNfse.trim() != '') {
                            xml += '<InfPedidoCancelamento Id="Cancelamento_NF' + object.numeroNfse + '">';
                        }
                        xml += '<IdentificacaoNfse>';
                        if (object.numeroNfse && object.numeroNfse.trim() != '') {
                            xml += '<Numero>' + object.numeroNfse + '</Numero>';
                        }
                        if (object.prestador.cnpj && object.prestador.cnpj.trim() != '') {
                            xml += '<Cnpj>' + object.prestador.cnpj.replace(/\.|\/|\-|\s/g, '') + '</Cnpj>';
                        }
                        if (object.prestador.inscricaoMunicipal && object.prestador.inscricaoMunicipal.trim() != '') {
                            xml += '<InscricaoMunicipal>' + object.prestador.inscricaoMunicipal + '</InscricaoMunicipal>';
                        }
                        if (object.config.codigoMunicipio && object.config.codigoMunicipio.trim() != '') {
                            xml += '<CodigoMunicipio>' + object.config.codigoMunicipio + '</CodigoMunicipio>';
                        }
                        xml += '</IdentificacaoNfse>';
                        if (object.codigoCancelamento && object.codigoCancelamento.trim() != '') {
                            xml += '<CodigoCancelamento>' + object.codigoCancelamento + '</CodigoCancelamento>';
                        }
                        xml += '</InfPedidoCancelamento>';
                        xml += '</Pedido>';

                        createSignature(xml, cert, 'InfPedidoCancelamento').then(xmlSignature => {
                            validator.validateXML(xml, __dirname + '/../../resources/xsd/catalao/nfse_v2_01.xsd', function (err, result) {
                                if (err) {
                                    return res.send({
                                        error: result
                                    })
                                }

                                if (!result.valid) {
                                    return res.send({
                                        invalid: result
                                    })
                                }
                            });

                            let xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.nfse">';
                            xml += '<soapenv:Header/>';
                            xml += '<soapenv:Body>';
                            xml += '<not:CancelarNfseRequest>';
                            xml += '<not:inputXML>';
                            xml += '<![CDATA[';
                            xml += '<CancelarNfseEnvio xmlns="http://www.abrasf.org.br/nfse.xsd">'
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
                                soapAction: 'http://services.nfse/CancelarNfse'
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

                        let xmlContent = '<GerarNfseEnvio xmlns="http://services.nfse/WSNacional/XSD/1/nfse_pcrj_v01.xsd">';

                        addSignedXml(object, cert)
                            .then(signedXmlRes => {
                                signedXmlRes.forEach(element => {
                                    xmlContent += element;
                                });

                                xmlContent += '</GerarNfseEnvio>';
                                validator.validateXML(xml, __dirname + '/../../resources/xsd/catalao/nfse_v2_01.xsd', function (err, result) {
                                    if (err) {
                                        return res.send({
                                            error: result
                                        })
                                    }

                                    if (!result.valid) {
                                        return res.send({
                                            invalid: result
                                        })
                                    }
                                });

                                let xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.nfse">';
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
                                    soapAction: 'http://services.nfse/GerarNfse'
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
            if (r.prestador && r.prestador.trim() != '') {
                prestadorCnpj = r.prestador.cnpj.replace(/[^\d]+/g,'');
                prestadorIncricaoMunicipal = r.prestador.inscricaoMunicipal;
            }
            xmlToBeSigned += '<Rps>';
            xmlToBeSigned += '<InfRps xmlns="http://www.abrasf.org.br/nfse.xsd" Id="' + object.emissor.cnpj.replace(/[^\d]+/g,'') + timestamp + 'RPS' + index + '">';
            xmlToBeSigned += '<IdentificacaoRps>';
            xmlToBeSigned += '<Numero>' + timestamp + index + '</Numero>';
            xmlToBeSigned += '<Serie>RPS</Serie>';
            if (r.tipo && r.tipo.trim() != '') {
                xmlToBeSigned += '<Tipo>' + r.tipo + '</Tipo>';
            }
            xmlToBeSigned += '</IdentificacaoRps>';
            if (r.dataEmissao && r.dataEmissao.trim() != '') {
                xmlToBeSigned += '<DataEmissao>' + r.dataEmissao.replace(/\s/g, 'T') + '</DataEmissao>';
            }
            if (r.naturezaOperacao && r.naturezaOperacao.trim() != '') {
                xmlToBeSigned += '<NaturezaOperacao>' + r.naturezaOperacao + '</NaturezaOperacao>';
            }
            if (r.optanteSimplesNacional && r.optanteSimplesNacional.trim() != '') {
                xmlToBeSigned += '<OptanteSimplesNacional>' + r.optanteSimplesNacional + '</OptanteSimplesNacional>';
            }
            if (r.incentivadorCultural && r.incentivadorCultural.trim() != '') {
                xmlToBeSigned += '<IncentivadorCultural>' + r.incentivadorCultural + '</IncentivadorCultural>';
            }
            if (r.status && r.status.trim() != '') {
                xmlToBeSigned += '<Status>' + r.status + '</Status>';
            }
            
            xmlToBeSigned += '<Servico>';
            xmlToBeSigned += '<Valores>';
            if (r.servico.valorServicos && r.servico.valorServicos.trim() != '') {
                xmlToBeSigned += '<ValorServicos>' + r.servico.valorServicos + '</ValorServicos>';
            }
            if (r.servicos.valorDeducoes && r.servicos.valorDeducoes.trim() != '') {
                xmlToBeSigned += '<ValorDeducoes>' + r.servico.valorDeducoes + '</ValorDeducoes>';
            }
            if (r.servicos.valorPis && r.servicos.valorPis.trim() != '') {
                xmlToBeSigned += '<ValorPis>' + r.servico.valorPis + '</ValorPis>';
            }
            if (r.servicos.valorCofins && r.servicos.valorCofins.trim() != '') {
                xmlToBeSigned += '<ValorCofins>' + r.servico.valorCofins + '</ValorCofins>';
            }
            if (r.servicos.valorInss && r.servicos.valorInss.trim() != '') {
                xmlToBeSigned += '<ValorInss>' + r.servico.valorInss + '</ValorInss>';
            }
            if (r.servicos.valorIr && r.servicos.valorIr.trim() != '') {
                xmlToBeSigned += '<ValorIr>' + r.servico.valorIr + '</ValorIr>';
            }
            if (r.servicos.valorCsll && r.servicos.valorCsll.trim() != '') {
                xmlToBeSigned += '<ValorCsll>' + r.servico.valorCsll + '</ValorCsll>';
            }
            if (r.servicos.issRetido && r.servicos.issRetido.trim() != '') {
                xmlToBeSigned += '<IssRetido>' + r.servico.issRetido + '</IssRetido>';
            }
            if (r.servicos.valorIss && r.servicos.valorIss.trim() != '') {
                xmlToBeSigned += '<ValorIss>' + r.servico.valorIss + '</ValorIss>';
            }
            if (r.servicos.baseCalculo && r.servicos.baseCalculo.trim() != '') {
                xmlToBeSigned += '<BaseCalculo>' + r.servico.baseCalculo + '</BaseCalculo>';
            }
            if (r.servicos.aliquota && r.servicos.aliquota.trim() != '') {
                xmlToBeSigned += '<Aliquota>' + r.servico.aliquota + '</Aliquota>';
            }
            if (r.servicos.valorLiquidoNfse && r.servicos.valorLiquidoNfse.trim() != '') {
                xmlToBeSigned += '<ValorLiquidoNfse>' + r.servico.valorLiquidoNfse + '</ValorLiquidoNfse>';
            }
            xmlToBeSigned += '</Valores>';
            if (r.servicos.itemListaServico && r.servicos.itemListaServico.trim() != '') {
                xmlToBeSigned += '<ItemListaServico>' + r.servico.itemListaServico.replace(/[^\d]+/g,'') + '</ItemListaServico>';
            }
            if (r.servicos.codigoTributacaoMunicipio && r.servicos.codigoTributacaoMunicipio.trim() != '') {
                xmlToBeSigned += '<CodigoTributacaoMunicipio>' + r.servico.codigoTributacaoMunicipio.replace(/[^\d]+/g,'') + '</CodigoTributacaoMunicipio>';
            }
            if (r.servicos.discriminacao && r.servicos.discriminacao.trim() != '') {
                xmlToBeSigned += '<Discriminacao>' + r.servico.discriminacao + '</Discriminacao>';
            }
            if (r.servicos.codigoMunicipio && r.servicos.codigoMunicipio.trim() != '') {
                xmlToBeSigned += '<CodigoMunicipio>' + r.servico.codigoMunicipio + '</CodigoMunicipio>';
            }
            xmlToBeSigned += '</Servico>';
            

            xmlToBeSigned += '<Prestador>';
            xmlToBeSigned += '<Cnpj>' + prestadorCnpj.replace(/[^\d]+/g,'') +'</Cnpj>';
            xmlToBeSigned += '<InscricaoMunicipal>' + prestadorIncricaoMunicipal + '</InscricaoMunicipal>';
            xmlToBeSigned += '</Prestador>';
            xmlToBeSigned += '<Tomador>';
            xmlToBeSigned += '<IdentificacaoTomador>';
            if (object.r.tomador.cnpjCpf && object.r.tomador.cnpjCpf.trim() != '') {
                xmlToBeSigned += '<CpfCnpj>';
                if (r.tomador.cnpjCpf.replace(/[^\d]+/g,'').length > 11) {
                    xmlToBeSigned += '<Cnpj>' + r.tomador.cnpjCpf.replace(/[^\d]+/g,'') + '</Cnpj>';
                } else {
                    xmlToBeSigned += '<Cpf>' + r.tomador.cnpjCpf.replace(/[^\d]+/g,'') + '</Cpf>';
                }
                xmlToBeSigned += '</CpfCnpj>';
            }
            if (object.r.tomador.inscricaoMunicipal && object.r.tomador.inscricaoMunicipal.trim() != '') {
                xmlToBeSigned += '<InscricaoMunicipal>' + r.tomador.inscricaoMunicipal + '</InscricaoMunicipal>';
            }
            xmlToBeSigned += '</IdentificacaoTomador>';
            if (object.r.tomador.razaoSocial && object.r.tomador.razaoSocial.trim() != '') {
                xmlToBeSigned += '<RazaoSocial>' + r.tomador.razaoSocial + '</RazaoSocial>';
            }
            xmlToBeSigned += '<Endereco>';
            if (object.r.tomador.endereco.endereco && object.r.tomador.endereco.endereco.trim() != '') {
                xmlToBeSigned += '<Endereco>' + r.tomador.endereco.endereco + '</Endereco>';
            }
            if (object.r.tomador.endereco.numero && object.r.tomador.endereco.numero.trim() != '') {
                xmlToBeSigned += '<Numero>' + r.tomador.endereco.numero + '</Numero>';
            }
            if (object.r.tomador.endereco.bairro && object.r.tomador.endereco.bairro.trim() != '') {
                xmlToBeSigned += '<Bairro>' + r.tomador.endereco.bairro + '</Bairro>';
            }
            if (object.r.tomador.codigoMunicipio && object.r.tomador.codigoMunicipio.trim() != '') {
                xmlToBeSigned += '<CodigoMunicipio>' + r.tomador.endereco.codigoMunicipio + '</CodigoMunicipio>';
            }
            if (object.r.tomador.endereco.uf && object.r.tomador.endereco.uf.trim() != '') {
                xmlToBeSigned += '<Uf>' + r.tomador.endereco.uf + '</Uf>';
            }
            if (object.r.tomador.endereco.cep && object.r.tomador.endereco.cep.trim() != '') {
                xmlToBeSigned += '<Cep>' + r.tomador.endereco.cep + '</Cep>';
            }
            xmlToBeSigned += '</Endereco>';
            xmlToBeSigned += '<Contato>';
            if (r.tomador.contato.telefone && r.tomador.contato.telefone != '') {
                xmlToBeSigned += '<Telefone>' + r.tomador.contato.telefone + '</Telefone>';
            }
            if (r.tomador.contato.email && r.tomador.contato.email != '') {
                xmlToBeSigned += '<Email>' + r.tomador.contato.email + '</Email>';
            }
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