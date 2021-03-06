const Cluster = require('es7frame/cluster');

if (Cluster.isMaster) return;

const web = require('./web').defaultInstance;

process.on(
  'unhandledRejection',
  function handleWarning( reason, promise ) {
    console.log( "[PROCESS] Unhandled Promise Rejection" );
    console.log( "- - - - - - - - - - - - - - - - - - -" );
    console.log( reason.stack );
    console.log( "- -" );
  }
);

class Me extends Cluster {
  async init() {
    await super.init();
    await web.ready;
    this.stay = true;
  }

  async main() {
    console.log(`RestApi microservice #${process.env.NODE_CLUSTER_ID} is running on HTTP ${web.httpBind} HTTPS ${web.httpsBind} ${web.prefix}`);
  }

  async finish() {
    console.log(`RestApi microservice #${process.env.NODE_CLUSTER_ID} is shutting down`);
    await super.finish();
  }
}

module.exports = Me;
