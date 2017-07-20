const cfg = process.env;
const webBind = cfg.AUTH_WEB_HTTP;

require('./dev');

if (!cfg.AUTH_WEB_BASE_PREFIX) cfg.AUTH_WEB_BASE_PREFIX = '';
cfg.AUTH_WEB_PREFIX = `${cfg.AUTH_WEB_BASE_PREFIX}/${cfg.NODE_APP_SERVICE}`;
if (!webBind) cfg.AUTH_WEB_HTTP = 3000;
