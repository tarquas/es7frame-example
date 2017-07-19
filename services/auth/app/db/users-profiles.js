const Crypt = require('es7frame/crypt');
const AutoInit = require('es7frame/auto-init');
const bcrypt = require('bcrypt');
const util = require('util');

require('../config');

const secret = process.env.TOKEN_SECRET;

class Profiles extends AutoInit {
  async init() {
    await super.init();
    await this.db.users.ready;
    this.model = this.db.users.model;
  }

  async register({
    name, // String?
    email, // String!
    password // String!
  }) {
    await this.db.validators.validateEmail(email);
    await this.db.validators.validatePassword(password);
    await this.db.validators.validateName(name);

    const passwordHash = await this.getPasswordHash(password);
    const keywords = await this.db.keywords.getKeywords({name, email});

    const user = new this.model({
      _id: this.db.users.newShortId(),
      createdAt: new Date(),
      email,
      emailLower: email.toLowerCase(),
      passwordHash,
      rev: 0,
      name,
      nameLower: name.toLowerCase(),
      keywords
    });

    try {
      await user.save();
    } catch (err) {
      if (err.code === this.errors.duplicate) throw 'exists';
      throw err;
    }

    return {
      userId: user._id
    };
  }

  async login({
    email, // String!
    password // String!
  }) {
    await this.db.validators.validateEmail(email);
    await this.db.validators.validatePassword(password);

    const user = await this.model.findOne(
      {emailLower: email.toLowerCase()},
      {passwordHash: 1, rev: 1}
    );

    if (!user) throw 'badAuth';

    const passwordMatch = await this.checkPasswordHash(password, user.passwordHash);
    if (!passwordMatch) throw 'badAuth';

    return this.getToken({userId: user._id, rev: user.rev});
  }

  async getToken({
    userId,
    rev
  }) {
    const crypt = new Crypt(secret);
    const now = +new Date();
    const expiresAt = new Date(now + Profiles.tokenExpirationMsec);

    const tokenData = {
      userId,
      expiresAt,
      rev: rev & Profiles.maskRev // eslint-disable-line
    };

    const token = crypt.getToken(tokenData);

    return {
      token,
      userId,
      expiresAt
    };
  }

  async authenticate({
    token // String! auth token
  }) {
    await this.db.validators.validateToken(token);

    const crypt = new Crypt(secret);

    let tokenData;

    try {
      tokenData = crypt.checkToken(token);
    } catch (err) {
      throw 'badToken';
    }

    await this.validateTokenData(token);

    const user = await this.model.findOne({_id: tokenData.userId}, {_id: 0, rev: 1});
    if (!user) throw 'badToken';

    const rev = user.rev & Profiles.maskRev; // eslint-disable-line

    if (rev !== tokenData.rev) throw 'badToken';

    return {
      userId: tokenData.userId,
      expiresAt: tokenData.expiresAt
    };
  }

  async getOne({
    userId
  }) {
    await this.db.validators.validateId(userId);

    const user = await this.model.findOne(
      {_id: userId},
      {email: 1, name: 1, createdAt: 1, updatedAt: 1, passwordUpdatedAt: 1}
    );

    return user;
  }

  async modify({ // eslint-disable-line
    userId, // String!
    name, // String?
    email, // String?
    password // String?
  }) {
    await this.db.validators.validateId(userId);

    const now = new Date();
    const mod = {};
    const $set = {};
    const $inc = {};
    const keywords = [];

    if (email) {
      await this.db.validators.validateEmail(email);
      Object.assign($set, {email});
      keywords.push(...await this.db.keywords.getKeywords({email}));
      $inc.rev = 1;
    }

    if (password) {
      await this.db.validators.validatePassword(password);
      const passwordHash = await this.getPasswordHash(password);
      Object.assign($set, {passwordHash, passwordUpdatedAt: now});
      $inc.rev = 1;
    }

    if (name) {
      await this.db.validators.validateName(name);
      keywords.push(...await this.db.keywords.getKeywords({name}));
      Object.assign($set, {name, nameLower: name.toLowerCase()});
    }

    for (const key in $set) { // eslint-disable-line
      $set.updatedAt = now;
      Object.assign(mod, {$set});
      break;
    }

    for (const key in $inc) { // eslint-disable-line
      Object.assign(mod, {$inc});
      break;
    }

    for (const key in mod) { // eslint-disable-line
      if (keywords.length) mod.$addToSet = {keywords: {$each: keywords}};

      const user = await this.model.findOneAndUpdate( // eslint-disable-line
        {_id: userId},
        mod,
        {new: true, select: {rev: 1}}
      );

      if (!user) throw 'notFound';

      if ($inc.rev) {
        await this.mq.pub('auth_userTokensExpired', {userId}); // eslint-disable-line
        const tokenReply = this.getToken({userId: user._id, rev: user.rev});
        Object.assign(tokenReply, {status: 'modified'});
      }

      return {status: 'modified'};
    }

    return {status: 'notModified'};
  }

  async validateTokenData(tokenData) {
    if (!tokenData) throw 'badToken';

    const now = +new Date();
    const expiresAt = +tokenData.expiresAt;
    if (expiresAt <= now) throw 'badToken';

    const createdAt = expiresAt - Profiles.tokenExpirationMsec;
    if (createdAt > now) throw 'badToken';
  }

  async getPasswordHash(password) {
    const salt = await util.promisify(bcrypt.genSalt)(Profiles.passwordSaltWorkFactor);
    const hash = await util.promisify(bcrypt.hash)(password, salt);
    return hash;
  }

  async checkPasswordHash(password, hash) {
    const match = await util.promisify(bcrypt.compare)(password, hash);
    return match;
  }
}

Profiles.maskRev = 0xFFFFFF;
Profiles.passwordSaltWorkFactor = 10;
Profiles.tokenExpirationMsec = 31 * 24 * 60 * 60 * 1000;

module.exports = Profiles;
