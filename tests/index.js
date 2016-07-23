var RaddishDB = require('../index');

RaddishDB.setConfig({
    default: {
        host: 'localhost',
        type: 'mysql',
        username: 'root',
        password: 'root',
        database: 'devel_nfsw'
    }
});

var instance = RaddishDB.getInstance('default'),
    builder = instance.getBuilder('select');

var query = builder
                .select('tbl.*')
                .from('categories', 'tbl')
                // This is better, however almost the same to the current API,
                // I want it to be more intuitive!
                // Next to that I want the same API!
                .where('tbl.id', 'IN', [1, 2]);

instance.execute(query)
    .then(function(result) {
        console.log(result);
        console.timeEnd('mysql');
    });

console.time('query');
instance.execute('SELECT * FROM categories')
    .then(function(result) {
        console.timeEnd('query');
    });

console.time('query');
instance.execute('SELECT * FROM categories')
    .then(function(result) {
        console.timeEnd('query');
    });
