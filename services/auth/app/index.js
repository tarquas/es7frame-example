const Cluster = require('es7frame/cluster');

if (Cluster.isMaster) return;

const web = require('./web').defaultInstance;

class Me extends Cluster {
  async init() {
    await super.init();
    await web.ready;
    this.stay = true;
  }

  async main() {
    console.log(`Auth microservice ${this.workerId} is running on HTTP ${web.httpBind} HTTPS ${web.httpsBind} ${web.prefix}`);
  }

  async finish() {
    console.log(`Auth microservice ${this.workerId} is shutting down`);
    await super.finish();
  }
}

module.exports = Me;
