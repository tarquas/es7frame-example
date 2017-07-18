const Crypt = require('es7frame/crypt');
const AutoInit = require('es7frame/auto-init');
const XRegExp = require('xregexp');
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
    Profiles.validateEmail(email);
    Profiles.validatePassword(password);
    Profiles.validateName(name);

    const passwordHash = await Profiles.getPasswordHash(password);
    const keywords = name.match(Profiles.rxNameKeywors);

    const user = new this.model({
      _id: this.db.users.newShortId(),
      createdAt: new Date(),
      email,
      emailLower: email.toLowerCase(),
      passwordHash,
      rev: 0,
      name,
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
    Profiles.validateEmail(email);
    Profiles.validatePassword(password);

    const user = await this.model.findOne(
      {emailLower: email.toLower()},
      {passwordHash: 1, rev: 1}
    );

    if (!user) throw 'badAuth';

    const passwordMatch = await Profiles.checkPasswordHash(password, user.passwordHash);
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
    Profiles.validateToken(token);

    const crypt = new Crypt(secret);
    const tokenData = crypt.checkToken(token);

    Profiles.validateTokenData(token);

    const user = this.model.findOne({_id: tokenData.userId}, {rev: 1});
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
    Profiles.validateUserId(userId);

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
    Profiles.validateUserId(userId);

    const now = new Date();
    const mod = {};
    const $set = {};
    const $inc = {};

    if (email) {
      Profiles.validateEmail(email);
      Object.assign($set, {email});
      $inc.rev = 1;
    }

    if (password) {
      Profiles.validatePassword(password);
      const passwordHash = await Profiles.getPasswordHash(password);
      Object.assign($set, {passwordHash, passwordUpdatedAt: now});
      $inc.rev = 1;
    }

    if (name) {
      Profiles.validateName(name);
      const keywords = name.match(Profiles.rxNameKeywors);
      Object.assign($set, {name, keywords});
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
      const user = await this.model.findOneAndUpdate( // eslint-disable-line
        {_id: userId},
        mod,
        {new: true, select: {rev: 1}}
      );

      if (!user) throw 'notFound';

      if ($inc.rev) await this.mq.pub('auth_userTokensExpired', {userId}); // eslint-disable-line
      return this.getToken({userId: user._id, rev: user.rev});
    }

    return {status: 'notModified'};
  }

  static validateUserId(userId) {
    if (!userId || !Profiles.rxValidUserId.test(userId)) throw 'badUserId';
  }

  static validateToken(token) {
    if (!token || !Profiles.rxValidToken.test(token)) throw 'badToken';
  }

  static validateTokenData(tokenData) {
    if (!tokenData) throw 'badToken';

    const now = +new Date();
    const expiresAt = +tokenData.expiresAt;
    if (expiresAt <= now) throw 'badToken';

    const createdAt = expiresAt - Profiles.tokenExpirationMsec;
    if (createdAt > now) throw 'badToken';
  }

  static validateName(name) {
    if (!name || !(name.length < 64)) throw 'badName';
  }

  static validateEmail(email) {
    if (!email || !(email.length < 64) || !Profiles.rxValidEmail.test(email)) throw 'badEmail';
  }

  static validatePassword(password) {
    if (!password || !(password.length < 64) || password.length < 6) throw 'badPassword';
  }

  static async getPasswordHash(password) {
    const salt = await util.promisify(bcrypt.genSalt)(Profiles.passwordSaltWorkFactor);
    const hash = await util.promisify(bcrypt.hash)(password, salt);
    return hash;
  }

  static async checkPasswordHash(password, hash) {
    const match = await util.promisify(bcrypt.compare)(password, hash);
    return match;
  }
}

Profiles.rxValidEmail = new RegExp(
  '^(([^<>()[\\]\\\\.,;:\\s@"]+(\\.[^<>()[\\]\\\\.,;:\\s@"]+)*)' +
  '|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.' +
  '[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
);

Profiles.maskRev = 0xFFFFFF;
Profiles.passwordSaltWorkFactor = 10;

Profiles.rxNameKeywors = new XRegExp('\\pL\'\\d\\-_\\.+', 'g');

Profiles.rxValidToken = /^[\w-]{32}$/;
Profiles.tokenExpirationMsec = 31 * 24 * 60 * 60 * 1000;

Profiles.rxValidUserId = /^[\w-]{16}$/;

module.exports = Profiles;
