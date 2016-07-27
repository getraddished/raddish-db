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
    builder = instance.getBuilder();

var query = builder
                .select('tbl.*')
                .from('categories', 'tbl')
                .where('tbl.id', 'IN', [1, 2]);

// var query = builder
//                 .update('categories')
//                 .set('title', 'bla')
//                 .where('tbl.id', 'IN', [1, 2]);

var query = builder
                .insert()
                .into('bla')
                .set('title', 'hello')
                .set('id', '55');

// var query = builder
//                 .delete()
//                 .from('table')
//                 .where('tbl.id', 'IN', [1, 2]);


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
