process.env.NODE_ENV = 'dev';

const child = require('child_process');

child.fork('./services/auth');
child.fork('./services/restapi');
