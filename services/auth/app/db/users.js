const Model = require('es7frame/model');

class Users extends Model {
  get schema() {
    return new this.Schema({
      _id: String,
      createdAt: Date,
      updatedAt: Date,
      passwordUpdatedAt: Date,
      email: String,
      emailLower: String,
      passwordHash: String,
      rev: Number,
      name: String,
      nameLower: String,
      keywords: [String]
    }, {
      collection: 'users'
    })
      .index({emailLower: 1}, {unique: true})
      .index({keywords: 1});
  }
}

module.exports = Users;
