const Disp = require('es7frame/dispatcher');
const uuid = require('uuid');
const os = require('os');
const util = require('util');

class Discovery extends Disp {
  constructor(setup) {
    super(setup);
    this.instances = {};
    this.nInstances = 0;
  }

  instanceUpdate({
    instId,
    info
  }) {
    const instInfo = this.instances[instId];
    if (!instInfo) return;

    Object.assign(instInfo, info, {
      updatedAt: new Date(),
      prevCpuAvg: instInfo.cpuAvg
    });

    if (instInfo.prevCpuAvg) {
      const idleDifference = instInfo.cpuAvg.idle - instInfo.prevCpuAvg.idle;
      const totalDifference = instInfo.cpuAvg.total - instInfo.prevCpuAvg.total;
      instInfo.cpuAvgLoad = 100 - ((100 * idleDifference) / totalDifference | 0);
    }
  }

  instanceDown({
    instId
  }) {
    const info = this.instances[instId];
    if (!info) return;
    delete this.instances[instId];
    this.nInstances++;
  }

  async keepAlive(info = {}) {
    if (!this.isAlive) return;
    const db = this.db.conn.db;
    const stats = await util.promisify(db.stats).call(db);

    Object.assign(info, {
      cpuAvg: Discovery.cpuAverage(),
      dbDataSize: stats.dataSize
    });

    try {
      await this.mq.pub('discovery_instanceUp', {instId: this.instId, info});
    } catch (err) {
      // ignore
    }

    if (this.isAlive) {
      setTimeout(this.keepAliveBound, Discovery.msecPingAlive);
    }
  }

  async ['SUB discovery_instanceUp']({
    instId,
    info
  }) {
    if (!this.instances[instId]) {
      this.instances[instId] = {};
      this.nInstances++;
    }

    this.instanceUpdate({instId, info});
  }

  async ['SUB discovery_instanceDown']({
    instId
  }) {
    this.instanceDown({instId, reason: 'managedShutdown'});
  }

  async checkExpires() {
    const now = +new Date();
    const insts = this.instances;

    for (const instId in insts) {
      if (Object.hasOwnProperty.call(insts, instId)) {
        const info = insts[instId];

        if (info.updatedAt + Discovery.msecAliveExpires < now) {
          this.instanceDown({instId, reason: 'pingTimeout'});
        }
      }
    }
  }

  async ['SUB discovery_pollInstances']() {
    const info = this.instances[this.instId];
    if (!info) return;
    await this.mq.pub('discovery_instanceUp', {instId: this.instId, info});
  }

  async listInstances() {
    await this.checkExpires();
    return this.instances;
  }

  static cpuAverage() {
    let totalIdle = 0;
    let totalTick = 0;
    const cpus = os.cpus();

    for (const cpu of cpus) {
      for (const type in cpu.times) {
        if (Object.hasOwnProperty.call(cpu.times, type)) {
          totalTick += cpu.times[type];
        }
      }

      totalIdle += cpu.times.idle;
    }

    const result = {
      idle: totalIdle / cpus.length,
      total: totalTick / cpus.length
    };

    return result;
  }

  async init() {
    await super.init();
    await this.db.validators.ready;
    const instId = uuid();

    Object.assign(this, {
      instId,
      isAlive: true,
      keepAliveBound: this.keepAlive.bind(this)
    });

    const info = {
      apiUrls: {
        auth: process.env.AUTH_WEB_URL,
        restapi: process.env.RESTAPI_WEB_URL
      },

      workerId: process.env.NODE_CLUSTER_ID,
      createdAt: new Date()
    };

    await this.mq.pub('discovery_pollInstances', {});
    this.keepAliveBound(info);
  }

  async finish() {
    this.isAlive = false;
    await this.mq.pub('discovery_instanceDown', {instId: this.instId});
    delete this.keepAliveBound;
    await super.finish();
  }
}

Discovery.msecPingAlive = 60000;
Discovery.msecAliveExpires = 90000;

module.exports = Discovery;
