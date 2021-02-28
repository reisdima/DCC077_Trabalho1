// const bcrypt = require('bcrypt-nodejs')
const fs = require('fs')
const csv = require('csv-parser')

module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

    const importRegistro = async (req, res) => {
        const descricao = ["examinado", "diagnosticado", "internado", "óbito", "recuperado"];
        app.elasticsearch
            .search({
                index: 'ministerio_saude',
                type: 'covid',
                body: {
                    "query": {
                        "term": {
                            "tipo.keyword": "pessoa"
                        }
                    },
                    "size": 500
                }
            })
            .then(
                result => {
                    let pessoas = result.hits.hits.map(hit => {
                        return hit._source
                    })

                    app.elasticsearch
                        .search({
                            index: 'ministerio_saude',
                            type: 'covid',
                            body: {
                                "query": {
                                    "term": {
                                        "tipo.keyword": "posto"
                                    }
                                },
                                "size": 58
                            }
                        })
                        .then(
                            result => {
                                let postos = result.hits.hits.map(hit => {
                                    return hit._source
                                })

                                for (let i = 0; i < 1000; i++) {
                                    let indicePessoaRandom = Math.floor(Math.random() * (pessoas.length))
                                    let indiceDescricaoRandom = Math.floor(Math.random() * (descricao.length))
                                    let indicePostoRandom = Math.floor(Math.random() * (postos.length))

                                    let registro = {
                                        tipo: "registro",
                                        pessoa: pessoas[indicePessoaRandom],
                                        posto: postos[indicePostoRandom],
                                        data: randomDate(new Date(2020, 2, 1), new Date(), 0, 24),
                                        descricao: descricao[indiceDescricaoRandom]
                                    }

                                    app.elasticsearch.index({
                                        index: 'ministerio_saude',
                                        type: 'covid',
                                        body: registro
                                    })
                                        .then(_ => res.status(204).send())
                                        .catch(err => res.status(500).send(err))
                                }

                            }
                        )
                        .catch(err => res.status(500).send(err))
                }
            )
            .catch(err => res.status(500).send(err))

    }

    const importGasto = async (req, res) => {
        const tiposGasto = ["exame", "tratamento", "vacina"]
        app.elasticsearch
            .search({
                index: 'ministerio_saude',
                type: 'covid',
                body: {
                    "query": {
                        "term": {
                            "tipo.keyword": "posto"
                        }
                    },
                    "size": 58
                }
            })
            .then(
                result => {
                    let postos = result.hits.hits.map(hit => {
                        return hit._source
                    })

                    for (let i = 0; i < 500; i++) {
                        let indicePostoRandom = Math.floor(Math.random() * (postos.length))
                        let indiceTipoGastoRandom = Math.floor(Math.random() * (tiposGasto.length))

                        let gasto = {
                            tipo: "gasto",
                            tipoGasto: tiposGasto[indiceTipoGastoRandom],
                            posto: postos[indicePostoRandom],
                            valor: (Math.floor(Math.random() * 10000) + 1),
                        }

                        app.elasticsearch.index({
                            index: 'ministerio_saude',
                            type: 'covid',
                            body: gasto
                        })
                            .then(_ => res.status(204).send())
                    }

                }
            )
    }

    const importPosto = async (req, res) => {
        let listaPostos = []
        fs.createReadStream('./assets/UBSJuizDeFora.csv')
            .pipe(csv())
            .on('data', (data) => listaPostos.push(data))
            .on('end', () => {

                listaPostos.forEach(itemPosto => {

                    let posto = {
                        tipo: "posto",
                        nome: itemPosto.nom_estabelecimento,
                        endereco: {
                            logradouro: itemPosto.endereco,
                            cidade: itemPosto.cidade,
                            bairro: itemPosto.bairro,
                            codigoMunicipio: itemPosto.cod_municipio
                        },
                        estoqueVacinas: Math.floor(Math.random() * 10000) + 1
                    }

                    app.elasticsearch.index({
                        index: 'ministerio_saude',
                        type: 'covid',
                        body: posto
                    })
                        .then(_ => res.status(204).send())
                })
            })
    }

    const importPessoa = async (req, res) => {
        console.log("Importando pessoas...");
        try {
            const bairros = {
                0: "São Pedro",
                1: "Granbery",
                2: "Bonfim",
                3: "Benfica",
                4: "Cascatinha"
            }

            let listaNomes = []

            fs.createReadStream('./assets/nomesPessoaBrasil.csv')
                .pipe(csv())
                .on('data', (data) => listaNomes.push(data))
                .on('end', () => {
                    let numeroCPF = 11122233500;
                    listaNomes.forEach(itemNome => {
                        let random = Math.floor(Math.random() * (5))
                        let randomIdade = Math.floor(Math.random() * 100) + 1;

                        let pessoa = {
                            tipo: "pessoa",
                            nome: itemNome.nome,
                            cpf: (numeroCPF -= 1).toString(),
                            endereco: {
                                cidade: "Juiz de Fora",
                                bairro: bairros[random]
                            },
                            idade: randomIdade,
                            vacinado: (randomIdade > 90)
                        }

                        if (pessoa.vacinado) {
                            pessoa.dose = random % 2 + 1;
                        }

                        app.elasticsearch.index({
                            index: 'ministerio_saude',
                            type: 'covid',
                            body: pessoa
                        })
                    })
                })
                .then(_ => res.status(204).send())
        } catch (error) {
            res.status(400).send(error);
        }
    }

    function randomDate(start, end, startHour, endHour) {
        var date = new Date(+start + Math.random() * (end - start));
        var hour = startHour + Math.random() * (endHour - startHour) | 0;
        date.setHours(hour);
        return date;
    }

    return { importRegistro, importGasto, importPosto, importPessoa }
}