const cfg = process.env;
if (!cfg.WEB_BASE_HTTP) cfg.WEB_BASE_HTTP = 3000;
if (!cfg.RESTAPI_WEB_HTTP) cfg.RESTAPI_WEB_HTTP = cfg.WEB_BASE_HTTP;
if (!cfg.WEB_BASE_PREFIX) cfg.WEB_BASE_PREFIX = '';
if (!cfg.RESTAPI_WEB_PREFIX) cfg.RESTAPI_WEB_PREFIX = `${cfg.WEB_BASE_PREFIX}/${cfg.NODE_APP_SERVICE}`;

require('./dev');
