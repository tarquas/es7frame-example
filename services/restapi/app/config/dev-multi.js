const cfg = process.env;
if (!cfg.RESTAPI_WEB_HTTP) cfg.RESTAPI_WEB_HTTP = cfg.WEB_BASE_HTTP;

require('./dev');

if (!cfg.WEB_BASE_PREFIX) cfg.WEB_BASE_PREFIX = '';
cfg.RESTAPI_WEB_PREFIX = `${cfg.WEB_BASE_PREFIX}/${cfg.NODE_APP_SERVICE}`;
