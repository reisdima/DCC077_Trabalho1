// const bcrypt = require('bcrypt-nodejs')
const fs = require('fs')
const csv = require('csv-parser')

module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

    const getById = (req, res) => {
        app.elasticsearch
            .get({
                index: 'ministerio_saude',
                type: 'covid',
                id: req.body._id
            })
            .then(object => { res.json(object) })
            .catch(err => res.status(500).send(err))
    }

    const deleteById = (req, res) => {
        app.elasticsearch
            .delete({
                index: 'ministerio_saude',
                type: 'covid',
                id: req.body._id
            })
            .then(result => { res.json(result) })
            .catch(err => res.status(500).send(err))
    }

    const search = (req, res) => {
        app.elasticsearch
            .search({
                index: 'ministerio_saude',
                type: 'covid',
                body: req.body
            })
            .then(result => { 
                console.log(result)
                res.json(result)
             })
            .catch(err => res.status(500).send(err))
    }

    const importFile = async (req, res) => {
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


    return { importFile, getById, search, deleteById }
}