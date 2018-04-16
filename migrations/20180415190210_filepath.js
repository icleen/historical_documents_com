
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('documents', function(table) {
      table.string('filepath');
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('documents', function(table) {
      table.dropColumn('filepath');
    }),
  ]);
};
