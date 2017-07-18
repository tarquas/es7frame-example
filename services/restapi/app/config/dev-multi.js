const cfg = process.env;
const webBind = cfg.WEB_HTTP;

require('./dev');

if (!cfg.WEB_BASE_PREFIX) cfg.WEB_BASE_PREFIX = '';
cfg.WEB_PREFIX = `${cfg.WEB_BASE_PREFIX}/${cfg.NODE_APP_SERVICE}`;
if (!webBind) cfg.WEB_HTTP = 3000;
