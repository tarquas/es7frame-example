const cfg = process.env;

if (!cfg.MQ_PREFIX) cfg.MQ_PREFIX = `${cfg.NODE_APP_PRODUCT}_`;
if (!cfg.RESTAPI_DB_PREFIX) cfg.RESTAPI_DB_PREFIX = `${cfg.NODE_APP_PRODUCT}_${cfg.NODE_APP_SERVICE}_`;
if (!cfg.RESTAPI_WEB_BASE_PREFIX) cfg.RESTAPI_WEB_BASE_PREFIX = '';
if (!cfg.RESTAPI_WEB_PREFIX) cfg.RESTAPI_WEB_PREFIX = `${cfg.RESTAPI_WEB_BASE_PREFIX}/${cfg.NODE_APP_SERVICE}`;

// generic

if (!cfg.MQ_URI) cfg.MQ_URI = cfg.RABBIT_URI;
if (!cfg.RESTAPI_DB_URI) cfg.RESTAPI_DB_URI = cfg.MONGO_URI;

// heroku

if (!cfg.MQ_URI) cfg.MQ_URI = cfg.CLOUDAMQP_URL;
if (!cfg.RESTAPI_DB_URI) cfg.RESTAPI_DB_URI = cfg.MONGOLAB_URI;
if (!cfg.RESTAPI_WEB_HTTP) cfg.RESTAPI_WEB_HTTP = cfg.PORT;
