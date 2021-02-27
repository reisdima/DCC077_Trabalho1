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

    const getPerson = (req, res) => {
        app.elasticsearch
            .get({
                index: 'ministerio_saude',
                type: 'covid',
                id: req.body._id
            })
            .then(person => { res.json(person) })
            .catch(err => res.status(500).send(err))
    }

    const deletePerson = (req, res) => {
        app.elasticsearch
            .delete({
                index: 'ministerio_saude',
                type: 'covid',
                id: req.body._id
            })
            .then(result => { 
                res.json(result) 
            })
            .catch(err => res.status(500).send(err))
    }

    const searchPerson = (req, res) => {
        app.elasticsearch
            .search({
                index: 'ministerio_saude',
                type: 'covid',
                body: req.body
            })
            .then(result => { 
                console.log(result);
                res.json(result)
             })
            .catch(err => res.status(500).send(err))
    }

    // const getById = (req, res) => {
    //     app.db('users')
    //         .select('id', 'name', 'email', 'admin')
    //         .where({ id: req.params.id })
    //         .whereNull('deletedAt')
    //         .first()
    //         .then(user => res.json(user))
    //         .catch(err => res.status(500).send(err))
    // }

    // const remove = async (req, res) => {
    //     try {
    //         const articles = await app.db('articles')
    //             .where({ userId: req.params.id })
    //         notExistsOrError(articles, 'Usuário possui artigos.')

    //         const rowsUpdated = await app.db('users')
    //             .update({ deletedAt: new Date() })
    //             .where({ id: req.params.id })
    //         existsOrError(rowsUpdated, 'Usuário não foi encontrado.')

    //         res.status(204).send()
    //     } catch (msg) {
    //         res.status(400).send(msg)
    //     }
    // }

    const importPerson = async (req, res) => {
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


    return { importPerson, getPerson, searchPerson, deletePerson }
    // return { save, get, getById, remove }
}