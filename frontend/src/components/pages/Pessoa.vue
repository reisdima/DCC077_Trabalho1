<template>
    <div class="category-admin">
        <!-- <b-form>
            <input id="category-id" type="hidden" v-model="category.id" />
            <b-form-group label="Nome:" label-for="category-name">
                <b-form-input id="category-name" type="text"
                    v-model="category.name" required
                    :readonly="mode === 'remove'"
                    placeholder="Informe o Nome da Pessoa..." />
            </b-form-group>
            <b-form-group label="CPF:" label-for="category-name">
                <b-form-input id="category-name" type="text"
                    v-model="category.name" required
                    :readonly="mode === 'remove'"
                    placeholder="Informe o CPF..." />
            </b-form-group>
            <b-form-group label="Cidade:" label-for="category-name">
                <b-form-input id="category-name" type="text"
                    v-model="category.name" required
                    :readonly="mode === 'remove'"
                    placeholder="Informe o Nome da Cidade..." />
            </b-form-group>
            <b-form-group label="Bairro:" label-for="category-name">
                <b-form-input id="category-name" type="text"
                    v-model="category.name" required
                    :readonly="mode === 'remove'"
                    placeholder="Informe o Nome do Bairro..." />
            </b-form-group>
            <b-form-group label="Idade:" label-for="category-name">
                <b-form-input id="category-name" type="number"
                    v-model="category.name" required
                    :readonly="mode === 'remove'"
                    placeholder="Informe A Idade..." />
            </b-form-group>
            <b-form-group label-for="category-name">
                <b-form-checkbox id="category-vacinado" type="text"
                    >Vacinado?</b-form-checkbox>
            </b-form-group>
            <b-button variant="primary" v-if="mode === 'save'"
                @click="save">Salvar</b-button>
            <b-button variant="danger" v-if="mode === 'remove'"
                @click="remove">Excluir</b-button>
            <b-button class="ml-2" @click="reset">Cancelar</b-button>
        </b-form>
        <hr /> -->
        <b-table hover striped :items="categories" :fields="fields">
            <template slot="actions" slot-scope="data">
                <b-button
                    variant="warning"
                    @click="loadCategory(data.item)"
                    class="mr-2"
                >
                    <i class="fa fa-pencil"></i>
                </b-button>
                <b-button
                    variant="danger"
                    @click="loadCategory(data.item, 'remove')"
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
            category: {},
            categories: [{
                id: "teste",
                idPessoa: "teste",
                idPosto: "teste",
                data: "teste",
            }],
            fields: [
                // { key: 'id', label: 'Código', sortable: true },
                // { key: 'idPessoa', label: 'Id da Pessoa', sortable: true },
                // { key: 'idPosto', label: 'Id do Posto', sortable: true },
                // { key: 'data', label: 'Data', sortable: true },
                { key: '_id', label: 'Código', sortable: true },
                { key: 'nome', label: 'Nome', sortable: true },
                { key: 'idade', label: 'Idade', sortable: true },
                { key: 'vacinado', label: 'Vacinado?', sortable: true },
                // { key: 'actions', label: 'Ações' }
            ]
        }
    },
    methods: {
        loadCategories() {
            const url = `${baseApiUrl}/covid/_search`
            axios.post(url).then(res => {
                console.log(res)
                if(res.data.hits.total.value > 0) {
                    console.log("Teste77")
                    this.categories = res.data.hits.hits.map(hit => {
                        return {...hit._source, "_id":hit._id }
                    });
                }

                // this.categories = res.data
                // this.categories = res.data.map(category => {
                //     return { ...category, value: category.id, text: category.path }
                // })
            })
        },
        reset() {
            this.mode = 'save'
            this.category = {}
            this.loadCategories()
        },
        save() {
            const method = this.category.id ? '_update' : '_create'
            const id = this.category.id ? `/${this.category.id}` : ''
            console.log(this.category)
            // axios.post(`${baseApiUrl}/covid/${method}`, this.category)
            //     .then(() => {
            //         this.$toasted.global.defaultSuccess()
            //         this.reset()
            //     })
            //     .catch(showError)
        },
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
        this.loadCategories()
    }
}
</script>

<style></style>
