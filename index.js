/**
 * I have to think about a good API, some parts are separate, however I have to check when and how to join them.
 * So first an API, which has to feel as natural as possible.
 */

function 

var db = require('raddish-db');
db.setConfig({
    default: {
        host: 'localhost',
        user: 'root',
        pass: 'root',
        type: 'mysql',
        database: 'temp',
        ssh: {
            host: 'example.com',
            user: 'jasper',
            pass: 'jasper'
        }
    }
});

var instance = db.getInstance('default');
var query = instance.getQueryBuilder();
query
    .select()
    .from('foo', 'tbl')
    .where('tbl.id', '=', 10);

instance.execute(query)
    .then(function(rows) {
        // This contains the updated, selected or deleted row/ rows
        // Except when a delete method is called, there of course is no data.
        console.log(rows)
    })
    .catch(function(error) {
        console.log(error);
    });