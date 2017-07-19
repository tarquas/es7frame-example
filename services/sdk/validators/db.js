const AutoInit = require('es7frame/auto-init');

class Validators extends AutoInit {
  async validateId(id) {
    if (typeof id !== 'string' || !Validators.rxValidId.test(id)) throw 'badId';
  }

  async validateToken(token) {
    if (typeof token !== 'string' || !Validators.rxValidToken.test(token)) throw 'badToken';
  }

  async validateName(name) {
    if (
      typeof name !== 'string' ||
      name.length < 2 ||
      name.length >= 64
    ) throw 'badName';
  }

  async validateEmail(email) {
    if (
      typeof email !== 'string' ||
      email.length >= 64 ||
      !Validators.rxValidEmail.test(email)
    ) throw 'badEmail';
  }

  async validatePassword(password) {
    if (
      typeof password !== 'string' ||
      password.length >= 64 ||
      password.length < 6
    ) throw 'badPassword';
  }

  async validatePrice(price) {
    if (
      !isFinite(price) ||
      +price < 0
    ) throw 'badPrice';
  }
}

Validators.rxValidEmail = new RegExp(
  '^(([^<>()[\\]\\\\.,;:\\s@"]+(\\.[^<>()[\\]\\\\.,;:\\s@"]+)*)' +
  '|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.' +
  '[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
);

Validators.rxValidToken = /^[\w-]{32}$/;

Validators.rxValidId = /^[\w-]{16}$/;

module.exports = Validators;
