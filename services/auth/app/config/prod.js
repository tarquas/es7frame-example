const cfg = process.env;

if (!cfg.AUTH_TOKEN_SECRET) throw new Error('Production requires explicit TOKEN_SECRET config');

if (!cfg.MQ_PREFIX) cfg.MQ_PREFIX = `${cfg.NODE_APP_PRODUCT}_`;
if (!cfg.AUTH_DB_PREFIX) cfg.DB_PREFIX = `${cfg.NODE_APP_PRODUCT}_${cfg.NODE_APP_SERVICE}_`;
if (!cfg.AUTH_WEB_BASE_PREFIX) cfg.AUTH_WEB_BASE_PREFIX = '';
if (!cfg.AUTH_WEB_PREFIX) cfg.AUTH_WEB_PREFIX = `${cfg.AUTH_WEB_BASE_PREFIX}/${cfg.NODE_APP_SERVICE}`;

// generic

if (!cfg.MQ_URI) cfg.MQ_URI = cfg.RABBIT_URI;
if (!cfg.AUTH_DB_URI) cfg.MQ_URI = cfg.MONGO_URI;

// heroku

if (!cfg.MQ_URI) cfg.MQ_URI = cfg.CLOUDAMQP_URL;
if (!cfg.AUTH_DB_URI) cfg.AUTH_DB_URI = cfg.MONGOLAB_URI;
if (!cfg.AUTH_WEB_HTTP) cfg.AUTH_WEB_HTTP = cfg.PORT;
