const Disp = require('es7frame/dispatcher');

class Profiles extends Disp {
  async ['RPCWORKER auth_checkToken']({
    token
  }) {
    try {
      const tokenData = await this.db.profiles.authenticate({token});
      return tokenData;
    } catch (err) {
      if (err === 'badToken') return null;
      throw err;
    }
  }
}

module.exports = Profiles;
