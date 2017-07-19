const child = require('child_process');

child.fork('./services/auth');
child.fork('./services/restapi');
