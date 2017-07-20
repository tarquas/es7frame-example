const cfg = process.env;
cfg.NODE_APP_PRODUCT = 'es7frame_example';
cfg.NODE_APP_SERVICE = 'auth';
cfg.NODE_APP_SERVICE_ID = 1;

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev';

switch (process.env.NODE_ENV) {
  case 'dev': require('./dev'); break;
  case 'dev-multi': require('./dev-multi'); break;
  case 'prod': require('./prod'); break;
  default: break;
}
