const app = require('express')()
const consign = require('consign')
const bodyParser = require("body-parser")
const elasticsearch = require("elasticsearch")
app.use(bodyParser.json())

const esClient = elasticsearch.Client({
    host: "http://127.0.0.1:9200",
})
app.elasticsearch = esClient;

consign()
    .then('./api/validation.js')
    .then('./api')
    .then('./config/routes.js')
    .into(app)


app.listen(process.env.PORT || 3000, () => {
    console.log('Backend executando...')
})
