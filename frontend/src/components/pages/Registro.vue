<template>
    <div class="category-admin">
        <b-form>
            <input id="register-id" type="hidden" v-model="register.id" />
            <b-form-group label="Id da Pessoa:" label-for="register-personName">
                <b-form-input
                    id="register-personName"
                    type="text"
                    v-model="register.pessoa"
                    required
                    :readonly="mode === 'remove'"
                    placeholder="Informe o Id da Pessoa..."
                />
            </b-form-group>
            <b-form-group label="Data:" label-for="register-date">
                <b-form-input
                    id="register-date"
                    type="text"
                    v-model="register.data"
                    required
                    :readonly="mode === 'remove'"
                    placeholder="Informe a Data do Registro..."
                />
            </b-form-group>
            <b-form-group
                label="Id do Posto:"
                label-for="register-healthCenter"
            >
                <b-form-input
                    id="register-healthCenter"
                    type="text"
                    v-model="register.posto"
                    required
                    :readonly="mode === 'remove'"
                    placeholder="Informe o Id do Posto..."
                />
            </b-form-group>
            <b-form-group label="Descrição:" label-for="register-description">
                <b-form-input
                    id="register-descricao"
                    type="text"
                    v-model="register.descricao"
                    required
                    :readonly="mode === 'remove'"
                    placeholder="Informe a descrição do registro..."
                />
            </b-form-group>
            <b-button variant="primary" v-if="mode === 'save'" @click="save"
                >Salvar</b-button
            >
            <b-button variant="danger" v-if="mode === 'remove'" @click="remove"
                >Excluir</b-button
            >
            <b-button class="ml-2" @click="reset">Cancelar</b-button>
        </b-form>
        <hr />
        <b-table hover striped :items="registers" :fields="fields">
            <template slot="actions" slot-scope="data">
                <b-button
                    variant="warning"
                    @click="loadRegisters(data.item)"
                    class="mr-2"
                >
                    <i class="fa fa-pencil"></i>
                </b-button>
                <b-button
                    variant="danger"
                    @click="loadRegisters(data.item, 'remove')"
                >
                    <i class="fa fa-trash"></i>
                </b-button>
            </template>
        </b-table>
    </div>
</template>

<script>
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'

export default {
    name: 'Home',
    data: function() {
        return {
            mode: 'save',
            register: {},
            registers: [{
                "_id": "Teste",
                "pessoa._id": "Teste",
                "data": "Teste",
                "posto._id": "Teste",
                "descricao": "Teste"
            }],
            fields: [
                { key: '_id', label: 'Código', sortable: true },
                { key: 'pessoa._id', label: 'Nome da Pessoa', sortable: true },
                { key: 'data', label: 'Data', sortable: true },
                { key: 'posto._id', label: 'Nome do Posto', sortable: true },
                { key: 'descricao', label: 'Descrição', sortable: true },
                // { key: 'actions', label: 'Ações' }
            ]
        }
    },
    methods: {
        loadRegisters() {
            const url = `${baseApiUrl}/covid/_search`
            let body = {
                query: {
                    term: {
                        "tipo.keyword": "registro"
                    }
                }
            };
            axios.post(url, body).then(res => {
                if(res.data.hits.total.value > 0) {
                    this.registers = res.data.hits.hits.map(hit => {
                        return {...hit._source, "_id":hit._id }
                    });
                }
                console.log(this.registers)

                // this.categories = res.data
                // this.categories = res.data.map(category => {
                //     return { ...category, value: category.id, text: category.path }
                // })
            })
        },
        reset() {
            this.mode = 'save'
            this.register = {}
            this.loadRegisters()
        },
        async save() {
            // const method = this.category.id ? '_update' : '_create'
            // const id = this.category.id ? `/${this.category.id}` : ''
            console.log("Registro:");
            console.log(this.register);
            const method = '_create';
            let pessoa = null;
            let posto = null;
            pessoa = await axios.post(`${baseApiUrl}/covid/_get`, {_id: this.register.pessoa})
                .then(res => {
                    this.$toasted.global.defaultSuccess()
                    // this.reset()
                    this.teste();
                    return JSON.parse(res);
                })
                .catch(_ => null)
            posto = await axios.post(`${baseApiUrl}/covid/_get`, {_id: this.register.posto})
                .then(res => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                    return JSON.parse(res);
                })
                .catch(_ => null)
            console.log(pessoa);
            console.log(posto);
            // let body = {
            //     tipo: "registro",
            //     pessoa: pessoas[indicePessoaRandom],
            //     posto: postos[indicePostoRandom],
            //     data: this.register.data,
            //     descricao: this.registers.descricao
            // }
            // axios.post(`${baseApiUrl}/covid/${method}`, this.register)
            //     .then(() => {
            //         this.$toasted.global.defaultSuccess()
            //         this.reset()
            //     })
            //     .catch(showError)
        },
        getPessoa(id) {
            // let pessoa = null;
            // pessoa = await axios.post(`${baseApiUrl}/covid/_get`, {_id: id})
            //     .then(res => {
            //         this.$toasted.global.defaultSuccess()
            //         this.reset()
            //         return JSON.parte(res);
            //     })
            //     .catch(_ => null)
            
        },
        teste(){
            console.log("teste aqui")
        }
        // remove() {
        //     // const id = this.category.id
        //     // axios.delete(`${baseApiUrl}/categories/${id}`)
        //     //     .then(() => {
        //     //         this.$toasted.global.defaultSuccess()
        //     //         this.reset()
        //     //     })
        //     //     .catch(showError)
        // },
        // loadCategory(category, mode = 'save') {
        //     // this.mode = mode
        //     // this.category = { ...category }
        // }
    },
    mounted() {
        this.loadRegisters()
    }
}
</script>

<style></style>
