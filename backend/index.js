const app = require('express')()
const consign = require('consign')
const elasticsearch = require("elasticsearch")

const esClient = elasticsearch.Client({
    host: "http://127.0.0.1:9200",
})
app.elasticsearch = esClient;

consign()
    .then('./api/validation.js')
    .then('./config/middlewares.js')
    .then('./api')
    .then('./config/routes.js')
    .into(app)


app.listen(process.env.PORT || 3000, () => {
    console.log('Backend executando...')
})
