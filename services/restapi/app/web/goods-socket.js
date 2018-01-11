const Socket = require('es7frame/socket');

class Goods extends Socket {
  get name() { return 'goods'; }

  async connect() {
    await this.web.authSocket.connected(this.socket);
  }

  async ['SUB goodsAdd'](x, y) {
    // console.log(this.req.authChecked);
    this.io.to('goods').emit('goodsAdded', x + y);
  }

  async ['SUB goodsSub']() {
    await this.join(['goods']);
    this.socket.emit('goodsSubed');
  }

  async ['SUB goodsUnsub']() {
    await this.leave('goods');
    this.socket.emit('goodsUnsubed');
  }
}

module.exports = Goods;
