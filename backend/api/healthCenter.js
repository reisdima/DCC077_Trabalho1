// const bcrypt = require('bcrypt-nodejs')
const fs = require('fs')
const csv = require('csv-parser')

module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

    // const encryptPassword = password => {
    //     const salt = bcrypt.genSaltSync(10)
    //     return bcrypt.hashSync(password, salt)
    // }

    // const save = async (req, res) => {
    //     const user = { ...req.body }
    //     if (req.params.id) user.id = req.params.id

    //     if (!req.originalUrl.startsWith('/users')) user.admin = false
    //     if (!req.user || !req.user.admin) user.admin = false

    //     try {
    //         existsOrError(user.name, 'Nome não informado')
    //         existsOrError(user.email, 'E-mail não informado')
    //         existsOrError(user.password, 'Senha não informada')
    //         existsOrError(user.confirmPassword, 'Confirmação de Senha inválida')
    //         equalsOrError(user.password, user.confirmPassword,
    //             'Senhas não conferem')

    //         const userFromDB = await app.db('users')
    //             .where({ email: user.email }).first()
    //         if (!user.id) {
    //             notExistsOrError(userFromDB, 'Usuário já cadastrado')
    //         }
    //     } catch (msg) {
    //         return res.status(400).send(msg)
    //     }

    //     user.password = encryptPassword(user.password)
    //     delete user.confirmPassword

    //     if (user.id) {
    //         app.db('users')
    //             .update(user)
    //             .where({ id: user.id })
    //             .whereNull('deletedAt')
    //             .then(_ => res.status(204).send())
    //             .catch(err => res.status(500).send(err))
    //     } else {
    //         app.db('users')
    //             .insert(user)
    //             .then(_ => res.status(204).send())
    //             .catch(err => res.status(500).send(err))
    //     }
    // }

    const getHealthCenter = (req, res) => {
        app.elasticsearch
            .get({
                index: 'ministerio_saude',
                type: 'covid',
                id: req.body._id
            })
            .then(healthcenter => { res.json(healthcenter) })
            .catch(err => res.status(500).send(err))
    }

    const deleteHealthCenter = (req, res) => {
        app.elasticsearch
            .delete({
                index: 'ministerio_saude',
                type: 'covid',
                id: req.body._id
            })
            .then(result => { res.json(result) })
            .catch(err => res.status(500).send(err))
    }

    const searchHealthCenter = (req, res) => {
        app.elasticsearch
            .search({
                index: 'ministerio_saude',
                type: 'covid',
                body: req.body
            })
            .then(people => { res.json(people) })
            .catch(err => res.status(500).send(err))
    }


    const importHealthCenter = async (req, res) => {
        console.log("Importando pessoas...");
        try {
            fs.createReadStream('../UBSJuizDeFora.csv')
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
                        esClient.index({
                            index: 'ministerio_saude',
                            type: 'covid',
                            body: posto
                        })
                    })
                })
                .then(_ => res.status(204).send())
        } catch (error) {
            res.status(400).send(error);
        }
    }


    return { importHealthCenter, getHealthCenter, searchHealthCenter, deleteHealthCenter }
    // return { save, get, getById, remove }
}