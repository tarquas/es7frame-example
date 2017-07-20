const cfg = process.env;

if (!cfg.AUTH_TOKEN_SECRET) cfg.AUTH_TOKEN_SECRET = 'dev_token_secret';

if (!cfg.MQ_PREFIX) cfg.MQ_PREFIX = `dev_${cfg.NODE_APP_PRODUCT}_`;
if (!cfg.AUTH_DB_PREFIX) cfg.AUTH_DB_PREFIX = '';
if (!cfg.AUTH_WEB_PREFIX) cfg.AUTH_WEB_PREFIX = '';

if (!cfg.MQ_URI) cfg.MQ_URI = 'amqp://localhost';
if (!cfg.AUTH_DB_URI) cfg.AUTH_DB_URI = `mongodb://127.0.0.1:27017/dev_${cfg.NODE_APP_PRODUCT}_${cfg.NODE_APP_SERVICE}`;
if (!cfg.AUTH_WEB_BASE_PORT) cfg.AUTH_WEB_BASE_PORT = cfg.AUTH_WEB_HTTP || 3000;

if (!cfg.AUTH_WEB_HTTP) {
  cfg.AUTH_WEB_HTTP = +cfg.AUTH_WEB_BASE_PORT + +cfg.NODE_APP_SERVICE_ID;
}
