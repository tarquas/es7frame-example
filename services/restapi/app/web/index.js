const Union = require('es7frame/union');

class Web extends Union(require('../../../sdk/web-api')) {}

module.exports = Web;

require('../config');

Object.assign(Web.desc, {
  type: 'web',

  members: {
    auth: require('../../../sdk/auth/web'),
    goods: require('./goods'),
    upload: require('es7frame/web-api-upload')
  },

  deps: {
    db: require('../db'),
    mq: require('../mq')
  },

  defaultInit: {
    httpBind: process.env.WEB_HTTP,
    httpsBind: process.env.WEB_HTTPS,

    httpsOpts: {
      key: process.env.WEB_HTTPS_KEY,
      cert: process.env.WEB_HTTPS_CERT
    },

    prefix: process.env.WEB_PREFIX
  }
});
