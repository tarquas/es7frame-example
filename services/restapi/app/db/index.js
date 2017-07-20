const Union = require('es7frame/union');

class Db extends Union(require('es7frame/db')) {}

module.exports = Db;

require('../config');

Object.assign(Db.desc, {
  type: 'db',

  members: {
    goods: require('./goods'),
    keywords: require('../../../sdk/keywords/db'),
    validators: require('../../../sdk/validators/db')
  },

  deps: {
    mq: require('../mq')
  },

  defaultInit: {
    connString: process.env.RESTAPI_DB_URI,
    prefix: process.env.RESTAPI_DB_PREFIX
  }
});
