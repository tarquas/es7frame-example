if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev-multi';

const nServices = 2;
const clusterSize = process.env.NODE_CLUSTER_SIZE || 1;

process.env.NODE_CLUSTER_SIZE = clusterSize * nServices;

const Cluster = require('es7frame/cluster');

if (Cluster.isMaster) return;

const workerIdZ = process.env.NODE_CLUSTER_ID - 1;
process.env.NODE_CLUSTER_SIZE = clusterSize;
process.env.NODE_CLUSTER_ID = (workerIdZ / nServices | 0) + 1;

const Async = require('es7frame/async');

switch ((workerIdZ % nServices) + 1) {
  case 1: Async.Launcher = require('./services/auth'); break;
  case 2: Async.Launcher = require('./services/restapi'); break;
  default: break;
}
