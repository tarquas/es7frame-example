const Socket = require('es7frame/socket');

class Auth extends Socket {
  async connect(req) {
    /*
    await this.web.auth.check(req);
    const userId = req.authChecked.userId;
    const userSockets = this.mq.auth.userSockets;

    let sockets = userSockets[userId];
    if (!sockets) userSockets[userId] = sockets = {};
    sockets[this.socket.id] = this.socket;
    await this.join(`auth/${userId}`);
    this.socket.emit('authChecked', req.authChecked); */
    this.socket.emit('authChecked', {userId: 'me'});
  }

  async disconnect(req) {
    if (req.authChecked) {
      const userId = req.authChecked.userId;
      const userSockets = this.mq.auth.userSockets;
      const sockets = userSockets[userId];
      if (sockets) {
        delete sockets[this.socket.id];
        let keep = false;
        for (const key in sockets) { keep = true; break; } // eslint-disable-line
        if (!keep) delete userSockets[userId];
      }
    }
  }
}

module.exports = Auth;
