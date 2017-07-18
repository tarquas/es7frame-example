const cfg = process.env;

if (!cfg.WEB_BASE_PREFIX) cfg.WEB_BASE_PREFIX = '';
if (!cfg.WEB_PREFIX) cfg.WEB_PREFIX = `${cfg.WEB_BASE_PREFIX}/${cfg.NODE_APP_SERVICE}`;

// heroku

if (!cfg.WEB_HTTP) cfg.WEB_HTTP = cfg.PORT;
