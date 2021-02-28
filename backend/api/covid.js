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
        app.elasticsearch
            .get({
                index: 'ministerio_saude',
                type: 'covid',
                id: req.body
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

    return { getById, search, deleteById, save }
}