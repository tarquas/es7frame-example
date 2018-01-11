const Rest = require('es7frame/rest');

class Goods extends Rest {
  async ['USE /goods > auth.check']() {
  }

  async ['GET /ping']() {
    this.web.goodsSocket.io.to('goods').emit('myPing', {worker: process.env.NODE_CLUSTER_ID});
    return {};
  }

  async ['GET /goods']({
    authChecked: {
      userId
    }
  }) {
    const goods = await this.db.goods.getAll({userId});
    return goods;
  }

  async ['POST /goods > upload.json1k']({
    authChecked: {
      userId
    },

    body: {
      name, // String: Name of good
      link, // String: Description link
      price // Number: Price of good
    }
  }) {
    const goods = await this.db.goods.create({userId, name, link, price});
    return goods;
  }

  async ['GET /goods/:goodId']({
    params: {
      goodId // String: Good ID
    }
  }) {
    const good = await this.db.goods.getOne({goodId});
    return good;
  }

  async ['PUT /goods/:goodId > upload.json1k']({
    authChecked: {
      userId
    },

    params: {
      goodId // String: User ID
    },

    body: {
      name, // String: Name of good
      link, // String: Description link
      price // Number: Price of good
    }
  }) {
    const done = await this.db.goods.modify({userId, goodId, name, link, price});
    return done;
  }

  async ['DELETE /goods/:goodId']({
    authChecked: {
      userId
    },

    params: {
      goodId // String: Good ID
    }
  }) {
    const done = await this.db.goods.remove({userId, goodId});
    return done;
  }
}

module.exports = Goods;
