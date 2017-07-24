const Disp = require('es7frame/dispatcher');
const Cache = require('es7frame/cache');

class Auth extends Disp {
  constructor(setup) {
    super(setup);
    this.tokenCache = new Cache(Auth.tokenCacheOpts);
    this.userCache = new Cache(Auth.userCacheOpts);

    this.tokenCache.on('expire', (token, desc) => {
      delete this.userCache[desc.userId].tokens[token];
    });

    this.userSockets = {};
  }

  async expireTokenCache(userId) {
    const user = this.userCache.get(userId);
    if (!user) return;

    for (const token in user.tokens) {
      if (Object.hasOwnProperty.call(user.tokens, token)) {
        this.tokenCache.remove(token);
      }
    }

    this.userCache.remove(userId);
  }

  async closeUserSockets(userId) {
    const sockets = this.userSockets[userId];

    if (sockets) {
      for (const socketId in sockets) {
        if (Object.hasOwnProperty.call(sockets, socketId)) {
          const socket = sockets[socketId];
          socket.conn.close();
        }
      }
    }
  }

  async ['SUB auth_userTokensExpired']({
    userId // String!
  }) {
    await this.expireTokenCache(userId);
    await this.closeUserSockets(userId);
  }
}

Auth.tokenCacheOpts = {
  maxCount: 1 ** 5,
  maxLifetime: 30 * 60 * 1000
};

Auth.userCacheOpts = {
  maxCount: 1 ** 5,
  maxLifetime: 30 * 60 * 1000
};

module.exports = Auth;
