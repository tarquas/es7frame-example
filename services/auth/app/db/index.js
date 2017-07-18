const Union = require('es7frame/union');

class Db extends Union(require('es7frame/db')) {}

module.exports = Db;

require('../config');

Object.assign(Db.desc, {
  type: 'db',

  members: {
    profiles: require('./users-profiles'),
    users: require('./users')
  },

  deps: {
    mq: require('../mq')
  },

  defaultInit: {
    connString: process.env.DB_URI,
    prefix: process.env.DB_PREFIX
  }
});
