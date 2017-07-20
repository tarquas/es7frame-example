const cfg = process.env;
const webBind = cfg.RESTAPI_WEB_HTTP;

require('./dev');

if (!cfg.RESTAPI_WEB_BASE_PREFIX) cfg.RESTAPI_WEB_BASE_PREFIX = '';
cfg.RESTAPI_WEB_PREFIX = `${cfg.RESTAPI_WEB_BASE_PREFIX}/${cfg.NODE_APP_SERVICE}`;
if (!webBind) cfg.RESTAPI_WEB_HTTP = 3000;
