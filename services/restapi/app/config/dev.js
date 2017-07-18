const cfg = process.env;

if (!cfg.WEB_PREFIX) cfg.WEB_PREFIX = '';

if (!cfg.WEB_BASE_PORT) cfg.WEB_BASE_PORT = cfg.WEB_HTTP || 3000;
if (!cfg.WEB_HTTP) cfg.WEB_HTTP = +cfg.WEB_BASE_PORT + +cfg.NODE_APP_SERVICE_ID;
