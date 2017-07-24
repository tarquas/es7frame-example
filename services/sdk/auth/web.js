const Rest = require('es7frame/rest');

class Auth extends Rest {
  async getToken({
    headers: {
      authorization
    },

    query: {
      auth
    }
  }) {
    let token = auth;

    if (!token && authorization) {
      const [matched, hdrToken] = authorization.match(Auth.rxHeaderToken) || [];
      if (!matched) throw 'badToken';
      token = hdrToken;
    }

    return token;
  }

  async check(req) {
    const token = await this.getToken(req);

    await this.db.validators.validateToken(token);
    let tokenData = this.mq.auth.tokenCache.get(token);

    if (!tokenData) tokenData = await this.mq.rpc('auth_checkToken', {token});
    if (!tokenData) throw 'badToken';

    this.mq.auth.tokenCache.add(token, tokenData);
    const userId = tokenData.userId;

    let user = this.mq.auth.userCache.get(userId);

    if (!user) {
      user = {tokens: {}};
      this.mq.auth.userCache.add(userId, user);
    }

    user.tokens[token] = true;
    req.authChecked = tokenData;
  }
}

Auth.rxHeaderToken = /^token ([\w-]{32})(\s|$)/i;

module.exports = Auth;
