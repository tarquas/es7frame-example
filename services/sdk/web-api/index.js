const WebApi = require('es7frame/web-api');

class Web extends WebApi {}

Object.assign(Web.errors, {
  badAuth: '401 Provided authentication credentials are invalid',
  badEmail: '412 Provided email is not valid',
  badId: '412 Provided ID is not valid',
  badName: '412 Provided name is not valid',
  badPassword: '412 Provided password is not valid (must be >= 6 characters)',
  badPrice: '412 Provided price is not valid',
  badToken: '401 Provided token is not valid',
  denied: '403 Resource access is forbidden',
  exists: '409 Resource with provided identifier already exists',
  internal: '500 Internal server error',
  notFound: '404 Requested resource does not exist'
});

module.exports = Web;
