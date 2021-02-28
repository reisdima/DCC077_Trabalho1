
module.exports = app => {
    app.post('/covid/importPessoa', app.api.importFile.importPessoa)
    app.post('/covid/importPosto', app.api.importFile.importPosto)
    app.post('/covid/importGasto', app.api.importFile.importGasto)
    app.post('/covid/importRegistro', app.api.importFile.importRegistro)

    app.post('/covid/_get', app.api.covid.getById)
    app.post('/covid/_create', app.api.covid.save)
    app.post('/covid/_search', app.api.covid.search)
    app.post('/covid/_delete', app.api.covid.deleteById)
    
    app.post('/covid/statistics', app.api.covid.getStatistics)
}