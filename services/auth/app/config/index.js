const cfg = process.env;
if (!cfg.NODE_APP_PRODUCT) cfg.NODE_APP_PRODUCT = 'es7frame_example';
if (!cfg.NODE_APP_SERVICE) cfg.NODE_APP_SERVICE = 'auth';
if (!cfg.NODE_APP_SERVICE_ID) cfg.NODE_APP_SERVICE_ID = 1;

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev';

switch (process.env.NODE_ENV) {
  case 'dev': require('./dev'); break;
  case 'dev-multi': require('./dev-multi'); break;
  case 'prod': require('./prod'); break;
  default: break;
}
