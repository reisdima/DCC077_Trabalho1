<template>
    <div class="category-admin">
        <b-table hover striped :items="statistic" :fields="fields">
            <template slot="actions">
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
            statistic: [{
                examinado: "Teste",
                diagnosticado: "Teste",
                internado: "Teste",
                obito: "Teste",
                recuperado: "Teste",
            }],
            fields: [
                { key: 'examinado', label: 'Total de Examinados', sortable: false },
                { key: 'diagnosticado', label: 'Total de Diagnosticados', sortable: false },
                { key: 'internado', label: 'Total de Internados', sortable: false },
                { key: 'obito', label: 'Total de Mortes', sortable: false },
                { key: 'recuperado', label: 'Total de Recuperados', sortable: false },
            ]
        }
    },
    methods: {
        loadStatistics() {
            const url = `${baseApiUrl}/covid/statistics`
            axios.post(url).then(res => {
                this.statistic = [res.data]
                // console.log(res)
                // if(res.data.hits.total.value > 0) {
                    // this.categories = res.data.hits.hits.map(hit => {
                    //     return {...hit._source, "_id":hit._id }
                    // });
                // }
            })
        }
    },
    mounted() {
        this.loadStatistics()
    }
}
</script>

<style></style>
