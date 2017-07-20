const Model = require('es7frame/model');

class Goods extends Model {
  get schema() {
    return new this.Schema({
      _id: String,
      userId: String,

      name: String,
      nameLower: String,
      link: String,
      price: Number,

      createdAt: Date,
      updatedAt: Date,
      priceUpdatedAt: Date,
      keywords: [String],
    }, {
      collection: 'goods'
    })
      .index({userId: 1, nameLower: 1})
      .index({keywords: 1});
  }

  async getAll({
    userId
  }) {
    await this.db.validators.validateId(userId);
    const goods = await this.model.find({userId}, Goods.info);
    return {data: goods};
  }

  async getOne({
    goodId
  }) {
    await this.db.validators.validateId(goodId);
    const good = await this.model.findOne({goodId}, Goods.info);
    if (!good) throw 'notFound';
    return {data: good};
  }

  async create({
    userId,
    name,
    link,
    price
  }) {
    await this.db.validators.validateId(userId);
    await this.db.validators.validateName(name);
    await this.db.validators.validatePrice(price);

    const good = new this.model({
      _id: this.newShortId(),
      userId,

      name,
      nameLower: name.toLowerCase(),
      link,
      price,

      createdAt: new Date(),
      keywords: await this.db.keywords.getKeywords({name})
    });

    await good.save();

    return {_id: good._id};
  }

  async modify({ // eslint-disable-line
    userId,
    goodId,
    name,
    link,
    price
  }) {
    await this.db.validators.validateId(userId);
    await this.db.validators.validateId(goodId);

    const now = new Date();
    const mod = {};
    const $set = {};
    const keywords = [];

    if (name) {
      await this.db.validators.validateName(name);
      const k = await this.db.keywords.getKeywords({name});
      keywords.push(...k);
      Object.assign($set, {name, nameLower: name.toLowerCase()});
    }

    if (link) {
      Object.assign($set, {link});
    }

    if (price) {
      await this.db.validators.validatePrice(price);
      Object.assign($set, {price, priceUpdatedAt: now});
    }

    for (const key in $set) { // eslint-disable-line
      $set.updatedAt = now;
      Object.assign(mod, {$set});
      break;
    }

    for (const key in mod) { // eslint-disable-line
      if (keywords.length) mod.$addToSet = {keywords: {$each: keywords}};

      const done = await this.model.update( // eslint-disable-line
        {_id: goodId, userId},
        mod
      );

      if (!done.n) throw 'denied';

      return {status: 'modified'};
    }

    return {status: 'notModified'};
  }

  async remove({
    userId,
    goodId
  }) {
    await this.db.validators.validateId(goodId);
    await this.db.validators.validateId(userId);
    const done = await this.model.remove({_id: goodId, userId});
    if (!done.n) throw 'denied';
    return {status: 'removed'};
  }
}

Goods.info = {
  name: String,
  link: String,
  price: Number,

  createdAt: Date,
  updatedAt: Date,
  priceUpdatedAt: Date,
};

module.exports = Goods;
