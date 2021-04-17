const elasticsearch = require('elasticsearch');

module.exports = new elasticsearch.Client({
    host: 'http://localhost:9200',
    log: 'trace'
});