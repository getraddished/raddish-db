var RaddishDB = require('../index');

console.time('mysql');
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
                // Custom typed queries. This so you can do your own chaining.
                // This might be improved in time!
                .where('tbl.id IN (1, 2)');

console.log(query.toQuery());

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
