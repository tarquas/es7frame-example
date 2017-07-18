const Union = require('es7frame/union');

class Web extends Union(require('es7frame/web-api')) {
  get errors() { return Web.errors; }
}

Object.assign(Web.errors, {
  badToken: '401 Provided token is not valid (must be 24 characters)'
});

module.exports = Web;

require('../config');

Object.assign(Web.desc, {
  type: 'web',

  members: {
    auth: require('../../../sdk/auth/web'),
    upload: require('es7frame/web-api-upload')
  },

  deps: {
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
