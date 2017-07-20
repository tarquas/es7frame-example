const cfg = process.env;
if (!cfg.AUTH_WEB_HTTP) cfg.AUTH_WEB_HTTP = cfg.WEB_BASE_HTTP;

require('./dev');

if (!cfg.WEB_BASE_PREFIX) cfg.WEB_BASE_PREFIX = '';
cfg.AUTH_WEB_PREFIX = `${cfg.WEB_BASE_PREFIX}/${cfg.NODE_APP_SERVICE}`;
