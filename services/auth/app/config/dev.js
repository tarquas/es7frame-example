const cfg = process.env;

if (!cfg.TOKEN_SECRET) cfg.TOKEN_SECRET = 'dev_token_secret';

if (!cfg.MQ_PREFIX) cfg.MQ_PREFIX = `dev_${cfg.NODE_APP_PRODUCT}_`;
if (!cfg.DB_PREFIX) cfg.DB_PREFIX = '';
if (!cfg.WEB_PREFIX) cfg.WEB_PREFIX = '';

if (!cfg.MQ_URI) cfg.MQ_URI = 'amqp://localhost';
if (!cfg.DB_URI) cfg.DB_URI = `mongodb://127.0.0.1:27017/dev_${cfg.NODE_APP_PRODUCT}_${cfg.NODE_APP_SERVICE}`;
if (!cfg.WEB_BASE_PORT) cfg.WEB_BASE_PORT = cfg.WEB_HTTP || 3000;
if (!cfg.WEB_HTTP) cfg.WEB_HTTP = +cfg.WEB_BASE_PORT + +cfg.NODE_APP_SERVICE_ID;
