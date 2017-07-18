const Union = require('es7frame/union');

class Web extends Union(require('es7frame/web-api')) {}

Object.assign(Web.errors, {
  badAuth: '401 Provided authentication credentials are invalid',
  badEmail: '412 Provided email is not valid',
  badName: '412 Provided name is not valid',
  badPassword: '412 Provided password is not valid (must be >= 6 characters)',
  badToken: '401 Provided token is not valid (must be 24 characters)',
  badUserId: '412 Provided user ID is not valid (must be 16 characters)',
  denied: '403 Resource access is forbidden',
  exists: '409 Resource with provided identifier already exists',
  internal: '500 Internal server error',
  notFound: '404 Requested resource does not exist'
});

module.exports = Web;

require('../config');

Object.assign(Web.desc, {
  type: 'web',

  members: {
    auth: require('../../../sdk/auth/web'),
    profiles: require('./users-profiles'),
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
