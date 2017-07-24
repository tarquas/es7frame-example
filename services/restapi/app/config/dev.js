const cfg = process.env;

if (!cfg.MQ_PREFIX) cfg.MQ_PREFIX = `dev_${cfg.NODE_APP_PRODUCT}_`;
if (!cfg.RESTAPI_DB_PREFIX) cfg.RESTAPI_DB_PREFIX = '';
if (!cfg.RESTAPI_WEB_PREFIX) cfg.RESTAPI_WEB_PREFIX = cfg.WEB_BASE_PREFIX || '';

if (!cfg.MQ_URI) cfg.MQ_URI = 'amqp://localhost';
if (!cfg.RESTAPI_DB_URI) cfg.RESTAPI_DB_URI = `mongodb://127.0.0.1:27017/dev_${cfg.NODE_APP_PRODUCT}_${cfg.NODE_APP_SERVICE}`;
if (!cfg.WEB_BASE_HTTP) cfg.WEB_BASE_HTTP = 3000;

if (!cfg.RESTAPI_WEB_HTTP) {
  cfg.RESTAPI_WEB_HTTP = +cfg.WEB_BASE_HTTP + +cfg.NODE_APP_SERVICE_ID;
}

if (!cfg.RESTAPI_WEB_URL) {
  cfg.RESTAPI_WEB_URL = `http://127.0.0.1:${cfg.RESTAPI_WEB_HTTP}${cfg.RESTAPI_WEB_PREFIX}`;
}
