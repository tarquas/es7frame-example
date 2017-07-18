const Rest = require('es7frame/rest');

class Users extends Rest {
  async ['USE /users > auth.check']({
    authChecked
  }) {
    console.log(authChecked);
  }

  async ['GET /users']() {
    const users = await this.db.users.find({}, {});
    return {users};
  }

  async ['GET /users/:id']({
    params: {
      id // String: User ID
    }
  }) {
    const user = await this.db.users.findById({id});
    return {user};
  }

  async ['PUT /users/:id > upload.json1k']({
    params: {
      id // String: User ID
    },

    body: {
      email // String: User Email
    }
  }) {
    console.log(email, id);
    return {status: 'ok'};
  }
}

module.exports = Users;
