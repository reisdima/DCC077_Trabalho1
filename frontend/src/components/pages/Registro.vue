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
                <b-form-invalid-feedback :state="validation.pessoa">
                    O Id informado não é válido.
                </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group label="Data:" label-for="register-date">
                <b-form-input
                    id="register-date"
                    type="date"
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
                <b-form-invalid-feedback :state="validation.posto">
                    O Id informado não é válido.
                </b-form-invalid-feedback>
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
import { baseApiUrl, showError } from "@/global";
import axios from "axios";

export default {
    name: "Home",
    data: function() {
        return {
            mode: "save",
            validation: {
                pessoa: true,
                posto: true
            },
            register: {
                // _id: "Teste",
                // pessoa: "sKAp5ncBQ5Ih-X2D_usH",
                // data: "2021-02-08",
                // posto: "sKAq5ncBQ5Ih-X2DBu1n",
                // descricao: "Teste",
            },
            registers: [
                {
                    _id: "Teste",
                    "pessoa._id": "Teste",
                    data: "Teste",
                    "posto._id": "Teste",
                    descricao: "Teste",
                },
            ],
            fields: [
                { key: "_id", label: "Código", sortable: true },
                { key: "pessoa.nome", label: "Nome da Pessoa", sortable: true },
                { key: "data", label: "Data", sortable: true },
                { key: "posto.nome", label: "Nome do Posto", sortable: true },
                { key: "descricao", label: "Descrição", sortable: true },
                // { key: 'actions', label: 'Ações' }
            ],
        };
    },
    methods: {
        loadRegisters() {
            const url = `${baseApiUrl}/covid/_search`;
            let body = {
                query: {
                    term: {
                        "tipo.keyword": "registro",
                    },
                },
            };
            axios.post(url, body).then((res) => {
                if (res.data.hits.total.value > 0) {
                    this.registers = res.data.hits.hits.map((hit) => {
                        return { ...hit._source, _id: hit._id };
                    });
                }
                console.log(this.registers);

                // this.categories = res.data
                // this.categories = res.data.map(category => {
                //     return { ...category, value: category.id, text: category.path }
                // })
            });
        },
        reset() {
            this.mode = "save";
            this.register = {};
            this.loadRegisters();
        },
        async save() {
            // console.log("Registro:");
            // console.log(this.register);
            let pessoa = null;
            let posto = null;
            pessoa = await axios
                .post(`${baseApiUrl}/covid/_get`, { _id: this.register.pessoa })
                .then((res) => res.data)
                .catch((_) => null);
            posto = await axios
                .post(`${baseApiUrl}/covid/_get`, { _id: this.register.posto })
                .then((res) => res.data)
                .catch((_) => null);
            if (!pessoa) {
                this.validation.pessoa = false;
                return;
            }
            else if (!posto) {
                this.validation.posto = false;
                return;
            }
            this.validation.pessoa = true;
            this.validation.posto = true;
            let body = {
                tipo: "registro",
                pessoa: pessoa._source,
                posto: posto._source,
                data: this.register.data,
                descricao: this.register.descricao,
            };
            let newRegister = axios
                .post(`${baseApiUrl}/covid/_create`, body)
                .then(res => {
                    this.reset();
                })
                .catch(showError);
        },
    },
    mounted() {
        this.loadRegisters();
    }
};
</script>

<style></style>
