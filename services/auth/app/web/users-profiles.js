const Rest = require('es7frame/rest');

class Users extends Rest {
  async ['POST /register > upload.json1k']({
    body: {
      name, // String: User Full Name
      email, // String: User Email
      password // String: User Password
    }
  }) {
    const result = await this.db.profiles.register({name, email, password});
    return result;
  }

  async ['POST /login > upload.json1k']({
    body: {
      email, // String: User Email
      password // String: User Password
    }
  }) {
    const result = await this.db.profiles.login({email, password});
    return result;
  }

  async ['GET /profile > auth.check']({
    authChecked: {
      userId
    }
  }) {
    const result = await this.db.profiles.getOne({userId});
    return result;
  }

  async ['PUT /profile > auth.check > upload.json1k']({
    authChecked: {
      userId
    },

    body: {
      name, // String?
      email, // String? User Email
      password // String? User Password
    }
  }) {
    const result = await this.db.profiles.modify({userId, name, email, password});
    return result;
  }
}

module.exports = Users;
