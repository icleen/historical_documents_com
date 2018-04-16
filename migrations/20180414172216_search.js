
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.raw("alter table documents add fulltext(doctype)"),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.raw("alter table documents drop index doctype"),
  ]);
};
