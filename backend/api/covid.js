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

    const save = (req, res) => {
        console.log("Save teste")
        console.log(req.body)
        app.elasticsearch
            .index({
                index: 'ministerio_saude',
                type: 'covid',
                body: req.body
            })
            .then(object => {
                res.json(object)
            })
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
                res.json(result)
            })
            .catch(err => res.status(500).send(err))
    }

    async function getStatistics(req, res) {
        try {
            const descricoes = ["examinado", "diagnosticado", "internado", "obito", "recuperado"];
            let statistics = {};
            for (let i = 0; i < descricoes.length; i++) {
                const descricao = descricoes[i];
                let body = {
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "term": {
                                        "tipo.keyword": "registro"
                                    }
                                },
                                {
                                    "term": {
                                        "descricao.keyword": descricao
                                    }
                                }
                            ]
                        }
                    },
                    "size": 0
                }
                let result = await app.elasticsearch
                .search({
                    index: 'ministerio_saude',
                    type: 'covid',
                    body: body
                })
                .then(data => data)
                .catch(err => res.status(500).send(err))
                statistics[descricao] = result.hits.total.value;
            }
            res.json(statistics)
        } catch (error) {

        }
    }

    return { getById, search, deleteById, save, getStatistics }
}